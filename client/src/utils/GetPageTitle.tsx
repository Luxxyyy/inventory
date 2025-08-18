function GetPageTitle(pathname: string): string {
    switch (pathname) {
        case '/':
            return 'Dashboard';
        case '/list':
            return 'List';
        default:
            return 'Dashboard';
    }
}

export default GetPageTitle;
