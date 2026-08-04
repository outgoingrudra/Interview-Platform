import TabSwitchDetector from "./TabSwitchDetector";
import ClipboardGuard from "./ClipboardGuard";
import FullscreenGuard from "./FullscreenGuard";
import FaceDetectionGuard from "./FaceDetectionGuard";
import SuspiciousGestureGuard from "./SuspiciousGestureGuard";
import LookingAwayGuard from "./LookingAwayGuard";

export default function SecurityGuards({
  sessionId,
  settings = {},
  onWarning,
  onTerminated,
  paused = false,
}) {
  if (!sessionId) return null;

  return (
    <>
      <TabSwitchDetector
        sessionId={sessionId}
        enabled={Boolean(settings?.detectTabSwitch)}
        onWarning={onWarning}
        onTerminated={onTerminated}
      />

      <ClipboardGuard
        sessionId={sessionId}
        enabled={Boolean(settings?.preventCopyPaste)}
        onWarning={onWarning}
        onTerminated={onTerminated}
      />

      <FullscreenGuard
        sessionId={sessionId}
        enabled={Boolean(settings?.requireFullscreen)}
        onWarning={onWarning}
        onTerminated={onTerminated}
      />

      <FaceDetectionGuard
        sessionId={sessionId}
        detectFaceEnabled={
          Boolean(settings?.detectFace) &&
          !paused
        }
        detectMultipleFacesEnabled={
          Boolean(settings?.detectMultipleFaces) &&
          !paused
        }
        onWarning={onWarning}
        onTerminated={onTerminated}
      />

      <LookingAwayGuard
        sessionId={sessionId}
        enabled={
          Boolean(settings?.detectSuspiciousGesture) &&
          !paused
        }
        onWarning={onWarning}
        onTerminated={onTerminated}
      />

      <SuspiciousGestureGuard
        sessionId={sessionId}
        enabled={
          Boolean(settings?.detectSuspiciousGesture) &&
          !paused
        }
      />
    </>
  );
}