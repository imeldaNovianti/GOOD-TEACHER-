function Table({ headers, children }) {
  // Komponen Table dengan props:
  // headers = array judul kolom tabel
  // children = isi baris tabel (tr, td)

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      {/* table-auto = biar lebar menyesuaikan
          border-collapse = gabungkan border jadi rapi
          border + w-full = full width dengan border */}
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th 
              key={i} // key unik untuk setiap kolom
              className="border border-gray-300 px-4 py-2"
            >
              {h} {/* judul kolom */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody> 
      {/* isi tabel (baris data) diberikan dari luar */}
    </table>
  );
}

export default Table; // export komponen agar bisa digunakan di file lain
