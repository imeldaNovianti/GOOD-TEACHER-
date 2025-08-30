function Modal({ isOpen, onClose, children }) {
  // Komponen Modal dengan props:
  // isOpen = kondisi apakah modal tampil atau tidak
  // onClose = fungsi untuk menutup modal
  // children = isi konten modal

  if (!isOpen) return null; 
  // jika isOpen = false, modal tidak ditampilkan sama sekali (return null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      {/* overlay gelap menutupi seluruh layar + flex untuk center modal */}
      <div className="bg-white p-6 rounded shadow-md">
        {/* box modal dengan background putih, padding, rounded, dan shadow */}
        {children} {/* konten modal diisi dari luar */}
        <button 
          onClick={onClose} // tombol untuk menutup modal
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal; // export komponen agar bisa dipakai di file lain
