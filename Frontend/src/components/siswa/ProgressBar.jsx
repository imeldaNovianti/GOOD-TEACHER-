function ProgressBar({ value }) { 
  // Komponen ProgressBar menerima props 'value' untuk menentukan persentase progress
  return (
    <div className="w-full bg-gray-200 rounded-full h-4"> 
      {/* Wrapper bar, dengan background abu-abu dan rounded penuh */}
      <div
        className="bg-green-500 h-4 rounded-full" 
        // bagian progress bar dengan warna hijau, tinggi 4px, rounded penuh
        style={{ width: `${value}%` }} 
        // Lebar progress sesuai nilai 'value' props, dalam persen
      />
    </div>
  );
}

export default ProgressBar; 
// Export agar bisa digunakan di file lain
