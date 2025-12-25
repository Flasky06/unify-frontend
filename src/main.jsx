import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import useAuthStore from "./store/authStore";
import { setGlobalAuthState } from "./lib/authState";

// Initialize global auth state from persisted store
const { user } = useAuthStore.getState();
if (user) {
  setGlobalAuthState({ user });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
