import Sidebar from "../components/Sidebar";
import DashNavbar from "../components/DashNavbar";
import { Outlet } from "react-router-dom";

export default function DashLayout() {
  return (
    <div className="bg-zinc-900 min-h-screen">

      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen text-neutral-300">

        <DashNavbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}