import { useEffect, useState } from "react";
import axios from "axios";
import "../Style/ScheduleSupervisor.css";

const WorkScheduleSupervisor = () => {
  const [values, setValues] = useState({
    machine_name: "",
    number_staff: "",
  });

  const [machines, setMachines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState({});
  const [expandedMachine, setExpandedMachine] = useState(null);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/schedule", values)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add the machine");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/schedule")
      .then((response) => {
        setMachines(response.data);
      })
      .catch((err) => {
        console.error("Failed to download the machine: ", err);
      });
    axios
      .get("http://localhost:5000/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((err) => {
        console.error("Failed to download employees ", err);
      });
  }, []);

  //rozwijanie formularza maszyny
  const handleExpandMachine = (machineId) => {
    setExpandedMachine(expandedMachine === machineId ? null : machineId);
  };

  //przypisywanie pracowników do maszyn
  const handleAssignEmployee = (machineId, index, employeeId) => {
    const updatedAssignments = { ...assignedEmployees };

    //dodawanie pracownika do maszyny
    if (!updatedAssignments[machineId]) {
      updatedAssignments[machineId] = [];
    }
    updatedAssignments[machineId][index] = employeeId;

    //aktualizacja stanu przypisanych pracownikow
    setAssignedEmployees(updatedAssignments);
  };

  //sprawdzenie czy pracownik jest juz przypisany
  const isEmployeeAssigned = (employeeId) => {
    return Object.values(assignedEmployees).flat().includes(employeeId);
  };

  const formatDate = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    };
    return now.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <h3>{formatDate()}</h3>
      <h3>Add machines</h3>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="machine_name" className="input_machine">
          Machine name
        </label>
        <input
          type="text"
          placeholder="Machine name"
          onChange={handleChange}
          name="machine_name"
          value={values.machine_name}
        />

        <label htmlFor="number_staff" className="input_machine">
          Staff number
        </label>
        <input
          type="number"
          placeholder="Staff number"
          onChange={handleChange}
          name="number_staff"
          value={values.number_staff}
        />

        <button type="submit">Add Machine</button>
      </form>

      <h3>Machines</h3>
      <div className="machines_grid">
        {machines.length > 0 ? (
          machines.map((machine) => (
            <div key={machine.id_machines}>
              <button
                className="machine"
                onClick={() => handleExpandMachine(machine.id_machines)}
              >
                {machine.machine_name} - No. employees: {machine.number_staff}
              </button>

              {/* Rozwijane pola pracowników */}
              {expandedMachine === machine.id_machines && (
                <div className="employee_assignment">
                  {Array.from({ length: machine.number_staff }).map(
                    (_, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`employee_${machine.id_machines}_${index}`}
                        >
                          Employee {index + 1}:
                        </label>
                        <select
                          id={`employee_${machine.id_machines}_${index}`}
                          onChange={(e) =>
                            handleAssignEmployee(
                              machine.id_machines,
                              index,
                              e.target.value
                            )
                          }
                          value={
                            assignedEmployees[machine.id_machines]
                              ? assignedEmployees[machine.id_machines][index] ||
                                ""
                              : ""
                          }
                        >
                          <option value="">Select an employee</option>
                          {employees
                            .filter(
                              (emp) => !isEmployeeAssigned(emp.id_employee)
                            )
                            .map((employee) => (
                              <option
                                key={employee.id_employee}
                                value={employee.id_employee}
                              >
                                {employee.name} {employee.surname}
                              </option>
                            ))}
                        </select>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No machines to display</p>
        )}
      </div>
    </div>
  );
};

export default WorkScheduleSupervisor;
