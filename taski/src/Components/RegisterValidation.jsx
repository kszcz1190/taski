function Validation(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (!values.name) errors.name = "Name should not be empty.";
  if (!values.surname) errors.surname = "Surname should not be empty";
  if (!values.phone) {
    errors.phone = "Phone number should not be empty";
  } else if (values.phone.length !== 9) {
    errors.phone = "Phone number must have exactly 9 digits";
  }
  if (!values.bankAccount) {
    errors.bankAccount = "Bank account should not be empty";
  } else if (values.bankAccount.length !== 26) {
    errors.bankAccount = "Bank account number must have exactly 26 characters";
  }
  if (!values.pesel) {
    errors.pesel = "Pesel should not be empty";
  } else if (values.pesel.length !== 11) {
    errors.pesel = "Pesel must have exactly 11 digits";
  }
  if (!values.email) {
    errors.email = "Email should not be empty.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password should not be empty.";
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      "Password must be at least 8 characters long, contain at least one digit, one lowercase letter, and one uppercase letter.";
  }

  return errors;
}

export default Validation;
