import { useEffect, useState } from "react";
import axios from "axios";
import "../Style/ScheduleEmp.css";
import { useUser } from "../UserContext";
import { Link } from "react-router-dom";

const WorkScheduleEmployee = () => {
  const [schedule, setSchedule] = useState([]); // Dane z harmonogramu
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(""); // Obsługa błędów
  const { user } = useUser();
  const userId = user?.id;

  const formattedDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Poniedziałek
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return formattedDate(day);
    });
  };

  const weekDates = getWeekDates(new Date());

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/schedule", {
        params: { userId, weekDates },
      });
      setSchedule(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Wystąpił błąd podczas ładowania danych."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [userId]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const daysOfWeek = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
    "Niedziela",
  ];
  return (
    <div className="wraper_schedule_emp">
      <div className="first_section">
        {weekDates.map((date, index) => {
          const daySchedule = schedule.find(
            (item) => item.schedule_date === date
          );
          return (
            <div key={date} className="day-schedule">
              <div className="date_schedule">
                <p>{date}</p>
                <p>{daysOfWeek[index]}</p>
              </div>
              {daySchedule ? (
                <div className="schedule_details">
                  <p className="machine_name">{daySchedule.machine_name}</p>

                  <p className="colleagues">Współpracownicy:</p>
                  <div className="colleagues">
                    {daySchedule.colleagues.map((colleague) => (
                      <div key={colleague.first_name + colleague.last_name}>
                        {colleague.first_name} {colleague.last_name}
                      </div>
                    ))}
                  </div>
                  <Link to="/Queue">
                    <button className="btn btn-dark btn-sm">
                      Zobacz kolejkę
                    </button>
                  </Link>
                </div>
              ) : (
                <p>Brak przypisania do maszyny.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkScheduleEmployee;
