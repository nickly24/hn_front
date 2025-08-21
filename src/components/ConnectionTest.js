import React, { useState } from 'react';
import { back_url } from '../Links';

function ConnectionTest() {
  const [status, setStatus] = useState('Не проверено');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Проверяю...');
    
    try {
      const response = await fetch(`${back_url}/`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ Подключение успешно! Ответ: ${JSON.stringify(data)}`);
      } else {
        setStatus(`❌ Ошибка HTTP: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Ошибка соединения: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Тест подключения к бэкенду</h3>
      <p><strong>URL бэкенда:</strong> {back_url}</p>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{ padding: '10px 20px', margin: '10px 0' }}
      >
        {loading ? 'Проверяю...' : 'Проверить подключение'}
      </button>
      <p><strong>Статус:</strong> {status}</p>
    </div>
  );
}

export default ConnectionTest;
