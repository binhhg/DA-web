FROM node:16-alpine as BUILD_IMAGE
WORKDIR /app
COPY package.json .
RUN yarn install --verbose
COPY . .
# COPY .env.local.dev .env.local
RUN yarn build
#RUN npm prune --production


FROM node:16-alpine
WORKDIR /app
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
EXPOSE 3000
CMD ["yarn", "start"]
