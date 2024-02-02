
import React, { useRef, useState, useMemo, useEffect } from 'react';
import './Links.scss';
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import { useDriveFileBrowser, useAppSelector, useAppDispatch } from 'app/hooks';
import { getServer } from 'app/common/appInfoSlice';
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import IQSubMenuButton from 'components/iqmenu/IQSubMenuButton';
import { postMessage } from "app/utils";
import { deleteLinksRecs } from 'features/safety/sbsmanager/operations/sbsManagerAPI';
import { getSBSDetailsById } from "features/safety/sbsmanager/operations/sbsManagerSlice";

const AddLinksData = [
	{
		"text": "New Smart Item",
		"value": "New Smart Item",
		"id": 1,
		"type": "Custom",
		iconCls: "common-icon-new-smart-item",
		children: [],
	},
	{
		"text": "Existing Smart Items",
		"value": "Existing Smart Items",
		"id": 2,
		"type": "Custom",
		children: [],
		iconCls: "common-icon-existing-smart-items",
	},
	{
		"text": "Rule Based linking",
		"value": "Rule Based linking",
		"id": 3,
		"type": "Custom",
		iconCls: "common-icon-rule-based-linking",
	},
	{
		"text": "Add External URL",
		"value": "Add External URL",
		"id": 4,
		"type": "Custom",
		iconCls: "common-icon-add-external-url",
	},
];
// const linksData = [
// 	{
// 		id: 1,
// 		name: 'Electricals',
// 		description: 'Electronics is a branch',
// 		createdby: 'Philip , Parker',
// 		date: '2023-12-29T18:30:00Z',
// 		type: 'Safety Task Analysis Log',
// 		stage: 'New',
// 		color: 'red'
// 	},
// 	{
// 		id: 2,
// 		name: 'ST0001',
// 		description: 'Description is the pattern',
// 		createdby: 'Philip , Parker',
// 		date: '2023-12-29T18:30:00Z',
// 		type: 'Fuse Tracker',
// 		stage: 'Work Activity',
// 		color: 'orange'
// 	}, {
// 		id: 3,
// 		name: 'ST0002',
// 		description: 'Description is the pattern',
// 		createdby: 'Philip , Parker',
// 		date: '2023-12-29T18:30:00Z',
// 		type: 'Fuse Tracker',
// 		stage: 'Verified',
// 		color: 'green'
// 	}
// ]
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
	const { appsList, detailsData } = useAppSelector(state => state.sbsManager)
	const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
	const [selected, setSelected] = useState<any>();
	const [searchText, setSearchText] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);
	const [filters, setFilters] = React.useState<any>(filterOptions);
	const [addLinksOptions, setAddLinksOptions] = React.useState<any>(AddLinksData)
	const [linksData, setLinksData] = useState<any>([])
	var tinycolor = require('tinycolor2');
	const [gridData, setGridData] = useState<any>([]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		setLinksData(detailsData?.links?.length ? detailsData?.links : [])
		setGridData(detailsData?.links?.length ? detailsData?.links : [])
	}, [detailsData]);

	useEffect(() => {
		const addLinksOptionsCopy = [...addLinksOptions];
		let newSmartItem = addLinksOptionsCopy.find((rec: any) => rec.value === "New Smart Item");
		let existingSmartItem = addLinksOptionsCopy.find((rec: any) => rec.value === "Existing Smart Items");

		const appsForNew = appsList?.map((obj: any) => {
			return {
				isNew: true,
				"text": obj?.name,
				"value": obj?.name,
				"id": obj?.id,
				icon: obj?.thumbnailUrl,
				"appid": obj?.objectId,
				"type": "Document"
			}
		});
		const appsForExisting = appsList?.map((obj: any) => {
			return {
				isNew: false,
				"text": obj?.name,
				"value": obj?.name,
				"id": obj?.id,
				icon: obj?.thumbnailUrl,
				"appid": obj?.objectId,
				"type": "Document"
			}
		});
		newSmartItem.children = appsForNew
		existingSmartItem.children = appsForExisting
		setAddLinksOptions(addLinksOptionsCopy);
	}, [appsList]);

	useEffect(() => {
		if (linksData?.length > 0) {
			const filtersCopy = [...filters];
			let companyItem = filtersCopy.find((rec: any) => rec?.value === "apps");
			const uniqueTypes = new Set();
			const linkType_array = linksData?.reduce((acc: any, item: any) => {
				if (!uniqueTypes.has(item.linkType)) {
					uniqueTypes.add(item.linkType);
					acc.push({ text: item.linkType, id: item.linkType, key: item.linkType, value: item.linkType, });
				}
				return acc;
			}, []);
			companyItem.children.items = linkType_array;
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
			suppressMenu: true,
			valueGetter: (params: any) => params.data?.name,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRenderer: (params: any) => {
				return params.data && (
					<div className={`app-items-cell-contentt`}>
						{params?.data?.thumbnail && <img
							src={params?.data?.thumbnail || ''}
							alt='Avatar'
							style={{ width: '28px', height: '28px' }}
							className='base-custom-img companyimg-cls'
						/>}
						<span className='link-name-tag' style={{ color: params.data?.smartAppId ? '#059CDF' : '' }}>{params.value}</span>
					</div>
				);
			}
		}, {
			headerName: 'Description',
			field: 'description',
			minWidth: 170,
			suppressMenu: true,
		}, {
			headerName: 'Stage',
			field: 'stagename',
			minWidth: 200,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				return (
					<Button
						variant='contained'
						style={{
							backgroundColor: `#${params?.data?.stageColor}`,
							color: tinycolor(`#${params?.data?.stageColor}`).isDark() ? 'white' : 'black',
						}}
						className='phaseButton'
					>
						{params?.value}
					</Button>
				)
			}

		},
		{
			headerName: 'Type',
			field: 'linkType',
			suppressMenu: true,
		},
		{
			headerName: "Phase",
			field: "phase.name",
			minWidth: 250,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				const phase = params.data && params.data?.phase ? params.data?.phase?.name : '';
				const phaseColor = params.data && params.data?.phase ? params.data?.phase?.color : '';

				const buttonStyle = {
					backgroundColor: phaseColor,
					color: params.data && tinycolor(`#${phaseColor}`).isDark() ? 'white' : 'black',
					alignItems: "center",
				};
				return (
					<>
						{phase ? (
							<Button style={buttonStyle} className="phase-btn">
								<span className="common-icon-phase"></span>
								{phase}
							</Button>
						) : 'NA'}
					</>
				);
			},
		},
		{
			headerName: 'Created By',
			field: 'createdBy',
			minWidth: 150,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.createdBy?.name || '',
			keyCreator: (params: any) => params.data?.createdBy?.name || 'None'
		}, {
			headerName: 'Creation Date',
			field: 'createdDate',
			suppressMenu: true,
			valueGetter: (params: any) => params.data?.createdDate ? formatDate(params.data?.createdDate) : '',
		},
	], []);

	const projectFileUpload = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts', folderType: folderType });
	};

	const onSelectedFilesDelete = () => {
		deleteLinksRecs(selected?.map((file: any) => file.objectId), (response: any) => {
			dispatch(getSBSDetailsById(detailsData?.uniqueid))
		});
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
				setGridData([...SearchGridData]);
			} else {
				setGridData(value);
			};
		} else if (searchText !== "") {
			let SearchGridData = SearchBy(gridDataCopy);
			setGridData([...SearchGridData]);
		} else {
			setGridData([...gridDataCopy]);
		};
	}, [filterKeyValue, searchText, linksData]);

	const SearchBy = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = gridData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(searchText?.toLowerCase());
		});
		return firstResult || [];
	};

	const FilterBy = (gridData: any, filterValue: any) => {
		let filteredData: any = [...gridData];
		const keys = Object.keys(filterValue);
		const lastvalue = keys.slice(-1).pop();

		if (lastvalue == 'all') {
			filteredData = linksData
		}
		if (filterValue?.apps?.length > 0) {
			const linkTypearray = filteredData?.filter((obj: any) => filterValue?.apps?.includes(obj.linkType));
			filteredData = linkTypearray;
		}
		return filteredData;
	};
	const handleMenu = (e: any) => {
		console.log('e', e)
		let sendMsg = {
			event: "common",
			body: {
				evt: "smartitemlink",
				isNew: e.isNew,
				data: {
					"Id": e.id,
					"smartAppId": e.appid,
					"Text": e.text,
					"Type": e.type,
				}
			}
		}
		postMessage(sendMsg);
		console.log("Menu Item Selected", sendMsg);
	};

	return (
		<div className='SBSLinks'>
			<div className='header-text'>Links</div>
			<div className='toolbar'>
				<div className='left-Section'>
					<IQSubMenuButton
						menuOptions={addLinksOptions || []}
						handleMenuChange={handleMenu}
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
						//defaultFilters={filterKeyValue}
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
					getRowId={(record: any) => record?.data?.objectId}
				/>
			</div>
		</div>
	)
}
export default Links;
