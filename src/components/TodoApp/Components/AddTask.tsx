import { useState } from "react";
import type todoProp from "../type/todoType";

interface AddTask {
  addTask: (query: string) => void;
}

export default function AddTask({ addTask }: AddTask) {
  const [input, setInput] = useState("");

  return (
    <div className="flex justify-between mt-4 mb-4">
      <input
        type="text"
        placeholder="add task"
        value={input}
        onChange={(data) => setInput(data.target.value)}
        className="w-full px-4 py-2 mr-8 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
      />
      <button
        onClick={() => {
          if (input.trim() === "") return;
          const newTask: todoProp = { title: input };
          addTask(newTask.title);
          setInput("");
        }}
        type="button"
        className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
      >
        Add
      </button>
    </div>
  );
}
