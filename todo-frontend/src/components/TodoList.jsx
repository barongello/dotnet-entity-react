import TodoItem from './TodoItem';
import './TodoList.css';

export default function TodoList({ todos, isLoading, onToggle, onDelete, onUpdateTitle }) {
  return (
    <ul className="todo-list">
      {isLoading === true ? (<p className="todo-info-text">Loading tasks...</p>) : (
        <>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateTitle={onUpdateTitle}
            />
          ))}

          {
            todos.length === 0
            ? (
              <p className="todo-info-text">No tasks found. Add one above!</p>
            )
            : null
          }
        </>
      )}
    </ul>
  );
}
