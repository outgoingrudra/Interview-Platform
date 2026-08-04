import { Outlet } from "react-router-dom";
import MainHeader from "../components/layout/MainHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <MainHeader />
      <Outlet />
    </div>
  );
}