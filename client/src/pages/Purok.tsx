import AddPurok from "../components/purok/AddPurok";
import EditPurok from "../components/purok/EditPurok";

const Purok = () => {
  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-md-5 mb-4">
          <AddPurok />
        </div>
        <div className="col-md-7">
          <EditPurok />
        </div>
      </div>
    </div>
  );
};

export default Purok;
