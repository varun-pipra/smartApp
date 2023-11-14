import React from 'react';
import { HeadsetMic } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Button, MessageStripDesign, ButtonDesign, FileUploader, FileUploaderDomRef, Label, MessageStrip, Ui5CustomEvent, ValueState } from '@ui5/webcomponents-react';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SmartDialog from 'components/smartdialog/SmartDialog';
import SUIDialog from "sui-components/Dialog/Dialog";
import './ImportCSVData.scss';
import "@ui5/webcomponents-icons/dist/download.js";
import IQButton from "components/iqbutton/IQButton";

interface ImportCSVDataProps {
	open: boolean;
	defaultFile?: any;
	onFileUploaded?: (file: FileList) => void;
	onClose?: (value: boolean) => void;
}

const ImportCSVData = (props: ImportCSVDataProps) => {
	const optionalTools = [
		<IQTooltip title="Help" placement={"bottom"}>
			<IconButton key={"freshdesk-tool"} aria-label="Help" color={'warning'}>
				<HeadsetMic />
			</IconButton>
		</IQTooltip>,
	]
	const [uploadFile, setUploadFile] = React.useState<any>(props.defaultFile ? props.defaultFile : { name: '' });
	const [showMessageStrip, setShowMessageStrip] = React.useState<boolean>(false);

	const handleOnClose = () => {
		setShowMessageStrip(false)
		if (props.onClose) props.onClose(false);
	}
	const handleOnClose_messagetrip = () => {
		setShowMessageStrip(false)
	}
	const handleDownloadTemplate = () => {

	}
	const onFileUpload = (event: Ui5CustomEvent<FileUploaderDomRef, { files: FileList }>) => {
		setShowMessageStrip(false);
		const uploadedFile = event.detail.files[0]
		if (uploadedFile.type === 'text/csv') {
			setUploadFile(uploadedFile);
		} else {
			setShowMessageStrip(true);
			setUploadFile({ name: '' });
		}
	}
	const handleImportFile = () => {
		if (props.onFileUploaded) props.onFileUploaded(uploadFile)
	}
	return (
		<div className='importcsv-model'>

			<SUIDialog
				open={true}

				headerTitle='Import Budget CSV'
				toolsOpts={{
					closable: true,
				}}
				buttons={<IQButton color='blue' onClick={handleImportFile} disabled={uploadFile.name === '' ? true : false} className='saveViewAs_button_vb' >IMPORT FILE</IQButton>}
				onClose={handleOnClose}
				style={{
					color: '#333333',
					fontSize: '1.12rem',
					fontWeight: 'bolder',
					fontFamily: 'Roboto-regular',
				}}
				background='#F2F2F2'
				height='50px'
				minWidth='25%'
				borderRadius='3px'
			>

				<div className='main-container'>
					<Button icon="download" onClick={handleDownloadTemplate}>Download Template</Button>
					<br />
					<br />
					<Label>Select File</Label>
					<br />
					<FileUploader placeholder='Upload csv' accept='.csv' value={uploadFile.name} onChange={onFileUpload}>
						<Button className='browser_button'>Browse</Button>
					</FileUploader>

					<div>
						{
							showMessageStrip ?
								<MessageStrip style={{ width: 'fit-content', marginTop: '10px' }} onClose={handleOnClose_messagetrip} design={MessageStripDesign.Warning} >
									Please upload a CSV file type.
								</MessageStrip>
								: null
						}
					</div>
				</div>
			</SUIDialog>
		</div>)

}

export default ImportCSVData;