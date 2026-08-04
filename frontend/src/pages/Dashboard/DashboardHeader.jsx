import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Manage interviews, candidates and reports.
        </p>
      </div>

      <Link
        to="/interviews/create"
        className="btn btn-primary w-full sm:w-auto"
      >
        <PlusIcon className="size-5" />
        Create Interview
      </Link>
    </header>
  );
}