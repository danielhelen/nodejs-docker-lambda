FROM amazon/aws-lambda-nodejs:14

COPY index.js package*.json ./

RUN npm install --global yarn && yarn --production

CMD [ "index.handler" ]
