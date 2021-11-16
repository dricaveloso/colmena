FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json yarn.lock ./
RUN yarn install --force --frozen-lockfile

# # ##linha que ch mandou
# ARG DEVELOP
# ENV NODE_ENV=${DEVELOP:+development}
# ENV NODE_ENV=${NODE_ENV:-production}

# ##linha que ch mandou
ARG PRODUCTION
ENV NODE_ENV=${PRODUCTION:+production}
ENV NODE_ENV=${NODE_ENV:-development}
# RUN echo $NODE_ENV

FROM node:16-alpine AS builder
WORKDIR /app
COPY .env .env
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build && yarn install --force --production --ignore-scripts --prefer-offline
# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]