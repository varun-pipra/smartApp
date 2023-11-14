
import React, { useRef, useState, useMemo } from 'react';
import './ReferenceFiles.scss';
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import { useDriveFileBrowser, useAppSelector } from 'app/hooks';
import { getServer } from 'app/common/appInfoSlice';
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';

const data = [
	{
		id: 1,
		name: 'Ground Floor Plan',
		description: 'test',
		createdby: 'Andrew Peterson',
		date: '2023-12-29T18:30:00Z',
		type: 'Drawing',
		phases: 'Post Construction'
	},
	{
		id: 2,
		name: 'Ground Floor Plan',
		description: 'test',
		createdby: 'Andrew Simmons',
		date: '2023-12-29T18:30:00Z',
		type: 'Drawing',
		phases: 'Post Construction'
	}
]
const filterOptions = [
	{
		text: "Phase",
		value: "Phase",
		key: "Phase",
	},
	{
		text: "Type",
		value: "Type",
		key: "Type",
	},
]
const UploadFileMethod = (props: any) => {
	const inputRef = useRef<any>();
	const onItemClick = (selectedItem: any) => {
		if (selectedItem?.type === 'local') {
			localFileUpload();
		}
		if (selectedItem?.type === 'project') {
			projectFileUpload();
		}
	};
	const localFileUpload = () => {
		if (inputRef.current) {
			inputRef?.current?.click();
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

	return (
		<>
			<UploadMenu
				showDriveOption={true}
				showContractOption={false}
				label={'Add Files'}
				folderType={props?.folderType}
				onItemClick={onItemClick}
				dropdownLabel={'Select Type'}
			/>
			<input
				multiple
				style={{ display: "none" }}
				ref={inputRef}
				type="file"
				onChange={handleFileChange}
			/>
		</>
	)
}

const ReferenceFiles = () => {
	const appInfo = useAppSelector(getServer);
	const [showDownloadButton, setShowDownloadButton] = useState<boolean>(true);
	const [disableDownloadBtn, setDisableDownloadBtn] = useState<boolean>(true);
	const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
	var tinycolor = require('tinycolor2');
	const [gridData, setGridData] = useState<any>(data);

	const headers = useMemo(() => [
		{
			headerName: 'Name',
			pinned: 'left',
			field: 'name',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			valueGetter: (params: any) => params.data?.name,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRenderer: (params: any) => {
				return params.data && (
					<div className={`app-items-cell-contentt`}>
						<span className='ref-name-icon'>T</span>
						<span className='ref-name-tag' style={{ color: params.data?.smartAppId ? '#059CDF' : '' }}>{params.value}</span>
					</div>
				);
			}
		}, {
			headerName: 'Description',
			field: 'description',
			minWidth: 150,
		}, {
			headerName: 'Created By',
			field: 'createdby',
			minWidth: 150,

		}, {
			headerName: 'Creation Date',
			field: 'date',
			valueGetter: (params: any) => params.data?.date ? formatDate(params.data?.date) : '',
		},
		{
			headerName: 'type',
			field: 'type',
		},
		{
			headerName: 'Phases',
			field: 'phases',
			cellRenderer: (params: any) => {
				return (
					<Button disabled
						variant='contained'
						style={{
							backgroundColor: `orange`,
							color: tinycolor(`orange`).isDark() ? 'white' : 'black',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							width: 'auto',
							paddingLeft: '10px',
							paddingRight: '10px',
							minWidth: '30px',
							textOverflow: 'ellipsis',
						}}>{params?.value}
					</Button>
				)
			}
		},
	], []);

	const projectFileUpload = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts', folderType: folderType });
	};
	const localFileUpload = (data: any) => {
		console.log('data', data)
	}
	const onSelectedFilesDownload = () => {
		console.log('onSelectedFilesDownload')
	}
	const onSelectedFilesDelete = () => {
		console.log('onSelectedFilesDelete')
	}
	const rowSelected = (sltdRows: any) => {

	}
	return (
		<div className='referenceFile'>
			<div className='header-text'>Reference Files</div>
			<div className='toolbar'>
				<div className='left-Section'>
					<UploadFileMethod
						folderType={'files'}
						onProjectFile={(folderType: any) => { projectFileUpload(folderType) }}
						localFileClick={(value: any) => { localFileUpload(value) }}
					/>
					<div className='icon-section'>
						{showDownloadButton && <IQTooltip title="Download" placement="bottom">
							<IconButton
								className="ref-download-btn"
								disabled={disableDownloadBtn}
								onClick={() => { onSelectedFilesDownload(); }}
							>
								<span className="common-icon-version-download"></span>
							</IconButton>
						</IQTooltip>
						}
						<IQTooltip title="sketch" placement="bottom">
							<IconButton
								className="ref-sketch-btn"
								disabled={false}
								onClick={() => { console.log('sketchclick'); }}
							>
								<span className="common-icon-sketch"></span>
							</IconButton>
						</IQTooltip>
						<IQTooltip title="Delete" placement="bottom">
							<IconButton
								className="ref-delete-btn"
								disabled={disableDeleteBtn}
								onClick={() => { onSelectedFilesDelete() }}
							>
								<span className="common-icon-delete"></span>
							</IconButton>
						</IQTooltip>
					</div>
				</div>
				<div className='right-section'>
					<IQSearch
						placeholder={'Search'}
						filters={filterOptions}
						filterHeader=''
						//defaultFilters={activeMainGridDefaultFilters}
						showGroups={false}
						onSearchChange={(text: string) => console.log(text)}
						onFilterChange={(filters: any) => { console.log('filters') }}
					/>
					<IQTooltip title="Gallery" placement="bottom">
						<IconButton
							className="gallery-btn"
							disabled={false}
							onClick={() => { console.log('Gallery btn click') }}
						>
							<span className="common-icon-image_write_24dp"></span>
						</IconButton>
					</IQTooltip>
				</div>
			</div>
			<div className='grid'>
				<SUIGrid
					headers={headers}
					data={gridData}
				/>
			</div>
		</div>
	)
}
export default ReferenceFiles;
