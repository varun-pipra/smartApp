import React, { useRef, useEffect, memo, useState, useMemo } from "react";
import SUILineItem from "sui-components/LineItem/LineItem";
import IQButton from "components/iqbutton/IQButton";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { Checkbox, FormControl, IconButton, TextField, Button } from "@mui/material";
//import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import "./SafetyViolation.scss"
import SUISafetyViolationTooltip from "./SafetyViolationTooltip";
import SafetyViolationDialog from "./SafetyViolationDialog";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setTriggerSafetyViolationApis, setViolationActionsFired } from "features/projectsettings/projectteam/operations/ptDataSlice";
import { getSafetyViolation, updatewarningstatus } from "features/projectsettings/projectteam/operations/ptDataAPI";
import { getServer } from "app/common/appInfoSlice";
import { getDate, formatDate } from "utilities/datetime/DateTimeUtils";
import { getTime } from "utilities/commonFunctions";
import Purchaseimgae from "resources/images/Purchase-Worker-Historical-Safety-Violations.png";
import { blockUser, deleteSafetyViolation, expungeSafetyViolation, unBlockUser } from "features/projectsettings/projectteam/operations/ptGridAPI";
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import moment from "moment";
import CustomTooltip from "features/budgetmanager/aggrid/customtooltip/CustomToolTip";
import { postMessage } from "app/utils";

const SafetyViolation = (props: any) => {
	const [disableReinstate, setDisableReinstate] = React.useState<any>(false);
	const ExpungeCustomTooltip = (props?: any) => {
		const { params, ...others } = props;
		return (
			<div className='safetyViolation_tooltip_content' style={{ margin: '0.5em' }}>
				{`Violation record Expunged on ${formatDate(params?.data?.expungedOn)?.replace(', ', ' ')}, by ${params?.data?.expungedBy?.displayName}`}
			</div>
		)
	};
	const headers = [
		{
			headerName: "App Name",
			field: "smartItemName",
			menuTabs: [],
			minWidth: 220,
			pinned: "left",
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left"
			},
			cellRenderer: (params: any) => {
				return (
					<>
						{params?.data?.isExpunged && (
							<DynamicTooltip title={<ExpungeCustomTooltip params={params} />}
								placement="top"
								sx={{
									"& .MuiTooltip-tooltip": {
										background: '#333333'
									}
								}}
							>
								<span className='common-icon-expunge'></span>
							</DynamicTooltip>
						)}
						{params?.data?.smartItem?.smartApp?.icon && (
							<img src={params?.data?.smartItem?.smartApp?.icon} />
						)}
						{params?.data?.smartItem?.name}
					</>
				);
			},
		},
		{
			headerName: "Violation Category",
			menuTabs: [],
			field: "categotyName",
			minWidth: 195,
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params?.data?.category.name && params?.data?.category.name?.length > 20 ? params?.data?.category.name : null;
			},
			cellRenderer: (params: any) => {
				return (
					<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
						{params?.data?.category.name}
					</span>
				)
			}
		},
		{
			headerName: "Violation Type",
			menuTabs: [],
			field: "typeName",
			minWidth: 155,
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params?.data?.type?.name && params?.data?.type?.name.length > 15 ? params?.data?.type?.name : null;
			},
			cellRenderer: (params: any) => {
				return (
					<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
						{params?.data?.type.name}
					</span>
				)
			}
		},
		{
			headerName: "Date of Violation",
			menuTabs: [],
			field: "violationDate",
			minWidth: 176,
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
			cellRenderer: (params: any) => {
				return (
					<>
						{getDate(params.data.violationDate)}
					</>
				);
			},
		},
		{
			headerName: "Reason",
			menuTabs: [],
			field: "reason",
			minWidth: 278,
			flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params?.data?.reason && params?.data?.reason?.length > 30 ? params?.data?.reason : null;
			},
			cellRenderer: (params: any) => {
				return (
					<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
						{params?.data?.reason}
					</span>
				)
			}
		},
		// {
		// 	headerName: "Updated By",
		// 	menuTabs: [],
		// 	field: "updatedBy",
		// 	minWidth: 238,
		// 	flex: 2,
		// 	cellStyle: {
		// 		display: "flex",
		// 		alignItems: "left",
		// 	},
		// },
		{
			headerName: "Created By",
			menuTabs: [],
			field: "createdBy",
			minWidth: 250,
			//	flex: 2,
			cellStyle: {
				display: "flex",
				alignItems: "left",
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				let a: any = moment.utc(params?.data?.createdOn).format('MM/DD/YYYY hh:mm A') + " " + (params?.data?.createdBy?.displayName ?? '');
				return a?.length > 25 ? a : null;
			},
			cellRenderer: (params: any) => {
				return (
					<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
						{getUserLog(params?.data?.createdOn, params?.data?.createdBy?.displayName)}
					</span>
				)
			}
		},
	];
	const { userdata, activeTab, status, warningMessage, userViolationActivity, showWarningMessage = () => { }, ...others } = props;
	const isCompMountedOnce = useRef(false);
	const { safetyViolationActions } = useAppSelector((state: any) => state?.projectTeamData);
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [columns, setColumns] = useState(headers);
	const [deleteDisabled, setDeleteDisabled] = useState(true);
	const [expungeDisabled, setExpungeDisabled] = useState(true);
	const [confirmationText, setConfirmationText] = useState("1");
	const [expungeDialog, setExpungeDialog] = useState(false);
	// const [warningMessage, setWarningMessage] = useState(false);
	const [rowsData, setRowData] = useState([]);
	const [selectedRecord, setSelectedRecord] = useState<any>();
	const [localRowData, setLocalRowData] = useState([]);
	const [notAllowedUser, setNotAllowedUser] = useState(false);
	const [allowedUser, setAllowedUser] = useState(false);
	const [historicalViolationDialog, setHistoricalViolationDialog] = useState(false);
	const [checkboxStatus, setCheckboxStatus] = useState(false);
	const [deleteAction, setDeleteAction] = useState(false);
	const selectedViolationRef = useRef<any>(null);
	const styles = {
		contextTextTitle: {
			display: 'flex',
			justifyContent: 'left',
			alignItems: 'center',
			fontSize: '16px',
			fontFamily: "Roboto-Regular",
			paddingLeft: '2px',
		},
		contextTextSubTitle: {
			border: "1px solid #EC605B",
			borderRadius: '4px',
			padding: '16px',
			margin: '10px 0px',
			backgroundColor: "#faf4cb",
			fontFamily: "Roboto-Regular",
			fontSize: '15px',
			gap: '10px',
			display: 'grid',
		}
	};
	const handleFormClose = () => {
		gridListItem();
		getUpdatedData();
	};
	const handleHistoricalViolations = () => {
		// setHistoricalViolationDialog(true);
		let evtData = {
			event: 'projectteam',
			body: {
				evt: 'openviolationreport',
				userUniqueId: userdata?.id
			}
		};
		postMessage(evtData);
	};
	const rowSelected = (e: any) => {
		if (e) {
			setExpungeDisabled((e?.data?.isExpunged ?? false) ? true : false);
		};
		setDeleteDisabled(false);
		setSelectedRecord(e);
	};
	const handleDelete = () => {
		setDeleteAction(true);
	};

	const handleExpungeIconAction = () => {
		setExpungeDialog(true);
	};
	const gridListItem = () => {
		if (userdata?.id && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking) {
			getSafetyViolation(appInfo, { userUniqueId: userdata?.id }, (response: any) => {
				setRowData(response);
				setLocalRowData(response);
			});
		}
	};
	const getUpdatedData = () => {
		dispatch(setTriggerSafetyViolationApis(true));
	};
	const handleReset = () => {
		gridListItem();
		setDeleteDisabled(true);
		setExpungeDisabled(true);
		setSelectedRecord(null);
		getUpdatedData();
	};
	React.useEffect(() => {
		if (userdata) {
			setDeleteDisabled(true);
			setExpungeDisabled(true);
			// && activeTab === 'safetyViolation' && !isCompMountedOnce?.current) {
			// isCompMountedOnce.current = true;
			gridListItem();
		};
	}, [userdata]);
	//}, [userdata, activeTab, isCompMountedOnce]);
	React.useEffect(() => {
		if (userdata && (isCompMountedOnce.current ?? false)) {
			isCompMountedOnce.current = false;
		};
	}, [userdata]);
	React.useEffect(() => {
		const { triggered = false, actionButton } = safetyViolationActions;
		if (triggered) {
			if (actionButton === 'Not Allow') {
				setNotAllowedUser(true);
			} else if (actionButton === 'Allow') {
				setAllowedUser(true);
			};
			dispatch(setViolationActionsFired({ triggered: false, actionButton: '' }));
		}
	}, [safetyViolationActions])
	const getUserLog = (date?: any, displayName?: any,) => {
		return (
			<>
				{moment.utc(date).format('MM/DD/YYYY hh:mm A')}{" "}
				{displayName ?? ''}{" "}
			</>
		)
	};
	const handleOnSearchChange = (searchTxt: any) => {
		if (!searchTxt) {
			setRowData(localRowData);
		} else {
			const lowerSearchTxt: string = searchTxt?.toLowerCase() || "";
			const filteredData = [...localRowData].filter(
				(obj: any) => {
					return JSON.stringify(obj).toLowerCase().includes(lowerSearchTxt);
				}
			);
			setRowData(filteredData);
		};
	};
	const handleExpungeDialogActions = (val: any) => {
		if (val == 'ok') {
			let payload = {
				userUniqueId: userdata?.id,
				violationId: selectedRecord?.data?.id,
				data: {
					"modifiedBy": {
						id: appInfo?.gblConfig?.user?.uniqueId
					}
				}
			};
			expungeSafetyViolation(appInfo, payload, (response: any) => {
				if (response) {
					handleReset();
					setExpungeDialog(false);
				};
			});
		}
		else {
			setExpungeDialog(false);
		}
	};
	const handleAllowedUserActions = (val: any) => {
		if (val == 'ok') {
			let payload = {
				userUniqueId: userdata?.id,
				data: {
					probationDays: confirmationText,
					"modifiedBy": {
						id: appInfo?.gblConfig?.user?.uniqueId
					}
				}
			};
			unBlockUser(appInfo, payload, (response: any) => {
				if (response) {
					handleReset();
					setAllowedUser(false);
				}
			});
		}
		else {
			setAllowedUser(false);
		}
	};
	const handleNotAllowedUserActions = (val: any) => {
		if (val == 'ok') {
			let payload = {
				userUniqueId: userdata?.id,
				data: {
					removeFromAll: checkboxStatus,
					"modifiedBy": {
						id: appInfo?.gblConfig?.user?.uniqueId
					}
				}
			};
			blockUser(appInfo, payload, (response: any) => {
				if (response) {
					handleReset();
					setNotAllowedUser(false);
				}
			});
		}
		else {
			setNotAllowedUser(false);
		}
	};
	const handleHistoricalViolationActions = (val: any) => {
		if (val == 'ok') {

		}
		else {
			setHistoricalViolationDialog(false);
		}
	};
	const handleWaringActions = (e: any, type: any) => {
		var payload: any = {
			userUniqueId: userdata?.id,
			request: {
				isDeny: false,
				modifiedBy: {
					id: appInfo?.gblConfig?.currentUserID
				}
			}
		};
		if (type === 'DenyAndDeactivate') {
			payload.request.isDeny = true;
		}
		updatewarningstatus(appInfo, payload, (response: any) => {
			handleClose();
			handleReset();
		});
		console.log("Waring Actions", e, type)
	};
	const handleClose = () => {
		showWarningMessage(false);
	};
	const handleDeleteActions = (val: any) => {
		if (val == 'ok') {
			let payload = {
				userUniqueId: userdata?.id,
				violationId: selectedRecord?.data?.id,
				data: {
					"modifiedBy": {
						id: appInfo?.gblConfig?.user?.uniqueId
					}
				}
			};
			deleteSafetyViolation(appInfo, payload, (response: any) => {
				handleReset();
				setDeleteAction(false);
			});
		}
		else {
			setDeleteAction(false);
		}
	};
	const [gridApi, setGridApi] = useState<any>();
	const [style, setStyle] = useState({
		height: '100%',
		width: '100%',
	});
	// useEffect(() => {
	// 	if ((gridApi ?? false) && rowsData) {
	// 		gridApi.sizeColumnsToFit();
	// 		gridApi.setDomLayout('autoHeight');
	// 	}
	//   }, [rowsData, gridApi]);

	const VoilationTooltip = useMemo(() => {
		return (
		<SUISafetyViolationTooltip
			userData={userdata}
			onCloseForm={() => handleFormClose()}
			activeTab={activeTab}
		/>
		);
  }, [userdata,activeTab]);
	return (
		<div className="safety-violation-container safety-violation-cotainer-tab">
			<div className="safety-violation-toolbar">
				<div className="safety-violation-left-toolbar">
					{VoilationTooltip}
					<IQTooltip title="Expunge" placement="bottom">
						<IconButton className="safety-viol-expunge-btn" disabled={expungeDisabled} onClick={() => handleExpungeIconAction()}>
							<span className='common-icon-expunge icon-size' />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Delete" placement="bottom">
						<IconButton className="safety-viol-delete-btn" disabled={deleteDisabled} onClick={() => handleDelete()}>
							<span className="common-icon-delete"></span>
						</IconButton>
					</IQTooltip>
				</div>
				<div className="safety-privacy-toolbar">
					{
						userdata?.safetyRegistrationID && (<div className="historical-privacy-violation" onClick={() => handleHistoricalViolations()}>
							<span className="common-icon-warning-medal"></span>
							<span>Historical Violations</span>
						</div>)
					}
					<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
						<IQSearchField
							placeholder={"Search"}
							onSearchChange={(text: string) => handleOnSearchChange(text)}
							filterHeader=""
							showGroups={false}
							showFilter={false}
						/>
					</div>
				</div>
			</div>
			<div style={{ width: "100%", flex: 1 }} className="safety-viol-grid">
				<SUILineItem
					tableref={(val: any) => setGridApi(val)}
					headers={columns}
					data={rowsData ?? []}
					enbleAddBtn={true}
					readOnly={true}
					showAddRow={false}
					rowSelected={rowSelected}
					rowMessageHeading={"No Safety Violation items available yet"}
					nowRowsMsg={"<div>click on + add button to create safety violation item."}
				/>
			</div>
			{(warningMessage && userViolationActivity) && (
				<div className='safety-violation-warning'>
					<div className='warning-content-wrap'>
						<div className='warning-content'>
							<div className='common-icon-exclamation'> </div>
							{(userViolationActivity?.isSameAppzone === true) && (<div className='content-right'><h6>Warning</h6><div className="common-icon-close" onClick={(e: any) => handleClose()}></div>
								<div>Looks like <b>{userdata?.firstName} {userdata?.lastName}</b>, a worker who was just onboarded to this project, is similar to a previous worker
									who may be flagged  by your company as a repeat safety offender on this poject in the name of {userViolationActivity?.userDisplayName}.</div>
								<div>Please investigate and verify if this worker can be allowed to this job site.</div>
							</div>)}
							{(userViolationActivity?.isSameAppzone === false) && (<div className='content-right'><h6>Warning</h6><div className="common-icon-close" onClick={(e: any) => handleClose()}></div>
								<div>It looks like <span className="current-user-name">{userdata?.firstName} {userdata?.lastName}</span>, a worker who was just onboarded to this project, is similar to a previous worker
									(Based on matching Email/ Phone Number or facial profile) who may be flagged  by your company as a repeat safety offender on this poject in the name of
									<span className="previous-user-name"> {userViolationActivity?.userDisplayName}</span> on {userViolationActivity?.projectName}. Please investigate and verify if this worker can be allowed on this job site</div>
							</div>)}
						</div>
						{(userViolationActivity?.isSameAppzone === false) && (<div className='grey-content'>
							Note: Smartapp.com keeps track of previous violation, any violation happened on other jobs are suggested here,
							while this is not a complete representation of their safety compliance, this is confirmation we have on file
							click on historical violations to view report.
						</div>)}
					</div>
					<div className='footer-buttons'>
						<IQButton
							disabled={false}
							className='btn-overrule-changes'
							variant="outlined"
							onClick={(e: any) => handleWaringActions(e, 'OverRuleSafetyViolation')}
						>
							OVERRULE SAFETY VIOLATION WARNING NOT VALID
						</IQButton>
						<IQButton
							disabled={false}
							className='btn-deny-changes'
							variant="outlined"
							onClick={(e: any) => handleWaringActions(e, 'DenyAndDeactivate')}
						>
							DENY AND DEACTIVATE THIS WORKER
						</IQButton>
					</div>
				</div>
			)}
			<SafetyViolationDialog
				open={allowedUser}
				onClose={() => { handleAllowedUserActions('cancel') }}
				contentText={
					<div>
						<div style={styles.contextTextTitle}>
							<span className="common-icon-safety-violation"></span>
							Are you sure you want to allow this worker back on this project?
						</div>
						<div style={styles.contextTextSubTitle}>
							<div>Note: By doing so, this worker account will be re-instated & placed on probation.</div>
							<div>(Please indicate the workers probation period.){" "}
								<TextField variant="outlined" size="small"
									name='name'
									value={confirmationText}
									defaultValue={confirmationText}
									style={{ backgroundColor: '#fff' }}
									onKeyPress={(event) => {
										if ((event?.key === '-' || event?.key === '+')) {
											event.preventDefault();
										}
									}}
									sx={{
										'.MuiInputBase-input': {
											height: '6px',
											width: '20px',
											fontSize: '12px !important'
										}
									}}
									onChange={(e: any) => {
										const re = /[0-9]+/g;
										if (e.target.value === '' || re.test(e.target.value)) {
											setConfirmationText(e.target.value);
											if(parseInt(e.target.value) > 0) {
												setDisableReinstate(false);
											} else {
												setDisableReinstate(true);
											}
										}
									}}
								/>{" "}
								Days of probation</div>
						</div>
					</div>
				}
				width={620}
				title={''}
				disable={disableReinstate}
				showActions={true}
				positiveActionLabel={'RE-INSTATE WORKER'}
				negativeActionLabel={'CANCEL'}
				dialogClose={true}
				onAction={(e: any, type: string) => handleAllowedUserActions(type)}
				iconTitleContent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span className="common-icon-Verify"></span>
						<div>Confirmation</div>
					</div>
				}
			/>
			<SafetyViolationDialog className='confirm-expunge-cls'
				open={expungeDialog}
				onClose={() => {
					setExpungeDialog(false);
				}}
				contentText={
					<div>
						<div style={styles.contextTextTitle}>
							<span className="common-icon-safety-violation"></span>
							Do you want to Expunge safety violation record {selectedRecord?.data?.name} for this worker form the public records?
						</div>
						<div style={styles.contextTextSubTitle}>
							<div>Note: This record will be still available for record purpose on this project. But, we will not be recommending this worker for any feature company jobs.</div>
						</div>
					</div>
				}
				title={''}
				showActions={true}
				positiveActionLabel={'YES'}
				negativeActionLabel={'NO'}
				dialogClose={true}
				helpIcon={true}
				onAction={(e: any, type: string) => handleExpungeDialogActions(type)}
				iconTitleContent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span className="common-icon-Verify"></span>
						<div>Confirmation</div>
					</div>
				}
			/>
			<SafetyViolationDialog
				open={notAllowedUser}
				onClose={() => { handleNotAllowedUserActions('cancel') }}
				contentText={
					<div>
						<div style={styles.contextTextTitle}>
							<span className="common-icon-safety-violation"></span>
							Are you sure you want to deactivate, by doing so the Worker will no longer be allowed to work on this project.
						</div>
						{/* <div style={styles.contextTextSubTitle}>
							<div>
								<Checkbox
									onClick={(e: any) => setCheckboxStatus(e?.target?.checked)}
								/>
								Additionally, I would also recommend this worker be flagged and they no longer to work on any of my company project
							</div>
						</div> */}
					</div>
				}
				width={720}
				title={''}
				showActions={true}
				positiveActionLabel={'CONFIRM'}
				negativeActionLabel={'CANCEL'}
				dialogClose={true}
				helpIcon={true}
				onAction={(e: any, type: string) => handleNotAllowedUserActions(type)}
				iconTitleContent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span className="common-icon-Verify"></span>
						<div>Confirmation</div>
					</div>
				}
			/>
			<SafetyViolationDialog
				open={historicalViolationDialog}
				onClose={() => { handleHistoricalViolationActions('cancel') }}
				contentText={
					<div>
						<div style={styles.contextTextTitle}>
							Do you want to fetch the detail report for historical safety violation fro the worker?
						</div>
						<div style={styles.contextTextSubTitle}>
							<div>
								Note: Smartapp.com keeps track of previous violations may have occurred on the jobs this worker may have been on,
								This for information we have on file in the Smartapp.com Data Management System.
							</div>
						</div>
						<div style={{ alignItems: 'center', gap: '10px' }}>
							<div>
								<img src={Purchaseimgae} width={675} />
							</div>

							<div className="bottom-text" style={{ textAlign: 'right', color: '#999' }}>
								Safety violation report cost for selected worker: $ XX
							</div>
						</div>
						{/* <div className="historical-violation-buttons">
							<Button
								className="cancel-cls"
								onClick={() => handleHistoricalViolationActions("cancel")}
							// 	sx={{
							// 		backgroundColor: '#666',
							// color: '#fff',
							// padding: '12px',
							// height: '36px',
							// font-family: "Roboto-Regular",
							// borderRadius: '2px',
							// justifyContent: 'center !important',
							// boxShadow: '0px 1px 5px #a0a0a0'
							// 	}}
							>
								NO THANK YOU
							</Button>
							<Button
								className="yes-cls"
								variant="contained"
								autoFocus
								color="success"
								onClick={() => handleHistoricalViolationActions("ok")}
							>
								BUY NOW
							</Button>
						</div> */}
					</div>
				}
				width={720}
				title={''}
				showActions={true}
				positiveActionLabel={'BUY NOW'}
				negativeActionLabel={'NO THANK YOU'}
				dialogClose={true}
				helpIcon={true}
				// disable={workerAlert?.disabled}
				// onAction={(e: any, type: string) => handleWorkerAlertActions(type)}
				iconTitleContent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span className="common-icon-Verify"></span>
						<div>Confirmation</div>
					</div>
				}
			/>
			<SafetyViolationDialog className='confirm-expunge-cls'
				open={deleteAction}
				onClose={() => {
					setDeleteAction(false);
				}}
				contentText={
					<div>
						<div style={styles.contextTextTitle}>
							Are you sure you want to delete this safety violation?
						</div>
					</div>
				}
				width={500}
				title={''}
				showActions={true}
				positiveActionLabel={'YES'}
				negativeActionLabel={'NO'}
				dialogClose={true}
				helpIcon={false}
				onAction={(e: any, type: string) => handleDeleteActions(type)}
				iconTitleContent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span className="common-icon-Verify"></span>
						<div>Confirmation</div>
					</div>
				}
			/>
		</div >
	);
};
export default memo(SafetyViolation);
