FROM keymetrics/pm2:16-alpine
WORKDIR /app
RUN yarn add pm2 
COPY . /app
RUN yarn install
EXPOSE 3333
CMD [ "pm2-runtime", "start", "pm2.json" ]
