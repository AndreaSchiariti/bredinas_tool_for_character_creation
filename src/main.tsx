import { createRoot } from "react-dom/client";
import "./App.scss";
import App from "./App.tsx";
import "./backend/utils/i18n/index.ts";

createRoot(document.getElementById("root")!).render(<App />);
