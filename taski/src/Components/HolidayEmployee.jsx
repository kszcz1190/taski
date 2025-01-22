import "../Style/Holiday.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext.jsx";

const HolidayEmployee = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [workingDays, setWorkingDays] = useState(0);
  const [respond, setRespond] = useState("");
  const { user, loading } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!loading && userId) {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/workhistory/user",
            {
              params: { user: userId },
            }
          );
          setWorkHistory(res.data);
          console.log("res.data", res.data);
        } catch (err) {
          console.error("Failed to fetch work history:", err);
        }
      };

      fetchData();
    }
  }, [loading, userId]);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      setWorkingDays(calculateWorkingDays(selectedStartDate, selectedEndDate));
    }
  }, [selectedStartDate, selectedEndDate]);

  const calculateWorkingDays = (startDate, endDate) => {
    let count = 1;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const holidayInquiry = async () => {
    if (selectedStartDate && selectedEndDate) {
      const formattedStartDate = selectedStartDate.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedEndDate = selectedEndDate.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const message = `Proszę o zatwierdzenie urlopu w dniach ${formattedStartDate} - ${formattedEndDate}.`;

      try {
        const response = await axios.post("http://localhost:5000/sendMessage", {
          sender_id: userId,
          title: "Zapytanie o urlop", // Dodano tytuł wiadomości
          content: message, // Zmieniono nazwę pola na "content"
          employeesId: [12],
        });
        setRespond(response.data.message);
      } catch (err) {
        console.error("Failed to send message:", err);
        console.log("Błąd serwera. Spróbuj ponownie później.");
      }
    }
  };

  const today = new Date();
  const currentYear = today.getFullYear();

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  const maxDate = new Date(currentYear, 11, 31);

  if (loading) {
    return <div>Loading...</div>;
  }

  const daysToUse = (dateStart, daysInYear, countUsedDays) => {
    const start = new Date(dateStart);
    const today = new Date();

    // Upewnij się, że `dateStart` jest wcześniejsza niż `today`
    if (start > today) {
      return 0;
    }

    // Oblicz różnicę w pełnych miesiącach między datami
    const yearsDifference = today.getFullYear() - start.getFullYear();
    const monthsDifference = today.getMonth() - start.getMonth();
    const totalMonths = yearsDifference * 12 + monthsDifference;

    // Oblicz liczbę dni do wykorzystania
    const days = Math.round((daysInYear / 12) * totalMonths) - countUsedDays;

    return days;
  };

  return (
    <div className="wrapper_schedule">
      <ul>
        {workHistory.map((item) => (
          <li key={item.id_user}>
            <div>Do wykorzystania w ciagu roku: {item.days_to_use}</div>
            <div>Wykorzystane dni: {item.used_days}</div>
            <div>
              Do wykorzystania na ten moment:{" "}
              {daysToUse(
                workHistory[0]?.date_start_employment,
                workHistory[0]?.days_to_use,
                workHistory[0]?.used_days
              )}
            </div>
          </li>
        ))}
      </ul>
      <div>Wybierz datę: </div>
      <DatePicker
        placeholderText="Od"
        selected={selectedStartDate}
        onChange={(date) => setSelectedStartDate(date)}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        name="dateFrom"
      />
      <DatePicker
        placeholderText="Do"
        selected={selectedEndDate}
        onChange={(date) => setSelectedEndDate(date)}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        name="dateTo"
      />
      <label htmlFor="">
        Dni robocze: {selectedStartDate && selectedEndDate ? workingDays : 0}
      </label>
      {selectedStartDate && selectedEndDate && (
        <button onClick={holidayInquiry}>Wyślij zapytanie o urlop</button>
      )}
      <label htmlFor="">{respond}</label>
    </div>
  );
};

export default HolidayEmployee;
