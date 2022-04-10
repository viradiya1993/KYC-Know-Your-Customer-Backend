FROM mhart/alpine-node:12 as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

# Second Stage : Setup command to run your app using lightweight node image #node:12.13-alpine
FROM mhart/alpine-node:12 as development

ARG NODE_ENV=staging

ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/src/app ./usr/src/app

WORKDIR /usr/src/app

EXPOSE 3030

CMD ["npm", "run", "start:staging"]