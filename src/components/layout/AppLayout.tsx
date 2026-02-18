import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import EmergencyButton from "./EmergencyButton";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
      <EmergencyButton />
    </div>
  );
};

export default AppLayout;
