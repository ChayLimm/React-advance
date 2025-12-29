import type todoProp from "../type/todoType";

interface TodoCardProps {
  index : number;
  todoProp: todoProp;
  removeHandler: (query: number) => void;
}

export default function TodoCard({ index,todoProp, removeHandler }: TodoCardProps ) {
  return (
    <div>
      <div className="flex flex-row justify-between items-center px-8  py-4 rounded-lg bg-white">
        <h2 className="text-black text-xl font-bold">{todoProp.title}</h2>
        <button className="border rounded-2xl px-4  py-2 border-red-400" type="button" onClick={
          () => removeHandler(index)}>
            delete
        </button>
      </div>
    </div>
  );
}
