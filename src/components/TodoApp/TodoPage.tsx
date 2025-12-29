import { useState, useEffect } from "react";
import SearchBar from "./Components/SearchBar";
import TodoList from "./Components/TodoList";
import { todos } from "./Data/data";
import AddTask from "./Components/AddTask";
import type todoProp from "./type/todoType";

export default function TodoPage() {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<todoProp[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("todoTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(todos);
      localStorage.setItem("todoTasks", JSON.stringify(todos));
    }
  }, []);

  const handleAdd = (title: string) => {
    const newTask = { title };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
  };

  const handleRemove = (index: number) => {
    const updatedTasks = tasks.filter((_,idx) => idx !== index);
    setTasks(updatedTasks);
    localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
  };

  const filtered = tasks.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col my-10 bg-gray-100 shadow-2xs p-10 rounded-4xl w-screen max-w-5xl min-h-screen">
      {/* header */}
      <div className="flex justify-between">
        <h1 className="text-4xl">Todo List</h1>
        <button
          className="py-2 px-4 border border-gray-400 rounded-2xl"
          type="button"
        >
          Export to Excel
        </button>
      </div>
      <SearchBar searchValue={search} onSearch={setSearch} />
      <AddTask addTask={handleAdd} />
      <TodoList todoList={filtered} removeHandler={handleRemove} />
    </div>
  );
}