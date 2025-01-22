function Validation(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const postCodePattern = /^\d{2}-\d{3}$/;
  const rolePattern = /^[0-3]+$/;
  // poskie znaki też
  const namePattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
  const numberPattern = /^[0-9]+$/;

  if (!namePattern.test(values.first_name)) {
    errors.first_name = "Tylko litery";
  }
  if (!namePattern.test(values.last_name)) {
    errors.last_name = "Tylko litery";
  }
  if (values.phone.length !== 9) {
    errors.phone = "Tylko 9 cyfr";
  }
  if (!emailPattern.test(values.email)) {
    errors.email = "Niepoprawny email";
  }
  if (values.bank_account.length !== 26) {
    errors.bank_account = "Tylko 26 cyfr";
  }
  if (!postCodePattern.test(values.post_code)) {
    errors.post_code = "Format: 00-000";
  }
  if (!namePattern.test(values.city)) {
    errors.city = "Tylko litery";
  }
  if (!numberPattern.test(values.house_number)) {
    errors.house_number = "Tylko cyfry";
  }
  if (!numberPattern.test(values.block_number)) {
    errors.block_number = "Tylko cyfry";
  }
  if (!rolePattern.test(values.role_id)) {
    errors.role_id = "Tylko 1-3";
  }
  if (!rolePattern.test(values.shift_id)) {
    errors.shift_id = "Tylko 1-3";
  }
  if (!rolePattern.test(values.dept_id)) {
    errors.dept_id = "Tylko 1-3";
  }
  if (values.date_of_birth === "") {
    errors.date_of_birth = "Pole wymagane";
  } else if (values.date_of_birth > new Date().toISOString().split("T")[0]) {
    errors.date_of_birth = "Data z przyszłości";
  } else if (
    new Date().getFullYear() - new Date(values.date_of_birth).getFullYear() <
    18
  ) {
    errors.date_of_birth = "Conajmniej 18 lat";
  }

  return errors;
}

export default Validation;
