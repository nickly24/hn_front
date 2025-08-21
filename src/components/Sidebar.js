import React, { useState } from 'react';
import { Sparkles, Bot, LogOut, Trash2, MessageCircle, Kanban, X } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ user, chats, currentChat, currentPage, onChatSelect, onNewChat, onDeleteChat, onPageChange, onLogout, models, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [isModelsExpanded, setIsModelsExpanded] = useState(false);
  const [deletingChats, setDeletingChats] = useState(new Set());

  const handleNewChat = () => {
    onNewChat();
  };

  const handleChatSelect = (chat) => {
    onChatSelect(chat);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    
    // Добавляем чат в список удаляемых
    setDeletingChats(prev => new Set(prev).add(chatId));
    
    try {
      await onDeleteChat(chatId);
    } catch (error) {
      console.error('Ошибка удаления чата:', error);
    } finally {
      // Убираем чат из списка удаляемых
      setDeletingChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Мобильное оверлей - показываем только когда меню открыто */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={handleMobileMenuClose} />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Мобильный заголовок */}
        <div className="mobile-sidebar-header">
          <div className="logo">
            <div className="logo-square">H&N</div>
            <span>H&N</span>
          </div>
          <button onClick={handleMobileMenuClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Логотип для десктопа */}
        <div className="sidebar-header desktop-only">
          <div className="logo">
            <div className="logo-square">H&N</div>
            <span>H&N</span>
          </div>
        </div>

      {/* Навигация */}
      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => {
            onPageChange('chat');
            handleMobileMenuClose();
          }}
        >
          <MessageCircle className="nav-icon" />
          <span>Чаты</span>
        </div>
        
        
        
        {user && user.role === 'admin' && (
          <div 
            className={`nav-item ${currentPage === 'kanban' ? 'active' : ''}`}
            onClick={() => {
              onPageChange('kanban');
              handleMobileMenuClose();
            }}
          >
            <Kanban className="nav-icon" />
            <span>Канбан-доски</span>
          </div>
        )}
        
        <div className="nav-item">
          <Bot className="nav-icon" />
          <span>Модели</span>
          <button 
            className="nav-button"
            onClick={() => setIsModelsExpanded(!isModelsExpanded)}
          >
            {isModelsExpanded ? '–' : '+'}
          </button>
        </div>
        
        {/* Список доступных моделей */}
        {isModelsExpanded && (
          <div className="models-list">
            {models && models.length > 0 ? (
              models.map(model => (
                <div key={model.id} className="model-item">
                  <Sparkles size={16} className="model-icon" />
                  <div className="model-info">
                    <span className="model-name">{model.model_name}</span>
                    {model.admin_only && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="model-item no-models">
                <span>Нет доступных моделей</span>
              </div>
            )}
          </div>
        )}
        
        {/* Временно закомментировано для переработки
        <div className="nav-item">
          <FileText className="nav-icon" />
          <span>Другие страницы</span>
          <button 
            className="nav-button"
            onClick={() => setExpandedSection(expandedSection === 'other' ? null : 'other')}
          >
            {expandedSection === 'other' ? '–' : '+'}
          </button>
        </div>
        
        {expandedSection === 'other' && (
          <div className="nav-submenu">
            <div 
              className={`nav-subitem ${currentPage === 'how-to-use' ? 'active' : ''}`}
              onClick={() => {
                console.log('🖱️ Клик по "Как пользоваться"');
                onPageChange('how-to-use');
                handleMobileMenuClose();
              }}
            >
              Как пользоваться?
            </div>
            <div 
              className={`nav-subitem ${currentPage === 'help' ? 'active' : ''}`}
              onClick={() => {
                console.log('🖱️ Клик по "Поддержка"');
                onPageChange('help');
                handleMobileMenuClose();
              }}
            >
              Поддержка
            </div>
          </div>
        )}
        */}
      </nav>

      {/* Призыв к действию */}
      <div className="cta-box">
        <div className="cta-icon">
          <MessageCircle size={20} />
        </div>
        <div className="cta-content">
          <h3>Задайте любой вопрос</h3>
          <p>
            {currentPage === 'kanban' 
              ? 'Нажмите, чтобы перейти в чаты и задать вопрос ИИ!' 
              : 'Спросите нужную модель ИИ и получите ответ в течение минуты!'
            }
          </p>
          <button className="cta-button" onClick={() => {
            // Если мы в канбане, сначала переходим в чаты
            if (currentPage === 'kanban') {
              onPageChange('chat');
            }
            // Создаем новый чат
            handleNewChat();
            handleMobileMenuClose();
          }}>
            {currentPage === 'kanban' ? 'Перейти в чаты' : 'Начать чат'}
          </button>
        </div>
      </div>

      {/* Список чатов */}
      <div className="chats-section">
        <h3>История чатов</h3>
        <div className="chats-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''} ${deletingChats.has(chat.id) ? 'deleting' : ''}`}
              onClick={() => {
                if (!deletingChats.has(chat.id)) {
                  handleChatSelect(chat);
                  handleMobileMenuClose();
                }
              }}
            >
              <MessageCircle size={16} className="chat-icon" />
              <div className="chat-info">
                <div className="chat-title">{chat.title}</div>
                <div className="chat-meta">
                  {chat.model_name || 'Неизвестная модель'} • {new Date(chat.updated_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <button
                className="delete-chat-btn"
                onClick={(e) => handleDeleteChat(e, chat.id)}
                title="Удалить чат"
                disabled={deletingChats.has(chat.id)}
              >
                {deletingChats.has(chat.id) ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Профиль пользователя */}
      <div className="user-profile">
        <div className="user-avatar">
          <span>{user.full_name.charAt(0)}</span>
        </div>
        <div className="user-info">
          <span className="user-name">{user.full_name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <button className="logout-btn" onClick={() => {
          onLogout();
          handleMobileMenuClose();
        }} title="Выйти">
          <LogOut size={16} />
        </button>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
