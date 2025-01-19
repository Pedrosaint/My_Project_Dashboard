import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/context/ContextTheme.jsx";
import OrderProvider from "./components/context/OrderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <StrictMode>
      <ThemeProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </ThemeProvider>
    </StrictMode>
  );
