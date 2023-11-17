import "./DocUploader.scss";
import "./ConformationDailog.scss";
import React, { useEffect, useState, useRef } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

import {
	IconButton
} from "@mui/material";
import UploadMenu from "./UploadMenu/UploadMenu";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SUIGrid from "sui-components/Grid/Grid";

interface DocUploaderProps {
	width?: string;
	height?: string;
	docLabel?: string;
	folderType?: string;
	onLinkClick?: any;
	imgData?: any;
	readOnly?: boolean;
	onImageClick?: any;
	onImageDelete?: any;
	docSubLabel?: string;
	onProjectFile?: any;
	localFileClick?: any;
	contractsClick?: any;
	btnLabel?: string;
	showContractOption?: boolean;
	showDriveOption?: boolean;
	delSelectedRows?: any;
	fileDownload?: any;
	showDownloadButton?: boolean;
	icon?: any;
	docPlaceholder?: any;
	showIcon?: boolean;
	labelIcon?: any;
	showlabelIcon?: boolean;
};

const DocUploader = ({ btnLabel, showContractOption, showDriveOption = true, showIcon = true, delSelectedRows, fileDownload, showDownloadButton = false, icon, docPlaceholder, labelIcon = 'common-icon-Upload-File', showlabelIcon = false, ...props }: DocUploaderProps) => {
	const {
		width = "800px",
		height = "200px",
		docLabel,
		imgData,
		readOnly = false,
		onImageClick,
		onImageDelete,
		contractsClick
	} = props;
	const [showImgs, setShowImgs] = React.useState(imgData?.length > 0 || false);
	const [imgWidth, setImgWidth] = React.useState(175);
	const [imgHeight, setImgHeight] = React.useState(200);
	const [zoomLevel, setZoomLevel] = React.useState(0);
	const [alert, setAlert] = React.useState(false);
	const inputRef = useRef<any>();
	const [disableDeleteBtn, setDisableDeleteBtn] = React.useState<boolean>(true);
	const [disableDownloadBtn, setDisableDownloadBtn] = React.useState<boolean>(true);
	const [selected, setSelected] = React.useState([]);
	const [imageData, setImageData] = React.useState<any>();
	const [selectedImage, setselectedImage] = React.useState<any>([]);

	let selectedRows: any = [];
	const columnDefs = [
		{
			headerName: "",
			field: "",
			minWidth: 40,
			menuTabs: [],
			flex: 0.08,
			headerCheckboxSelection: readOnly ? false : true,
			checkboxSelection: readOnly ? false : true,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
		},
		{
			headerName: "Name",
			field: "fileName",
			menuTabs: [],
			minWidth: 180,
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
		},
		{
			headerName: "File",
			field: "thumbnail",
			menuTabs: [],
			minWidth: 100,
			flex: 1,
			type: "avatar",
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
		},
	];

	useEffect(() => {
		setShowImgs(imgData?.length > 0 || false);
		setDisableDownloadBtn(imgData?.length > 0 ? false : true);
		setImageData(imgData)
	}, [imgData]);

	const onDrop = (evnt: any) => {
		evnt.preventDefault();
		// console.log("files drop", evnt);
		let element = evnt.currentTarget;
		element.classList.remove("dragged-over");
		// alert("dropped");
		setShowImgs(true);
	};

	const onDragOver = (evnt: any) => {
		evnt.preventDefault();
		// console.log("files onDragOverFiles", evnt);
	};

	const onDragEnter = (evt: any) => {
		evt.preventDefault();
		let element = evt.currentTarget;
		element.classList.add("dragged-over");
	};

	const onDragLeave = (evt: any) => {
		evt.preventDefault();
		let element = evt.currentTarget;
		element.classList.remove("dragged-over");
	};

	const zoomIn = () => {
		setImgWidth(imgWidth + 20);
		setImgHeight(imgHeight + 20);
		setZoomLevel(zoomLevel + 1);
	};

	const zoomOut = () => {
		setImgWidth(175);
		setImgHeight(200);
		setZoomLevel(0);
	};

	const onImageDeleteFn = (event: any, item: any) => {
		event.preventDefault();
		event.stopPropagation();
		if (onImageDelete) onImageDelete(item);
	};

	const localFileUpload = () => {
		if (inputRef.current) {
			inputRef?.current?.click();
			setAlert(false);
		}
	};
	const projectFileUpload = () => {
		props.onProjectFile(props?.folderType);
	};

	const handleFileChange = (event: any) => {
		event.preventDefault();
		props.localFileClick(event.target.files);
		event.target.value = null;
	};

	const onItemClick = (selectedItem: any) => {
		if (selectedItem?.type === 'local') {
			localFileUpload();
		}
		if (selectedItem?.type === 'project') {
			projectFileUpload();
		}
		if (selectedItem?.type === 'Contract Files') {
			contractsClick(props?.folderType);
		}
	};

	const rowSelected = (sltdRow: any) => {
		const selectedRowData = sltdRow.data;
		if (selectedRowData !== undefined) {
			const selected: boolean = sltdRow.node.selected;
			if (selected === true) {
				selectedRows = [...selectedRows, selectedRowData];
			} else {
				selectedRows.map((row: any, index: number) => {
					if (row.id === selectedRowData.id) {
						selectedRows.splice(index, 1);
					}
				});
			}
		}
		selectedRows.length > 0 ? setDisableDeleteBtn(false) : setDisableDeleteBtn(true);
		setSelected(selectedRows);
	};

	const onSelectedFilesDelete = () => {
		delSelectedRows(selected);
	};

	const onSelectedFilesDownload = () => {
		if (selectedImage?.length > 0) {
			fileDownload(selectedImage);
		}
		else {
			fileDownload(imgData)
		}

	};
	const imageClick = (e: any, imgData: any, index: any, selecteditem: any) => {
		if (e.detail === 1) {
			///single Click
			console.log('if image single click')
			const updatedValues = imageData?.map((item: any) => {
				if (item.id === selecteditem.id) {
					const overlay = item.overlay == 0 ? 1 : 0;
					return { ...item, overlay };
				}
				return item;
			});
			setImageData(updatedValues);
			const filteredData = updatedValues?.filter((item: any) => item.overlay === 0);
			setselectedImage(filteredData);

		} else if (e.detail === 2) {
			///double Click
			console.log('else image double click')
			onImageClick(imgData, index)
		}

	}

	return (
		<>
			<div className="doc-upload-base-container">
				{!readOnly &&
					<div className='doc-uploadd-header'>
						{docLabel && labelIcon && showlabelIcon ? <span className={labelIcon}></span> : ''}
						<span className="doc-lbl-hdr-bold">{docLabel}</span>
						{imgData?.length > 0 && showDownloadButton && <IQTooltip title="Download" placement="bottom">
							<IconButton
								className="download-btn"
								disabled={disableDownloadBtn}
								onClick={() => { onSelectedFilesDownload(); }}
							>
								<span className="common-icon-version-download"></span>
							</IconButton>
						</IQTooltip>
						}
					</div>
				}
				<div className="doc-upload-text-cont">
					{readOnly && docLabel && showIcon ? <span className={labelIcon}></span> : ''}
					{readOnly && <span className={showIcon ? " " : "doc-lbl-hdr-bold"}>{docLabel}</span>}
					{!readOnly && <UploadMenu
						showDriveOption={showDriveOption}
						showContractOption={showContractOption}
						label={btnLabel}
						folderType={props?.folderType}
						onItemClick={onItemClick}
						dropdownLabel={'Select Type'}
					/>}
					{imgData?.length > 0 && showDownloadButton && readOnly && docLabel && <IQTooltip title="Download" placement="bottom">
						<IconButton
							className="download-btn"
							disabled={disableDownloadBtn}
							onClick={() => { onSelectedFilesDownload(); }}
						>
							<span className="common-icon-version-download"></span>
						</IconButton>
					</IQTooltip>}

					{(zoomLevel == 3 && !readOnly) && <IQTooltip title="Delete" placement="bottom">
						<IconButton
							className="delete-btn"
							disabled={disableDeleteBtn}
							onClick={onSelectedFilesDelete}
						>
							<span className="common-icon-delete"></span>
						</IconButton>
					</IQTooltip>
					}
					{imgData?.length > 0 && showDownloadButton && <IQTooltip title="Download" placement="bottom">
						{!readOnly ? (
							<div className="doc-file-length">
								Files Added ({imgData?.length})
							</div>
						) : (
							<div className="doc-file-length">Files ({imgData?.length})</div>
						)}
					</IQTooltip>}
				</div>
				<div className="doc-file-cont-wrap">
					{(zoomLevel != 3) && <div
						className="doc-file-cont"
						onDrop={!readOnly ? onDrop : undefined}
						onDragOver={!readOnly ? onDragOver : undefined}
						onDragEnter={!readOnly ? onDragEnter : undefined}
						onDragLeave={!readOnly ? onDragLeave : undefined}
						style={{
							display: !showImgs ? 'flex' : 'contents',
							alignItems: 'center',
							justifyContent: 'center',
							padding: !showImgs ? '20px 24px 0px 24px !important' : 0
						}}
					>
						<input
							multiple
							style={{ display: "none" }}
							ref={inputRef}
							type="file"
							onChange={handleFileChange}
						/>
						{!showImgs ? (
							<div className="reference-file-watermark">
								{!readOnly ? (
									<>
										<span className={icon ? icon : "common-icon-cloud-upload"} ></span>
										{docPlaceholder ?
											<div className="doc-text-clr"> {docPlaceholder}</div> :
											<div>
												<div className="doc-text-clr">Drag and drop files here</div>
												<div className="doc-text-clr">or click here to upload files</div>
											</div>
										}
									</>
								) : (
									<div className="doc-text-clr">No files found</div>
								)}
							</div>
						) : (
							<ImageList
								sx={{
									width: width,
									height: height,
									gap: '1em 2em !important',
									display: 'flex !important',
									flexWrap: 'wrap !important',
									alignItems: 'center',
									justifyContent: 'left',
									alignContent: 'flex-start',
									padding:
										// zoomLevel === 1 ? '1em 0em 0em 10em !important' : 
										// zoomLevel === 2 ? '1em 0em 0em 10em !important' : 
										'1em 0em 0em 4em !important'
								}}
								className="doc-img-item-cont">
								{imageData && imageData.length > 0 && imageData?.map((item: any, index: number) => {
									return <ImageListItem
										key={item.thumbnail}
										style={{ width: imgWidth, height: imgHeight }}
										className="doc-img-item"
										onClick={(e) => imageClick(e, imgData, index, item)}
									>
										<img
											src={item.thumbnail}
											srcSet={item.thumbnail}
											alt={item.fileName}
											loading="lazy"
										/>
										<div className={item.overlay == 0 ? 'overLayActive' : ''}></div>
										{!readOnly ? (
											<ImageListItemBar
												position="top"
												actionIcon={
													<IconButton
														sx={{ color: "white" }}
														aria-label={`star ${item.fileName}`}
														onClick={(event) => {
															onImageDeleteFn(event, item);
														}}
													>
														<CloseOutlinedIcon className="doc-img-close" />
													</IconButton>
												}
												actionPosition="right"
											/>
										) : (
											""
										)}
										<ImageListItemBar title={item.fileName} position="below" />
									</ImageListItem>;
								}
								)}
							</ImageList>
						)}
					</div>}

					{(zoomLevel == 3) && <div className="doc-file-grid-view">
						<SUIGrid
							headers={columnDefs}
							data={imgData}
							rowSelected={rowSelected}
						/>
					</div>}

					<span className="bottomleft">
						{zoomLevel != 3 ? (
							<AddCircleOutlineIcon onClick={zoomIn} className="zoom-btn" />
						) : (
							<RemoveCircleOutlineOutlinedIcon
								onClick={zoomOut}
								className="zoom-btn"
							/>
						)}
					</span>
				</div>
			</div>
		</>
	);
};

export default DocUploader;