import type { Employee } from "./../../EmployeeManagement/type/EmployeeType";

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: number) => Promise<void>; 
}

export default function EmployeeCard({employee,onDelete}: EmployeeCardProps) {
  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-md">
        <h2 className="text-black font-bold">{employee.name}</h2>   
        <p className="text-black">{employee.email}</p>
        <button onClick={()=>onDelete(employee.id)} type="button" className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg " > 
            Add To Card
        </button>
    </div>
  )
}
