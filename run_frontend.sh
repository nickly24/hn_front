#!/bin/bash

echo "🌐 Запуск фронтенда на порту 3000..."

# Переходим в папку frontend
cd frontend

# Проверяем, что порт 3000 свободен
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Порт 3000 занят. Остановите процесс на порту 3000"
    echo "💡 Попробуйте: lsof -i :3000"
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Запускаем React приложение
echo "✅ Запуск React приложения на http://localhost:3000"
echo "🔗 Фронтенд будет проксировать API запросы на http://localhost:80"
echo ""
echo "Для остановки нажмите Ctrl+C"

npm start
