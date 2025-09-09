function GetPageTitle(pathname: string): string {
    switch (pathname) {
        case '/':
            return 'Map';
        case '/list':
            return 'List';
        case '/source':
            return 'Source';
        case '/balangay':
            return 'Balangay';
        case '/consumer':
            return 'Consumer';
        case '/logs':
            return 'Logs';
        case '/add-user':
            return 'Add User';
        default:
            return 'Dashboard';
    }
}

export default GetPageTitle;
