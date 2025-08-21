import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import './KanbanBoard.css';

function KanbanBoard({ user }) {
  const [activeBoard, setActiveBoard] = useState('web_canban');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    task: '',
    description: '',
    status: 'set'
  });

  const boards = [
    { id: 'web_canban', name: 'Web Канбан', color: '#3b82f6' },
    { id: 'tsd_android_canban', name: 'TSD Android', color: '#10b981' },
    { id: 'win_tsd_canban', name: 'Win TSD', color: '#f59e0b' },
    { id: 'system_canban', name: 'System', color: '#ef4444' }
  ];

  const statusColumns = [
    { id: 'set', name: 'К выполнению', color: '#64748b' },
    { id: 'process', name: 'В работе', color: '#3b82f6' },
    { id: 'done', name: 'Выполнено', color: '#10b981' }
  ];



  useEffect(() => {
    loadTasks();
  }, [activeBoard]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${activeBoard}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Ошибка загрузки задач');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch(`/api/${activeBoard}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewTask({
          task: '',
          description: '',
          status: 'set'
        });
        loadTasks();
      } else {
        console.error('Ошибка добавления задачи');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`/api/${activeBoard}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setEditingTask(null);
        loadTasks();
      } else {
        console.error('Ошибка обновления задачи');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        const response = await fetch(`/api/${activeBoard}/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadTasks();
        } else {
          console.error('Ошибка удаления задачи');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    handleUpdateTask(taskId, { status: newStatus });
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };



  if (!user || user.role !== 'admin') {
    return (
      <div className="kanban-access-denied">
        <AlertCircle size={48} />
        <h2>Доступ запрещен</h2>
        <p>Только администраторы могут просматривать канбан-доски</p>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      {/* Заголовок и навигация по доскам */}
      <div className="kanban-header">
        <h1>Канбан-доски</h1>
        <div className="board-tabs">
          {boards.map(board => (
            <button
              key={board.id}
              className={`board-tab ${activeBoard === board.id ? 'active' : ''}`}
              style={{ '--board-color': board.color }}
              onClick={() => setActiveBoard(board.id)}
            >
              {board.name}
            </button>
          ))}
        </div>
        <button 
          className="add-task-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Добавить задачу
        </button>
      </div>

      {/* Канбан-доска */}
      <div className="kanban-board">
        {statusColumns.map(column => (
          <div key={column.id} className="kanban-column">
            <div 
              className="column-header"
              style={{ backgroundColor: column.color }}
            >
              <h3>{column.name}</h3>
              <span className="task-count">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="column-content">
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : (
                getTasksByStatus(column.id).map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h4>{task.task}</h4>
                      <div className="task-actions">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="action-btn edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="action-btn delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    
                    <div className="task-meta">
                      <div className="task-id">
                        ID: {task.id}
                      </div>
                    </div>
                    
                    <div className="task-status-actions">
                      {statusColumns.map(status => (
                        <button
                          key={status.id}
                          className={`status-btn ${task.status === status.id ? 'active' : ''}`}
                          onClick={() => handleStatusChange(task.id, status.id)}
                          disabled={task.status === status.id}
                        >
                          {status.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно добавления задачи */}
      {showAddModal && (
        <div className="kanban-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="kanban-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Добавить новую задачу</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
              <div className="form-group">
                <label>Название задачи *</label>
                <input
                  type="text"
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Статус</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                >
                  {statusColumns.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="kanban-modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="primary">
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования задачи */}
      {editingTask && (
        <div className="kanban-modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="kanban-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Редактировать задачу</h3>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              handleUpdateTask(editingTask.id, editingTask); 
            }}>
              <div className="form-group">
                <label>Название задачи *</label>
                <input
                  type="text"
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({...editingTask, task: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Статус</label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                >
                  {statusColumns.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="kanban-modal-actions">
                <button type="button" onClick={() => setEditingTask(null)}>
                  Отмена
                </button>
                <button type="submit" className="primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
