import {memo, useMemo} from 'react';
import TabbedWindowContent from 'components/iqtabbedwindow/tab/TabbedWindowContent';
import {
	getSubmittalsStatus,
	getSubmittalsStatusLabel,
} from 'utilities/smartSubmittals/enums';
import {Button} from '@mui/material';
import {SSLeftToolbar} from 'features/field/smartsubmittals/content/toolbar/sslefttoolbar/SSLeftToolbar';
import {SSRightToolbar} from 'features/field/smartsubmittals/content/toolbar/ssrighttoolbar/SSRightToolbar';
import {smartSubmittalFlatList} from "data/smartsubmittals/smartsubmittals";

const SubmittalTab = () => {
	const columns = useMemo(() => submittalColumns, []);
	const submittalGroupOptions = useMemo(() => [
		{text: 'Division  ', value: 'division'},
		{text: 'Submittal Type  ', value: 'type'},
		{text: 'Submittal Status ', value: 'status'},
		{text: 'Spec Section', value: 'sectionTitle'},
		{text: 'Bid Package', value: 'bidPackageName'},
		{text: 'Division & Spec Section', value: 'divisionSubmitalType'},
		{text: 'Spec Book', value: 'specBook'}
	], []);

	const submittalFilterOptions = useMemo(() => [{
		text: 'Submittal Type  ',
		value: 'type',
		key: 'type',
		children: {
			type: 'checkbox',
			items: []
		}
	}, {
		text: 'Submittal Status',
		value: 'status',
		key: 'status',
		children: {
			type: 'checkbox',
			items: [
				{text: 'Suggested Draft', value: 'SuggestedDraft', id: 0},
				{text: 'Draft', value: 'Draft', id: 1},
				{text: 'Committed', value: 'Committed', id: 2},
				{text: 'Deleted', value: 'Deleted', id: 3}
			]
		}
	}, {
		text: 'Spec Section Title',
		value: 'sectionTitle',
		key: 'sectionTitle',
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
	}, {
		text: 'Spec Book',
		value: 'specBook',
		key: 'specBook',
		nested: true,
		nestedKey: 'displayName',
		children: {
			type: 'checkbox',
			items: []
		}
	}], []);

	const onPrevious = () => {
		console.log('on previous');
	};

	const onNext = () => {
		console.log('on next');
	};

	return <TabbedWindowContent
		onPreviousNavigation={onPrevious}
		onNextNavigation={onNext}
		toolbar={{
			leftItems: <SSLeftToolbar defaultType='default' />,
			rightItems: <SSRightToolbar />,
			searchComponent: {
				show: true,
				type: 'regular',
				groupOptions: submittalGroupOptions,
				filterOptions: submittalFilterOptions,
				// onGroupChange: onGroupingChange,
				// onFilterChange: onFilterChange,
				// onSearchChange: onGridSearch,
				defaultGroups: 'divisionSubmitalType'
			}
		}}
		grid={{
			headers: columns,
			data: []
		}}
	/>;
};

export default memo(SubmittalTab);

const CustomCellRenderer = (params: any) => {
	let statusClr;
	let parentRec = params?.node?.level == 1;
	if(parentRec) {
		statusClr =
			params?.data?.submittalCountBySection ===
			params?.data?.committedCountBySection;
	} else {
		statusClr =
			params?.params?.submittalCountByDivision ===
			params?.params?.committedCountByDivision;
	}
	return (
		<div
			style={{
				backgroundColor: statusClr ? 'green' : '#d6b335',
				borderRadius: '50%',
				height: '1em',
				width: '1em',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				margin: '12px auto 0px auto',
			}}
		></div>
	);
};

const submittalColumns = [
	{
		headerName: 'Submittal ID',
		field: 'submittalId',
		pinned: 'left',
		minWidth: 250,
		hide: true,
		cellStyle: {color: '#059cdf'},
		show: false,
		keyCreator: (params: any) => params.data?.submittalId || 'None',
	},

	{
		headerName: 'Submittal Type',
		field: 'type',
		pinned: 'left',
		minWidth: 250,
		hide: true,
		show: false,
		keyCreator: (params: any) => params.data?.type || 'None',
	},
	{
		headerName: 'Submittal Status',
		field: 'status',
		pinned: 'left',
		minWidth: 250,
		hide: true,
		show: false,
		keyCreator: (params: any) => (params.data?.sectionStatus ?? params.data?.status) && (getSubmittalsStatusLabel(params.data?.sectionStatus) ?? getSubmittalsStatusLabel(params.data?.status)) || 'None',
		cellRenderer: (params: any) => {
			const status = params?.data?.status;
			const buttonStyle = {
				backgroundColor: getSubmittalsStatus(status),
				color: '#000',
			};

			return <Button style={buttonStyle}>
				{getSubmittalsStatusLabel(status)}
			</Button>;
		},
	},
	{
		headerName: 'Submittal Title',
		field: 'title',
		hide: true,
		show: false,
		keyCreator: (params: any) => params.data?.title || 'None',
	},
	{
		headerName: 'Submittal Summary',
		field: 'title',
		hide: true,
		show: false,
		keyCreator: (params: any) => params.data?.title || 'None',
	},
	{
		headerName: 'Spec Section Title',
		field: 'sectionTitle',
		hide: true,
		show: false,
		keyCreator: (params: any) => params.data?.sectionTitle || 'None'
	},
	{
		headerName: 'Page(s)',
		field: 'pages',
		minWidth: 100,
		suppressMenu: true,
		resizable: true,
		hide: true,
		show: false,
		cellStyle: {color: '#059cdf'},
		valueGetter: (params: any): string => {
			if(params?.node?.level || !params?.node?.group) {
				return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage}`;
			}
			return '';
		},
	},
	{
		headerName: 'Submittal Package',
		field: 'submittalPackage',
		minWidth: 250,
		hide: true,
		show: false,
		suppressMenu: true,
		resizable: true,
		keyCreator: (params: any) => params.data?.submittalPackage || 'None',
	}, {
		headerName: 'Status',
		field: 'status',
		hide: true,
		show: false,
		minWidth: 250,
		suppressMenu: true,
		resizable: true,
		keyCreator: (params: any) => params.data?.status || 'None'
	},
	{
		headerName: 'Spec Section Name',
		pinned: 'left',
		field: 'sectionTitle',
		sort: 'asc',
		suppressMenu: false,
		checkboxSelection: true,
		headerCheckboxSelection: true,
		// minWidth: 250,
		show: true,
		cellRenderer: 'agGroupCellRenderer',
		minWidth: 540,
		resizable: true,
		keyCreator: (params: any) => params.data?.title || 'None',
		valueGetter: (params: any) => `${params?.data?.number} - ${params?.data?.title}`
	},
	{
		headerName: 'Spec Book',
		field: 'specBook',
		minWidth: 160,
		suppressMenu: true,
		resizable: true,
		keyCreator: (params: any) => params.data?.specBook?.fileName || 'None',
		valueGetter: (params: any) => {
			if(params?.node?.level || !params?.node?.group) {
				return `${params?.data?.specBook?.fileName}`;
			}
		},
	},
	{
		headerName: 'Display Name',
		field: 'displayName',
		minWidth: 200,
		suppressMenu: true,
		resizable: true,
		valueGetter: (params: any) => {
			if(params?.node?.level || !params?.node?.group) {
				return `${params?.data?.specBook?.displayName}`;
			}
		},
	},
	{
		headerName: 'Division',
		field: 'division',
		minWidth: 250,
		suppressMenu: true,
		resizable: true,
		keyCreator: (params: any): String => {
			return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
		},
		valueGetter: (params: any): String => {
			if(params?.node?.level || !params?.node?.group) {
				return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
			}
			else return '';
		},
	},
	{
		headerName: '',
		fieldName: 'colorDiv',
		key: 'colorDiv',
		pinned: 'left',
		show: true,
		maxWidth: 54,
		cellRendererFramework: CustomCellRenderer,
	},
	{
		headerName: 'Pages',
		field: 'pages',
		minWidth: 100,
		suppressMenu: true,
		resizable: true,
		cellStyle: {color: '#059cdf'},
		valueGetter: (params: any): string => {
			if(params?.node?.level || !params?.node?.group) {
				return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage}`;
			}
			return '';
		},
	},
	{
		headerName: 'Bid Package',
		field: 'bidPackageName',
		minWidth: 250,
		suppressMenu: true,
		resizable: true,
		keyCreator: (params: any) => params.data?.bidPackageName || 'None',
		valueGetter: (params: any) => params.data?.bidPackageName === null || params.data?.bidPackageName === '' ? 'NA'
			: params.data?.bidPackageName
	},
	{
		headerName: '',
		field: 'divisionSubmitalType',
		hide: true,
		show: true,
		keyCreator: (params: any): String => {
			return `${`${params?.data?.division?.number} - ${params?.data?.division?.text}`}`;
		},
		valueGetter: (params: any): String => {
			if(params?.node?.level || !params?.node?.group) {
				return `${`${params?.data?.division?.number} - ${params?.data?.division?.text}`}`;
			}
			else return '';
		},
	},
];