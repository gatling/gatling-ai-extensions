#!/usr/bin/env node

import {
  createMcpExpressApp,
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthMetadataRouter,
  requireBearerAuth
} from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import type { AuthInfo } from "@modelcontextprotocol/server";
import {
  createMcpHandler,
  OAuthError,
  OAuthErrorCode,
  OAuthTokenVerifier
} from "@modelcontextprotocol/server";
import * as jwt from "jsonwebtoken";
import Keycloak from "keycloak-connect";

import { mcpServer } from "./mcpServer/index.js";
import { analyticsInit } from "./analytics.js";
// oauthMetadata.json extracted from https://auth.dev.gatling.io/auth/.well-known/oauth-authorization-server/realms/gatling
// (Should probably be retrieved dynamically instead? Note that it's only used as backup for clients that directly probe
// the MCP's '/.well-known/oauth-authorization-server' path instead of following the auth URL in the 401 resposne, which
// points directly to the auth server.).
import oauthMetadata from "./oauthMetadata.json" with { type: "json" };

try {
  const analytics = analyticsInit();

  const mcpHandler = createMcpHandler(() => mcpServer(analytics));
  const nodeHandler = toNodeHandler(mcpHandler);

  const mcpServerUrl = new URL("http://127.0.0.1:3000/mcp");
  const verifyAccessToken = async (token: string): Promise<AuthInfo> => {
    // Uses keycloak.json by default for configuration (Keycloak Admin Console > clients > choose client > Action menu >
    // Download Adapter config > Keycloak OIDC JSON). Alternatively, provide the conf object as a constructor param.
    const keycloak = new Keycloak();
    const validatedToken = await keycloak.grantManager.validateAccessToken(token);
    if (validatedToken === false) {
      throw new OAuthError(OAuthErrorCode.InvalidToken, "JWT token is invalid");
    } else {
      const decodedToken = jwt.decode(validatedToken) as jwt.JwtPayload; // FIXME
      if (decodedToken.sub === undefined) {
        throw new OAuthError(OAuthErrorCode.InvalidToken, "JWT token is missing field 'sub");
      }
      return {
        token,
        clientId: decodedToken.sub,
        scopes: decodedToken.scopes,
        expiresAt: decodedToken.exp
      };
    }
  }
  const verifier: OAuthTokenVerifier = { verifyAccessToken };
  const auth = requireBearerAuth({
    verifier,
    requiredScopes: ["mcp:prompts","mcp:resources","mcp:tools"],
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(mcpServerUrl)
  });

  const app = createMcpExpressApp();
  app.all("/mcp", auth, (req, res) => void nodeHandler(req, res, req.body));
  app.use(mcpAuthMetadataRouter({ oauthMetadata, resourceServerUrl: mcpServerUrl }));
  analytics.onServerReady();
  app.listen(3000);
} catch (error) {
  console.error("Gatling MCP Server fatal error:", error);
  process.exit(1);
}
