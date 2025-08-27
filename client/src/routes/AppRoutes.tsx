import { Routes, Route } from 'react-router-dom';
import ListGroup from '../components/ListGroup';
import Dashboard from '../pages/Dashboard';
import Source from '../pages/Source';
import Consumer from '../pages/Consumer';
import Balangay from '../pages/Balangay';
import Purok from '../pages/Purok';


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/list" element={<ListGroup />} />
            <Route path="/source" element={<Source />} />
            <Route path="/balangay" element={<Balangay />} />
            <Route path="/consumer" element={<Consumer />} />
            <Route path="/purok" element={<Purok />} />
        </Routes>
    );
};

export default AppRoutes;
