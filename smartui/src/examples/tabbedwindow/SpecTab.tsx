import {memo, useEffect, useMemo, useState} from 'react';
import TabbedWindowContent from 'components/iqtabbedwindow/tab/TabbedWindowContent';
import {SMLeftButtons} from 'features/field/specificationmanager/content/toolbar/smlefttoolbar/SMLeftToolbar';
import {SMRightButtons} from 'features/field/specificationmanager/content/toolbar/smrighttoolbar/SMRightToolbar';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {getSMList} from 'features/field/specificationmanager/stores/SpecificationManagerSlice';
import {currency, isLocalhost} from 'app/utils';
import {appInfoData} from 'data/appInfo';
import {setCurrencySymbol, setServer} from 'app/common/appInfoSlice';
import SpecificationManagerLID from 'features/field/specificationmanager/details/SpecficationManagerLID';
import _ from 'lodash';

const SpecTab = () => {
	const dispatch = useAppDispatch();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const columns = useMemo(() => specColumns, []);
	const {server} = useAppSelector((state) => state.appInfo);
	const {SMData} = useAppSelector((state) => state.specificationManager);
	const presenceMap = useMemo(() => {
		return {
			presenceId: 'smart-submittals-presence'
		};
	}, []);

	useEffect(() => {
		if(localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
		}
	}, [localhost, appData]);

	useEffect(() => {
		if(server) {
			dispatch(getSMList());
		}
	}, [server]);

	const specGroupOptions = useMemo(() => [
		{text: 'Division ', value: 'division'},
		{text: 'Spec Book', value: 'specBook'},
		{text: 'Bid Package  ', value: 'bidPackageName'},
	], []);

	const specFilterOptions = useMemo(() => [{
		text: 'Division ',
		value: 'division',
		key: 'division',
		children: {
			type: 'checkbox',
			items: []
		}
	}, {
		text: 'Spec Book',
		value: 'specBook',
		key: 'specBook',
		children: {
			type: 'checkbox',
			items: []
		}
	}, {
		text: 'Bid Package',
		value: 'bidPackageName',
		key: 'bidPackageName',
		children: {
			type: 'checkbox',
			items: []
		}
	}], []);

	return <TabbedWindowContent
		presenceProps={presenceMap}
		detailView={SpecificationManagerLID}
		toolbar={{
			leftItems: <SMLeftButtons
			// handleDeleteAction={handleSpecDeleteAction}
			// setManualLIDOpen={setManualLIDOpen}
			/>,
			rightItems: <SMRightButtons />,
			searchComponent: {
				show: true,
				type: 'regular',
				groupOptions: specGroupOptions,
				filterOptions: specFilterOptions,
				// onGroupChange: onSpecGroupingChange,
				// onFilterChange: onSpecFilterChange,
				// onSearchChange: onSpecGridSearch,
				defaultGroups: 'division'
			}
		}}
		grid={{
			headers: columns,
			data: SMData,
			grouped: true,
			groupIncludeTotalFooter: false,
			groupSelectsChildren: true,
			groupIncludeFooter: false,
			rowSelection: 'multiple',
			groupDefaultExpanded: 1,
			nowRowsMsg:
				'<div>Create New Change Event Request by Clicking the + Add button above</div>',
			animateRows: false,
			groupDisplayType: 'groupRows'
		}}
	/>;
};

export default memo(SpecTab);

const specColumns = [{
	headerName: 'Spec Number',
	pinned: 'left',
	field: 'number',
	cellClass: 'sm-number',
	cellStyle: {color: '#059cdf'},
	// cellRenderer: 'agGroupCellRenderer',
	sort: 'asc',
	checkboxSelection: true,
	headerCheckboxSelection: true,
	resizable: true,
	minWidth: 200
}, {
	headerName: 'Spec Section Title',
	pinned: 'left',
	field: 'title',
	cellClass: 'sm-title',
	resizable: true,
	minWidth: 350
}, {
	headerName: 'Spec Book',
	field: 'specBook',
	minWidth: 150,
	suppressMenu: true,
	resizable: true,
	cellClass: 'sm-specBookName',
	keyCreator: (params: any) => params.data?.specBook?.fileName || 'None',
	valueGetter: (params: any) => `${params?.data?.specBook?.fileName}`
}, {
	headerName: 'Display Name',
	field: 'specBookDisplayName',
	cellClass: 'sm-specBookDisplayName',
	minWidth: 200,
	suppressMenu: true,
	resizable: true,
	keyCreator: (params: any) => params.data?.specBook?.displayName || 'None',
	valueGetter: (params: any) => `${params?.data?.specBook?.displayName}`
}, {
	headerName: 'Division',
	field: 'division',
	cellClass: 'sm-division',
	minWidth: 250,
	rowGroup: true,
	resizable: true,
	suppressMenu: true,
	keyCreator: (params: any) => params.data.division && `${params.data.division.number} - ${params.data.division.text}` || 'None',
	valueGetter: (params: any) => {
		const division = params?.data?.division;
		if(
			division &&
			division.number !== undefined &&
			division.text !== undefined
		) {
			return `${division.number} - ${division.text}`;
		}
	}
}, {
	headerName: 'Pages',
	field: 'pages',
	cellClass: 'sm-pages',
	minWidth: 120,
	suppressMenu: true,
	resizable: true,
	cellStyle: {color: '#059cdf'},
	valueGetter: (params: any) => `${params?.data?.startPage} - ${params?.data?.endPage}`
}, {
	headerName: 'Bid Package',
	field: 'bidPackageName',
	cellClass: 'sm-bidPackages',
	minWidth: 350,
	resizable: true,
	suppressMenu: true,
	keyCreator: (params: any) => params.data?.bidPackageName || 'None',
	valueGetter: (params: any) => params.data?.bidPackageName === '' ? 'NA' : params.data?.bidPackageName
}, {
	headerName: 'Type',
	field: 'extractionType',
	cellClass: 'sm-extractionType',
	minWidth: 100,
	suppressMenu: true,
	resizable: true
}, {
	headerName: 'Spec Section Name',
	field: 'sectionName',
	cellClass: 'sm-sectionName',
	resizable: true,
	suppressMenu: true,
	valueGetter: (params: any) => {
		return params.data?.title;
	}
}];