import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatArea.css';

function ChatArea({ user, currentChat, setCurrentChat, onChatUpdate, onNewChat, updateChat, models }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('🔄 useEffect currentChat изменился:', currentChat);
    if (currentChat) {
      console.log('📱 Загружаем сообщения для чата:', currentChat.id);
      loadMessages();
      console.log(`🤖 Текущая модель чата: ${currentChat.model_id}`);
    } else {
      console.log('❌ Нет текущего чата, очищаем сообщения');
      setMessages([]);
    }
  }, [currentChat]);

  // Добавляем отладку для messages
  useEffect(() => {
    console.log('📊 useEffect messages изменился:', messages);
  }, [messages]);

  const loadMessages = async () => {
    if (!currentChat) return;
    
    try {
      console.log('📥 Загружаем сообщения для чата ID:', currentChat.id);
      const response = await fetch(`/api/chats/${currentChat.id}/messages`);
      const data = await response.json();
      console.log('📨 Получены сообщения с сервера:', data.messages);
      setMessages(data.messages);
      console.log('✅ Сообщения установлены в состояние');
    } catch (error) {
      console.error('❌ Ошибка загрузки сообщений:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentChat || isLoading) return;

    console.log('🚀 Отправляем сообщение в чат:', currentChat.id);
    console.log('📊 Текущие сообщения:', messages);

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString()
    };

    // Сохраняем сообщение пользователя для обновления заголовка
    const userMessageContent = inputMessage;

    // Добавляем сообщение пользователя
    setMessages(prev => {
      console.log('➕ Добавляем сообщение пользователя:', userMessage);
      return [...prev, userMessage];
    });
    
    setInputMessage('');
    setIsLoading(true);

    // Добавляем пустое сообщение ассистента для стриминга
    const assistantMessage = {
      id: `temp-${Date.now()}-${Math.random()}`, // Уникальный временный ID
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      isTemporary: true // Флаг для временного сообщения
    };
    
    console.log('🤖 Добавляем пустое сообщение ассистента:', assistantMessage);
    setMessages(prev => {
      console.log('📊 Сообщения после добавления ассистента:', [...prev, assistantMessage]);
      return [...prev, assistantMessage];
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          chat_id: currentChat.id,
          message: inputMessage,
          model_id: currentChat.model_id
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка API');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              console.log('✅ Стриминг завершен');
              setIsLoading(false);
              
              // Перезагружаем сообщения из БД чтобы избежать дублирования
              await loadMessages();
              
              // Очищаем локальное состояние от временных сообщений
              setMessages(prev => prev.filter(msg => !msg.isTemporary && msg.content !== ''));
              
              // Обновляем заголовок чата только после получения ответа
              if (currentChat.title === 'Новый чат') {
                console.log('📝 Обновляем заголовок чата на:', userMessageContent);
                try {
                  const response = await fetch(`/api/chats/${currentChat.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title: userMessageContent.length > 50 ? 
                        userMessageContent.substring(0, 50) + '...' : 
                        userMessageContent
                    }),
                  });
                  
                  if (response.ok) {
                    const updatedChat = await response.json();
                    console.log('✅ Заголовок чата обновлен:', updatedChat.title);
                    // Обновляем чат в сайдбаре и в currentChat
                    updateChat(currentChat.id, { title: updatedChat.title });
                  }
                } catch (error) {
                  console.error('❌ Ошибка обновления заголовка чата:', error);
                }
              }
              
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                console.log('📨 Получен контент от ассистента:', parsed.content);
                // Обновляем контент последнего сообщения ассистента
                setMessages(prev => {
                  console.log('🔄 Обновляем сообщения, текущие:', prev);
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    console.log('✅ Найдено сообщение ассистента, добавляем контент');
                    // Проверяем, не дублируется ли контент
                    if (!lastMessage.content.includes(parsed.content)) {
                      lastMessage.content += parsed.content;
                      console.log('📝 Новый контент ассистента:', lastMessage.content);
                    } else {
                      console.log('⚠️ Контент уже содержит этот чанк, пропускаем');
                    }
                  } else {
                    console.log('❌ Не найдено сообщение ассистента для обновления');
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.log('⚠️ Ошибка парсинга JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      // Убираем сообщение ассистента при ошибке
      setMessages(prev => prev.filter(msg => msg.role !== 'assistant' || msg.content !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="chat-area empty">
        <div className="empty-state">
          <div className="empty-icon">
            <Zap size={64} />
          </div>
          <h2>H&N chat</h2>
          <p>Выберите чат или создайте новый для начала общения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* Заголовок чата */}
      <div className="chat-header">
        <h1>H&N chat</h1>
        <div className="model-display">
          {currentChat && models.length > 0 && (
            <div className="current-model">
              <Sparkles size={16} />
              <span>
                {models.find(m => m.id === currentChat.model_id)?.model_name || 'Неизвестная модель'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Область сообщений */}
      <div className="messages-container">
        {!currentChat ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">
              <Zap size={80} />
            </div>
            <p>Начните новый диалог с ИИ</p>
            <button 
              className="start-new-chat-btn"
              onClick={() => onNewChat()}
            >
              Начать новый чат
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">
              <Zap size={80} />
            </div>
            <p>Начните новый диалог с ИИ</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="message-content">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Стили для заголовков
                        h1: ({node, ...props}) => <h1 style={{fontSize: '1.5em', fontWeight: 'bold', margin: '0.5em 0'}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{fontSize: '1.3em', fontWeight: 'bold', margin: '0.4em 0'}} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{fontSize: '1.1em', fontWeight: 'bold', margin: '0.3em 0'}} {...props} />,
                        // Стили для жирного и курсива
                        strong: ({node, ...props}) => <strong style={{fontWeight: 'bold'}} {...props} />,
                        em: ({node, ...props}) => <em style={{fontStyle: 'italic'}} {...props} />,
                        // Стили для списков
                        ul: ({node, ...props}) => <ul style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
                        li: ({node, ...props}) => <li style={{margin: '0.2em 0'}} {...props} />,
                        // Стили для кода
                        code: ({node, inline, ...props}) => {
                          if (inline) {
                            return <code style={{backgroundColor: '#f1f3f4', padding: '0.2em 0.4em', borderRadius: '3px', fontFamily: 'monospace'}} {...props} />;
                          }
                          
                          // Проверяем, является ли это ASCII таблицей
                          const content = props.children;
                          const isAsciiTable = typeof content === 'string' && (content.includes('|') || content.includes('---'));
                          
                          if (isAsciiTable) {
                            return (
                              <div style={{
                                backgroundColor: '#f8f9fa',
                                border: '2px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '16px',
                                margin: '1em 0',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                overflowX: 'auto'
                              }}>
                                <code style={{
                                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                                  fontSize: '0.9em',
                                  lineHeight: '1.4',
                                  color: '#495057',
                                  display: 'block',
                                  whiteSpace: 'pre'
                                }} {...props} />
                              </div>
                            );
                          }
                          
                          return <code style={{backgroundColor: '#f1f3f4', padding: '1em', borderRadius: '6px', fontFamily: 'monospace', display: 'block', margin: '0.5em 0'}} {...props} />;
                        },
                        pre: ({node, ...props}) => {
                          const content = props.children;
                          const isAsciiTable = typeof content === 'string' && (content.includes('|') || content.includes('---'));
                          
                          if (isAsciiTable) {
                            return (
                              <div style={{
                                backgroundColor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                border: '2px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '16px',
                                margin: '1em 0',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                overflowX: 'auto'
                              }}>
                                <pre style={{
                                  backgroundColor: 'transparent',
                                  padding: '0',
                                  margin: '0',
                                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                                  fontSize: '0.9em',
                                  lineHeight: '1.4',
                                  color: '#495057',
                                  whiteSpace: 'pre'
                                }} {...props} />
                              </div>
                            );
                          }
                          
                          return <pre style={{backgroundColor: '#f1f3f4', padding: '1em', borderRadius: '6px', overflow: 'auto', margin: '0.5em 0'}} {...props} />;
                        },
                        // Стили для таблиц
                        table: ({node, ...props}) => <table style={{borderCollapse: 'collapse', width: '100%', margin: '0.5em 0'}} {...props} />,
                        th: ({node, ...props}) => <th style={{border: '1px solid #ddd', padding: '8px', backgroundColor: '#f8f9fa', textAlign: 'left'}} {...props} />,
                        td: ({node, ...props}) => <td style={{border: '1px solid #ddd', padding: '8px'}} {...props} />,
                        // Стили для блоков
                        blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid #3b82f6', margin: '0.5em 0', paddingLeft: '1em', color: '#6b7280'}} {...props} />,
                        // Стили для ссылок
                        a: ({node, ...props}) => <a style={{color: '#3b82f6', textDecoration: 'underline'}} {...props} />,
                        // Стили для параграфов
                        p: ({node, ...props}) => <p style={{margin: '0.5em 0'}} {...props} />,
                        // Стили для горизонтальных линий
                        hr: ({node, ...props}) => <hr style={{border: 'none', borderTop: '1px solid #e5e7eb', margin: '1em 0'}} {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  {message.role === 'assistant' && isLoading && message.id === messages[messages.length - 1]?.id && (
                    <span className="typing-indicator">▋</span>
                  )}
                </div>
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Форма ввода */}
      <div className="input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Отправить"
            disabled={isLoading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="disclaimer">
          Не полагайтесь на ответ нейросети полностью. ИИ также способен ошибаться.
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
