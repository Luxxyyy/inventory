function Balangay() {

    return(
        <div>
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput" className="form-label">Balangay </label>
                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Enter Balangay"></input>
            </div>
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput2" className="form-label">Source</label>
                <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Enter Source"></input>
            </div>        
            <button type="button" className="btn btn-primary m-1">Add</button>
            <button type="button" className="btn btn-success m-1 text-white">Edit</button>    
        </div>
    )

}

export default Balangay;