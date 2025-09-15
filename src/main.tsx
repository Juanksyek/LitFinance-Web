import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

(function ensureTheme() {
  const stored = localStorage.getItem("theme") as "light" | "dark" | null;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored ?? (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
