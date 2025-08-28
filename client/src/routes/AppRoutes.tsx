import { Routes, Route } from 'react-router-dom';
import ListGroup from '../components/ListGroup';
import Dashboard from '../pages/Dashboard';
import Source from '../pages/Source';
import Consumer from '../pages/Consumer';
import Balangay from '../pages/Balangay';
import Purok from '../pages/Purok';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import UserCreate from '../pages/AddUser';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/list" element={<ListGroup />} />
            <Route path="/source" element={<Source />} />
            <Route path="/balangay" element={<Balangay />} />
            <Route path="/consumer" element={<Consumer />} />
            <Route path="/purok" element={<Purok />} />
            <Route
                path="/add-user"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <UserCreate />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
