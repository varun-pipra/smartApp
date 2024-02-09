
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
import { AppList_PostMessage } from '../../../utils';

const linksOptions = [
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
		"text": "Select from Drive",
		"value": "Select from Drive",
		"id": 3,
		"type": "Custom",
		iconCls: "common-icon-drive-icon",
	},
	{
		"text": "Upload Files",
		"value": "Upload Files",
		"id": 2,
		"type": "Custom",
		children: [],
		iconCls: "common-icon-upload1",
	},
	{
		"text": "Add External URL",
		"value": "Add External URL",
		"id": 2,
		"type": "Custom",
		children: [],
		iconCls: "common-icon-add-external-url",
	},
];

const linksgridData = [
	{
		"sbsId": 2,
		"name": "1",
		"stagename": "Approval",
		"stageColor": "4A148C",
		"type": 0,
		"linkType": "CASymbols",
		"description": "",
		"createdBy": {
			"id": null,
			"name": "Mani, Vimal Raj"
		},
		"createdDate": "2024-01-19T10:46:56.903",
		"objectId": 2288057,
		"id": "8049d1ce-05c3-44cf-af03-01dcb8823810",
		"thumbnail": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqthumbnail/a1ec16cd64194fb8a28a3c58e4f9d8de",
	},
	{
		"sbsId": 2,
		"name": "AR - 0023",
		"stagename": "Report Prepared",
		"stageColor": "59D800",
		"type": 0,
		"linkType": "Accident Report",
		"description": "test",
		"createdBy": {
			"id": null,
			"name": "MK, Sudeep"
		},
		"createdDate": "2024-01-29T09:52:22.717",
		"objectId": 3410732,
		"id": "179ac9c4-d9eb-47e0-8fc2-013c45f31837",
		"thumbnail": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqthumbnail/f6222293d88145acbc2ce2de6df8d9b5",
	},
	{
		"sbsId": 2,
		"name": "123 -123",
		"stagename": "For Record",
		"stageColor": "558B2F",
		"type": 0,
		"linkType": "Bid Packages",
		"description": "Architectural-123",
		"createdBy": {
			"id": null,
			"name": "Mani, Vimal Raj"
		},
		"createdDate": "2024-01-19T10:46:29.81",
		"objectId": 3133282,
		"id": "7db51d7e-6938-4d6d-91b2-9473789d117d",
		"thumbnail": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fiqthumbnail%2F41cba6bdb70846489b4048993c7561c3%2F1b39047498b04b679400301e6c286161.png?generation=1655379006248906&alt=media",
	}
]

const filterOptions = [
	{
		text: "Smart Item", value: "SmartItem", key: "SmartItem",
		children: { type: "checkbox", items: [], },
	},
	{
		text: "File Type", value: "FileType", key: "FileType",
		children: { type: "checkbox", items: [], },
	},
]

const Links = () => {
	const dispatch = useAppDispatch();
	var tinycolor = require('tinycolor2');
	const appInfo = useAppSelector(getServer);
	const { appsList, detailsData } = useAppSelector(state => state.sbsManager)
	const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
	const [selected, setSelected] = useState<any>();

	const [addLinksOptions, setAddLinksOptions] = React.useState<any>(linksOptions)
	const [linksData, setLinksData] = useState<any>([])

	const [gridData, setGridData] = useState<any>([]);
	const [filters, setFilters] = React.useState<any>(filterOptions);
	const [searchText, setSearchText] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);

	useMemo(() => {
		setLinksData(linksgridData?.length ? linksgridData : [])
		setGridData(linksgridData?.length ? linksgridData : [])
	}, [linksgridData])

	useMemo(() => {
		if (linksgridData?.length > 0) {
			const filtersCopy = [...filters];
			let FileType = filtersCopy.find((rec: any) => rec?.value === "FileType");
			const uniqueTypes = new Set();
			const linkType_array = linksgridData?.reduce((acc: any, item: any) => {
				if (!uniqueTypes.has(item.linkType)) {
					uniqueTypes.add(item.linkType);
					acc.push({ text: item.linkType, id: item.linkType, key: item.linkType, value: item.linkType, });
				}
				return acc;
			}, []);
			FileType.children.items = linkType_array;
			setFilters(filtersCopy);
		}
	}, [linksgridData]);

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

	const FilterBy = (gridData: any, filterValue: any) => {
		let filteredData: any = [...gridData];
		const keys = Object.keys(filterValue);
		const lastvalue = keys.slice(-1).pop();

		if (lastvalue == 'all') {
			filteredData = linksData
		}
		if (filterValue?.FileType?.length > 0) {
			const linkTypearray = filteredData?.filter((obj: any) => filterValue?.FileType?.includes(obj.linkType));
			filteredData = linkTypearray;
		}
		return filteredData;
	};
	const SearchBy = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = gridData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(searchText?.toLowerCase());
		});
		return firstResult || [];
	};

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
			minWidth: 150,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				return (
					<Button
						variant='contained'
						style={{
							backgroundColor: params?.data?.stageColor,
							color: tinycolor(params?.data?.stageColor).isDark() ? 'white' : 'black',
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
		deleteLinksRecs(
			selected?.map((file: any) => file.objectId),
			(response: any) => {
				dispatch(getSBSDetailsById(detailsData?.uniqueId))
			}
		);
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

	return (
		<div className='timelog-Links'>
			<div className='timelog-details-header'>
				<div className='title-action'>
					<span className='common-icon-Links iconmodify'></span>
					<span className='title' style={{ marginLeft: '6px' }}>Links</span>
				</div>
			</div>
			<div className='toolbar'>
				<div className='left-Section'>
					<IQSubMenuButton
						menuOptions={addLinksOptions || []}
						handleMenuChange={(e: any) => { AppList_PostMessage(e) }}
						startIcon={<span className="common-icon-Add" />}
						endIcon={<span className="common-icon-down-arrow1" />}
						label={'Add Links'}
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
					rowMessageIcon={'common-icon-Links'}
					rowMessageHeading={'Please click on + Add Links button to create link'}
				/>
			</div>
		</div>
	)
}
export default Links;
