import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import "../Style/Messages.css";

const MsgRecive = () => {
  const { user } = useUser();
  const user_id = user?.id;
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/messages", {
        params: { user_id },
      });
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [user_id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="msg-recive">
      <ul>
        {messages.length === 0 ? (
          <li>Brak wiadomości</li>
        ) : (
          messages.map((msg) => (
            <li key={msg.id}>
              <p>
                <b>Od:</b> {msg.first_name} {msg.last_name}
              </p>
              <p>
                <b>Data wysłania:</b> {formatDate(msg.created_date)}
              </p>
              <h5>{msg.title}</h5>
              <p>{msg.content}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
export default MsgRecive;
