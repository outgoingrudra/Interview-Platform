import {
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";

export default function ProtectedRoute({
  children,
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
}