import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./store/store"; // Import your Redux store

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrap your App component with the Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
