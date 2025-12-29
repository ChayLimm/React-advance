import TodoCard from './TodoCard'
import type todoProp from "../type/todoType";

interface TodoListProps {
  todoList: todoProp[];
  removeHandler: (query: number) => void;
}

export default function TodoList({ todoList, removeHandler }: TodoListProps) {
  return (
    <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-2 transition-all duration-300'>
      {todoList.map((data,index) => (
        <TodoCard 
            index={index}
          todoProp={data}
          removeHandler={removeHandler}
        />
      ))}
    </div>
  );
}
