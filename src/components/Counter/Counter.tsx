import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };
  const decrease = () => {
    setCount(count - 1);
  };

  return (
    <div className="flex flex-col gap-4 items-center p-20">
      <strong className="text-4xl ">{count}</strong>
      <div className="flex flex-row gap-4">
        <button type="button" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"  onClick={decrease}>decrease</button>
        <button type="button" className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" onClick={increase}>Increase</button>
      </div>
    </div>
  );
}
