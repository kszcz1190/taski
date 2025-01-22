import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";
import { SelectedEmployeesList } from "./SelectedEmployeesList";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import "../Style/Messages.css";

const MsgEmployee = () => {
  const [results, setResults] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const { user } = useUser();
  const sender_id = user?.id;

  const handleSelectEmployee = (employee) => {
    // Dodaj pracownika do listy wybranych, jeśli jeszcze go tam nie ma
    if (!selectedEmployees.some((e) => e.id_user === employee.id_user)) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleRemoveEmployee = (id) => {
    // Usuń pracownika z listy wybranych
    setSelectedEmployees(selectedEmployees.filter((e) => e.id_user !== id));
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const employeesId = selectedEmployees.map((employee) => employee.id_user);
    try {
      const response = await axios.post("http://localhost:5000/sendMessage", {
        sender_id,
        title,
        content: message, // Zmieniono nazwę pola na "content"
        employeesId,
      });

      if (response.data.success) {
        setMessage("Wiadomość wysłana pomyślnie.");
      } else {
        setMessage("Nie udało się wysłać wiadomości.");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessage("Błąd serwera. Spróbuj ponownie później.");
    }
  };

  useEffect(() => {
    console.log("selectedEmployees", selectedEmployees);
  }, [selectedEmployees]);

  return (
    <div className="msg-employee">
      <form method="post" onSubmit={sendMessage}>
        <div className="msg-employee-search">
          <SearchBar setResults={setResults} />
          <SearchResultsList
            results={results}
            onSelect={handleSelectEmployee}
          />
          <SelectedEmployeesList
            employees={selectedEmployees}
            onRemove={handleRemoveEmployee}
          />
        </div>
        <div className="msg-employee-form">
          <label htmlFor="title">
            Tytuł wiadomości:
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              placeholder="Wpisz tytuł"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="textarea">
            Treść wiadomości:
            <textarea
              name="textarea"
              id="textarea"
              placeholder="Wpisz wiadomość"
              rows="4"
              cols="40"
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Kontrolowanie wartości
            />
          </label>
          <button
            type="submit"
            className="btn btn-outline-dark btn-lg btn-block"
          >
            Wyślij wiadomość
          </button>
        </div>
      </form>
    </div>
  );
};

export default MsgEmployee;
