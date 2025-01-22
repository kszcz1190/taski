import { useState } from "react";
// import { auth } from "../firebase";

const SendCodeEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendCode = async () => {
    try {
      setError("");
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      setMessage("Check your email for further instructions");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendCode} disabled={loading}>
        Send Code
      </button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};
export default SendCodeEmail;
