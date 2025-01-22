import { useEffect, useState } from "react";
import axios from "axios";

const WorkHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Indeks wiersza w trybie edycji
  const [editedData, setEditedData] = useState({}); // Dane edytowanego wiersza

  useEffect(() => {
    axios
      .get("http://localhost:5000/workhistory")
      .then((response) => setEmployees(response.data))
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedData(employees[index]); // Załaduj dane wiersza do edycji
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value }); // Aktualizuj dane
  };

  const handleSave = async () => {
    const userId = editedData.id_user; // Pobierz id_user
    console.log("userId", userId);
    if (!userId) {
      console.error("Missing user ID for update");
      return;
    }
    const formattedStartDate = formatDate(editedData.date_start_employment);
    const formattedEndDate = formatDate(editedData.date_end_employment);

    try {
      const response = await axios.put(`http://localhost:5000/workhistory`, {
        userId,
        ...editedData,
        date_start_employment: formattedStartDate,
        date_end_employment: formattedEndDate,
      });
      if (response.data.message === "Success") {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date); // Konwertuj na obiekt Date
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Dodaj zero na początku
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Zwróć w formacie yyyy-MM-dd
  };

  const handleCancel = () => {
    setEditIndex(null); // Anuluj edycję
    setEditedData({});
  };

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
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="bg-white rounded p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Id pracownika</th>
              <th>Imię i Nazwisko</th>
              <th>Początek zatrudnienia</th>
              <th>Koniec zatrudnienia</th>
              <th>Wykorzystanych dni</th>
              <th>Liczba dni do wykorzystania w ciągu całego roku</th>
              <th>Pozostałe dni do wykorzystania</th>
              <th>Edytuj</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((data, i) => (
              <tr key={i}>
                {editIndex === i ? (
                  <>
                    <td>{data.id_user}</td>
                    <td>
                      {data.first_name} {data.last_name}
                    </td>
                    <td>
                      <input
                        type="date"
                        value={formatDate(editedData.date_start_employment)}
                        onChange={(e) =>
                          handleChange(e, "date_start_employment")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={formatDate(editedData.date_end_employment)}
                        onChange={(e) => handleChange(e, "date_end_employment")}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editedData.used_days}
                        onChange={(e) => handleChange(e, "used_days")}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave(i)}
                      >
                        Zapisz
                      </button>
                      <button className="btn btn-danger" onClick={handleCancel}>
                        Anuluj
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{data.id_user}</td>
                    <td>
                      {data.first_name} {data.last_name}
                    </td>
                    <td>{formatDate(data.date_start_employment)}</td>
                    <td>{formatDate(data.date_end_employment)}</td>
                    <td>{data.used_days}</td>
                    <td>{data.days_to_use}</td>
                    <td>
                      {daysToUse(
                        data.date_start_employment,
                        data.days_to_use,
                        data.used_days
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-dark"
                        onClick={() => handleEdit(i)}
                      >
                        Edytuj
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkHistory;
