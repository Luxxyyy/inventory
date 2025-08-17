import { Routes, Route } from 'react-router-dom';
import ListGroup from '../components/ListGroup';
import Dashboard from '../pages/Dashboard';


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/list" element={<ListGroup />} />
        </Routes>
    );
};

export default AppRoutes;
