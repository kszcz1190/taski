export const SearchResultsList = ({ results, onSelect }) => {
  return (
    <div className="results-list">
      {results.map((result, i) => (
        <div
          key={i}
          className="result"
          onClick={() => onSelect(result)} // Wywołaj onSelect przy kliknięciu
          style={{ cursor: "pointer" }}
        >
          <>{result.first_name} </>
          <>{result.last_name}</>
        </div>
      ))}
    </div>
  );
};
