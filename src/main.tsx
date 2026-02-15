import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
root.classList.add("hydrating");
createRoot(root).render(<App />);
// Remove hydrating class after React paints
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    root.classList.remove("hydrating");
  });
});
