# ===============================
# 1단계: Build 단계 (Node.js 환경)
# ===============================
FROM node:18 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 전체 파일 복사 (package.json, src, public 등)
COPY . .

# 의존성 설치 및 Vite 빌드
RUN npm install
RUN npm run build


# ===============================
# 2단계: 배포 단계 (Nginx 사용)
# ===============================
FROM nginx:stable-alpine

# Nginx 설정 덮어쓰기 (SPA 라우팅을 위한 설정)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
