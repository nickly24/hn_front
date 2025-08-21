import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import './ModelSelectorModal.css';

function ModelSelectorModal({ isOpen, models, onClose, onModelSelect, user }) {
  const [selectedModelId, setSelectedModelId] = useState(null);

  if (!isOpen) return null;

  const handleCreateChat = () => {
    if (selectedModelId) {
      onModelSelect(selectedModelId);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedModelId(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="modal-header">
          <h2>Выберите модель ИИ</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Список моделей */}
        <div className="models-list">
          {models.map(model => (
            <div
              key={model.id}
              className={`model-item ${selectedModelId === model.id ? 'selected' : ''}`}
              onClick={() => setSelectedModelId(model.id)}
            >
              <div className="model-icon">
                <Sparkles size={20} />
              </div>
              <div className="model-info">
                <div className="model-name">{model.model_name}</div>
                {model.admin_only && (
                  <div className="admin-badge">Только для администраторов</div>
                )}
              </div>
              <div className="selection-indicator">
                {selectedModelId === model.id && (
                  <div className="checkmark">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Отмена
          </button>
          <button 
            className="create-button" 
            onClick={handleCreateChat}
            disabled={!selectedModelId}
          >
            Создать чат
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelSelectorModal;
