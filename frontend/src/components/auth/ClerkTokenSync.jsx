import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setClerkTokenGetter } from "../../api/clerkToken";

export default function ClerkTokenSync() {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    setClerkTokenGetter(getToken);

    return () => {
      setClerkTokenGetter(null);
    };
  }, [isLoaded, getToken]);

  return null;
}