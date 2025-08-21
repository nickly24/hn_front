import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Users, AlertTriangle, CheckCircle, Info, BookOpen } from 'lucide-react';
import './Help.css';

function Help() {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Как создать новый чат?",
      answer: "Нажмите кнопку 'Начать чат' в сайдбаре или используйте сочетание клавиш Ctrl+N. Новый чат будет создан автоматически."
    },
    {
      question: "Можно ли удалить чат?",
      answer: "Да, вы можете удалить любой чат, нажав на иконку корзины рядом с названием чата. Удаление необратимо."
    },
    {
      question: "Как изменить название чата?",
      answer: "Кликните на название чата в сайдбаре и введите новое название. Изменения сохранятся автоматически."
    },
    {
      question: "Какие модели ИИ доступны?",
      answer: "В настоящее время доступна модель TEKMAN-1. В будущем планируется добавление новых моделей."
    },
    {
      question: "Как долго хранятся сообщения?",
      answer: "Все сообщения хранятся в базе данных и доступны в любое время. Рекомендуем сохранять важную информацию отдельно."
    }
  ];

  return (
    <div className="help">
      <div className="help-header">
        <div className="header-icon">
          <HelpCircle size={32} />
        </div>
        <h1>Помощь и поддержка</h1>
        <p className="header-subtitle">Найдите ответы на часто задаваемые вопросы и получите помощь</p>
      </div>

      <div className="help-content">
        {/* Основная информация о поддержке */}
        <section className="support-info-section">
          <h2>
            <Users className="section-icon" />
            Служба поддержки ТЕКМАН
          </h2>
          
          <div className="support-highlight">
            <div className="support-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="support-text">
              <h3>Для личных вопросов обращайтесь к сотрудникам поддержки ТЕКМАН</h3>
              <p>Если у вас возникли вопросы, связанные с личными данными, аккаунтом или специфическими задачами, пожалуйста, свяжитесь с нашей службой поддержки.</p>
            </div>
          </div>

          <div className="contact-methods">
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <h3>Телефон поддержки</h3>
              <p>+7 (XXX) XXX-XX-XX</p>
              <span className="contact-hours">Пн-Пт: 9:00 - 18:00</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <h3>Email поддержки</h3>
              <p>support@tekman.ru</p>
              <span className="contact-hours">Ответ в течение 24 часов</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <MessageCircle size={24} />
              </div>
              <h3>Онлайн чат</h3>
              <p>Доступен на сайте ТЕКМАН</p>
              <span className="contact-hours">Круглосуточно</span>
            </div>
          </div>
        </section>

        {/* Часто задаваемые вопросы */}
        <section className="faq-section">
          <h2>
            <HelpCircle className="section-icon" />
            Часто задаваемые вопросы
          </h2>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${activeFAQ === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <div className="faq-toggle">
                    {activeFAQ === index ? '−' : '+'}
                  </div>
                </button>
                <div className={`faq-answer ${activeFAQ === index ? 'active' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Решение проблем */}
        <section className="troubleshooting-section">
          <h2>
            <CheckCircle className="section-icon" />
            Решение распространенных проблем
          </h2>
          
          <div className="troubleshooting-grid">
            <div className="trouble-card">
              <div className="trouble-icon">
                <AlertTriangle size={20} />
              </div>
              <h3>Не загружается страница</h3>
              <ul>
                <li>Проверьте подключение к интернету</li>
                <li>Обновите страницу (F5)</li>
                <li>Очистите кэш браузера</li>
                <li>Попробуйте другой браузер</li>
              </ul>
            </div>

            <div className="trouble-card">
              <div className="trouble-icon">
                <MessageCircle size={20} />
              </div>
              <h3>Проблемы с чатом</h3>
              <ul>
                <li>Проверьте авторизацию</li>
                <li>Создайте новый чат</li>
                <li>Проверьте настройки браузера</li>
                <li>Отключите блокировщики рекламы</li>
              </ul>
            </div>

            <div className="trouble-card">
              <div className="trouble-icon">
                <Clock size={20} />
              </div>
              <h3>Медленная работа</h3>
              <ul>
                <li>Закройте лишние вкладки</li>
                <li>Перезапустите браузер</li>
                <li>Проверьте скорость интернета</li>
                <li>Очистите историю браузера</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Полезные ссылки */}
        <section className="useful-links-section">
          <h2>
            <Info className="section-icon" />
            Полезные ссылки
          </h2>
          
          <div className="links-grid">
            <a href="#" className="link-card">
              <div className="link-icon">
                <BookOpen size={20} />
              </div>
              <h3>Документация ТЕКМАН</h3>
              <p>Полное руководство пользователя</p>
            </a>

            <a href="#" className="link-card">
              <div className="link-icon">
                <Users size={20} />
              </div>
              <h3>Сообщество пользователей</h3>
              <p>Форум и обсуждения</p>
            </a>

            <a href="#" className="link-card">
              <div className="link-icon">
                <Clock size={20} />
              </div>
              <h3>Статус системы</h3>
              <p>Мониторинг работы сервисов</p>
            </a>

            <a href="#" className="link-card">
              <div className="link-icon">
                <Mail size={20} />
              </div>
              <h3>Обратная связь</h3>
              <p>Предложения по улучшению</p>
            </a>
          </div>
        </section>

        {/* Контактная информация */}
        <section className="contact-section">
          <h2>
            <Phone className="section-icon" />
            Связаться с нами
          </h2>
          
          <div className="contact-info">
            <div className="company-info">
              <h3>ТЕКМАН</h3>
              <p>Ваш надежный партнер в области искусственного интеллекта</p>
              <div className="company-details">
                <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123</p>
                <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
                <p><strong>Email:</strong> info@tekman.ru</p>
                <p><strong>Время работы:</strong> Пн-Пт 9:00-18:00 (МСК)</p>
              </div>
            </div>
            
            <div className="emergency-contact">
              <h3>Экстренная поддержка</h3>
              <p>Для критических проблем доступна круглосуточная поддержка</p>
              <div className="emergency-phone">
                <Phone size={20} />
                <span>+7 (XXX) XXX-XX-XX</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Help;
