import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LoginForm from './components/LoginForm';
import KanbanBoard from './components/KanbanBoard';
import ModelSelectorModal from './components/ModelSelectorModal';
import { back_url } from './Links';
import ConnectionTest from './components/ConnectionTest';
// Временно закомментировано для переработки
// import HowToUse from './components/HowToUse';
// import Help from './components/Help';

function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentPage, setCurrentPage] = useState('chat');
  const [models, setModels] = useState([]); // Добавляем состояние для моделей
  const [selectedModelId, setSelectedModelId] = useState(null); // Добавляем состояние для выбранной модели
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false); // Состояние модального окна
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Состояние мобильного меню

  // Добавляем отладку для currentChat
  useEffect(() => {
    console.log('🔄 App.js: currentChat изменился:', currentChat);
  }, [currentChat]);

  // Отладочная функция для изменения страницы (временно закомментировано)
  /*
  const handlePageChange = (newPage) => {
    console.log(`🔄 Смена страницы: ${currentPage} → ${newPage}`);
    setCurrentPage(newPage);
  };
  */

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Загружаем модели и чаты только один раз при инициализации
      loadModels(userData.id);
      loadChats(userData.id);
    }
  }, []); // Пустой массив зависимостей - выполняется только один раз

  // Устанавливаем первую модель как выбранную по умолчанию
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      console.log(`🤖 Устанавливаем модель по умолчанию: ${models[0].model_name}`);
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);

  const loadModels = async (userId) => {
    try {
      const response = await fetch(`${back_url}/api/models?user_id=${userId}`);
      const data = await response.json();
      
      if (data.models) {
        setModels(data.models);
        console.log(`🤖 Загружено моделей: ${data.models.length}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error);
    }
  };

  const loadChats = async (userId) => {
    try {
      const response = await fetch(`${back_url}/api/chats?user_id=${userId}`);
      const data = await response.json();
      
      // Просто загружаем чаты без всяких проверок
      setChats(data.chats);
      console.log(`📊 Загружено чатов: ${data.chats.length}`);
      
      // НЕ сбрасываем currentChat при загрузке чатов - это может привести к потере текущего чата
      // if (currentChat && !data.chats.find(chat => chat.id === currentChat.id)) {
      //   console.log('⚠️ Текущий чат не найден в списке, сбрасываем');
      //   setCurrentChat(null);
      // }
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Загружаем модели и чаты при первом входе
    await loadModels(userData.id);
    await loadChats(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentChat(null);
    setChats([]);
    localStorage.removeItem('user');
  };

  const createNewChat = async (userId) => {
    // Открываем модальное окно выбора модели
    setIsModelSelectorOpen(true);
  };

  const handleModelSelect = async (modelId) => {
    try {
      console.log('🆕 Создаем новый чат с моделью ID:', modelId);
      
      const response = await fetch(`${back_url}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          title: 'Новый чат',
          model_id: modelId
        }),
      });
      
      const newChat = await response.json();
      console.log('✅ Новый чат создан:', newChat);
      
      // Добавляем новый чат в список и устанавливаем как текущий
      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChat(newChat);
      
      // Прокручиваем к началу списка чатов
      const chatsSection = document.querySelector('.chats-section');
      if (chatsSection) {
        chatsSection.scrollTop = 0;
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      console.log(`🗑️ Удаляем чат ID: ${chatId}`);
      const response = await fetch(`${back_url}/api/chats/${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`✅ Чат удален из БД:`, result);
      
      // Обновляем состояние только если удаление прошло успешно
      setChats(chats.filter(chat => chat.id !== chatId));
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(null);
      }
      console.log(`✅ Чат удален из интерфейса`);
    } catch (error) {
      console.error('❌ Ошибка удаления чата:', error);
    }
  };

  const updateChat = (chatId, updates) => {
    console.log(`🔄 Обновляем чат ID: ${chatId} с данными:`, updates);
    
    // Обновляем чат в списке
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    );
    
    // Обновляем currentChat если это он
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(prev => ({ ...prev, ...updates }));
    }
  };



  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Мобильный бургер - выносим из Sidebar */}
      <div className="mobile-burger">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="burger-btn">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="app">
        <Sidebar
          user={user}
          chats={chats}
          currentChat={currentChat}
          currentPage={currentPage}
          onChatSelect={setCurrentChat}
          onNewChat={() => createNewChat(user.id)}
          onDeleteChat={deleteChat}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          models={models}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      {currentPage === 'chat' && (
        <ChatArea
          user={user}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          onChatUpdate={() => loadChats(user.id)}
          onNewChat={() => createNewChat(user.id)}
          updateChat={updateChat}
          models={models}
        />
      )}
      {currentPage === 'kanban' && (
        <KanbanBoard user={user} />
      )}
      {currentPage === 'test' && (
        <ConnectionTest />
      )}
      {/* Временно закомментировано для переработки
      {currentPage === 'how-to-use' && (
        <div>
          <div style={{padding: '20px', background: '#f0f0f0', margin: '10px'}}>
            <strong>DEBUG:</strong> Текущая страница: {currentPage}
          </div>
          <HowToUse />
        </div>
      )}
      {currentPage === 'help' && (
        <div>
          <div style={{padding: '20px', background: '#f0f0f0', margin: '10px'}}>
            <strong>DEBUG:</strong> Текущая страница: {currentPage}
          </div>
          <Help />
        </div>
      )}
      */}

      </div>

      {/* Модальное окно выбора модели - выносим наружу */}
      <ModelSelectorModal
        isOpen={isModelSelectorOpen}
        models={models}
        onClose={() => setIsModelSelectorOpen(false)}
        onModelSelect={handleModelSelect}
        user={user}
      />
    </>
  );
}

export default App;
