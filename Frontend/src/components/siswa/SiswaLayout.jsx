import { Outlet } from "react-router-dom";
import SiswaHeader from "./SiswaHeader";
import SiswaFooter from "./SiswaFooter";

function SiswaLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiswaHeader />

      <main className="flex-grow bg-gray-100 p-6">
        <Outlet />
      </main>

      <SiswaFooter />
    </div>
  );
}

export default SiswaLayout;
