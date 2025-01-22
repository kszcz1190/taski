import axios from "axios";
import "../Style/VerifyEmail.css";
import { useState } from "react";
import { useContext } from "react";

const VerifyEmail = () => {
  const [timerCount, setTimerCount] = useState(60);
  const [disable, setDisable] = useState(true);

  function resentCode() {
    if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => {
        const timer = setInterval(() => {
          setTimerCount((prev) => {
            if (prev === 0) {
              clearInterval(timer);
              setDisable(false);
              return 60;
            }
            return prev - 1;
          });
        }, 1000);
      });
  }

  return (
    <div className="wrapper-verify">
      <p>Wpisz kod z wiadomości email</p>
      <form action="" className="verify-form">
        <div className="input-wrapper-verify">
          <input type="text" />
          <input type="text" />
          <input type="text" />
          <input type="text" />
        </div>

        <button className="btn btn-outline-danger btn-lg">Weryfikuj</button>
      </form>
      <p>
        Kod nie dotarł?{" "}
        <span
          className={disable ? "disabled" : ""}
          onClick={() => {
            resentCode();
            setDisable(true);
          }}
        >
          Wyślij ponownie
        </span>
      </p>
    </div>
  );
};

export default VerifyEmail;
