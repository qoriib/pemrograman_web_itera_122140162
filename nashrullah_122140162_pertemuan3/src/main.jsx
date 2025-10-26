import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BookProvider } from "./context/BookContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BookProvider>
        <App />
      </BookProvider>
    </BrowserRouter>
  </StrictMode>
);
