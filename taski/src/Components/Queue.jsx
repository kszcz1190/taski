import { useEffect, useState } from "react";
import axios from "axios";
import "../Style/Queue.css";

const Queue = () => {
  const [generatedQueueMachine, setGeneratedQueueMachine] = useState([]);
  const [generatedQueuePacking, setGeneratedQueuePacking] = useState([]);

  const [generatedSchedule, setGeneratedSchedule] = useState([]); // Wygenerowana kolejka
  const [positions, setPositions] = useState([]); // Stan stanowisk
  const [selectedMachine, setSelectedMachine] = useState("");
  const [machines, setMachines] = useState([]);

  const positionOrder = async (machineName) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/position-order",
        {
          params: { machineName },
        }
      );
      setPositions(response.data);
      setSelectedMachine(machineName);
    } catch (err) {
      console.error("Error in positionOrder:", err);
    }
  };
  const generateDailyQueue = (selectedPosition) => {
    const startTime = new Date("2025-01-15T06:30:00");
    const endTime = new Date("2025-01-15T14:00:00");
    let startIndex = positions.findIndex(
      (pos) => pos.name === selectedPosition
    );

    if (startIndex === -1) {
      alert("Wybrana pozycja nie istnieje w liście.");
      return;
    }

    const schedule = [];
    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      const position = positions[startIndex % positions.length];
      schedule.push({
        time: currentTime.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        position: position.name,
      });
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // Dodaj 30 minut
      startIndex++;
    }

    setGeneratedSchedule(schedule); // Ustaw wygenerowaną kolejkę
  };

  const generateDailyQueuePackingOnDuty = (selectedPosition, d, pak) => {
    const start = "dyzur";
    let nextPosition = "0";
    let currentTime = new Date("2025-01-15T06:00:00");
    let endTime = new Date("2025-01-15T14:00:00");
    let pos = selectedPosition; //wybrane pierwsze stanowisko
    let countD = d; //liczba dyżurnych
    let countP = pak; //liczba pakujących
    const schedule = [];

    do {
      pos = start;
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      schedule.push({
        time: currentTime.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        position: pos,
      });
    } while (currentTime < new Date("2025-01-15T07:00:00"));
    pos = selectedPosition;
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    schedule.push({
      time: currentTime.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      position: pos,
    });
    while (currentTime < new Date("2025-01-15T13:00:00")) {
      if (pos + countD <= countP) {
        pos += countD;
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        schedule.push({
          time: currentTime.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          position: pos,
        });
      } else {
        nextPosition = pos - countP;
        pos = start;
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        schedule.push({
          time: currentTime.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          position: pos,
        });
        pos = nextPosition;
      }
    }
    while (currentTime < endTime) {
      pos = start;
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      schedule.push({
        time: currentTime.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        position: pos,
      });
    }

    setGeneratedQueuePacking(schedule);
  };

  const generateDailyQueuePacking = (selectedPosition, d, pak) => {
    const start = selectedPosition;
    let pos;
    let nextPosition = "0";
    let currentTime = new Date("2025-01-15T06:00:00");
    let endTime = new Date("2025-01-15T14:00:00");
    const countD = d; //liczba dyżurnych
    const countP = pak; //liczba pakujących

    const schedule = [];
    pos = start;
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    schedule.push({
      time: currentTime.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      position: pos,
    });
    while (currentTime < endTime) {
      if (pos + countD <= countP) {
        pos += countD;
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        schedule.push({
          time: currentTime.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          position: pos,
        });
      } else {
        if (currentTime < new Date("2025-01-15T07:00:00")) {
          pos = pos + countD - countP;
          currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
          schedule.push({
            time: currentTime.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            position: pos,
          });
        } else {
          if (currentTime < new Date("2025-01-15T13:00:00")) {
            nextPosition = pos - countP;
            pos = "dyzur";
            currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
            schedule.push({
              time: currentTime.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              position: pos,
            });
            pos = nextPosition;
          } else {
            pos = pos + countD - countP;
            currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
            schedule.push({
              time: currentTime.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              position: pos,
            });
          }
        }
      }
    }
    setGeneratedQueuePacking(schedule);
  };

  const machineName = async () => {
    try {
      const response = await axios.get("http://localhost:5000/machines");
      setMachines(response.data);
      console.log("machines", response.data);
    } catch (err) {
      console.error("Error in machine_name:", err);
    }
  };
  useEffect(() => {
    machineName();
  }, []);

  return (
    <div className="choose_section">
      <div className="machine_section">
        <h3>Maszyna</h3>
        <div className="machines_wrap">
          <div className="machines_list">
            {machines.map((machine, index) => (
              <button
                className="button_machines"
                key={index}
                onClick={() => positionOrder(machine.machine_name)}
              >
                {machine.machine_name}
              </button>
            ))}
          </div>
          <div className="second_section">
            {positions.length > 0 && selectedMachine && (
              <div className="position_order">
                <h3>{selectedMachine.toUpperCase()}</h3>
                <p>wybierz pierwsze stanowisko</p>
                {positions.map((position) => (
                  <button
                    key={position.orderPositions}
                    onClick={() => generateDailyQueue(position.name)}
                  >
                    {position.name}
                  </button>
                ))}
              </div>
            )}
            {generatedSchedule.length > 0 && (
              <div className="daily_schedule">
                <h3>Kolejka</h3>
                <ul>
                  {generatedSchedule.map((entry, index) => (
                    <li key={index}>
                      {entry.time} - {entry.position}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="queue_list">
            <div>
              {generatedQueueMachine.map((entry, index) => (
                <p key={index}>
                  {entry.time} - {entry.position}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="packing_section">
        <h3>Pakownia</h3>
        <div className="packing_wrap">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const pakujace = parseInt(e.target.elements.pakujace.value, 10); // liczba pakujących
              const dyzurne = parseInt(e.target.elements.dyzurne.value, 10); // liczba dyżurnych
              const wybraneStanowisko = parseInt(
                e.target.elements.selectedPosition.value,
                10
              );
              if (e.nativeEvent.submitter.value === "dyzurna") {
                // pierwsze stanowisko
                generateDailyQueuePackingOnDuty(
                  wybraneStanowisko,
                  dyzurne,
                  pakujace
                );
              } else {
                generateDailyQueuePacking(wybraneStanowisko, dyzurne, pakujace);
              }
            }}
          >
            <label htmlFor="pakujace">Liczba osób pakujących:</label>
            <input type="number" name="pakujace" required min="1" />
            <br />
            <label htmlFor="dyzurne">Liczba dyżurnych:</label>
            <input type="number" name="dyzurne" required min="1" />
            <br />
            <label htmlFor="selectedPosition">
              Które stanowisko jako pierwsze?
            </label>
            <input
              type="number"
              name="selectedPosition"
              required
              min="1"
              max="8"
            />
            <br />
            <button type="submit" value="dyzurna">
              Dyzurna
            </button>
            <button type="submit" value="pakujaca">
              Pakująca
            </button>
          </form>
          <div className="daily_schedule">
            <h3>Kolejka</h3>
            <ul>
              {generatedQueuePacking.map((entry, index) => (
                <li key={index}>
                  {entry.time} - {entry.position}
                </li>
              ))}
            </ul>
            <span>
              Jeśli jesteś osobą pakującą i wypada ci dyżur od 12:30 do 13:00 to
              musisz zająć miejsce na którym od godz 13 miała znajdować się
              dyżurna
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Queue;
