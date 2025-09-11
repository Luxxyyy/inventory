import AddBalangay from "../components/balangay/AddBalangay";
import EditBalangay from "../components/balangay/EditBalangay";

function Balangay() {
  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-md-6">
          <AddBalangay />
        </div>
        <div className="col-md-6">
          <EditBalangay />
        </div>
      </div>
    </div>
  );
}

export default Balangay;
