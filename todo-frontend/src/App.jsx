import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchTodos(controller.signal);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isLoading === true || inputRef.current === null) {
      return;
    }

    inputRef.current.focus();
  }, [isLoading]);

  const fetchTodos = async signal => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos`, { signal });

      if (response.ok === true) {
        const data = await response.json();

        setTodos(data);
      }
    }
    catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Error fetching data:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async title => {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      return;
    }

    const data = {
      title: trimmedTitle,
      isComplete: false
    };

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok === true) {
        const newTodo = await response.json();

        setTodos(prevTodos => [...prevTodos, newTodo]);

        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
    catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleComplete = async todo => {
    const updatedStatus = todo.isComplete === false;

    const data = {
      title: todo.title,
      isComplete: updatedStatus
    };

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok === true) {
        setTodos(prevTodos =>
          prevTodos.map(item =>
            item.id === todo.id ? { ...item, isComplete: updatedStatus } : item
          )
        );
      }
    }
    catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async id => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok === true) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    }
    catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodoTitle = async (id, newTitle) => {
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle.length === 0) {
      return;
    }

    const data = {
      title: trimmedNewTitle
    };

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok === true) {
        setTodos(prevTodos =>
          prevTodos.map(item =>
            item.id === id ? { ...item, title: trimmedNewTitle } : item
          )
        );
      }
    }
    catch (error) {
      console.error('Error updating todo title:', error);
    }
  };

  const clearAllTodos = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/todos/clear-all`, {
        method: 'DELETE',
      });

      if (response.ok === true) {
        setTodos([]);
      }
    }
    catch (error) {
      console.error('Error clearing all todos:', error);
    }
  };

  return (
    <div className="todo-container">
      <h1>.NET + Entity + React</h1>

      <h1>Todo App</h1>

      <TodoForm
        onAddTodo={handleAddTodo}
        isLoading={isLoading}
        inputRef={inputRef}
      />

      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
        onUpdateTitle={updateTodoTitle}
      />

      {!isLoading && (
        <div className="todo-actions-footer">
          <button
            onClick={clearAllTodos}
            className="todo-button-clear"
            disabled={todos.length === 0}
          >
            Clear All Tasks
          </button>
        </div>
      )}
    </div>
  );
}
