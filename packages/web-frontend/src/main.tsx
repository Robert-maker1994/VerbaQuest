import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Renderer from "./renderer";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Renderer />
  </StrictMode>,
);
