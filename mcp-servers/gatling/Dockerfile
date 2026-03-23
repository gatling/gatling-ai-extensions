FROM gcr.io/distroless/nodejs24-debian13:nonroot

USER nonroot:nonroot

COPY --chown=nonroot:nonroot [ ".", "/app/" ]

WORKDIR /app

CMD [ "." ]
