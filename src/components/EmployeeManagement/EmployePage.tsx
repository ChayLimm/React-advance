import { useEffect, useState } from "react";
import type { Employee } from "./../EmployeeManagement/type/EmployeeType";
import EmployeeCard from "./Components/EmployeeCard";

export default function EmployePage() {
  const [employees, setEmployees] = useState([]);
  const url = "http://localhost:3001/employee"
  useEffect(() => {
    fecthEmployees();
  }, []);

  const fecthEmployees = async () => {
    const res = await fetch(url);
    const data = await res.json();
    setEmployees(data);
  };

  const deleteEmployee = async (id: number) => {
    console.log("Deleting employee with id:", id);
    await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    fecthEmployees();
  };

  const update = async (employee: Employee) => {
    await fetch(`${url}/${employee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });
    fecthEmployees();
  };

  const addEmployee = async (employee: Employee) => {
    employee.id = Date.now()
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });
    fecthEmployees();
  }

  return (
    <div className="flex flex-col items-start w-screen h-screen max-w-5xl">
      <h1 className="text-2xl mb-4">Employee Management</h1>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 w-full">
        {employees.map((employee: Employee) => (
          <EmployeeCard employee={employee} onDelete={deleteEmployee} />
        ))}
      </div>
    </div>
  );
}
