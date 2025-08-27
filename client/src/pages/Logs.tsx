function Logs() {

    return(
        <div className="fuild-container mx-4 my-3"> 
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput" className="form-label">Consumer </label>
                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Enter Balangay"></input>
            </div>
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput" className="form-label">Balangay </label>
                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Enter Balangay"></input>
            </div>
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput2" className="form-label">Source</label>
                <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Enter Source"></input>
            </div>
            <div className="mb-3" id="input-box">
                <label htmlFor="formGroupExampleInput2" className="form-label">Remarks</label>
                <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Enter Source"></input>
            </div>        
            <button type="button" className="btn btn-primary m-1">Add Log</button>   
        </div>
    )

}

export default Logs;