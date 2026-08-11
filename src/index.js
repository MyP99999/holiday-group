import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { Capacitor } from "@capacitor/core";
import App from "./App";

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add("native-app");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
