import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../src/components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

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
        <Layout />
      )}
    </AuthProvider>
  );
};

export default App;
