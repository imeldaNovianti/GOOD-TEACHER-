function Button({ children, onClick, type = "button", className = "" }) { 
  // Komponen Button dengan props:
  // children = isi tombol (text/icon)
  // onClick = fungsi handler ketika tombol diklik
  // type = jenis tombol (default "button")
  // className = tambahan class CSS dari luar

  return (
    <button
      type={type} // set type tombol (button, submit, reset)
      onClick={onClick} // fungsi yang dijalankan ketika tombol diklik
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`} 
      // styling default tombol + tambahan class dari props
    >
      {children} {/* isi tombol (misalnya "Simpan", "Login") */}
    </button>
  );
}

export default Button; // export komponen agar bisa digunakan di file lain
