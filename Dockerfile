FROM node:16-alpine as BUILD_IMAGE
#WORKDIR /app
#COPY package.json .
#RUN yarn install --verbose
#COPY . .
## COPY .env.local.dev .env.local
#
#ENV USER_URL="https://api.icalendar.click/user"
#ENV CALENDAR_URL="https://api.icalendar.click/calendar"
#ENV NEXTAUTH_URL="https://icalendar.click"
#RUN yarn build
##RUN npm prune --production
#
#
#FROM node:16-alpine
#WORKDIR /app
#ENV USER_URL="https://api.icalendar.click/user"
#ENV CALENDAR_URL="https://api.icalendar.click/calendar"
#ENV NEXTAUTH_URL="https://icalendar.click"
#COPY --from=BUILD_IMAGE /app/package.json ./package.json
#COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
#COPY --from=BUILD_IMAGE /app/.next ./.next
#COPY --from=BUILD_IMAGE /app/public ./public
#EXPOSE 3000
#CMD ["yarn", "start"]

WORKDIR /app
COPY . .
RUN yarn

ENV NEXT_USER_URL="https://api.icalendar.click/user"
ENV NEXT_CALENDAR_URL="https://api.icalendar.click/calendar"
ENV NEXTAUTH_URL="https://icalendar.click"

EXPOSE 3000
RUN yarn build
CMD ["yarn", "start"]
