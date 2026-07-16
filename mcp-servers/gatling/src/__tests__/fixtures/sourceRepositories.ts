import teams from "@src/__tests__/fixtures/teams.js";

export const createOneArgs = {
  name: "[R&D] sample source repository",
  teamId: teams.ci._id,
  remote: {
    url: "https://github.com/gatling/gatling-js-demo.git"
  }
};

export default {
  js: {
    name: "Gatling JS demo",
    teamId: teams.ci._id,
    remote: {
      url: "https://github.com/gatling/gatling-js-demo.git"
    },
    _id: "source_repository_8y9hr9taji848jr8qecdpa9m6w"
  }
};
