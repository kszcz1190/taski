import "../Style/VerifyEmail.css";
const ChangePassword = () => {
  return (
    <div className="wrapper-verify">
      <form action="">
        <div className="wrapper-form">
          <div>
            <label htmlFor="">Nowe hasło</label>
            <input type="password" />
          </div>

          <div>
            <label htmlFor="">Potwierdź hasło</label>
            <input type="password" />
          </div>
        </div>
        <button className="btn btn-danger">Resetuj hasło</button>
      </form>
    </div>
  );
};
export default ChangePassword;
