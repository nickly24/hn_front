// Конфигурация URL для бэкенда
export const back_url = 'http://172.20.10.3:80';

// Можно добавить дополнительные URL если понадобятся
export const api_endpoints = {
    login: `${back_url}/login`,
    chat: `${back_url}/chat`,
    models: `${back_url}/models`,
    // Добавьте другие эндпоинты по мере необходимости
};
