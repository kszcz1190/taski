import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Style/ScheduleList.css";

const ScheduleList = () => {
  const [schedule, setSchedule] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [today, setToday] = useState(new Date());

  // Funkcja do pobierania grafiku z serwera na podstawie daty
  const fetchSchedule = async () => {
    try {
      const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString("en-CA")
        : null;

      const response = await axios.get("http://localhost:5000/schedule/list", {
        params: { date: formattedDate },
      });
      setSchedule(response.data); // Ustawiamy dane grafiku
    } catch (err) {
      setErrorMessage("Błąd pobierania grafiku: " + err.message);
    }
  };

  // Obsługuje wysłanie formularza (kliknięcie przycisku)
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDate) {
      setErrorMessage("Proszę wybrać datę.");
      return;
    }

    // Pobranie grafiku dla wybranej daty
    await fetchSchedule(selectedDate);
  };

  // Funkcja do edycji grafiku
  const dropSchedule = (machine) => async () => {
    const response = await axios.delete(
      "http://localhost:5000/schedule/delete",
      {
        params: {
          date: selectedDate.toLocaleDateString("en-CA"),
          machine: machine,
        },
      }
    );
    if (response.data.success) {
      window.location.reload();
    }

    console.log("Response:", response.data);
  };

  return (
    <div className="schedule-list">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Wybierz datę:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Wybierz datę"
          />
          <button className="btn btn-dark" type="submit">
            Pokaż grafik
          </button>
        </div>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="schedule-table">
        {Object.entries(schedule).length === 0 && (
          <p>Brak grafiku dla wybranej daty.</p>
        )}

        {Object.entries(schedule).map(([machine, employees], i) => (
          <div key={i} className="schedule-section">
            <h2>{machine}:</h2>
            <ul>
              {employees.map((employee, j) => (
                <li key={j}>
                  {j + 1}. {employee}
                </li>
              ))}
            </ul>
            {selectedDate > today ? (
              <>
                <button onClick={dropSchedule(machine)}>Usuń</button>
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
