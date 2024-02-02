import * as React from 'react';
import { IconButton, Stack } from '@mui/material';
import {
	KeyboardArrowLeft,
	KeyboardArrowRight
} from '@mui/icons-material';
import {
	DynamicPage,
	DynamicPageHeader
} from '@ui5/webcomponents-react';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { fetchSettings, fetchSettingsCostCodeAndType, fetchdefaultdrodown, fetchSecurity, fetchCostCodeDropdownList, fetchDivisionCostCodeFilterList, fetchCostTypeDropdownList } from '../operations/settingsSlice';
import { fetchConnectors, fetchGridData } from '../operations/gridSlice';

import { fetchVendorData } from '../operations/vendorInfoSlice';
import { isLocalhost, postMessage } from 'app/utils';
import { fetchRollupTaskData, setOpenBudgetTransferForm, setOpenCostForm } from 'features/budgetmanager/operations/rightPanelSlice';
import {
	showRightPannel, setRightPannel, setLineItemDescription, setShowSettingPopup2, getShowSettingPopup2, getTemplateForBudget
} from '../operations/tableColumnsSlice';

import LineItemDetails from '../lineitemdetails/LineItemDetails';
import HeaderPage from '../headerpage/HeaderPage';
import TableGrid from '../aggrid/AgGrid';
import TableGridDemo from '../aggrid/AgGridNew';
import BudgetManagerToolbar from '../BudgetManagerToolbar';
import './HeaderPinning.scss';
import { fetchUserImage, setSelectedRowData, setSelectedRowIndex } from '../operations/rightPanelSlice';
import { getServer, getAppWindowMaximize, getFullView, getCostCodeDivisionList, setCostCodeDivisionList, setCostTypeList } from 'app/common/appInfoSlice';
import { updateBudgetLineItem } from '../operations/gridAPI';
import Toast from 'components/toast/Toast';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import { AddDescription } from './AddDescription';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import BMSettings from '../settings/BMSettings';
import { useTranslation } from 'react-i18next';
import { fetchViewBuilderList } from '../operations/viewBuilderSlice';
import { settingcostcodetypeData } from 'data/SettingsCosttypeData';
import { getPhaseDropdownValues, getSBSGridList } from 'features/safety/sbsmanager/operations/sbsManagerSlice';

const HeaderPinning = (props: any) => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const { demo, gridData, originalGridApiData } = useAppSelector((state: any) => state.gridData);
	const { selectedRow, selectedRowIndexData, userImage } = useAppSelector(state => state.rightPanel);
	const { lineItemDescription } = useAppSelector(state => state.tableColumns);
	const totalGridRows = gridData.length;
	const [rowIndex, setRowIndex] = React.useState<number>(0);
	const [toastMessage, setToastMessage] = React.useState<string>('');
	const [showLeftButton, setShowLeftButton] = React.useState<boolean>(false);
	const [showRightButton, setShowRightButton] = React.useState<boolean>(false);
	const [api, setApi] = React.useState<any>('');
	const rightPannel = useAppSelector(showRightPannel);
	const appInfo = useAppSelector(getServer);
	const costCodeDivisionOpts = useAppSelector(getCostCodeDivisionList);
	const [budgetDetailsContent, setBudgetDetailsContent] = React.useState<any>('');
	const [showToast, setShowToast] = React.useState<any>({ displayToast: false, message: '' });
	const [lineItems, setLineItems] = React.useState(gridData);
	const [updateData, setUpdateData] = React.useState<any>(null);
	const [selectedLng, setSelectedLng] = React.useState<any>(i18n.language || 'en');
	const openSettingPopup2 = useAppSelector(getShowSettingPopup2);
	const budgetManagerMaximized = useAppSelector(getAppWindowMaximize);
	const isFullView = useAppSelector(getFullView);
	const { settingsData, CostCodeAndTypeData, openAlert, divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData } = useAppSelector(state => state.settings);
	const [localhost] = React.useState(isLocalhost);
	const realtimeRef = React.useRef(false);
	const dataSetRef = React.useRef(false);
	const { isBudgetLocked } = useAppSelector(state => state.tableColumns);

	const languageList = [
		{ label: 'English', value: 'en' },
		{ label: 'French', value: 'fr' },
		{ label: 'Spanish', value: 'es' }
	];

	React.useEffect(() => {
		dispatch(fetchGridData(appInfo));
		dispatch(fetchVendorData(appInfo));
		dispatch(fetchSettings(appInfo));
		dispatch(fetchSettingsCostCodeAndType(appInfo));
		dispatch(fetchdefaultdrodown(appInfo));
		dispatch(fetchSecurity(appInfo));
		dispatch(fetchViewBuilderList(appInfo));
		dispatch(fetchConnectors(appInfo));
		dispatch(getPhaseDropdownValues());
		dispatch(getSBSGridList());
		dispatch(fetchRollupTaskData({ 'appInfo': appInfo }));
		// dispatch(getTemplateForBudget(appInfo))	;
		return () => { };
	}, []);

	const getDivisionCostCodeValues = (data: any, id: any) => {
		if (data.length > 0) {
			const values = data.map((obj: any) => {
				if (obj.id === id) {
					return obj.listValues;
				}
			});

			return values.filter((element: any) => {
				return element !== undefined;
			});
		}
	};

	React.useEffect(() => {
		// console.log('settings in header pinning', CostCodeAndTypeData)
		dispatch(fetchDivisionCostCodeFilterList({ appInfo: appInfo, costCodeName: settingsData.divisionCostCode }));
		dispatch(fetchCostCodeDropdownList({ appInfo: appInfo, name: settingsData.divisionCostCode }));
		// dispatch(fetchCostTypeDropdownList({appInfo: appInfo, name: settingsData.divisionCostCode}));
		// console.log("List divisionCostCodeFilterData",divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData)

		const ListData = localhost ? settingcostcodetypeData.values : CostCodeAndTypeData.values;
		// console.log('ListData', divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData)
		const divisionCostCodeListValues = getDivisionCostCodeValues(ListData, settingsData.divisionCostCodeId);
		const costTypeListValues = getDivisionCostCodeValues(ListData, settingsData.costTypeId);
		// console.log('divisionCostCodeListValues', divisionCostCodeListValues, costTypeListValues)
		divisionCostCodeListValues?.length > 0 && dispatch(setCostCodeDivisionList(divisionCostCodeListValues[0]));
		costTypeListValues?.length > 0 && dispatch(setCostTypeList(costTypeListValues[0]));

	}, [settingsData, CostCodeAndTypeData]);

	const handleOnChange = (lng: any) => {
		i18n.changeLanguage(lng);
		setSelectedLng(lng);
	};

	React.useEffect(() => {
		const data = dispatch(fetchUserImage({ 'appInfo': appInfo, 'userId': selectedRow.modifiedBy ? selectedRow.modifiedBy.globalId : '' }));
		dispatch(setLineItemDescription(selectedRow.description));
	}, [selectedRow]);

	React.useEffect(() => {
		if (rightPannel && selectedRow?.id === updateData?.id) {
			dispatch(setSelectedRowData(updateData));
		}
	}, [updateData]);

	React.useEffect(() => {
		const message = `${selectedRow.division} ${selectedRowIndexData.childIndex + 1} of ${getLengthOfGroup(selectedRow.division)}`;
		setToastMessage(message);
		setShowLeftButton(selectedRowIndexData.firstChild === true && selectedRowIndexData.parent.firstChild === true ? true : false);
		setShowRightButton(selectedRowIndexData.lastChild === true && selectedRowIndexData.parent.lastChild === true ? true : false);
	}, [gridData, selectedRowIndexData, selectedRow, originalGridApiData]);

	// React.useEffect(() => {
	// 	if (realtimeRef.current) return;
	// 	realtimeRef.current = true;
	// 	setTimeout(function () {
	// 		realtimeManager();
	// 	}, 3000);
	// }, []);

	const getLengthOfGroup = (groupName: string) => {
		// console.log("getLengthOfGroup", groupName)
		const data = originalGridApiData.filter((row: any) => row?.division === groupName);
		return data.length;
	};

	const handleRef = (ref: any) => {
		setApi(ref.current.api);
	};

	const handleLeftArrow = () => {
		let recordFound: boolean = false;
		let isGrpExpanded: boolean = false;
		api.forEachNode(function (node: any) {
			if (selectedRowIndexData.rowIndex - 1 === node.rowIndex && node.data !== undefined) {
				node.setSelected(true, true);
				dispatch(setSelectedRowData(node.data));
				dispatch(setSelectedRowIndex(node));
				recordFound = true;
			}
		});
		api.forEachNode(function (node: any) {
			if (recordFound === false && selectedRowIndexData.rowIndex - 2 === node.rowIndex) {
				node.setExpanded(true);
				isGrpExpanded = true;
				setTimeout(() => {
					const rowNode = api.getDisplayedRowAtIndex(selectedRowIndexData.rowIndex - 3);
					rowNode.setSelected(true, true);
					dispatch(setSelectedRowData(rowNode.data));
					dispatch(setSelectedRowIndex(rowNode));
				}, 1000);
			}
		});
		if (recordFound === false && isGrpExpanded === false) {
			const rowNode = api.getDisplayedRowAtIndex(selectedRowIndexData.rowIndex - 3);
			rowNode.setSelected(true, true);
			dispatch(setSelectedRowData(rowNode.data));
			dispatch(setSelectedRowIndex(rowNode));

		}
		dispatch(setOpenBudgetTransferForm(false));
		dispatch(setOpenCostForm(false));
	};

	const handleRightArrow = () => {
		let recordFound: boolean = false;
		api.forEachNode(function (node: any) {
			if (selectedRowIndexData.rowIndex + 1 === node.rowIndex) {
				node.setSelected(true, true);
				dispatch(setSelectedRowData(node.data));
				dispatch(setSelectedRowIndex(node));
				recordFound = true;
			}
		});
		api.forEachNode(function (node: any) {
			if (recordFound === false && selectedRowIndexData.rowIndex + 2 === node.rowIndex) {
				node.setExpanded(true);
				setTimeout(() => {
					const rowNode = api.getDisplayedRowAtIndex(selectedRowIndexData.rowIndex + 3);
					rowNode.setSelected(true, true);
					dispatch(setSelectedRowData(rowNode.data));
					dispatch(setSelectedRowIndex(rowNode));
				}, 1000);
			}
		});
		dispatch(setOpenBudgetTransferForm(false));
		dispatch(setOpenCostForm(false));
	};

	const handleOnLineItemAdded = (value: any) => {
		// console.log('ddddddddddddd', value);
		setShowToast({ ...value });
	};

	const budgetdetails = (data: any) => {
		setBudgetDetailsContent(data);
	};

	const submitUpdate = () => {
		const data = {
			division: budgetDetailsContent?.division,
			costCode: budgetDetailsContent?.costCode,
			costType: budgetDetailsContent?.costType,
			estimatedStart: convertDateToDisplayFormat(budgetDetailsContent?.estimatedStart),
			estimatedEnd: convertDateToDisplayFormat(budgetDetailsContent?.estimatedEnd),
			curve: budgetDetailsContent.curve,
			originalAmount: budgetDetailsContent?.originalAmount,
			Vendors: budgetDetailsContent?.Vendors,
			status: 0,
			unitCost: budgetDetailsContent?.unitCost,
			unitOfMeasure: budgetDetailsContent?.unitOfMeasure,
			unitQuantity: budgetDetailsContent?.unitQuantity,
		};
		updateBudgetLineItem(appInfo, budgetDetailsContent.id, data, (response: any) => {
			// dispatch(fetchGridData(appInfo));
		});
	};

	// const addRealtimeListener = (projectUid: any, rtdManager: any) => {
	// 	if (rtdManager && rtdManager.realTimeDocument && rtdManager.realTimeDocument._rtDocument) {
	// 		let pathObject = rtdManager.realTimeDocument._rtDocument.at && rtdManager.realTimeDocument._rtDocument.at(`budgetManagerLineItems@${projectUid}`);
	// 		// console.log('pathObject', pathObject);
	// 		pathObject && pathObject.on('change', '**', function (path: any, event: any) {
	// 			let txnObject, liveData = event.value;
	// 			if (_.has(liveData, 'update')) {
	// 				const liveItem = liveData?.update;
	// 				if (_.has(liveData, 'transactions')) {
	// 					dispatch(setTransactionData(liveData?.transactions));
	// 				}
	// 				setUpdateData(liveItem);
	// 				if (!liveItem.length) txnObject = { update: [liveItem] };
	// 			} else if (_.has(liveData, 'add')) {
	// 				const liveItem = liveData?.add;
	// 				console.log('elseif liveaddliveItem', liveItem);
	// 				if (!liveItem.length) txnObject = { add: [liveItem] }
	// 			} else if (_.has(liveData, 'delete')) {
	// 				const liveItem = liveData?.delete;
	// 				txnObject = { remove: liveItem }
	// 			}
	// 			if (txnObject) {
	// 				// console.log('txnObject', txnObject)
	// 				dispatch(setLiveData(txnObject));
	// 			}
	// 			console.log('Realtime change noticed.', event.value);
	// 		});
	// 		return;
	// 	}

	// 	setTimeout(() => {
	// 		addRealtimeListener(projectUid, rtdManager);
	// 	}, 1000);
	// };

	// const realtimeManager = () => {
	// 	let config = {
	// 		projectUid: appInfo.uniqueId,
	// 		documentId: `${appInfo.urlAppZoneID}_${appInfo.uniqueId}`,
	// 		baseUrl: appInfo.hostUrl,
	// 		appzoneRTCServerUrl: appInfo.appzoneRTCServerUrl
	// 	};
	// 	if (config.documentId) {
	// 		try {
	// 			let rtdManager = new RTDataManager(config);
	// 			document.addEventListener('setlivetransactions', function (event: any) {
	// 				if (event.detail && rtdManager && rtdManager.updateRealTimeModel) {
	// 					rtdManager.updateRealTimeModel(`budgetManagerLineItems@${config.projectUid}`, `budgetManagerLineItems@${config.projectUid}`, event.detail, 2);
	// 				}
	// 			});

	// 			setTimeout(function () {
	// 				addRealtimeListener(config.projectUid, rtdManager);
	// 			}, 1000);
	// 		} catch (e) {
	// 			console.log('Failed to create rtDocument', e);
	// 		}
	// 	}
	// };
	return (
		<div className='header-pinning'>
			<DynamicPage className='dynamic-page-root'
				headerTitle={<div className='' style={{ background: '#fff' }}></div>}
				showHideHeaderButton={true}
				onToggleHeaderContent={function noRefCheck() { }}
				headerContent={
					<DynamicPageHeader>
						<div className='title-description-container'>
							<span className='title-text'>{t('BM_create_new_budget_line_item')}</span>
							<AddDescription value={rightPannel ? '' : lineItemDescription} disabled={isBudgetLocked} />
							<p className='right-spacer'></p>
							{isBudgetLocked && <div className='bubble-box budget-locked-box'>
								<div className='icon common-icon-info-white'></div>
								<div className='text'>
									<div>Budget is locked and now is in Read Only Mode.</div>
									<div>To Edit, you may unlock the budget.</div>
								</div>
							</div>}
							{/* <MuiGrid item xl={1.5} lg={1.5} md={1.5} sm={6} xs={6}>
								<SmartDropDown
									LeftIcon={<div className='budget-Curve' style={{ fontSize: '1.25rem' }}></div>}
									options={languageList}
									dropDownLabel='Language selection'
									isSearchField={false}
									outSideOfGrid={true}
									isFullWidth
									selectedValue={selectedLng}
									handleChange={(value: any) => handleOnChange(value)}
								/>
							</MuiGrid> */}
						</div>
						<HeaderPage onLineItemAdded={(value: any) => handleOnLineItemAdded(value)} />
					</DynamicPageHeader>
				}
			>
				<BudgetManagerToolbar />
				{props?.demo ? <TableGridDemo onRefChange={(ref: any) => handleRef(ref)} /> : <TableGrid onRefChange={(ref: any) => handleRef(ref)} />}
				{
					showToast.displayToast ?
						<Toast message={showToast.message} interval={3000} />
						: <></>
				}
			</DynamicPage>


			{rightPannel && (
				<SUIDrawer
					PaperProps={{ style: { position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a' } }}
					anchor='right'
					variant='permanent'
					elevation={8}
					open={false}
				>
					<Stack className='rightpanel-content-section'>
						<LineItemDetails
							image={userImage}
							budgetdetailsdata={(data) => budgetdetails(data)}
							close={() => {
								dispatch(setRightPannel(false));
								dispatch(setLineItemDescription(""));
								postMessage({
									event: "help",
									body: { iframeId: "budgetManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BudgetManager", isFromHelpIcon: false }
								});
							}}
						/>
					</Stack>
					<Stack direction='row' className='rightpanel-footer-section'>
						<IQTooltip title='Previous Record' placement={'top'} arrow>
							<IconButton
								aria-label='Fullscreen control'
								className='footer-icons'
								size='small'
								disabled={showLeftButton}
								onClick={handleLeftArrow}
							>
								<KeyboardArrowLeft />
							</IconButton>
						</IQTooltip>
						<IQTooltip title='Next Record' placement={'top'} arrow>
							<IconButton
								aria-label='Close Right Pane'
								className='footer-icons'
								size='small'
								disabled={showRightButton}
								onClick={handleRightArrow}
							>
								<KeyboardArrowRight />
							</IconButton>
						</IQTooltip>
						<div className='footer-lineitem-counter'>
							<span className='toastmessage'>{toastMessage}</span>
						</div>
					</Stack>
				</SUIDrawer>
			)}
			{openSettingPopup2 && (
				<SUIDrawer
					anchor='right'
					variant='permanent'
					elevation={2}
					PaperProps={{
						style: {
							position: 'absolute',
							top: isFullView ? '56px' : '105px',
							bottom: '0px',
							width: '25em',
							height: 'inherit',
							overflow: 'auto',
						}

					}}
					sx={{
						'& .MuiPaper-root': {
							border: '1px solid rgba(0, 0, 0, 0.12) !important',
							boxShadow: '-6px 0px 10px -10px'
						}
					}}
				>
					<BMSettings
						onClose={() => dispatch(setShowSettingPopup2(false))}
					/>
				</SUIDrawer>
			)}
		</div>
	);
};

export default HeaderPinning;