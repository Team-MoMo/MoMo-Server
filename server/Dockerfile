FROM node:14-alpine

# 앱 디랙터리 생성
WORKDIR /app

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./

RUN npm ci --only=production && npm install typescript
ENV NODE_ENV=production

# 앱 소스 추가
COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "node", "./build/server.js" ]
