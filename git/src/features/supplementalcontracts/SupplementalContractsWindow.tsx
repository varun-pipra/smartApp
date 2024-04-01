import _ from 'lodash';
import { useMemo, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useFilePreview } from 'app/hooks';
import { Box, Stack, IconButton } from '@mui/material';
import { ColDef } from 'ag-grid-enterprise';

import './SupplementalContractsWindow.scss';

import BaseWindow from 'components/iqbasewindow/IQBaseWindow';
import { IQBaseWindowProps } from 'components/iqbasewindow/IQBaseWindowTypes';
import IQButton from 'components/iqbutton/IQButton';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import Grid from 'sui-components/Grid/Grid';

import { getServer } from 'app/common/appInfoSlice';
import { getSupplementalContracts, getContractList, setAddButtonDisabled, getAddButtonDisabled } from './stores/SupplementalContractsSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';

type SupplementalContractProps = IQBaseWindowProps & {
	categories?: Array<number>;
	onAdd?: (records: Array<any>) => void;
	rowSelection?: any;
	selectedFiles?: any;
	filterOptions?: any;
	Iframe?: any;
	modules?: any;
};

const SupplementalContractsWindow = ({ categories, onAdd, selectedFiles = [], filterOptions = [], rowSelection = 'multiple', Iframe, modules, ...props }: SupplementalContractProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const contracts = useAppSelector(getContractList);
	const addBtnDisabled = useAppSelector(getAddButtonDisabled);
	const [rowdata, setRowData] = useState<any>([]);
	const [gridRef, setGridRef] = useState<any>();
	const [filterKeyValue, setFilterKeyValue] = useState<any>([]);
	const [searchText, setSearchText] = useState<any>('');
	const [filters, setFilters] = useState<any>([]);
	const [filterOption, setFilterOption] = useState<any>([]);
	const [selectedStandardFile, setSelectedStandardFile] = useState<any>(null);

	const categoryies: any = {
		VendorContract: 'Vendor Contract',
		ClientContract: 'Client Contract',
		Quote: 'Quote',
		LienWaiver: 'Lien Waiver',
		BidPackage: 'Bid Package',
		General: 'General'
	};

	useEffect(() => {
		const loader = document.getElementById('smartapp-react-loader');
		if (loader) {
			loader.style.display = 'none';
		}
	});

	useEffect(() => {
		if (contracts?.length > 0) setRowData(contracts);
	}, [contracts]);

	useEffect(() => {
		if (filterOptions?.length > 0) setFilterOption(filterOptions);
	}, [filterOptions]);

	useEffect(() => {
		dispatch(getSupplementalContracts({ appInfo: appInfo, categories: categories }));
	}, [appInfo]);

	const onRowSelection = (event: any) => {
		const selectedData: any = event.api.getSelectedRows();
		dispatch(setAddButtonDisabled(selectedData.length === 0));
	};

	// const onSelectionComplete = () => {
	// 	const records = gridRef?.current?.api?.getSelectedRows();
	// 	console.log('selectedFiles',selectedFiles)
	// 	if (selectedFiles.length > 0) {
	// 		console.log('if',selectedFiles)
	// 		const uniqueDocumentIds = new Set(selectedFiles?.map((file: any) => file?.documentId));
	// 		console.log('uniqueDocumentIds', uniqueDocumentIds)
	// 		const filteredContracts = records?.filter((contract: any) => !uniqueDocumentIds.has(contract?.documentId));
	// 		console.log('filteredContracts', filteredContracts)
	// 		if (filteredContracts?.length > 0) {
	// 			console.log('filteredContracts if')
	// 			onAdd && onAdd(filteredContracts);
	// 			props.onClose && props.onClose('programmatic');
	// 		}
	// 		else {
	// 			console.log('filteredContracts else')
	// 			props.onClose && props.onClose('programmatic');
	// 		}
	// 	}
	// 	else {
	// 		console.log('else')
	// 		onAdd && onAdd(records);
	// 		props.onClose && props.onClose('programmatic');
	// 	}
	// };
	const onSelectionComplete = () => {
		const records = gridRef?.current?.api?.getSelectedRows();
		onAdd && onAdd(records);
		props.onClose && props.onClose('programmatic');
	}

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
		if (_.isEmpty(filterValue)) setFilters([]);
		else setFilters(keys);
		if (lastvalue == 'all') {
			filteredData = contracts
		}
		if (filterValue?.Category?.length > 0) {
			filteredData = filteredData.filter((item: any) => filterValue?.Category?.includes(item?.category));
		}
		return filteredData;
	};

	const handleOnSearchChange = (searchText: string) => {
		setSearchText(searchText)
	};

	useEffect(() => {
		const gridDataCopy = [...contracts];
		let value: any;
		if (filterKeyValue && Object.keys(filterKeyValue)?.length > 0) {
			value = FilterBy(gridDataCopy, filterKeyValue);
			if (searchText !== "") {
				let SearchGridData = SearchBy(value);
				setRowData(SearchGridData);
			} else {
				setRowData(value);
			};
		} else if (searchText !== "") {
			let SearchGridData = SearchBy(gridDataCopy);
			setRowData(SearchGridData);
		} else {
			setRowData([...gridDataCopy]);
		};
	}, [filterKeyValue, searchText, contracts]);

	const handleHelp = () => {
		postMessage({
			event: "help",
			body: { iframeId: "supplementalContractsIFrame", roomId: appInfo && appInfo.presenceRoomId, appType: "SupplementalContracts" }
		});
	};

	const helpTool = <IQTooltip title='Help' placement={'bottom'}>
		<IconButton key={'help'} aria-label='Help' onClick={handleHelp}>
			<span className='help-icon common-icon-Live-Support-Help'></span>
		</IconButton>
	</IQTooltip>;

	const defaultProps = useMemo(() => {
		return {
			title: 'Select Contract Attachments',
			tools: {
				closable: true,
				resizable: true,
				customTools: helpTool
			},
			PaperProps: {
				sx: {
					width: '70%',
					height: '80%'
				}
			},
			actions: <><IQButton
				color='blue'
				disabled={addBtnDisabled}
				onClick={onSelectionComplete}
			>
				ADD
			</IQButton></>
		};
	}, [addBtnDisabled, gridRef]);

	const onImagePreview = (event: any) => {
		if (event?.data) {
			setSelectedStandardFile(event?.data);
		}
	};
	const openPreview = (files: Array<any>, index: number) => {
		setSelectedStandardFile(null);
		useFilePreview(Iframe, appInfo, modules, files, index);
	};

	useEffect(() => {
		if (selectedStandardFile) {
			console.log('selectedStandardFile',selectedStandardFile)
			const index :any = rowdata?.findIndex((file: any) => file.uniqueId === selectedStandardFile.uniqueId);
			const formattedFileList = rowdata?.map((file: any) => {
				const { uniqueId, displayName, thumbnail } = file;
				return {
					id: uniqueId, fileName: displayName, thumbnail
				}
			});
			console.log('formattedFileList', formattedFileList)
			openPreview(formattedFileList, index);
		}
	}, [selectedStandardFile]);

	const columns: ColDef[] = useMemo(() => [
		{
			headerName: 'Document ID',
			field: 'documentId',
			menuTabs: [],
			maxWidth: 170,
			flex: 2,
			checkboxSelection: rowSelection == 'single' ? false : true,
			showDisabledCheckboxes: true,
			headerCheckboxSelection: rowSelection == 'single' ? false : true,
			cellRenderer: (params: any) => {
				return <div className='hotlink'>{params.value}</div>;
			}
		}, {
			headerName: 'Name',
			field: 'displayName',
			menuTabs: [],
			flex: 2.2
		}, {
			headerName: 'Description',
			field: 'description',
			menuTabs: [],
			flex: 4.5
		}, {
			headerName: 'Category',
			field: 'category',
			menuTabs: [],
			flex: 1.8,
			cellRenderer: (context: any) => categoryies[context.value]
		}, {
			headerName: 'File',
			field: 'thumbnail',
			menuTabs: [],
			flex: 1.2,
			onCellClicked: onImagePreview,
			cellRenderer: (params: any) => {
				return params.value ? <img className='thumbnail' src={params.value} style={{ cursor: 'pointer' }} /> : '';
			}
		}], []);

	return <BaseWindow className='contract-attachments-window' {...defaultProps} {...props} withInModule={true}>
		<Box className='body-box'>
			<Stack className='toolbar' direction='row'>
				<div className='sub-section'>
					<IconButton>
						<span className='common-icon-sketch'></span>
					</IconButton>
				</div>
				<div className='sub-section'>
					<IQSearch
						showGroups={false}
						showFilter={filterOption?.length > 0 ? true : false}
						filters={filterOptions}
						onSearchChange={(value: any) => { handleOnSearchChange(value); }}
						onFilterChange={(filter: any) => { setFilterKeyValue(filter) }}
					/>
				</div>
				<div className='sub-section'></div>
			</Stack>
			<Box className='grid-box'>
				<Grid
					headers={columns}
					data={rowdata && rowdata?.length > 0 ? rowdata : []}
					rowSelection={rowSelection}
					rowMultiSelectWithClick={true}
					getRowId={(record: any) => record.data.contentId}
					nowRowsMsg={'<div>No records to display</div>'}
					rowSelected={onRowSelection}
					getReference={(value: any) => { setGridRef(value); }}
				/>
			</Box>
		</Box>
	</BaseWindow>;
};

export default SupplementalContractsWindow;