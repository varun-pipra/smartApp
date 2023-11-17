import { useState } from "react";

import "./Fileuploader.scss";

export const FileUploader = ({ onSuccess }: any) => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  
  const onFileChange = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLFormElement;
    let name = target.files[0].name;
    setFileName((prev) => [...prev, name]); 
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <form method="post" onSubmit={onSubmit}>
      <div className="card w-50">
        <div className="card-body">
          <h5 className="card-title">
            M18 FUEL Guage Nailer-3 <span className="close">&times;</span>
          </h5>
          <hr />
          <div className="form-group files">
            <label htmlFor="file-input" id="label">
              <img
                id="previewImg"
                alt="file-Img"
                src="https://icon-library.com/images/5631de589c.png"
              />
              <br />
            </label>
            <input
              id="file-input"
              data-testid="file-input"
              type="file"
              className="form-control"
              onChange={onFileChange}
              multiple
            />
          </div>
        </div>
        {fileName.length == 0 && (
          <div className="documentContrainer" data-testid="no-document">
            {" "}
            <>
              <i className="fa fa-file-text fa-5x" aria-hidden="true"></i>
              <p>No Document Exist</p>
            </>
          </div>
        )}
        {fileName.length > 0 &&
          fileName.map((e, index) => {
            return (
              <div
                className="fileNameDisplay"
                data-testid="documents"
                key={e + index}
              >
                <span className="badge rounded-pill">
                  {e}{" "}
                  <i
                    className="fa fa-file-text file-color"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
            );
          })}
      </div>
    </form>
  );
};
