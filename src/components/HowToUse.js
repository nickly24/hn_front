import React from 'react';
import { MessageCircle, Bot, Sparkles, Users, Clock, Zap, BookOpen, Lightbulb } from 'lucide-react';
import './HowToUse.css';

function HowToUse() {
  return (
    <div className="how-to-use">
      <div className="how-to-use-header">
        <div className="header-icon">
          <BookOpen size={32} />
        </div>
        <h1>Как пользоваться H&N Chat</h1>
        <p className="header-subtitle">Полное руководство по использованию интеллектуального помощника</p>
      </div>

      <div className="how-to-use-content">
        {/* Основные возможности */}
        <section className="feature-section">
          <h2>
            <Sparkles className="section-icon" />
            Основные возможности
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MessageCircle size={24} />
              </div>
              <h3>Умные чаты</h3>
              <p>Создавайте неограниченное количество чатов для разных тем и задач</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Bot size={24} />
              </div>
              <h3>ИИ модели</h3>
              <p>Используйте передовые модели искусственного интеллекта для решения задач</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={24} />
              </div>
              <h3>Быстрые ответы</h3>
              <p>Получайте качественные ответы в течение минуты</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>История чатов</h3>
              <p>Все ваши разговоры сохраняются и доступны для повторного использования</p>
            </div>
          </div>
        </section>

        {/* Пошаговая инструкция */}
        <section className="instruction-section">
          <h2>
            <Lightbulb className="section-icon" />
            Пошаговая инструкция
          </h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Создание чата</h3>
                <p>Нажмите кнопку "Начать чат" в сайдбаре или используйте сочетание клавиш Ctrl+N</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Выбор модели</h3>
                <p>Выберите подходящую ИИ модель в разделе "Модели" (по умолчанию TEKMAN-1)</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Формулировка вопроса</h3>
                <p>Четко и подробно опишите ваш вопрос или задачу в текстовом поле</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Получение ответа</h3>
                <p>Дождитесь ответа от ИИ (обычно занимает менее минуты)</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Продолжение диалога</h3>
                <p>Задавайте уточняющие вопросы для получения более детальной информации</p>
              </div>
            </div>
          </div>
        </section>

        {/* Советы по использованию */}
        <section className="tips-section">
          <h2>
            <Lightbulb className="section-icon" />
            Полезные советы
          </h2>
          
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🎯 Будьте конкретны</h3>
              <p>Чем точнее сформулирован вопрос, тем лучше будет ответ</p>
            </div>
            
            <div className="tip-card">
              <h3>📝 Используйте контекст</h3>
              <p>Ссылайтесь на предыдущие сообщения для продолжения диалога</p>
            </div>
            
            <div className="tip-card">
              <h3>🔄 Разбивайте сложные задачи</h3>
              <p>Разделяйте сложные вопросы на несколько простых</p>
            </div>
            
            <div className="tip-card">
              <h3>💾 Сохраняйте важное</h3>
              <p>Копируйте важные ответы, так как чаты могут быть удалены</p>
            </div>
          </div>
        </section>

        {/* Примеры использования */}
        <section className="examples-section">
          <h2>
            <BookOpen className="section-icon" />
            Примеры использования
          </h2>
          
          <div className="examples-container">
            <div className="example-card">
              <h3>💼 Рабочие задачи</h3>
              <ul>
                <li>Анализ данных и отчеты</li>
                <li>Написание текстов и документов</li>
                <li>Решение технических проблем</li>
                <li>Планирование проектов</li>
              </ul>
            </div>
            
            <div className="example-card">
              <h3>🎓 Обучение</h3>
              <ul>
                <li>Объяснение сложных концепций</li>
                <li>Помощь с домашними заданиями</li>
                <li>Изучение новых технологий</li>
                <li>Подготовка к экзаменам</li>
              </ul>
            </div>
            
            <div className="example-card">
              <h3>🚀 Творчество</h3>
              <ul>
                <li>Генерация идей</li>
                <li>Написание сценариев</li>
                <li>Создание контента</li>
                <li>Дизайн и планирование</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Клавиатурные сокращения */}
        <section className="shortcuts-section">
          <h2>
            <Zap className="section-icon" />
            Клавиатурные сокращения
          </h2>
          
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>Ctrl + N</kbd>
              <span>Создать новый чат</span>
            </div>
            
            <div className="shortcut-item">
              <kbd>Ctrl + Enter</kbd>
              <span>Отправить сообщение</span>
            </div>
            
            <div className="shortcut-item">
              <kbd>Ctrl + K</kbd>
              <span>Быстрый поиск по чатам</span>
            </div>
            
            <div className="shortcut-item">
              <kbd>Ctrl + /</kbd>
              <span>Показать все горячие клавиши</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HowToUse;
