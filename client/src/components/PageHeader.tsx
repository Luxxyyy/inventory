import GetPageTitle from "../utils/GetPageTitle";
import '../index.css'

function PageHeader() {
    const pageTitle = GetPageTitle(location.pathname);;

    return (
        <div className="fluid-container page-header text-white px-4 py-3" id="page-header">
            <h1 className="m-0 fs-4">Quezon Water District | <span id="page-title">{pageTitle}</span></h1>
        </div>
    );
};

export default PageHeader;
