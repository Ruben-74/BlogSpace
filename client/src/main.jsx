import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./store/user/Context.jsx";
import App from "./App.jsx";
import "./assets/sass/main.scss";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
