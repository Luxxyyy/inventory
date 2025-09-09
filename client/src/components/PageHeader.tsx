import React from "react";
import GetPageTitle from "../utils/GetPageTitle";
import { AuthContext } from "../contexts/AuthContext";

function PageHeader({ collapsed }: { collapsed: boolean }) {
  const pageTitle = GetPageTitle(location.pathname);
  const { logout } = React.useContext(AuthContext);

  return (
    <div
      className="d-flex justify-content-between align-items-center bg-dark text-white px-4 py-3 border-bottom"
      style={{
        height: 60,
        paddingLeft: collapsed ? 70 : 24,
        transition: "padding-left 0.3s ease",
      }}
    >
      <h1 className="m-0 fs-4">| <span>{pageTitle}</span></h1>
      <button className="btn btn-outline-light btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default PageHeader;
