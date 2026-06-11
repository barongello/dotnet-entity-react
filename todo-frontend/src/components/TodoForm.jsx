import { useState } from 'react';
import './TodoForm.css';

export default function TodoForm({ onAddTodo, isLoading, inputRef }) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle.length === 0) {
      return;
    }

    onAddTodo(trimmedNewTitle);

    setNewTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        className="todo-input"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="todo-button-add"
        disabled={isLoading || !newTitle.trim()}
      >
        Add
      </button>
    </form>
  );
}
