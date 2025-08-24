function Table({ headers, children }) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="border border-gray-300 px-4 py-2">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export default Table;
