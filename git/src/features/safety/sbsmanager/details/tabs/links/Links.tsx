
import React, { useRef, useState, useMemo, useEffect } from 'react';
import './Links.scss';
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import { useDriveFileBrowser, useAppSelector } from 'app/hooks';
import { getServer } from 'app/common/appInfoSlice';
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import IQSubMenuButton from 'components/iqmenu/IQSubMenuButton';

const AddLinksData = [
	{
		"text": "New Smart Item",
		"value": "New Smart Item",
		"id": 1,
		"type": "Custom",
		iconCls: "common-icon-sketch",
		"children": [{
			"text": "Visitor",
			"value": "Visitor",
			"id": 1,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "Safety Task Analysis Log",
			"value": "Safety Task Analysis Log",
			"id": 2,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "Fire Alarm Inspection",
			"value": "Fire Alarm Inspection",
			"id": 3,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "Constraints And Issue Log",
			"value": "Constraints And Issue Log",
			"id": 4,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},{
			"text": "Sprinkler Inspection",
			"value": "Sprinkler Inspection",
			"id": 5,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},{
			"text": "Fire Extinguisher",
			"value": "Fire Extinguisher",
			"id": 6,
			iconCls: "common-icon-sketch",
			"type": "custom"
		}]
	},
	{
		"text": "Existing Smart Items",
		"value": "Existing Smart Items",
		"id": 2,
		"type": "Custom",
		"children": [{
			"text": "Submittals",
			"value": "Submittals",
			"id": 1,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "Accident Report",
			"value": "Accident Report",
			"id": 2,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "Fuse Tracker",
			"value": "Fuse Tracker",
			"id": 3,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},
		{
			"text": "RFI",
			"value": "RFI",
			"id": 1,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},{
			"text": "Tasks",
			"value": "Tasks",
			"id": 4,
			iconCls: "common-icon-sketch",
			"type": "custom"
		},{
			"text": "Worker In Logs",
			"value": "Worker In Logs",
			"id": 5,
			iconCls: "common-icon-sketch",
			"type": "custom"
		}],
		iconCls: "common-icon-sketch",
	},
	{
		"text": "Rule Based linking",
		"value": "Rule Based linking",
		"id": 3,
		"children": [],
		iconCls: "common-icon-sketch",
	},
	{
		"text": "Add External URL",
		"value": "Add External URL",
		"id": 4,
		iconCls: "common-icon-sketch",
		"children": []
	}
];
const linksData = [
	{
		id: 1,
		name: 'Electricals',
		description: 'Electronics is a branch',
		createdby: 'Philip , Parker',
		date: '2023-12-29T18:30:00Z',
		type: 'Safety Task Analysis Log',
		stage: 'New',
		color: 'red'
	},
	{
		id: 2,
		name: 'ST0001',
		description: 'Description is the pattern',
		createdby: 'Philip , Parker',
		date: '2023-12-29T18:30:00Z',
		type: 'Fuse Tracker',
		stage: 'Work Activity',
		color: 'orange'
	}, {
		id: 3,
		name: 'ST0002',
		description: 'Description is the pattern',
		createdby: 'Philip , Parker',
		date: '2023-12-29T18:30:00Z',
		type: 'Fuse Tracker',
		stage: 'Verified',
		color: 'green'
	}
]
const filterOptions = [
	{
		text: "Apps",
		value: "apps",
		key: "apps",
		children: {
			type: "checkbox",
			items: [
			],
		},
	},
]



const Links = () => {
	const appInfo = useAppSelector(getServer);
	const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
	const [selected, setSelected] = useState<any>();
	const [searchText, setSearchText] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);
	const [filters, setFilters] = React.useState<any>(filterOptions);

	var tinycolor = require('tinycolor2');
	const [gridData, setGridData] = useState<any>(linksData);

	useEffect(() => {
		if (linksData?.length > 0) {
			const filtersCopy = [...filters];
			let companyItem = filtersCopy.find((rec: any) => rec?.value === "apps");
			const uniqueTypes = new Set();
			const newArray = linksData?.reduce((acc: any, item: any) => {

				if (!uniqueTypes.has(item.type)) {
					uniqueTypes.add(item.type);
					acc.push({
						text: item.type,
						id: item.type,
						key: item.type,
						value: item.type,
					});
				}
				return acc;
			}, []);
			companyItem.children.items = newArray;
			setFilters(filtersCopy);
		}
	}, [linksData]);

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
						<span className='link-name-icon'>

						</span>
						<span className='link-name-tag' style={{ color: params.data?.smartAppId ? '#059CDF' : '' }}>{params.value}</span>
					</div>
				);
			}
		}, {
			headerName: 'Description',
			field: 'description',
			minWidth: 170,
		}, {
			headerName: 'Stage',
			field: 'stage',
			minWidth: 150,
			cellRenderer: (params: any) => {
				return (
					<Button
						variant='contained'
						style={{
							backgroundColor: params?.data?.color,
							color: tinycolor(params?.data?.color).isDark() ? 'white' : 'black',
						}}
						className='phaseButton'
					>
						{params?.value}
					</Button>
				)
			}

		},
		{
			headerName: 'type',
			field: 'type',
		},
		{
			headerName: 'Created By',
			field: 'createdby',
			minWidth: 150,

		}, {
			headerName: 'Creation Date',
			field: 'date',
			valueGetter: (params: any) => params.data?.date ? formatDate(params.data?.date) : '',
		},
	], []);

	const projectFileUpload = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts', folderType: folderType });
	};


	const onSelectedFilesDelete = () => {
		console.log('onSelectedFilesDelete', selected)
	}

	const rowSelected = (sltdRows: any) => {
		const selectedRowData = sltdRows.api.getSelectedRows();
		if (selectedRowData?.length > 0) {
			setDisableDeleteBtn(false);
		}
		else {
			setDisableDeleteBtn(true);
		}
		setSelected(selectedRowData);
	}

	useEffect(() => {
		const gridDataCopy = [...linksData];
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
	}, [filterKeyValue, searchText, linksData]);

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
			filteredData = linksData
		}
		if (filterValue?.apps?.length > 0) {
			filteredData = filteredData.filter((item: any) => filterValue?.apps?.includes(item?.type));
		}
		return filteredData;
	};
	const handleMenu = (e:any) => {
		console.log("Menu Item Selected", e);
	};
	const handleSubMenu = (e:any) => {
		console.log("Sub Menu Item Selected", e);
	};
	return (
		<div className='SBSLinks'>
			<div className='header-text'>Links</div>
			<div className='toolbar'>
				<div className='left-Section'>
					<IQSubMenuButton 
					menuOptions={AddLinksData || []}
					handleMenuChange={handleMenu}
					handleSubMenuChange={handleSubMenu}
					startIcon={<span className="common-icon-Add" />}
					endIcon={<span className="common-icon-down-arrow1" />}
					label={'Add Link As'}
					/>
					<div className='icon-section'>
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
						//defaultFilters={activeMainGridDefaultFilters}
						showGroups={false}
						onSearchChange={(text: string) => { setSearchText(text) }}
						onFilterChange={(filters: any) => { setFilterKeyValue(filters) }}
						showSearchField={true}
					/>
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
export default Links;
