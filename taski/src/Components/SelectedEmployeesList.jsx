export const SelectedEmployeesList = ({ employees, onRemove }) => {
  return (
    <div className="selected-list">
      <h5>Wybrane osoby:</h5>
      {employees.map((employee) => (
        <div key={employee.id_user} className="selected-item">
          <span>
            {employee.first_name} {employee.last_name}
          </span>
          <button
            className="button-delete"
            onClick={() => onRemove(employee.id_user)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
