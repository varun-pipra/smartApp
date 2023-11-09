import * as React from "react";
import _ from 'lodash';
// import './BudgetManagerWindow.scss';
import {IconButton} from "@mui/material";

import {postMessage, isLocalhost, currency} from "app/utils";
import SmartDialog from "components/smartdialog/SmartDialog";
import IQTooltip from "components/iqtooltip/IQTooltip";
import HeaderPinning from './headerPinning/HeaderPinning';
import ManageTableColumns from "./managetablecolumns/ManageTableColumns";
import {useAppSelector, useAppDispatch, useHomeNavigation} from "app/hooks";
import {useLocation} from 'react-router-dom';
import {appInfoData} from 'data/appInfo';
import {getToastMessage} from './operations/tableColumnsSlice';
import {setPresenceData} from './operations/gridSlice';
import {
	getServer, setServer, setCostCodeList, setFullView,
	setCostUnitList, setCurrencySymbol, setAppWindowMaximize
} from 'app/common/appInfoSlice';
import {setUploadedFilesFromLocal, setUploadedFilesFromDrive} from "./operations/transactionsSlice";
import {triggerEvent} from 'utilities/commonFunctions';
import PresenceManager from "utilities/presence/PresenceManager.js";
import 'utilities/presence/PresenceManager.css';
import Toast from "components/toast/Toast";
import SUIAlert from "sui-components/Alert/Alert";
import {isBudgetManager} from "app/common/userLoginUtils";

import GridWindow from 'components/iqgridwindow/IQGridWindow';
import {useEffect, useMemo, useState} from "react";
import {gridData} from "data/Budgetmanger/griddata";

const BudgetManagerWindowNew = (props: any) => {
	const dispatch = useAppDispatch();

	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);

	const location = useLocation();
	const {server, currencySymbol} = useAppSelector((state) => state.appInfo);

	useEffect(() => {
		const {search} = location;
		if(search) {
			const params: any = new URLSearchParams(search);
			setMaxByDefault(params?.get('maximizeByDefault') === 'true');
			setInline(params?.get('inlineModule') === 'true');
			setFullView(params?.get('inlineModule') === 'true');
		}
	}, []);

	const handleIconClick = () => {
		if(isInline) useHomeNavigation('budgetManagerIframe', 'BudgetManager');
	};

	const columns = useMemo(() => [
		{headerName: 'Budget ID/CBS', field: 'budgetId'},
		{headerName: 'Description', field: 'description'},
		{headerName: 'Division/Cost Code', field: 'costCode'},
		{headerName: 'Cost Type', field: 'Cost Type'},
		{headerName: 'Associated Location/System', field: 'locations'},
		{headerName: 'Original Budget Amount', field: 'originalBudgetAmount'},
		{headerName: 'Budget Transfer Amount', field: 'budgetTransferAmount'},
		{headerName: 'Approved COs', field: 'approvedCOs'},
		{headerName: 'Revised Budget', field: 'revisedBudget'},
		{headerName: 'Transaction Amount', field: 'transactionAmount'},
		{headerName: 'Remaining Balance', field: 'remainingBalance'},
		{headerName: 'Curve', field: 'curve'},
		{headerName: 'Vendor', field: 'vendor'},
		{headerName: 'Estimated Start Date', field: 'estimatedStartDate'},
		{headerName: 'Estimated End Date', field: 'estimatedEndDate'},
		{headerName: 'Projected Schedule Start', field: 'projectedScheduleStart'},
		{headerName: 'Projected Schedule End', field: 'projectedScheduleEnd'},
		{headerName: 'Actual Schedule Start', field: 'actualScheduleStart'},
		{headerName: 'Actual Schedule End', field: 'actualScheduleEnd'},
		{headerName: 'Unit of Measure', field: 'unitofMeasure'},
		{headerName: 'Unit Quantity', field: 'unitQuantity'},
		{headerName: 'Unit Cost', field: 'unitCost'},
		{headerName: 'Pending Change Order', field: 'pendingChangeOrder'},
		{headerName: 'Pending Transactions', field: 'pendingTransactions'},
		{headerName: 'Budget Forecast', field: 'budgetForecast'},
		{headerName: 'Balance Forecast', field: 'balanceForecast'},
		{headerName: 'Bid Package Name', field: 'bidPackageName'},
		{headerName: 'Bid Award Date', field: 'bidAwardDate'},
		{headerName: 'Bid Status', field: 'bidStatus'},
		{headerName: 'Vendor Contract Name', field: 'vendorContractName'},
		{headerName: 'Vendor Contract Date', field: 'vendorContractDate'},
		{headerName: 'Vendor Contract Status', field: 'vendorContractStatus'},
		{headerName: 'Client Contract Name', field: 'clientContractName'},
		{headerName: 'Client Contract Date', field: 'clientContractDate'},
		{headerName: 'Client Contract Status', field: 'clientContractStatus'}
	], []);

	return <GridWindow
		open={true}
		title='Budget Manager'
		className='budget-manager-window'
		iconCls='common-icon-budget-manager'
		appType='BudgetManager'
		appInfo={server}
		iFrameId='budgetManagerIframe'
		zIndex={100}
		// onClose={handleClose}
		// manualLIDOpen={manualLIDOpen}
		moduleColor='#00e5b0'
		inlineModule={isInline}
		isFullView={isFullView}
		maxByDefault={isMaxByDefault}
		showBrena={server?.showBrena}
		onIconClick={handleIconClick}
		presenceProps={{
			presenceId: 'budgetmanager-presence',
			showBrena: false,
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		}}
		tools={{
			closable: true,
			resizable: true,
			openInNewTab: true
		}}
		PaperProps={{
			sx: {
				width: '95%',
				height: '90%'
			}
		}}
		// toast={toastMessage}
		content={{
			// headContent: isChangeEventGC() ? {regularContent: <ChangeEventRequestsForm />} : {},
			// detailView: ChangeEventRequestsLID,
			gridContainer: {
				toolbar: {
					// leftItems: <CERLeftButtons />,
					// rightItems: <CERRightButtons />,
					searchComponent: {
						show: true,
						type: 'regular',
						// defaultFilters: defaultFilters,
						// groupOptions: isChangeEventSC() ? scGroupOptions : gcGroupOptions,
						// filterOptions: filterOptions,
						// onGroupChange: onGroupingChange,
						// onSearchChange: onGridSearch,
						// onFilterChange: onFilterChange
					}
				},
				grid: {
					headers: columns,
					data: gridData || [],
					getRowId: (params: any) => params.data?.id,
					grouped: true,
					groupIncludeTotalFooter: false,
					rowSelection: 'single',
					groupIncludeFooter: false,
					// onRowDoubleClicked:onRowDoubleClick,
					// rowSelected: (e: any) => rowSelected(e),
					// groupDisplayType: 'groupRows',
					nowRowsMsg: `<div>Create new budget line item from above</div>`,
					// groupRowRendererParams: groupRowRendererParams,
				}
			}
		}}
	/>;
};

export default BudgetManagerWindowNew;