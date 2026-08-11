import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { useAuth } from "../context/AuthContext";
import { isNativeApp, NATIVE_AUTH_ERROR_KEY } from "../lib/nativeApp";

let lastHandledUrl = "";

export default function NativeAppBridge() {
  const navigate = useNavigate();
  const { completeNativeAuthUrl } = useAuth();

  useEffect(() => {
    if (!isNativeApp()) return undefined;

    let active = true;
    let listenerHandle;

    const handleUrl = async (url) => {
      if (!active || !url || url === lastHandledUrl) return;
      lastHandledUrl = url;

      try {
        const returnPath = await completeNativeAuthUrl(url);
        await Browser.close().catch(() => {});
        if (active) navigate(returnPath, { replace: true });
      } catch (error) {
        sessionStorage.setItem(
          NATIVE_AUTH_ERROR_KEY,
          error?.message || "The sign-in link could not be completed."
        );
        await Browser.close().catch(() => {});
        if (active) navigate("/online", { replace: true });
      }
    };

    CapacitorApp.addListener("appUrlOpen", ({ url }) => handleUrl(url)).then((handle) => {
      listenerHandle = handle;
      if (!active) handle.remove();
    });

    CapacitorApp.getLaunchUrl().then((launch) => handleUrl(launch?.url));

    return () => {
      active = false;
      listenerHandle?.remove();
    };
  }, [completeNativeAuthUrl, navigate]);

  return null;
}
