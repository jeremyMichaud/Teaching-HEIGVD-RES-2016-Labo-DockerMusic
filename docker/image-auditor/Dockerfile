FROM node:4.3.1
MAINTAINER Jeremy Michaud

COPY src /opt/app/

RUN npm install moment

ENTRYPOINT ["node", "/opt/app/auditor.js"]
