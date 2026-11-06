import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/general.css";
import "./styles/utilities.css";
import "./styles/components.css";
import "./Config/Optimizer/styles/rendimiento.css";
import App from "./App.jsx";
import { RendimientoProvider } from "./Config/Optimizer/context/RendimientoContext.jsx";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <RendimientoProvider>
        <App />
      </RendimientoProvider>
    </StrictMode>
  </BrowserRouter>,
);
