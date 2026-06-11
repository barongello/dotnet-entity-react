import { useState } from 'react';
import './TodoItem.css';

export default function TodoItem({ todo, onToggle, onDelete, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    const trimmedNewTitle = editTitle.trim();

    if (trimmedNewTitle.length === 0) {
      return;
    }

    if (trimmedNewTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    onUpdateTitle(todo.id, trimmedNewTitle);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);

    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.isComplete ? 'item-completed' : ''}`}>
      <div className="todo-item-left">
        <input
          type="checkbox"
          checked={todo.isComplete}
          onChange={() => onToggle(todo)}
          className="todo-checkbox"
          disabled={isEditing}
        />

        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="todo-item-edit-input"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSave();
              }
              else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        ) : (
          <span className={`todo-text ${todo.isComplete ? 'completed' : ''}`} title={todo.title}>
            <span className="todo-text-inner">
              {todo.title}
            </span>
          </span>
        )}
      </div>

      <div className="todo-item-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="todo-button-save"
              disabled={editTitle.trim().length === 0}
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="todo-button-cancel"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="todo-button-edit"
              disabled={todo.isComplete}
            >
              Edit
            </button>

            <button onClick={() => onDelete(todo.id)} className="todo-button-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
