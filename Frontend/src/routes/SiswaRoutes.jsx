import { Routes, Route } from "react-router-dom";
import SiswaLayout from "../components/siswa/SiswaLayout";

import Dashboard from "../pages/siswa/Dashboard";
import KuisionerList from "../pages/siswa/KuisionerList";
import IsiKuisioner from "../pages/siswa/IsiKuisioner";
import HasilKuisioner from "../pages/siswa/HasilKuisioner";
import Profile from "../pages/siswa/Profile";
import Achievement from "../pages/siswa/Achievement";
import About from "../pages/siswa/About";

function SiswaRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SiswaLayout />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Kuisioner */}
        <Route path="kuisioner" element={<KuisionerList />} /> 
        <Route path="kuisioner/:guruId" element={<IsiKuisioner />} />

        {/* Hasil */}
        <Route path="hasil" element={<HasilKuisioner />} />

        {/* Profil & Lainnya */}
        <Route path="profile" element={<Profile />} />
        <Route path="achievement" element={<Achievement />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default SiswaRoutes;
