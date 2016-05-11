FROM node:4.3.1
MAINTAINER Jeremy Michaud

COPY src /opt/app/

RUN npm install node-uuid

ENTRYPOINT ["node", "/opt/app/musician.js"]
