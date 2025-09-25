import React from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        <div className="d-flex" style={{ height: "100vh" }}>
          <main
            className="bg-white text-dark main"
            style={{ flex: 1, overflowY: "auto" }}
          >
            <AppRoutes />
          </main>
        </div>
      ) : (
        <AppRoutes />
      )}
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;