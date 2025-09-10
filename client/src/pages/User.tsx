import AddUser from '../components/user/AddUser';
import EditUsers from '../components/user/EditUser';

const UserManagementPage: React.FC = () => (
  <div className="container-fluid my-4">
    <div className="row g-4">
      <div className="col-md-6">
        <AddUser />
      </div>
      <div className="col-md-6">
        <EditUsers />
      </div>
    </div>
  </div>
);

export default UserManagementPage;
