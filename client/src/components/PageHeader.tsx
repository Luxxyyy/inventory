import React from 'react';
import GetPageTitle from "../utils/GetPageTitle";
import { AuthContext } from '../contexts/AuthContext';
import '../index.css';

function PageHeader() {
    const pageTitle = GetPageTitle(location.pathname);
    const { logout } = React.useContext(AuthContext);

    return (
        <div className="fluid-container page-header text-white px-4 py-3 d-flex justify-content-between align-items-center" id="page-header">
            <h1 className="m-0 fs-4">| <span>{pageTitle}</span></h1>
            <button className="btn btn-outline-light" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default PageHeader;
