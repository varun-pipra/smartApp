import { useState } from 'react';
// import axios from 'axios';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';

import '../smartappImage/smartAppImage.scss';
import Button from '@mui/material/Button';

export const Addimage = ({ onSuccess }: any) => {
	const [files, setFiles] = useState([]);
	const [fileName, setFileName] = useState<string>("");

	const onInputChange = (e: any) => {
		setFiles(e.target.files)
	};
	const onFileChange = (event: any) => {
		let name = event.target.files[0]
		setFileName(URL.createObjectURL(name));
	};

	/* const onSubmit = (e:any) => {
		 e.preventDefault();
	   console.log("file names",fileName)

 const data = new FormData();

		for(let i = 0; i < files.length; i++) {
			data.append('file', files[i]);
		 }

		 axios.post('//localhost:8000/upload', data)
			 .then((response:any) => {
				 toast.success('Upload Success');
				 onSuccess(response.data)
			 })
			.catch((e:any) => {
				toast.error('Upload Error')
		  })  */
	/*  }; */

	return (
		<div>
			<div className="form-group files">
				<Button
					variant="contained"
					component="span"
					style={{ background: 'none' }}
				>

					<label htmlFor="file-input">{fileName ? <img id="previewImg" alt="file-Img" src={fileName} /> :
						<div>

							<img id="previewImg" alt="file-Img" src="https://icon-library.com/images/5631de589c.png" />
							<p style={{ color: 'grey' }}>Add Image</p>

						</div>

					}
						<br />

					</label>
					<input id="file-input" type="file"
						className="form-control"
						onChange={onFileChange}
						multiple
						accept="image/png, image/gif, image/jpeg , image/jpng,image.jpg" />
				</Button>


			</div>
		</div>

	)
};