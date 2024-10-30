import { Link } from "react-router-dom";
import "../Style/HomePages.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

const HomeEmployee = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [workingDays, setWorkingDays] = useState(0);
  const [daysForUse, setDaysForUse] = useState(0);

  const today = new Date();
  const currentYear = today.getFullYear();

  // Widelki wybrania dat
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  const maxDate = new Date(currentYear, 11, 31);

  // Funkcja do liczenia dni roboczych w zależności od wybranych dat
  const calculateWorkingDays = (startDate, endDate) => {
    let count = 0;
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

  const startWork = new Date(2024, 6, 1); // 2 stycznia 2024

  // Funkcja do obliczania dni urlopowych
  const calculateDaysForUse = (startWork) => {
    const currentMonth = today.getMonth() + 1; // aktualny miesiąc, dodajemy 1 bo urlop nalicza się na początku miesiaca
    const startMonth = startWork.getMonth(); // miesiąc rozpoczęcia pracy
    const monthsWorked = currentMonth - startMonth; // liczba przepracowanych miesięcy
    return Math.round((monthsWorked * 20) / 12); // Zakładając 20 dni urlopowych rocznie
  };

  // Funkcja która dynamicznie będzie obliczać dni, jeśli użytkownik zmieni daty
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const workDays = calculateWorkingDays(selectedStartDate, selectedEndDate);
      setWorkingDays(workDays);
    }

    const daysForUseCalculated = calculateDaysForUse(startWork);
    setDaysForUse(daysForUseCalculated);
  }, [selectedStartDate, selectedEndDate]);

  const holidayInquiry = () => {
    if (selectedEndDate) {
      const formattedEndDate = selectedEndDate.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (selectedStartDate) {
        const formattedStartDate = selectedStartDate.toLocaleDateString(
          "pl-PL",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );
        console.log(
          `FROM ${formattedStartDate} TO ${formattedEndDate} -> DAYS: ${workingDays}`
        );
      }
    }
  };
  return (
    <div className="wrapper_Home">
      <div className="column">
        <Link to={"/WorkScheduleEmployee"} className="buttons_homePage">
          Work Schedule
        </Link>
      </div>
      <div className="column">
        <Link to={"/HolidayEmployee"} className="buttons_homePage">
          Holiday
        </Link>
        <div className="label_days">
          <label htmlFor="used">USED:</label> <br />
          <label htmlFor="forUse">FOR USE: {daysForUse}</label> <br />
        </div>
        <div>choose your holiday date</div>
        <DatePicker
          placeholderText="FROM DATE"
          selected={selectedStartDate}
          onChange={(date) => setSelectedStartDate(date)}
          dateFormat="dd/MM/YYYY"
          minDate={minDate}
          maxDate={maxDate}
          name="dateFrom"
        />
        <DatePicker
          placeholderText="TO DATE"
          selected={selectedEndDate}
          onChange={(date) => setSelectedEndDate(date)}
          dateFormat="dd/MM/YYYY"
          minDate={minDate}
          maxDate={maxDate}
          name="dateTo"
        />
        <br />
        <label htmlFor="">
          working days: {selectedStartDate && selectedEndDate && workingDays}
        </label>{" "}
        <br />
        {selectedStartDate && selectedEndDate && (
          <button onClick={holidayInquiry}>Send a holiday inquiry</button>
        )}
      </div>
    </div>
  );
};

export default HomeEmployee;
