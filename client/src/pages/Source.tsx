import AddSource from '../components/_source/AddSource';
import EditSource from '../components/_source/EditSource';

function Source() {
  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-md-6">
          <AddSource />
        </div>
        <div className="col-md-6">
          <EditSource />
        </div>
      </div>
    </div>
  );
}

export default Source;
