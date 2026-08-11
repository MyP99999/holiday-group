import { Capacitor } from "@capacitor/core";

export const NATIVE_APP_ID = "com.HolidaySplits";
export const NATIVE_AUTH_SCHEME = "com.holidaysplits.app";
export const NATIVE_AUTH_ERROR_KEY = "holidaysplits:native-auth-error";

const productionWebOrigin = String(
  process.env.REACT_APP_PUBLIC_SITE_URL || "https://holidaysplits.com"
).replace(/\/$/, "");

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function publicWebOrigin() {
  return isNativeApp() ? productionWebOrigin : window.location.origin;
}

function safeReturnPath(returnPath, fallback = "/online/lobby") {
  const candidate = String(returnPath || "");
  return candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : fallback;
}

export function nativeAuthRedirect(returnPath, mode = "auth") {
  const params = new URLSearchParams({
    returnPath: safeReturnPath(returnPath),
    mode,
  });
  return `${NATIVE_AUTH_SCHEME}://auth/callback?${params}`;
}

export function authRedirectFor(returnPath, mode = "auth") {
  const path = safeReturnPath(returnPath);
  return isNativeApp()
    ? nativeAuthRedirect(path, mode)
    : `${window.location.origin}${path}`;
}

export function nativeAuthResult(url) {
  const parsed = new URL(url);
  const query = parsed.searchParams;
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const value = (key) => query.get(key) || fragment.get(key) || "";
  const returnPath = safeReturnPath(value("returnPath"));

  return {
    accessToken: value("access_token"),
    refreshToken: value("refresh_token"),
    code: value("code"),
    mode: value("mode") || value("type") || "auth",
    returnPath,
    error: value("error_description") || value("error"),
  };
}
