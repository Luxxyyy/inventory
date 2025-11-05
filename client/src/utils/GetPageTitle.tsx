function GetPageTitle(pathname: string): string {
    switch (pathname) {
        case '/':
            return 'Map';
        case '/list':
            return 'Summary';
        case '/message':
            return 'Message';
        case '/source':
            return 'Sources';
        case '/sheet':
            return 'Sheets';
        case '/balangay':
            return 'Barangays';
        case '/purok':
            return 'Puroks/Balangays';
        case '/add-user':
            return 'Users';
        case '/legend':
            return 'Legends';
        case '/logs':
            return 'Logs';
        case '/notes':
            return 'Notes';
        case '/inventory':
            return 'Inventory';
        case '/items':
            return 'Items';
        case '/categories':
            return 'Categories';
        case '/suppliers':
            return 'Suppliers';
        default:
            return 'Dashboard';
    }
}

export default GetPageTitle;
