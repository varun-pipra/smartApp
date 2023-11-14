import React, { useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import { TableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { Avatar, Grid, Input, InputLabel, TextField } from '@mui/material';
import SmartDialog from 'components/smartdialog/SmartDialog';
import Toast from 'components/toast/Toast';
import Icon from '@mui/material/Icon';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import uploadImage from './../../resources/images/budgetManager/upload_image.png'
import pngImage from './../../resources/images/budgetManager/png_image.png'
import jpgImage from './../../resources/images/budgetManager/jpg_image.png'
import gifImage from './../../resources/images/budgetManager/gif_image.png'
import jpegImage from './../../resources/images/budgetManager/jpeg_image.png'
import pdfImage from './../../resources/images/budgetManager/pdf_image.png'
import xlsImage from './../../resources/images/budgetManager/xls_image.png'
import './UploadDocumentsDialog.scss'
import Dropzone from 'react-dropzone'
import PreviewDocumentsDialog from './previewdocuments/PreviewDocumentsDialog';

export interface Document {
	id: number;
	type: string;
	name: string;
	image: any;
}

export interface UploadDocumentsDialogProps {
	open: boolean;
	defaultFiles?: Document[];
	fileExtensions: String[];
	onUploadDocuments?: (documents: Document[]) => void
	onClose?: () => void;
}

export default function UploadDocumentsDialog(props: UploadDocumentsDialogProps) {
	const [files, setFiles] = React.useState<any>(props.defaultFiles ? props.defaultFiles : []);
	const [showUploadIcon, setShowUploadIcon] = React.useState<boolean>(true)
	const [imageInput, setImageInput] = React.useState<boolean>(true);
	const [imageId, setImageId] = React.useState<any>('')
	const [openPreviewDocuments, setOpenPreviewDocuments] = React.useState<boolean>(false);
	const [previewDocumentId, setPreviewDocumentId] = React.useState<number>(0);
	const [showToast, setShowToast] = React.useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const imagesTypes: any = {
		png: pngImage,
		jpg: jpgImage,
		jpeg: jpegImage,
		gif: gifImage,
		pdf: pdfImage,
		xls: xlsImage
	}

	function getDocuments(uploadedFiles: any) {
		const uploadedDocuments: any = uploadedFiles.map((document: any, index: number) => {
			const { name, type, image } = document;
			if (props.fileExtensions.includes(type.split('/')[1])) {
				return {
					id: files.length + index + 1,
					type: type,
					name: name,
					image: URL.createObjectURL(document)
				}
			}
			setShowToast(true);
			return null;
		})
		return uploadedDocuments.filter(function (el: any) {
			return el != null;
		});
	}
	const handleOnDrop = (acceptedFiles: any) => {
		setShowToast(false);		
		const uploadedDocuments: Document[] = getDocuments(acceptedFiles)
		const filesClone = [...files, ...uploadedDocuments]
		setFiles(filesClone);
	}

	function handleUpload(event: any) {
		setShowToast(false);		
		const uploadedDocuments: Document[] = getDocuments(Object.values(event.target.files))
		const filesClone = [...files, ...uploadedDocuments]
		setFiles(filesClone);
		setShowUploadIcon(!showUploadIcon);
	}

	function handleUploadIcon() {
		const value: boolean = showUploadIcon ? false : true;
		setShowUploadIcon(value);

	}

	function handleUploadedDocuments() {
		if (props.onClose) props.onClose();
		if (props.onUploadDocuments) props.onUploadDocuments(files)

	}
	function handleInputChange(event: any, file: Document) {
		const filesClone: Document[] = files.filter((ele: Document) => {
			if (ele.id === file.id) {
				ele.name = event.target.value
				return ele;
			}
			return ele;
		})
		setFiles([...filesClone]);
	}

	function handleDelete(event: any, file: Document) {
		const filesClone: Document[] = files.filter((ele: Document) => {
			if (ele.id === file.id) {
				files.splice(file.id - 1, 0);
				return;
			}
			return ele;
		})
		setFiles([...filesClone]);

	}
	function handlePreviewDocumentsDialog(value: boolean) {
		setOpenPreviewDocuments(value)

	}
	function handleZoomClick(e: any, id: number) {
		setOpenPreviewDocuments(true);
		setPreviewDocumentId(id);
	}
	function handleLocalUploadButton() {
		if (inputRef.current != null) {
			inputRef.current.click();
		}
	}

	function inputchange(value: boolean, id: any) {
		setImageInput(value);
		setImageId(id);
	}
	function handleClose() {
		if (props.onClose) props.onClose()
	}
	return (<>
		<SmartDialog
			open={props.open}
			PaperProps={{
				sx: { height: '80%', width: '60%' }
			}}
			custom={{
				closable: true,
				resizable: true,
				title: 'Upload',
				// tools: [optionalTools]
			}}
			onClose={() => {
				handleClose();
			}}
		>	<>
				<div className='upload-container'>
					{
						files.length > 0 ?
							<Card variant='outlined' className='content-section'>
								{files.length > 0 &&
									<TableContainer >
										<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
											<TableBody className='heading'>
												<TableRow >
													<TableCell component="th" style={{ width: 30 }} align="center"></TableCell>
													<TableCell component="th" style={{ width: 250, color: 'white' }}></TableCell>
													<TableCell component="th" style={{ color: 'white' }}>File Name</TableCell>
													<TableCell component="th" align="right"></TableCell>
													<TableCell component="th" align="left"></TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								}
								<Stack className='documents-container'>
									<TableContainer >
										<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
											<TableBody>
												{files.map((file: Document, index: number) => (
													<TableRow >
														<TableCell component="td" style={{ width: 30 }} align="center">
															<Stack className='img-type' sx={{ border: '1px solid grey', borderRadius: '25px', padding: '6px' }}>
																<Box component="img" key={'img' + index} src={imagesTypes[file.type.split('/')[1]]} alt='png' style={{ height: '24px', width: '24px' }} />
															</Stack>
														</TableCell>
														<TableCell component="td" style={{ width: 180 }}>
															<Card variant='outlined' className='img-container'>
																<ZoomInIcon className='zoom-icon' onClick={(e: any) => handleZoomClick(e, file.id)} />
																<img src={file.image} key={'img' + index} className='img' />
															</Card>
														</TableCell>
														<TableCell component="td" style={{ width: 200 }}>
															<Input value={file.name} key={'input' + index} onChange={e => handleInputChange(e, file)}
																onBlur={() => { inputchange(true, file.id) }} onFocus={() => { inputchange(false, file.id) }} disableUnderline={imageId == file.id && imageInput == false ? false : true} />
														</TableCell>
														<TableCell component="td" align="right">
															<CheckIcon className='check-icon' key={'icon' + index} />
														</TableCell>
														<TableCell component="td" align="left">
															<Delete className='delete-button' key={'button' + index} onClick={(e: any) => handleDelete(e, file)} />
														</TableCell>
													</TableRow>
												))
												}
											</TableBody>
										</Table>
									</TableContainer>
								</Stack>
							</Card>
							:
							<Dropzone onDrop={acceptedFiles => handleOnDrop(acceptedFiles)}>
								{({ getRootProps, getInputProps }) => (
									<Card {...getRootProps()} variant='outlined' className='content-section'>
										<Stack alignItems="center">
											<Box component="img" alt="QR Code" src={uploadImage} style={{ marginTop: '60px' }} />
											<input {...getInputProps()} />
											<InputLabel style={{ fontSize: '18px' }}>Drag and Drop Your files here!</InputLabel>
											<InputLabel>or click on the + button to browse your files.</InputLabel>
										</Stack>
									</Card>
								)}

							</Dropzone>
					}
					{showUploadIcon &&
						<Stack direction='column' alignItems='end' className='upload-button-section'>
							<IconButton className='upload-button' aria-label="upload picture" component="label" onClick={handleUploadIcon} >
								<CloudUploadIcon />
							</IconButton>
						</Stack>
					}
					{files.length > 0 &&
						<Card variant='outlined' className="add-tag-section" style={{ display: 'flex', margin: '8px 0px 0px 0px', padding: '3px' }}>
							<AddCircleOutlineOutlinedIcon color={'primary'} />
							<InputLabel variant="standard" sx={{ margin: '0px 0px 0px 10px' }}>Add Tags(optional)</InputLabel>
						</Card>
					}
					<Stack className='Inventory-button-section'>
						<Box display="flex" justifyContent="end" alignItems="end" style={{ marginTop: files.length > 0 ? '4px' : '8px' }} >
							<Button color={'warning'} variant={'contained'} disabled={files.length > 0 ? false : true} onClick={handleUploadedDocuments}>UPLOAD</Button>
						</Box>
					</Stack>

				</div>
				{showUploadIcon == false &&
					<div className='disable-upload-container'>
						<Stack direction='column' alignItems='end' className="button-container">
							<Stack direction='row' className="cloud-button-container">
								<Button variant='outlined' className='cloud-upload-label'>Select from Cloud</Button>
								<IconButton className='cloud-upload-button' >
									<CloudDownloadIcon />
								</IconButton>
							</Stack>
							<Stack direction='row' className="local-button-container">
								<input ref={inputRef} id='selectImage' hidden accept="image/*, application/*" type="file" multiple onChange={handleUpload} />
								<Button variant='outlined' className='local-upload-label' onClick={handleLocalUploadButton}>
									Select from local
								</Button>
								<IconButton aria-label="upload picture" component="label" className='local-upload-button' >
									<input hidden accept="image/*, application/*" type="file" multiple onChange={handleUpload} />
									<DriveFolderUploadIcon />
								</IconButton>
							</Stack>
							<IconButton className='close-button' onClick={handleUploadIcon}>
								<HighlightOffIcon />
							</IconButton>
						</Stack>
					</div>
				}
			</>
			{
				showToast ?
					<Toast message={'Files with .'+ props.fileExtensions.join(' .') + ' extensions can be uploaded.'} showclose={true} />
					: <></>
			}
		</SmartDialog >
		{
			openPreviewDocuments ?
				<PreviewDocumentsDialog previewDocumentId={previewDocumentId} documents={files} open={true} onClose={() => handlePreviewDocumentsDialog(false)} />
				: null
		}


	</>)


}