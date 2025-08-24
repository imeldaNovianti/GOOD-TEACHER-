import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import DataGuru from "../pages/admin/DataGuru";
import DataSiswa from "../pages/admin/DataSiswa";
import Pertanyaan from "../pages/admin/Pertanyaan";
import Periode from "../pages/admin/Periode";
import Kuisioner from "../pages/admin/Kuisioner";
import Laporan from "../pages/admin/Laporan";
import About from "../pages/admin/About";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dataguru" element={<DataGuru />} />
        <Route path="datasiswa" element={<DataSiswa />} />
        <Route path="pertanyaan" element={<Pertanyaan />} />
        <Route path="periode" element={<Periode />} />
        <Route path="kuisioner" element={<Kuisioner />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
