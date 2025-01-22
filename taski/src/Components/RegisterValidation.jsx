function Validation(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!values.first_name) errors.first_name = "Name should not be empty.";
  if (!values.last_name) errors.last_name = "Surname should not be empty";
  if (!values.phone) {
    errors.phone = "Phone number should not be empty";
  } else if (values.phone.length !== 9) {
    errors.phone = "Phone number must have exactly 9 digits";
  }
  if (!values.bank_account) {
    errors.bank_account = "Bank account should not be empty";
  } else if (values.bank_account.length !== 26) {
    errors.bank_account = "Bank account number must have exactly 26 characters";
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
  //date of birth
  if (!values.date_of_birth) {
    errors.date_of_birth = "Date of birth should not be empty.";
  } //older than 18
  else if (
    new Date().getFullYear() - new Date(values.date_of_birth).getFullYear() <
    18
  ) {
    errors.date_of_birth = "You must be at least 18 years old.";
  }

  return errors;
}

export default Validation;
