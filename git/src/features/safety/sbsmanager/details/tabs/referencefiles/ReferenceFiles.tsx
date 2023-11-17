
import React, { useRef, useState, useMemo, useEffect } from 'react';
import './ReferenceFiles.scss';
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import { useDriveFileBrowser, useAppSelector } from 'app/hooks';
import { getServer } from 'app/common/appInfoSlice';
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';

const referenceData = [
	{
		id: 1,
		name: 'Ground Floor Plan',
		description: 'test',
		createdby: 'Andrew Peterson',
		date: '2023-12-29T18:30:00Z',
		type: 'Drawing',
		phase: 'Post Construction'
	},
	{
		id: 2,
		name: 'Ground Floor Plan',
		description: 'test',
		createdby: 'Andrew Simmons',
		date: '2023-12-29T18:30:00Z',
		type: 'Sketch',
		phase: 'Operations & Maintance'
	}
]
const filterOptions = [
	{
		text: "Phase",
		value: "phase",
		key: "phase",
		children: {
			type: "checkbox",
			items: [
			],
		},
	},
	{
		text: "Type",
		value: "type",
		key: "type",
		children: {
			type: "checkbox",
			items: [
			],
		},
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
	const [selected, setSelected] = useState<any>();
	const [searchText, setSearchText] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);
	const [filters, setFilters] = React.useState<any>(filterOptions);

	var tinycolor = require('tinycolor2');
	const [gridData, setGridData] = useState<any>(referenceData);

	useEffect(() => {
		if (referenceData?.length > 0) {
			const filtersCopy = [...filters];
			let phaseItem = filtersCopy.find((rec: any) => rec?.value === "phase");
			let typeItem = filtersCopy.find((rec: any) => rec?.value === "type");
			const uniqueTypes = new Set();
			const uniqueTypes2 = new Set();
			const newArray = referenceData?.reduce((acc: any, item: any) => {
				if (!uniqueTypes.has(item.phase)) {
					uniqueTypes.add(item.phase);
					acc.push({ text: item.phase, id: item.phase, key: item.phase, value: item.phase, });
				}
				return acc;
			}, []);
			const newArray2 = referenceData?.reduce((acc: any, item: any) => {
				if (!uniqueTypes2.has(item.type)) {
					uniqueTypes2.add(item.type);
					acc.push({ text: item.type, id: item.type, key: item.type, value: item.type, });
				}
				return acc;
			}, []);
			phaseItem.children.items = newArray;
			typeItem.children.items = newArray2;
			setFilters(filtersCopy);
		}
	}, [referenceData]);

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
			field: 'phase',
			cellRenderer: (params: any) => {
				return (
					<Button disabled
						variant='contained'
						style={{
							backgroundColor: `#fd8d27`,
							color: tinycolor(`#fd8d27`).isDark() ? 'white' : 'black',
						}}
						className='phaseButton'
					>
						<span className="common-icon-phase"></span>
						{params?.value}
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
		console.log('onSelectedFilesDownload', selected)
	}
	const onSelectedFilesDelete = () => {
		console.log('onSelectedFilesDelete', selected)
	}
	const rowSelected = (sltdRows: any) => {
		const selectedRowData = sltdRows.api.getSelectedRows();
		if (selectedRowData?.length > 0) {
			setDisableDeleteBtn(false);
			setDisableDownloadBtn(false);
		}
		else {
			setDisableDeleteBtn(true);
			setDisableDownloadBtn(true);
		}
		setSelected(selectedRowData);
	}

	useEffect(() => {
		const gridDataCopy = [...referenceData];
		let value: any;
		if (filterKeyValue && Object.keys(filterKeyValue)?.length > 0) {
			value = FilterBy(gridDataCopy, filterKeyValue);
			if (searchText !== "") {
				let SearchGridData = SearchBy(value);
				setGridData(SearchGridData);
			} else {
				setGridData(value);
			};
		} else if (searchText !== "") {
			let SearchGridData = SearchBy(gridDataCopy);
			setGridData(SearchGridData);
		} else {
			setGridData([...gridDataCopy]);
		};
	}, [filterKeyValue, searchText, referenceData]);

	const SearchBy = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = gridData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(searchText?.toLowerCase());
		});
		return firstResult;
	};
	const FilterBy = (gridData: any, filterValue: any) => {

		const gridDataCopy = gridData;
		let filteredData: any = gridDataCopy;
		const keys = Object.keys(filterValue);
		const lastvalue = keys.slice(-1).pop();

		if (lastvalue == 'all') {
			filteredData = referenceData
		}
		if (filterValue?.type?.length > 0) {
			filteredData = filteredData.filter((item: any) => filterValue?.type?.includes(item?.type));
		}
		if (filterValue?.phase?.length > 0) {
			filteredData = filteredData.filter((item: any) => filterValue?.phase?.includes(item?.phase));
		}
		return filteredData;
	};

	return (
		<div className='sbs-referenceFile'>
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
						filters={filters}
						filterHeader=''
						showGroups={false}
						onSearchChange={(text: string) => { setSearchText(text) }}
						onFilterChange={(filters: any) => { setFilterKeyValue(filters) }}
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
					rowSelected={(e: any) => rowSelected(e)}
					getRowId={(record: any) => record.data.id}
				/>
			</div>
		</div>
	)
}
export default ReferenceFiles;
