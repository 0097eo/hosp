//index
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";

const App = () => {
    return (
      <div>
        <AppRoutes />
      </div>
    );
  };
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);