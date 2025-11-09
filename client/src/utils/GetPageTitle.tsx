function GetPageTitle(pathname: string): string {
    switch (pathname) {
        case '/':
            return 'Map';
        case '/add-user':
            return 'Users';
        case '/logs':
            return 'Logs';
        case '/inventory':
            return 'Inventory';
        case '/items':
            return 'Items';
        case '/categories':
            return 'Categories';
        case '/suppliers':
            return 'Suppliers';
        case '/sales':
            return 'Sales Records';
        default:
            return 'Dashboard';
    }
}

export default GetPageTitle;
