import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/ScheduleSupervisor.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SupervisorSetup = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [machines, setMachines] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [noAssigments, setNoAssigments] = useState([]);
  const [select, setSelect] = useState(false);
  const [packingStaffCount, setPackingStaffCount] = useState(0);
  const [packingAssignments, setPackingAssignments] = useState([]);

  const navigate = useNavigate();

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response) => setEmployees(response.data))
      .catch((err) => console.error("Failed to fetch employees: ", err));
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return utcDate.toISOString().split("T")[0];
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selected = Array.from(
      event.target.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => Number(checkbox.id));

    setSelectedMachines(selected);
    setAssignments({});
    setErrorMessage("");
  };

  const handleEmployeeSelect = async (machineId, index, userId) => {
    const formattedDate = formatDate(selectedDate);

    // Sprawdzanie, czy pracownik jest już przypisany do innej maszyny
    for (const [currentMachineId, assignedEmployees] of Object.entries(
      assignments
    )) {
      if (
        currentMachineId !== String(machineId) && // Ignoruj bieżącą maszynę
        assignedEmployees.includes(userId) // Sprawdź, czy użytkownik jest przypisany
      ) {
        setErrorMessage(
          `Pracownik ID ${userId} jest już przypisany do maszyny ID ${currentMachineId}.`
        );
        return;
      }
    }

    // Sprawdzanie przypisania w bazie danych
    try {
      const response = await axios.post(
        "http://localhost:5000/schedule/check",
        {
          userId,
          scheduleDate: formattedDate,
        }
      );

      if (response.data.isAssigned) {
        setErrorMessage(
          `Pracownik ID ${userId} jest już przypisany w dniu ${formattedDate}.`
        );
        return;
      }

      // Aktualizacja przypisań w stanie
      setAssignments((prev) => {
        const updated = { ...prev };
        if (!updated[machineId]) {
          updated[machineId] = [];
        }
        // Dodajemy lub aktualizujemy przypisanie dla konkretnego indeksu
        updated[machineId][index] = userId;
        return updated;
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Error checking employee assignment:", error);
      setErrorMessage("Wystąpił błąd podczas sprawdzania przypisań.");
    }
  };

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault();

    const formattedDate = formatDate(selectedDate);
    const payload = [];

    // Przypisania do maszyn
    for (const [machineId, assignedEmployees] of Object.entries(assignments)) {
      assignedEmployees.forEach((employeeId) => {
        if (employeeId) {
          payload.push({
            schedule_date: formattedDate,
            machine_id: parseInt(machineId, 10),
            user_id: parseInt(employeeId, 10),
          });
        }
      });
    }

    // Przypisania do pakowni
    packingAssignments.forEach((employeeId) => {
      if (employeeId) {
        payload.push({
          schedule_date: formattedDate,
          machine_id: 10, // Brak konkretnej maszyny
          user_id: parseInt(employeeId, 10),
        });
      }
    });

    if (payload.length === 0) {
      alert("Brak przypisań do zapisania!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/schedule", {
        schedules: payload,
      });
      console.log("Dane wysyłane do bazy danych: ", payload);
      setErrorMessage(""); // Wyczyść błąd po sukcesie
      navigate("/ScheduleList");
    } catch (err) {
      console.error("Failed to save schedule: ", err);
      setErrorMessage("Nie udało się zapisać grafiku. Spróbuj ponownie.");
    }
  };

  const handleDataSubmit = (event) => {
    event.preventDefault();
    setSelect(true);
    axios
      .get("http://localhost:5000/machines/check", {
        params: {
          date: formatDate(selectedDate),
        },
      })
      .then((response) => setMachines(response.data))
      .catch((err) => console.error("Failed to fetch machines: ", err));
    //Pobranie liczby pracowników którzy nie zostali przypisani do maszyn
    axios
      .get("http://localhost:5000/employees/check", {
        params: {
          date: formatDate(selectedDate),
        },
      })
      .then((response) => {
        if (response.data.length > 0) {
          // Zaktualizuj stan, ustawiając pełną tablicę pracowników
          const employeesList = response.data.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          );
          setNoAssigments(employeesList);
        } else {
          setNoAssigments([]); // Brak pracowników
        }
      })
      .catch((err) => console.error("Failed to fetch employees: ", err));
  };

  return (
    <div className="wrapper_schedule_supervisor">
      <div className="schedule-part-first">
        <form className="form-data" onSubmit={handleDataSubmit}>
          <div>
            <label>Data:</label>
            <DatePicker
              placeholderText="wybierz"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={minDate}
            />
          </div>
          <button className="btn btn-dark" type="submit">
            Wybierz datę
          </button>
        </form>
        {select && (
          <>
            <div className="no-assigments">
              {noAssigments.length > 0 ? (
                <div>
                  <p>
                    Pracownicy którzy jeszcze nie zostali przypisani do maszyny
                  </p>
                  <ul>
                    {noAssigments.map((employee, index) => (
                      <li key={index}>
                        {index + 1}.{employee}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Brak pracowników do przypisania</p>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header">
                  <p className="title">Wybierz maszyny</p>
                </div>
                <div className="card-body">
                  {machines.map((machine) => (
                    <div
                      key={machine.id_machines}
                      className="checkbox-container"
                    >
                      <input
                        type="checkbox"
                        name="machine"
                        id={machine.id_machines}
                        value={machine.machine_name}
                      />
                      <label htmlFor={machine.id_machines}>
                        {machine.machine_name} ({machine.count_staff}{" "}
                        pracowników)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-dark" type="submit">
                Zatwierdź
              </button>
            </form>
            <div className="packing-section">
              <h3>Pakownia</h3>
              <label>Liczba osób w pakowni:</label>
              <input
                type="number"
                min="0"
                max={employees.length} // Maksymalna liczba dostępnych pracowników
                value={packingStaffCount}
                onChange={(e) => setPackingStaffCount(Number(e.target.value))}
              />
              <button
                className="btn btn-dark"
                onClick={() => {
                  // Reset przypisań pakowni
                  setPackingAssignments(Array(packingStaffCount).fill(null));
                }}
              >
                Zatwierdź
              </button>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleEmployeeSubmit}>
        {selectedMachines.length > 0 && (
          <>
            <div className="schedule-table-supervisor">
              <div className="schedule-part-second">
                {selectedMachines.map((machineId) => {
                  const machine = machines.find(
                    (machine) => machine.id_machines === machineId
                  );
                  if (!machine) return null;

                  return (
                    <div key={machine.id_machines} className="machine-section">
                      <h4>{machine.machine_name}</h4>
                      {[...Array(machine.count_staff)].map((_, index) => (
                        <div key={`${machine.id_machines}-${index}`}>
                          <label>Pracownik {index + 1}:</label>
                          <select
                            onChange={(e) =>
                              handleEmployeeSelect(
                                machine.id_machines,
                                index,
                                e.target.value
                              )
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Wybierz pracownika
                            </option>
                            {employees.map((employee) => (
                              <option
                                key={employee.id_user}
                                value={employee.id_user}
                              >
                                {employee.first_name} {employee.last_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {packingStaffCount > 0 && (
                <div className="packing-assignments">
                  <h4>Przypisanie do pakowni</h4>
                  {[...Array(packingStaffCount)].map((_, index) => (
                    <div key={`packing-${index}`}>
                      <label>Pracownik {index + 1}:</label>
                      <select
                        onChange={(e) => {
                          const userId = Number(e.target.value);

                          // Sprawdź, czy pracownik nie jest już przypisany do maszyny
                          for (const assigned of Object.values(assignments)) {
                            if (assigned.includes(userId)) {
                              setErrorMessage(
                                `Pracownik ID ${userId} jest już przypisany do maszyny.`
                              );
                              return;
                            }
                          }

                          // Sprawdź, czy pracownik nie jest już przypisany do pakowni
                          if (packingAssignments.includes(userId)) {
                            setErrorMessage(
                              `Pracownik ID ${userId} jest już przypisany do pakowni.`
                            );
                            return;
                          }

                          // Aktualizacja przypisań pakowni
                          setPackingAssignments((prev) => {
                            const updated = [...prev];
                            updated[index] = userId;
                            return updated;
                          });
                          setErrorMessage("");
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Wybierz pracownika
                        </option>
                        {employees.map((employee) => (
                          <option
                            key={employee.id_user}
                            value={employee.id_user}
                            disabled={
                              packingAssignments.includes(employee.id_user) ||
                              Object.values(assignments).some((a) =>
                                a.includes(employee.id_user)
                              )
                            }
                          >
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
                </div>
              )}

              <button className="btn btn-dark" type="submit">
                Ustal grafik
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SupervisorSetup;
