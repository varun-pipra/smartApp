
import React, { useRef, useState, useMemo, useEffect } from 'react';
import './Links.scss';
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import { useDriveFileBrowser, useAppSelector, useAppDispatch ,useLocalFileUpload} from 'app/hooks';
import { getServer } from 'app/common/appInfoSlice';
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import IQSubMenuButton from 'components/iqmenu/IQSubMenuButton';
import { postMessage } from "app/utils";
import _ from 'lodash';
import { AppList_PostMessage } from '../../../utils';
import {deleteLinksData,saveLinksData} from '../../../stores/TimeLogAPI';
import {getTimeLogDetails,setSmartItemOptionSelected,setSelectedTimeLogDetails} from '../../../stores/TimeLogSlice';

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
	const inputRef = useRef<any>();

	const { appsList, detailsData } = useAppSelector(state => state.sbsManager)
	const { selectedTimeLogDetails ,smartItemOptionSelected,driveFile} = useAppSelector(state => state.timeLogRequest);
	const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
	const [selected, setSelected] = useState<any>();

	const [addLinksOptions, setAddLinksOptions] = React.useState<any>(linksOptions)
	const [linksData, setLinksData] = useState<any>([])

	const [gridData, setGridData] = useState<any>([]);
	const [filters, setFilters] = React.useState<any>(filterOptions);
	const [searchText, setSearchText] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);
	const[localupload ,setLocalupload] = useState<boolean>(false);

	useMemo(() => {
		setLinksData(selectedTimeLogDetails?.links?.length > 0 ? selectedTimeLogDetails?.links : [])
		setGridData(selectedTimeLogDetails?.links?.length > 0? selectedTimeLogDetails?.links : [])
	}, [selectedTimeLogDetails])

	useMemo(() => {
		if (linksData?.length > 0) {
			const filtersCopy = [...filters];
			let FileType = filtersCopy.find((rec: any) => rec?.value === "FileType");
			let SmartItem = filtersCopy.find((rec: any) => rec?.value === "SmartItem");

			const uniqueTypes = new Set();
			const linkType_array = linksData?.reduce((acc: any, item: any) => {
				if (!uniqueTypes.has(item.linkType)) {
					uniqueTypes.add(item.linkType);
					acc.push({ text: item.linkType, id: item.linkType, key: item.linkType, value: item.linkType, });
				}
				return acc;
			}, []);
			const SmartItemTypes = new Set();
			const smartItem_array = linksData?.reduce((acc: any, item: any) => {
				if (!SmartItemTypes.has(item.name)) {
					SmartItemTypes.add(item.linkType);
					acc.push({ text: item.name, id: item.name, key: item.name, value: item.name, });
				}
				return acc;
			}, []);
			FileType.children.items = linkType_array;
			SmartItem.children.items = smartItem_array;
			setFilters(filtersCopy);
		}
	}, [linksData]);

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
		if (filterValue?.SmartItem?.length > 0) {
			const linkTypearray = filteredData?.filter((obj: any) => filterValue?.SmartItem?.includes(obj.name));
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
			field: 'stage',
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
		// {
		// 	headerName: 'Type',
		// 	field: 'linkType',
		// 	suppressMenu: true,
		// },
		{
			headerName: 'Created By',
			field: 'createdBy',
			minWidth: 150,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.createdBy   ? params?.data?.createdBy : '',
			keyCreator: (params: any) => params.data?.createdBy || 'None'
		}, {
			headerName: 'Creation Date',
			field: 'createdOn',
			suppressMenu: true,
			valueGetter: (params: any) => params.data?.createdOn ? formatDate(params.data?.createdOn) : '',
		},
	], []);

	const projectFileUpload = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts', folderType: folderType });
	};

	useEffect(()=>{
		if(!_.isEmpty(smartItemOptionSelected)){
			const payload = [{itemId : smartItemOptionSelected?.id}]
			saveLinksData(selectedTimeLogDetails?.id,payload, (response: any) => {
					console.log('response',response)
					dispatch(setSelectedTimeLogDetails(response));
					dispatch(setSmartItemOptionSelected({}));
			});
		}
	},[smartItemOptionSelected]);

	const onSelectedFilesDelete = async() => {
		console.log('selected',selected)
		try{
			await Promise.all(selected.map((links:any) => {
						deleteLinksData(selectedTimeLogDetails?.id,links?.id,(response:any) => {
							console.log('response linkdelete',response)
							dispatch(getTimeLogDetails(selectedTimeLogDetails?.id))
					});
			}));	
		}
		catch{
			console.log('delete error')
		}	
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

	const openDrive = () => {
    let params: any = {
      iframeId: '',
      roomId: appInfo && appInfo.presenceRoomId,
      appType: '',
      multiSelect: false,
    };
    postMessage({
      event: "getdrivefiles",
      body: params,
    });
	};
	
	const AddLinks = (e:any) =>{
		console.log('e',e)
		if(e == 'Select from Drive'){
			openDrive();
		}
		else if(e == 'Upload Files'){
			if (inputRef.current) {inputRef?.current?.click();};
		}
		else if(e == 'Add External URL'){

		}
		else{
			AppList_PostMessage(e)
		}
	}
	const LocalFileUpload = (event: any) => {
		const data = event?.target?.files
		console.log('event',data);
		event.preventDefault();
		useLocalFileUpload(appInfo, data).then((res) => {
			console.log('res',res)
    });
		event.target.value = null;
	};
	
	useEffect(() => {
    if (driveFile) {
      console.log('driveFile',driveFile)
    }
	}, [driveFile]);
	
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
						handleMenuChange={(e: any) => { AddLinks(e) }}
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
					<input
						multiple
						style={{ display: "none" }}
						ref={inputRef}
						type="file"
						onChange={LocalFileUpload}
					/>
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
