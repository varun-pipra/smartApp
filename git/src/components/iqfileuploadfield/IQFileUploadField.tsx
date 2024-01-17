import {Box, Button, Chip, Stack} from "@mui/material";
import {memo, useRef, useState} from "react";

import './IQFileUploadField.scss';

type IQFileUploadFieldProps = {
	label?: string;
	iconCls?: string;
	placeholder?: string;
	onFileChange: any;
};

const IQFileUploadField = (props: IQFileUploadFieldProps) => {
	const {label, iconCls, placeholder, onFileChange} = props;
	const [file, setFile] = useState<any>(undefined);
	const inputRef = useRef<any>();

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		setFile(file);
		onFileChange(file);
	};

	return <Box className="iq-fileupload-field">
		<Stack className="item-row label">
			<span className={`iq-fileupload-icon ${iconCls}`}></span>
			{label}
		</Stack>
		<Stack className="item-row input">
			<Stack
				className="tag-container"
				sx={{width: '20em'}}
			>
				{file ? <Chip label={file.name} onDelete={() => setFile(undefined)} /> : <span className='placeholder'>{placeholder}</span>}
			</Stack>
			<Button
				disabled={!!file}
				onClick={() => inputRef.current.click()}
			>
				Browse
			</Button>
		</Stack>
		<input
			style={{display: "none"}}
			ref={inputRef}
			type="file"
			onChange={handleFileChange}
		/>
	</Box>;
};

export default memo(IQFileUploadField);