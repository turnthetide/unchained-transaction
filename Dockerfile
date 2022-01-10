FROM ubuntu:20.04
ARG NODEJS_MAJOR_VERSION=12
ARG KUBETPL_VERSION=0.9.0
ARG GRPCURL_VERSION=1.8.5

RUN apt-get update -yq && \
  apt-get install --yes ca-certificates make build-essential curl openssl openssh-client bash python2-minimal mime-support gnupg && \
  curl --silent --location https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash -  && \
  update-ca-certificates && \
  apt-get update -yq && apt-get upgrade -yq && \
  apt-get install --yes nodejs && \
  apt-get autoremove -yq && apt-get clean -yq


# install server
WORKDIR /app/api
COPY ./unchained/package.json /app/api/package.json
COPY ./unchained/package-lock.json /app/api/package-lock.json
RUN npm ci
COPY unchained /app/api

ENTRYPOINT ["npm"]
CMD ["run", "start"]
