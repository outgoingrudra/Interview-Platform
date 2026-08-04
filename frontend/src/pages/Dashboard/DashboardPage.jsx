import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import InterviewList from "./InterviewList";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <DashboardHeader />
        <DashboardStats />
        <InterviewList />
      </div>
    </main>
  );
}