import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/AppLayout";
import ClerkTokenSync from "./components/auth/ClerkTokenSync";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorPage from "./components/common/ErrorPage";

/*
  Route-level code splitting.

  Each page becomes a separate JavaScript chunk and is downloaded
  only when the user visits that route.
*/

const HomePage = lazy(() =>
  import("./pages/Home/HomePage"),
);

const DashboardPage = lazy(() =>
  import("./pages/Dashboard/DashboardPage"),
);

const CodingPracticePage = lazy(() =>
  import("./pages/CodingPractice/CodingPracticePage"),
);

const CreateInterviewPage = lazy(() =>
  import("./pages/CreateInterview/CreateInterviewPage"),
);

const InterviewDetailsPage = lazy(() =>
  import("./pages/InterviewDetails/InterviewDetailsPage"),
);

const JoinInterviewPage = lazy(() =>
  import("./pages/JoinInterview/JoinInterviewPage"),
);

const InterviewRoomPage = lazy(() =>
  import("./pages/InterviewRoom/InterviewRoomPage"),
);

const CandidateResultPage = lazy(() =>
  import("./pages/CandidateResult/CandidateResultPage"),
);

const InterviewReportPage = lazy(() =>
  import("./pages/InterviewReport/InterviewReportPage"),
);

const InterviewTerminatedPage = lazy(() =>
  import(
    "./pages/InterviewTerminated/InterviewTerminatedPage"
  ),
);

const MyInterviewsPage = lazy(() =>
  import("./pages/MyInterviews/MyInterviewsPage"),
);

const ReportsPage = lazy(() =>
  import("./pages/Reports/ReportsPage"),
);

function RouteLoader() {
  return (
    <main className="grid min-h-screen place-items-center bg-base-200">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />

        <p className="text-sm text-base-content/60">
          Loading page...
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const theme = useSelector(
    (state) => state?.ui?.theme,
  );

  return (
    <div
      data-theme={theme}
      className="min-h-screen"
    >
      <ClerkTokenSync />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            border:
              "1px solid var(--color-base-300)",
          },
        }}
      />

      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Public route */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/practice"
              element={<CodingPracticePage />}
            />

            <Route
              path="/interviews/create"
              element={<CreateInterviewPage />}
            />

            <Route
              path="/interviews/:id/join"
              element={<JoinInterviewPage />}
            />

            <Route
              path="/interviews/:id/room"
              element={<InterviewRoomPage />}
            />

            <Route
              path="/interviews/:id"
              element={<InterviewDetailsPage />}
            />

            <Route
              path="/sessions/:sessionId/result"
              element={<CandidateResultPage />}
            />

            <Route
              path="/sessions/:sessionId/report"
              element={<InterviewReportPage />}
            />

            <Route
              path="/interview-terminated"
              element={<InterviewTerminatedPage />}
            />

            <Route
              path="/reports"
              element={<ReportsPage />}
            />

            <Route
              path="/my-interviews"
              element={<MyInterviewsPage />}
            />
          </Route>

          {/* Unknown route */}
          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Page Not Found"
                message="The page you requested does not exist, or the address may be incorrect."
              />
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}