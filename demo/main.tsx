import { createRoot } from "react-dom/client";
import { ListApp } from "../src";
import "./demo.css";

createRoot(document.getElementById("root") as HTMLElement).render(<ListApp />);
