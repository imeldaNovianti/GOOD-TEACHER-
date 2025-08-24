import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet /> {/* <-- Halaman child akan muncul di sini */}
        </main>
      </div>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
