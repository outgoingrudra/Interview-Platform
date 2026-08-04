import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import MainHeader from "../components/layout/MainHeader";

const isInterviewRoomRoute = (pathname = "") =>
  /^\/interviews\/[^/]+\/room\/?$/.test(pathname);

export default function AppLayout() {
  const location = useLocation();

  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document?.fullscreenElement),
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document?.fullscreenElement),
      );
    };

    document?.addEventListener?.(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document?.removeEventListener?.(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  const shouldHideHeader =
    isFullscreen &&
    isInterviewRoomRoute(location?.pathname);

  return (
    <div className="min-h-screen bg-base-200">
      {!shouldHideHeader && <MainHeader />}

      <Outlet />
    </div>
  );
}