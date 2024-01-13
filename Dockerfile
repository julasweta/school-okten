# Використовуємо офіційний образ Node як базовий образ
FROM node:18-alpine

# Створюємо директорію /app
RUN mkdir /app

# Встановлюємо /app як робочий каталог
WORKDIR /app

# Копіюємо файли package.json та package-lock.json в контейнер
COPY ./backend/package.json /app

# Виконуємо команду npm install для встановлення залежностей
RUN npm i
 




