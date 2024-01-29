import { useEffect, useState } from 'react';
import { Stack, IconButton, Button } from '@mui/material';
import { EastOutlined, KeyboardArrowLeft, KeyboardArrowRight, Gavel } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import './BidResponseManagerToolbar.scss';
import { getServer } from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import {
	setShowLineItemDetails, getShowLineItemDetails, setToastMessage, setSelectedNode, setSelectedRecord, fetchBidResponseDetailsData
} from 'features/bidresponsemanager/stores/BidResponseManagerSlice';
import BidResponsePackageLineItem from '../bidResponsepackageDetails/BidResponsePackageLineItem';
import { fetchBidResponseGridData, setActiveMainGridFilters, setActiveMainGridGroupKey, setMainGridSearchText, setSelectedRows } from '../stores/gridSlice';
import IQButton from 'components/iqbutton/IQButton';
import { patchDeclineAndIntendToBid } from '../stores/BidResponseManagerAPI';
import { setSubmitResponseClick } from '../stores/BidResponseSlice';
import { UpdateBidResponse } from '../stores/BidResponseAPI';
import SUIAlert from 'sui-components/Alert/Alert';
import { deleteBidResponcePackages } from '../stores/gridAPI';
import { ResponseStatusFilterOptions } from 'utilities/bidResponse/enums';
import React from 'react';
import { statusFilterOptions } from 'utilities/bid/enums';
import _ from "lodash";
import { postMessage } from 'app/utils';
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';

const BidResponseManagerToolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const showRightPanel = useAppSelector(getShowLineItemDetails);
	const [api, setApi] = useState<any>(props?.gridRef?.current?.api);
	const { selectedRecord, selectedTabName, selectedNode } = useAppSelector((state) => state.bidResponseManager);
	const { bidResponseData, selectedRows, activeMainGridDefaultFilters, activeMainGridFilters } = useAppSelector((state) => state.bidResponseManagerGrid);
	const { submitWait } = useAppSelector((state) => state.bidResponse);

	const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
	const [showRightButton, setShowRightButton] = useState<boolean>(false);
	const [disablePrint, setDisablePrint] = useState<boolean>(true);
	const [disableDelete, setDisableDelete] = useState<boolean>(true);
	const [declineBid, setDeclineBid] = useState<any>({ show: true, disable: false });
	const [submitBid, setSubmitBid] = useState<any>({ show: false, disable: true });
	const [alert, setAlert] = useState<any>({
		open: false,
		contentText: '',
		title: '',
		method: ''
	});
	const groupOptions = [
		{ text: "Bid Response Status", value: "responseStatus" },
		{ text: "Bid Package Status", value: "packageStatus" },
		{ text: "Intend To Bid", value: "intendToBid" },
		{ text: "Bid Process", value: "processType" },
	];

	const filterOptions = [
		{
			text: "Bid Response Status",
			value: "responseStatus",
			key: "responseStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: ResponseStatusFilterOptions,
			},
		},
		{
			text: "Bid Package Status",
			value: "bidpackageStatus",
			key: "bidpackageStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [statusFilterOptions[3], statusFilterOptions[4], statusFilterOptions[5], statusFilterOptions[6], statusFilterOptions[7], statusFilterOptions[8]]
			},
		},
		{
			text: "Intend To Bid",
			value: "intendToBid",
			key: "intendToBid",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Undecided', id: '0', key: '0', value: '0', },
					{ text: 'Yes', id: '2', key: '2', value: '2', },
					{ text: 'No', id: '1', key: '1', value: '1', },
					{ text: 'Expired', id: '3', key: '3', value: '3', },
				],
			},
		},
		{
			text: "Bid Process",
			value: "processType",
			key: "processType",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Open', id: '0', key: '0', value: '0', },
					{ text: 'Closed', id: '1', key: '1', value: '1', },
				],
			},
		},
	];
	const [filters, setFilters] = React.useState<any>(filterOptions);

	useEffect(() => {
		dispatch(fetchBidResponseGridData(appInfo));
	}, []);

	useEffect(() => {
		setApi(props?.gridRef?.current?.api);
	}, [props?.gridRef]);

	useEffect(() => {
		setShowLeftButton(selectedNode?.firstChild ? true : false);
		setShowRightButton(selectedNode?.lastChild ? true : false);
	}, [bidResponseData, selectedNode]);

	useEffect(() => {
		setDeclineBid({ ...declineBid, show: selectedRecord?.responseStatus == 0 && selectedRecord?.packageStatus == 3 ? true : false });
		setSubmitBid({ ...submitBid, show: [2, 3].includes(selectedRecord?.responseStatus) && selectedTabName == 'bidResponse' ? true : false, disable: selectedRecord?.responseStatus == 3 || selectedRows[0]?.responseStatus == 3 ? false : true });
		if (selectedRows.length > 0) { setDisableDelete(false); setDisablePrint(false); }
		else { setDisableDelete(true); setDisablePrint(true); }
	}, [bidResponseData, selectedRecord, selectedTabName, selectedRows]);

	const onRightPanelClose = () => {
		dispatch(setShowLineItemDetails(false));
		postMessage({
			event: "help",
			body: { iframeId: "bidResponseManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BidResponseManager", isFromHelpIcon: false }
		});
	};

	const handleDeclineAndIntendToBid = (payload: any) => {
		patchDeclineAndIntendToBid(appInfo, selectedRecord?.id, selectedRecord?.bidderUID, payload).then(() => {
			dispatch(fetchBidResponseGridData(appInfo)).then((response: any) => {
				const record = response?.payload?.find((item: any) => item?.id === selectedRecord?.id);
				dispatch(setSelectedRecord(record));
			});
			dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: selectedRecord?.id }));
		});
	};

	const updateBidResponse = (id: any, source: string) => {
		UpdateBidResponse(appInfo, id, { status: 5 }).then(() => {
			dispatch(fetchBidResponseGridData(appInfo)).then((response: any) => {
				const record = response?.payload?.find((item: any) => item?.id === selectedRecord?.id);
				dispatch(setSelectedRecord(record));
			});
			dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: selectedRecord?.id }));
		});
	};

	const handleSubmitBidFormRightPanel = (e: any) => {
		// if(!submitWait) {
		updateBidResponse(selectedRecord?.bidderUID, 'rightPanel');
		dispatch(setSubmitResponseClick(true));
		// }
	};

	const handleSubmitBidFormToolbar = () => {
		updateBidResponse(selectedRows[0]?.bidderUID, 'toolbar');
		dispatch(setToastMessage({ displayToast: true, message: 'Bid Submitted Successfully' }));
	};

	const handleDelete = () => {
		setAlert({
			open: true,
			contentText: 'Are you sure want to continue?',
			title: 'Confirmation',
			method: 'Delete'
		});
	};

	// const handleOnSearchChange = (searchText: string) => {
	// 	if (aliasOriginalGridData.length && searchText !== ' ') {
	// 		const firstResult = aliasOriginalGridData.filter((obj: any) => {
	// 			return JSON.stringify(obj).toLowerCase().includes(searchText.toLowerCase());
	// 		});
	// 		let result = originalGridData.filter((o1: any) => firstResult.some((o2: any) => o1.id === o2.id));
	// 		dispatch(setGridData(result));
	// 	} else {
	// 		dispatch(setGridData(originalGridData));
	// 	}
	// };

	const handleLeftArrow = () => {
		api.forEachNode(function (node: any) {
			if (selectedNode?.rowIndex - 1 === node.rowIndex && node?.data !== undefined) {
				node.setSelected(true, true);
				dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: node?.data?.id }));
				dispatch(setSelectedNode(node));
				dispatch(setSelectedRecord(node?.data));
			}
		});
	};
	const handleRightArrow = () => {
		api.forEachNode(function (node: any) {
			if (selectedNode?.rowIndex + 1 === node?.rowIndex) {
				node.setSelected(true, true);
				dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: node?.data?.id }));
				dispatch(setSelectedNode(node));
				dispatch(setSelectedRecord(node?.data));
			}
		});
	};

	const handleListChanges = (val: string, method: any) => {
		if (val == 'yes') {
			if (method == 'Delete') {
				deleteBidResponcePackages(appInfo, selectedRows[0]['bidderUID']).then(() => {
					dispatch(fetchBidResponseGridData(appInfo));
					dispatch(setToastMessage({ displayToast: true, message: `Selected Record Deleted Successfully` }));
					setDisableDelete(true);
				});
			}
		}
		setAlert({ open: false });
	};
	const PrintOnclick = (event: any) => {
		postMessage({
			event: 'openitemlevelreport',
			body: {
				targetLocation: {
					x: event.pageX,
					y: event.pageY
				}
			}
		});
	};
	return (
		<Stack direction='row' className='toolbar-root-container-bidmanager bid-response'>
			<div key='toolbar-buttons' className='toolbar-item-wrapper options-wrapper bid-response-toolbar'>
				<>
					<IQTooltip title='Refresh' placement='bottom'>
						<IconButton
							aria-label='Refresh Bid Response Manager List'
							onClick={() => {
								dispatch(fetchBidResponseGridData(appInfo));
								dispatch(setSelectedRows([]));
								// dispatch(setActiveMainGridFilters({}))
								// dispatch(setActiveMainGridGroupKey(null))
								// dispatch(setActiveMainGridDefaultFilters({}))
							}}
						>
							<span className="common-icon-refresh"></span>
						</IconButton>
					</IQTooltip>

					{/* <IQTooltip title='Export CSV' placement='bottom'>
						<IconButton>
							<Box component='img' alt='CSV' src={CSV} className='image' width={22} height={22} />
						</IconButton>
					</IQTooltip> */}
					<IQTooltip title='Print' placement='bottom'>
						<IconButton
							aria-label='Print Bid Line Item'
							disabled={disablePrint}
							onClick={(e: any) => { PrintOnclick(e) }}
						>
							<span className="common-icon-Print1"></span>
						</IconButton>
					</IQTooltip>
					<IQTooltip title='Delete' placement='bottom'>
						<IconButton
							aria-label='Delete Bid Line Item'
							disabled={disableDelete}
							onClick={handleDelete}
						>
							<span className="common-icon-delete"></span>
						</IconButton>
					</IQTooltip>
					<Button variant="outlined" color={submitBid?.disable ? 'inherit' : 'success'} onClick={handleSubmitBidFormToolbar} startIcon={<Gavel />} disabled={submitBid?.disable}>
						Submit Bid
					</Button>
				</>
			</div>
			<div key='toolbar-search' className='toolbar-item-wrapper search-wrapper bid-response-search'>
				<IQSearch
					placeholder={'Search'}
					groups={groupOptions}
					filters={filters}
					onSearchChange={(text: string) => dispatch(setMainGridSearchText(text))}
					filterHeader=''
					defaultFilters={activeMainGridDefaultFilters}
					// onSettingsChange={handleSettings}
					// onViewFilterChange={handleViewFilter}
					onGroupChange={(selectedVal: any) => { dispatch(setActiveMainGridGroupKey(selectedVal)); }}
					// onSearchChange={searchHandler}
					onFilterChange={(filters: any) => {
						if (filters) {
							let filterObj = filters;
							Object.keys(filterObj).filter((item) => {
								if (filterObj[item]?.length === 0) {
									delete filterObj[item];
								};
							});
							if (!_.isEqual(activeMainGridFilters, filterObj)) {
								dispatch(setActiveMainGridFilters(filterObj));
							};
						};
					}}
				/>
			</div>
			<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
				{<ReportAndAnalyticsToggle />}
			</div>
			{showRightPanel && (
				<SUIDrawer
					PaperProps={{ style: { position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a' } }}
					anchor='right'
					variant='permanent'
					elevation={8}
					open={false}
				>
					<Stack className='rightpanel-content-section'>
						<BidResponsePackageLineItem close={onRightPanelClose} />
					</Stack>
					<Stack direction='row' className='rightpanel-footer' >
						{
							<Stack direction='row' spacing={3}>
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
							</Stack>
						}
						{
							declineBid?.show && selectedRecord?.hasIntendToBidCountdown &&
							<Stack direction='row' spacing={2}>
								<IQButton
									disabled={declineBid?.disable}
									className='btn-decline-bid'
									// color='secondary'
									onClick={() => handleDeclineAndIntendToBid({ intendToBid: 1 })}>
									DECLINE BID
								</IQButton>
								<IQButton
									disabled={declineBid?.disable}
									className='btn-acknowledge-bid'
									color='warning'
									startIcon={<EastOutlined />}
									onClick={() => handleDeclineAndIntendToBid({ intendToBid: 2 })}>
									I ACKNOWLEDGE MY INTENT TO BID
								</IQButton>
							</Stack>
						}
						{
							submitBid?.show &&
							<IQButton
								disabled={submitBid?.disable}
								className='btn-post-bid'
								color='green'
								onClick={handleSubmitBidFormRightPanel}
								startIcon={<Gavel />}>
								Submit Bid Response
							</IQButton>
						}
					</Stack>
				</SUIDrawer>
			)}
			<SUIAlert
				open={alert.open}
				contentText={<span>{alert.contentText}</span>}
				title={alert.title}
				onAction={(e: any, type: string) => handleListChanges(type, alert.method)}
			/>
		</Stack>
	);
};

export default BidResponseManagerToolbar;