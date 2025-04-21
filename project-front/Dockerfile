FROM node:22-alpine

WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกซอร์สโค้ดทั้งหมด
COPY . .

# เปิด port ที่ Next.js ใช้
EXPOSE 3000

# รัน dev mode
CMD ["npm", "run", "dev"]y