import React, { memo, useRef } from 'react';
import IQGridLID, { IQGridWindowDetailProps } from 'components/iqgridwindowdetail/IQGridWindowDetail';
import DynamicPage, { DynamicPageProps } from 'components/ui5/dynamicpage/DynamicPage';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { getServer, } from "app/common/appInfoSlice";
var tinycolor = require('tinycolor2');
import { Box, Button, Stack, IconButton, Paper, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { getBidStatus } from 'utilities/bid/enums';
import { isLocalhost, getSafetyCredIFrame, postMessage } from "app/utils";
import './ProjectTeamApplicationsLID.scss';
import IQButton from 'components/iqbutton/IQButton';
import { vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusColors, vendorPayAppsPaymentStatusIcons } from 'utilities/vendorPayApps/enums';
import UserDetails from './tabs/userDetails/UserDetails';
import SafetyCred from './tabs/safetycred/SafetyCred';
import {
	fetchRolesData,
	fetchTradesData,
	fetchEmailSuggestions,
	fetchCompaniesData,
	fetchShiftsData,
	fetchActiveCalendars,
	fetchSkillsData,
	setViolationActionsFired,
	setTriggerSafetyViolationApis,
	getRolesData,
	getcategoriesData
} from '../operations/ptDataSlice';
import {
	getCertificateStatus,
	getSafteyStatus,
	getSafteyStatusColor,
	getSafteyStatusRightBackground,
	getPolicyStatusColor,
	getPolicyStatusRightBackground,
	getCertsStatusColor,
	getCertsStatusRightBackground,
	getPolicyStatus,
	getSafteyStatusCls,
	getRoles
} from "utilities/projectteam/enums";
import SafetyPolicies from './tabs/safetyPolicies/SafetyPolicies';
import Certifications from './tabs/certifications/Certifications';
import { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import WarningAmber from '@mui/icons-material/WarningAmber';
import UserBadge from './tabs/userBadge/UserBadge';
import {
	fetchPendingDocsData, getUserViolationActivity, checkIsRTLSIdExists, upsertUserDetails, upsertWorker, fetchSafetyManualsData,
	fetchSafetyCertificationData, UpsertCertificateData
} from '../operations/ptDataAPI';
import SafetyViolation from './tabs/safetyViolation/SafetyViolation';
import { getDate } from "utilities/datetime/DateTimeUtils";
import { getTime } from "utilities/commonFunctions";
import DynamicTooltip from 'sui-components/DynamicTooltip/DynamicTooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { checkboxClasses } from '@mui/material/Checkbox';
import moment from 'moment';
import SUIAlert from 'sui-components/Alert/Alert';
import Toast from "components/toast/Toast";
import { Alert } from "@mui/material";
import { uploadUserImage } from '../operations/ptDataAPI';
import { fetchPtGridDataList } from '../operations/ptGridAPI';
import { setCurrentSelection, setPtGridData, setSelectedMembers } from '../operations/ptGridSlice';
import _ from 'lodash';
const HeaderContent = (props: any) => {
	const { headerData, status, rolesData, imageuploadid, showWarningMessage = () => { } } = props;
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [image, setImage] = React.useState<any>({ preview: "", raw: "" });
	const [isImageHovering, setIsImageHovering] = React.useState<any>(false);

	const appInfo = useAppSelector(getServer);
	React.useEffect(() => { setImage({ preview: headerData?.thumbnailUrl }) }, [headerData?.thumbnailUrl])

	const handleChange = async (e: any) => {
		if (e.target.files.length > 0) {
			setImage({
				preview: URL.createObjectURL(e.target.files[0]),
				raw: e.target.files[0]
			});
			let fileObject = new FormData();
			fileObject.append("file", e.target.files[0]);
			uploadUserImage(appInfo, fileObject, (res: any) => {
				console.log('reference file response', res);
				if (imageuploadid) imageuploadid(res?.values)
			});
		}
	};

	const handleViolationAlert = async (info: any) => {
		showWarningMessage(true);
	};

	return (
		<>
			<div className='NonCollapseContent'>
				<div className='kpi-vertical-container'>
					<div className='left-container'>
						<div>
							<Box
								component="img"
								sx={{
									height: 100,
									width: 100,
									// maxHeight: { xs: 233, md: 167 },
									// maxWidth: { xs: 350, md: 250 },
								}}
								className='userimage'
								alt={headerData?.firstName}
								src={image?.preview}
								onMouseOver={() => { setIsImageHovering(true); }}
								onMouseOut={() => { setIsImageHovering(false); }}

							/>
							{isImageHovering && <label htmlFor="upload-button" className='image_upload' onMouseOver={() => { setIsImageHovering(true); }} onMouseOut={() => { setIsImageHovering(false); }}>
								<span className='common-icon-Edit userdetails_icons' />
								<span>Change</span>
								<input
									type="file"
									id="upload-button"
									style={{ display: "none" }}
									onChange={handleChange}
									accept="image/png, image/gif, image/jpeg"
								/>
							</label>}
						</div>
						<div className='userdata'>
							<div><span className='common-icon-Approval-Role userdetails_icons' /> <span>{getRoles(headerData.roles)}</span></div>
							<div><span className='common-icon-company userdetails_icons' /> <span>{headerData?.company?.name}</span></div>
						</div>
					</div>
					<div className="center-container">
						{
							(status?.hasViolated && (status?.safetyStatus != 7 || status?.safetyStatus != 8) && status?.violationCount == 0) && (<div className="safety-violation-alert-cls" onClick={() => handleViolationAlert({})}>
								<span className="common-icon-exclamation"></span>
								<span>Safety Violation Alert!</span>
							</div>)
						}
					</div>
					{ (appInfo?.gblConfig?.currentProjectInfo?.safetyTracking || isLocalhost) && <div className='kpi-section'>
						<span className='kpi-right-container'>
							<span className='kpi-name' >Safety Status:</span>
							<span className='status' style={{ backgroundColor: getSafteyStatusRightBackground(status?.safetyStatus), color: getSafteyStatusColor(status?.safetyStatus) }}>
								<span className='status-icon common-icon-SafetyPermit ' style={{ color: getSafteyStatusColor(status?.safetyStatus) }} />
								{getSafteyStatus(status?.safetyStatus)}
							</span>
						</span>
						<span className='kpi-right-container'>
							<span className='kpi-name' >Policy Status:</span>
							<span className='status' style={{ backgroundColor: getPolicyStatusRightBackground(status?.policyStatus), color: getPolicyStatusColor(status?.policyStatus) }}>
								<span className='status-icon common-icon-orgconsole-safety-policies' style={{ color: getPolicyStatusColor(status?.policyStatus) }} />
								{getPolicyStatus(status?.policyStatus)}
							</span>
						</span>
						<span className='kpi-right-container'>
							<span className='kpi-name' >Certification Status:</span>
							<span className='status' style={{ backgroundColor: getCertsStatusRightBackground(status?.certificateStatus), color: getCertsStatusColor(status?.certificateStatus) }}>
								<span className='status-icon common-icon-certification' style={{ color: getCertsStatusColor(status?.certificateStatus) }} />
								{getCertificateStatus(status?.certificateStatus)}
							</span>
						</span>
					</div>}
				</div>
			</div>
		</>
	)
};

const CollapseContent = (props: any) => {
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { headerData, status, showWarningMessage = () => { } } = props;
	const handleViolationAlert = async (info: any) => {
		showWarningMessage(true);
	};
	return (
		<>
			<div className='CollapseContent'>
				<div className='lid-details-container'>
					<Box
						component="img"
						sx={{
							height: 70,
							width: 70,
							// maxHeight: { xs: 233, md: 167 },
							// maxWidth: { xs: 350, md: 250 },
						}}
						className='userimage'
						alt={headerData?.firstName}
						src={headerData?.thumbnailUrl}
					/>
					<div className='userdata'>
						<div><span className='common-icon-Approval-Role userdetails_icons' /> <span>Foreman</span>

						</div>
						<div><span className='common-icon-company userdetails_icons' /> <span>{headerData?.company?.name}</span></div>
						<div className='safety-violation-alert-cls-wrap'>	{
							(status?.hasViolated && (status?.safetyStatus != 7 || status?.safetyStatus != 8) && status?.violationCount == 0) && (<div className="safety-violation-alert-cls" onClick={() => handleViolationAlert({})}>
								<span className="common-icon-exclamation"></span>
								<span>Safety Violation Alert!</span>
							</div>)
						}
						</div>
						{ appInfo?.gblConfig?.currentProjectInfo?.safetyTracking && <div className='kpi-vertical-container'>
							<span className='kpi-right-container one'>
								<span className='kpi-name' >Safety Status:</span>
								<span className='status' style={{ backgroundColor: getSafteyStatusRightBackground(status?.safetyStatus), color: getSafteyStatusColor(status?.safetyStatus) }}>
									<span className='status-icon common-icon-SafetyPermit' style={{ color: getSafteyStatusColor(status?.safetyStatus) }} />
									{getSafteyStatus(status?.safetyStatus)}
								</span>
							</span>
							<span className='kpi-right-container two'>
								<span className='kpi-name' >Policy Status:</span>
								<span className='status' style={{ backgroundColor: getPolicyStatusRightBackground(status?.policyStatus), color: getPolicyStatusColor(status?.policyStatus) }}>
									<span className='status-icon common-icon-orgconsole-safety-policies' style={{ color: getPolicyStatusColor(status?.policyStatus) }} />
									{getPolicyStatus(status?.policyStatus)}
								</span>
							</span>
							<span className='kpi-right-container three'>
								<span className='kpi-name' >Certification Status:</span>
								<span className='status' style={{ backgroundColor: getCertsStatusRightBackground(status?.certificateStatus), color: getCertsStatusColor(status?.certificateStatus) }}>
									<span className='status-icon common-icon-certification' style={{ color: getCertsStatusColor(status?.certificateStatus) }} />
									{getCertificateStatus(status?.certificateStatus)}
								</span>
							</span>
						</div>}
					</div>
				</div>
			</div>
		</>
	)
};

const CommonCheckbox = (props?: any) => {
	const { type, checked = false, disable = false, handleCheckboxChange = () => { } } = props;
	const [localVal, setLocalVal] = React.useState<any>(checked);
	React.useEffect(() => {
		if (checked) {
			setLocalVal(checked);
		};
	}, [checked])
	return (
		<Checkbox
			disabled={disable}
			onClick={(e: any) => { setLocalVal(!localVal); handleCheckboxChange(e, !localVal, setLocalVal, props) }}
			defaultChecked={false}
			checked={localVal}
			style={{
				transform: "scale(1)",
				padding: '9px 4px',
				borderRadius: 0
			}}
			sx={{

				[`&.${checkboxClasses.checked}`]: {
					color: '#059cdf'

				},
			}}
		/>
	)
};

const FooterContent = (props: any) => {
	const [alert, setAlert] = React.useState<any>({
		open: false,
		contentText: '',
		title: '',
		handleAction: '',
		actions: true,
		dailogClose: false
	});
	const handleCheckboxChange = (e: any, isChecked: any, setCheckedVal: any, props: any) => {
		console.log('Footer handleCheckboxChange', e, isChecked, setCheckedVal, props, new Date());
		// setSafetyCredData(...safetyCredData, { isAcknowledge: !safetyCredData.isAcknowledge })
		let msg,
			yesFunction: any;
		if (props?.type == 'acknowledgesafetycred') {
			setSafetyCredentialsAcknowledged(isChecked);
			return;
		}
		if (!isChecked) {
			return;
		}
		switch (props?.type) {
			case 'verifyCredentials':
				msg = 'Are you sure you want to verify credentials for this worker?';
				yesFunction = () => {
					// logic to verifyCredentials
					console.log('logic to verifyCredentials');
				}
				break;
			case 'verifyAll':
				msg = 'Are you sure you want to verify credentials, Policies and Certifications for this worker?';
				yesFunction = () => {
					// logic to verifyAll
					console.log('logic to verifyAll');
				}
				break;
			case 'verifyPolicies':
				msg = 'Are you sure you want to verify safety policies for this worker?';
				yesFunction = () => {
					// logic to verifyPolicies
					console.log('logic to verifyPolicies');
				}
				break;
			case 'workerVerifyPolicies':
				msg = 'Are you sure you want to have the worker verify the safety policies on this device?';
				yesFunction = () => {
					// logic to workerVerifyPolicies
					console.log('logic to workerVerifyPolicies');
				}
				break;
			case 'verifyCerts':
				msg = 'Are you sure you want to verify certifications for this worker?';
				yesFunction = () => {
					// logic to verifyCerts
					console.log('logic to verifyCerts');
				}
				break;

			default:
				break;
		}
		setAlert({
			open: true,
			title: "Confirmation",
			contentText: msg,
			handleAction: (event: any, type: any) => {
				setAlert({
					open: false
				});
				if (type == 'yes') {
					yesFunction();
				} else {
					setCheckedVal(false)
				}
			},
			actions: true,
			dailogClose: true
		});
	};

	const { hasViolated, SafetyStatus, userViolationActivity, activeTab, safetyCredData, isOnlyCompanyManager, setSafetyCredentialsAcknowledged, ...others } = props;
	const disableVerificationAck = isOnlyCompanyManager || safetyCredData?.isAcknowledge;
	const verifiedOn = safetyCredData?.safetyVerifiedOn && moment.utc(safetyCredData?.safetyVerifiedOn).local().format('MM/DD/YYYY hh:mm A')
	const verifiedByAndOn = `${safetyCredData?.safetyVerifiedBy}, ${verifiedOn}`;
	return (
		<>
			<SUIAlert
				open={alert.open}
				contentText={alert.contentText}
				title={alert.title}
				onAction={alert.handleAction}
				showActions={alert.actions}
				DailogClose={alert.dailogClose}
			/>
			{activeTab === 'safetyCredentials' && (
				<div className='footer-content-container'>
					<div className="verify-cred-content">
						<div className="checkbox-content">
							<FormControlLabel control={<CommonCheckbox type="acknowledgesafetycred" disable={disableVerificationAck} checked={safetyCredData?.isAcknowledge} handleCheckboxChange={handleCheckboxChange} />} label="I acknowledge safety credentials of above added user" />
							{/* <FormControlLabel control={<CommonCheckbox type="verifyCredentials" disable={disableVerificationAck} checked={safetyCredData?.isAcknowledge} handleCheckboxChange={handleCheckboxChange} />} label="I verify credentials submitted for this worker" /> */}
						</div>
						{
							safetyCredData?.isAcknowledge && (
								<div className='verificationdetails-cls'>
									<span className="common-icon-safety-tick"></span>{verifiedByAndOn}
								</div>
							)
						}
					</div>
					{/* <div>
						<div className="checkbox-content">
							<FormControlLabel control={<CommonCheckbox type="verifyAll" disable={false} checked={false} handleCheckboxChange={handleCheckboxChange} />} label="I verify credentials, polices, certifications for this worker" />
						</div>
					</div> */}
				</div>
			)}
			{/* activeTab === 'safetyPolicies' && (
				<div className='footer-content-container'>
					<div className="checkbox-content">
						<FormControlLabel control={<CommonCheckbox type="verifyPolicies" disable={false} checked={false} handleCheckboxChange={handleCheckboxChange} />} label="I verify safety polices for this worker" />
					</div>
					<div>
						<div className="checkbox-content">
							<FormControlLabel control={<CommonCheckbox type="workerVerifyPolicies" disable={false} checked={false} handleCheckboxChange={handleCheckboxChange} />} label="Have worker verify the safety policy now" />
						</div>
					</div>
				</div>
			) */}
			{/* activeTab === 'certifications' && (
				<div className='footer-content-container'>
					<div className="checkbox-content">
						<FormControlLabel control={<CommonCheckbox type="verifyCerts" disable={false} checked={false} handleCheckboxChange={handleCheckboxChange} />} label="I verify certifications from this worker" />
					</div>
				</div>
			) */}
			{activeTab === 'safetyViolation' && (
				<>
					{
						hasViolated && (SafetyStatus === 7) && userViolationActivity ? (
							<DeactivatedWorkerText userViolationActivity={userViolationActivity} />
						) : (
							<>
								{
									hasViolated && (SafetyStatus === 8) && userViolationActivity ? (
										<ReInstatedWorkerText userViolationActivity={userViolationActivity} />
									) : (
										null
									)
								}
							</>
						)
					}
				</>
			)}
		</>
	)
};

const getUserLog = (label?: any, date?: any, displayName?: any) => {
	return (
		<>
			{label ?? ''}{" "}
			{moment.utc(date).local().format('MM/DD/YYYY hh:mm A')}{" "}
			{displayName ?? ''}{" "}
		</>
	)
};

const DeactivatedWorkerText = (props?: any) => {
	const { userViolationActivity, ...others } = props;
	return (
		<div className="worker-reinstated-cls">

			<>
				{getUserLog('Worker deactivated on:', userViolationActivity?.deactivatedOn, userViolationActivity?.deactivatedBy?.displayName)}
			</>
		</div>
	)
};

const ReInstatedWorkerTooltip = (props: any) => {
	const { data, label, ...others } = props;
	const { currentSelection } = useAppSelector((state: any) => state.ptGridData);
	const [user, setUser] = React.useState<any>(null);

	React.useEffect(() => { setUser(data?.objectId || currentSelection?.objectId) }, [data, currentSelection]);

	return (
		<div className='safetyViolation_tooltip_content' style={{ margin: '0.5em' }}>
			<label className='safetyViolation_tooltip_label'>{label ?? ''}</label>
			<div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1em' }}>
				<div>
					<ErrorIcon className="safety_details_errorIcon " />
				</div>
				<div style={{ display: 'grid', gap: '4px' }}>

					<div>{getUserLog('Deactivated on:', data?.deactivatedOn, data?.deactivatedBy?.displayName)}</div>
					<div>{getUserLog('Re-instated on:', data?.reInstatedOn, data?.reInstatedBy?.displayName)}</div>
					<div>Probation till: {" "} {`${moment.utc(data?.reInstatedOn).add(data?.probationPeriod, 'day').format('MM/DD/YYYY')}`}</div>
				</div>

			</div>
		</div>
	)
};

const ReInstatedWorkerText = (props?: any) => {
	const { userViolationActivity, ...others } = props;
	return (
		<div className="worker-reinstated-cls">

			<>
				{getUserLog('Worker was re-instated on:', userViolationActivity?.reInstatedOn, userViolationActivity?.reInstatedBy?.displayName)}
				<DynamicTooltip title={<ReInstatedWorkerTooltip data={userViolationActivity} label={'Probation on Violation'} />}
					placement="top"
					sx={{
						"& .MuiTooltip-tooltip": {
							background: '#333333'
						}
					}}
				>
					<span className='common-icon-exclamation' style={{ color: '#f2bb13', fontSize: '24px', cursor: 'pointer', }} />
				</DynamicTooltip>
			</>
		</div>
	)
};

const ProjectTeamApplicationsLID = ({ data, iframeEventData, ...props }: IQGridWindowDetailProps) => {
	const [localhost] = React.useState(isLocalhost);
	const appInfo = useAppSelector(getServer);
	const dispatch = useAppDispatch();
	const { pendingDocs, triggerSafetyViolationApis } = useAppSelector((state: any) => state?.projectTeamData);
	const [activeTab, setActiveTab] = React.useState('');
	const [subTitleText, setSubTitleText] = React.useState('');
	const gblConfig = appInfo?.gblConfig;
	const projectPlanSettings = appInfo?.gblConfig?.projectPlanSettings;
	const [selectedUserData, setSelectedUserData] = React.useState<any>({});
	const [selectedTrade, setSelectedTrade] = React.useState<any>({});
	const { rolesData, gridMainPayload, currentSelection } = useAppSelector((state: any) => state.ptGridData);
	const [userViolationActivity, setUserViolationActivity] = React.useState<any>();
	const [status, setStatus] = React.useState<any>({})
	const { safetyStatus, certificateStatus, pendingCertificateCount, pendingPolicyCount, policyStatus, hasViolated, violationCount } = status;
	const isCompMountedOnce = useRef(false);
	const [userDetails, setUserDetails] = React.useState<any>();
	const [userImage, setUserImage] = React.useState<any>();
	const [focusRTLSId, setFocusRTLSId] = React.useState<any>(false);
	const [focusBLEId, setFocusBLEId] = React.useState<any>(false);
	const [triggerfetchPendingDocsApiCall, setTriggerfetchPendingDocsApiCall] = React.useState<any>(false);
	// const [credPayload, setCredPayload] = React.useState<any>([]);
	// const [credentialsData, setCredentialsData] = React.useState<any>([]);
	const [alert, setAlert] = React.useState<any>({
		open: false,
		contentText: '',
		title: '',
		handleAction: '',
		actions: true,
		dailogClose: false
	});

	const [showToastMessage, setShowToastMessage] = React.useState<any>(false);
	const [warningMessage, setWarningMessage] = React.useState<any>(false);
	const [toastMessage, setToastMessage] = React.useState<any>('');
	const [certificationsData, setCertificationsData] = React.useState<any>();
	const [refreshCerts, setRefreshCerts] = React.useState<any>(false);
	const [registeredCertsEventListener, setRegisteredCertsEventListener] = React.useState<any>();
	const [safetyCredData, setSafetyCredData] = React.useState<any>();
	let [safetyCredentialsAcknowledged, setSafetyCredentialsAcknowledged] = React.useState<any>(false);
	let [reloadSafetyCred, setReloadSafetyCred] = React.useState<any>(false);
	const isOnlyCompanyManager = (gblConfig?.isCompanyManager || gblConfig?.isComplianceManager) && !(gblConfig?.isAdmin || gblConfig?.isProjectAdmin);
	const [ptGridRowData, setPtGridRowData] = React.useState([]);

	React.useEffect(() => {
		if (showToastMessage) {
			setTimeout(() => {
				setShowToastMessage(false);
				setToastMessage('');
			}, 3000)
		}
	}, [showToastMessage]);

	const commonApiCalls = (userData: any) => {
		const SkillsIds = userData?.skills?.map((o: any) => o.objectId).join(';');
		const pendingDocsPayload = { tradeId: userData?.trade?.objectId, userId: userData?.objectId, skillId: SkillsIds };
		const safetyTracking = appInfo?.gblConfig?.currentProjectInfo?.safetyTracking;
		if(safetyTracking) {
			fetchPendingDocsData(appInfo, pendingDocsPayload, (response: any) => {
				showWarningMessage(false);
				setStatus(response);
			});
		}
		fetchPtGridDataList(appInfo, gridMainPayload, (response: any, totalCount: any) => {
			dispatch(setPtGridData(response));
			setPtGridRowData(response);
			if (response && selectedUserData && (response?.length > 0 ?? false)) {
				let a = [...response].find((item: any) => item?.id === selectedUserData?.id);
				console.log("Refreshing the main Grid with existing user", a,
					"Refreshing the main Grid with selected user",
					"Checking for current obj and updated obj",!_.isEqual(selectedUserData, a));
				if (a !== undefined && !_.isEqual(selectedUserData, a)) {
					console.log("Current Obj Roles");
					setSelectedUserData(a);
					dispatch(setCurrentSelection(a));
					dispatch(setSelectedMembers([a]));
				};
			};
		});
		if(safetyTracking){
			getUserViolationActivity(appInfo, { userUniqueId: selectedUserData?.id }, (response: any) => {
				setUserViolationActivity(response);
			});
			dispatch(setTriggerSafetyViolationApis(false));
		}
	};

	const fetchPendingDocsApiCall = (userData: any, credPayload: any, verificationData: any) => {
		let SkillsIds = '';
		if (userData?.skills && userData?.skills?.length > 0) {
			if (typeof userData?.skills[0] === 'object') {
				SkillsIds = userData?.skills?.map((o: any) => o.objectId).join(';');
			} else {
				SkillsIds = userData?.skills?.map((o: any) => o).join(';');
			}
		}
		const pendingDocsPayload = { tradeId: (userData?.trade?.objectId || userData?.trade?.id), userId: selectedUserData.objectId, skillId: SkillsIds };
		fetchPendingDocsData(appInfo, pendingDocsPayload, (response: any) => {
			setStatus(response);
			if (credPayload) {
				executeSave(credPayload, verificationData, false);
			}
		});
	};

	React.useEffect(() => {
		if (triggerSafetyViolationApis && selectedUserData) {
			commonApiCalls(selectedUserData);
		};
	}, [triggerSafetyViolationApis]);

	React.useEffect(() => {
		console.log('****Received iframeEventData', iframeEventData, new Date());
		if (iframeEventData) {
			switch (iframeEventData.event || iframeEventData.evt) {
				case "safetycredsloaded":
					break;
				case "setsafetycreddata":
					setSafetyCredData(iframeEventData.data);
					if (iframeEventData?.data) {
						setSafetyCredentialsAcknowledged(iframeEventData?.data?.isAcknowledge);
					}
					break;
				case "setsafetycredsheight":
					const safetyCredIFrame = getSafetyCredIFrame();
					if (iframeEventData.height && safetyCredIFrame && safetyCredIFrame.style) {
						safetyCredIFrame.style.height = iframeEventData.height + 'px';
					}
					break;
				case "setmddata":
					/* if (selectedUserData?.mdData) {
						selectedUserData?.mdData.isAcknowledge = safetyCredentialsAcknowledged;
					} */
					executeSave(iframeEventData.userDetails, iframeEventData.mdData, false)
					break;
			}
		}
	}, [iframeEventData]);

	React.useEffect(() => {
		if (!isCompMountedOnce?.current) {
			isCompMountedOnce.current = true;
			dispatch(fetchRolesData(appInfo));
			dispatch(fetchTradesData(appInfo));
			dispatch(fetchEmailSuggestions(appInfo));
			dispatch(fetchCompaniesData(appInfo));
			dispatch(fetchShiftsData(appInfo));
			dispatch(fetchActiveCalendars(appInfo));
			dispatch(fetchSkillsData(appInfo));
			setStatus({});

			// Listen to message from parent IFrame window
			// window["addEventListener"]("message", function (event) {
			// 	let data = event.data;
			// 	data = typeof data == "string" ? JSON.parse(data) : data;
			// 	data =
			// 		data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
			// 	if (data) {
			// 		switch (data.event || data.evt) {
			// 			case "safetycredsloaded":
			// 				console.log('safetycredsloaded', data, new Date());
			// 				break;
			// 			case "setsafetycreddata":
			// 				console.log('setsafetycreddata', data, new Date());
			// 				setSafetyCredData(data.data);
			// 				if (data?.data) {
			// 					setSafetyCredentialsAcknowledged(data?.data?.isAcknowledge);
			// 				}
			// 				break;
			// 			case "setsafetycredsheight":
			// 				console.log('setsafetycredsheight', data, new Date());
			// 				const safetyCredIFrame = getSafetyCredIFrame();
			// 				if (data.height && safetyCredIFrame && safetyCredIFrame.style) {
			// 					safetyCredIFrame.style.height = data.height + 'px';
			// 				}
			// 				break;
			// 			case "setmddata":
			// 				console.log('setmddata', data, new Date());
			// 				/* if (data?.mdData) {
			// 					data.mdData.isAcknowledge = safetyCredentialsAcknowledged;
			// 				} */
			// 				executeSave(data.userDetails, data.mdData)
			// 				break;
			// 		}
			// 	}
			// }, false);
		}

	}, []);

	const onUserSelectionChange = (user: any) => {
		console.log('onUserSelectionChange==>', user);
		if(user && Object.keys(user).length > 0){
			const SkillsIds = user?.skills?.map((o: any) => o.objectId).join(';');
			const pendingDocsPayload = { tradeId: user?.trade?.objectId, userId: user?.objectId, skillId: SkillsIds };
			fetchPendingDocsData(appInfo, pendingDocsPayload, (response: any) => {
				showWarningMessage(false);
				setStatus(response);
			});
		}		
		setSelectedUserData(user);
	};
	
	React.useEffect(() => {
		if(data) {
			console.log("Checking", data);
			onUserSelectionChange(data);
		}
	},[data])

	React.useEffect(() => {
		if(currentSelection) {
			onUserSelectionChange(currentSelection);
		}
	},[currentSelection])

	/* React.useEffect(() => {
		if (selectedTrade && Object.keys(selectedTrade).length > 0) {
			setRefreshCerts(true);
		}
	}, [selectedTrade]); */

	React.useEffect(() => {
		if (selectedUserData) {
			if (hasViolated && (status?.safetyStatus === 8 ?? false)) {
				setSubTitleText('');
			} else if (hasViolated && (status?.safetyStatus !== 7 ?? false) && status?.violationCount > 0) {
				setSubTitleText('Safety Violation Records Found for this worker');
			} else if (hasViolated && (status?.safetyStatus === 7 ?? false)) {
				setSubTitleText('Worker is deactivated and is no longer allowed to work on this job site due to one or more Safety Violations');
			} else {
				setSubTitleText('');
			};
			if (status?.hasViolated) {
				if (selectedUserData?.id) {
					getUserViolationActivity(appInfo, { userUniqueId: selectedUserData?.id }, (response: any) => {
						setUserViolationActivity(response);
						if (status?.hasViolated && (status?.safetyStatus != 7 || status?.safetyStatus != 8) && status?.violationCount == 0 && selectedUserData?.status == 'Active') {
							showWarningMessage(true);
						} else {
							showWarningMessage(false);
						}
					});
				}
			};
		}
	}, [status]);

	const callPendingDocs = (payload: any, counter: number) => {
		setTimeout(() => {
			fetchPendingDocsData(appInfo, payload, (response: any) => {
				if (response.policyStatus != 2 && counter < 10) {
					callPendingDocs(payload, counter + 1);
				} else {
					setStatus(response);
				}
			});
		}, 1500);
	};

	const executeSave = (payload: any, verificationData: any, skipPolicyCheck: any) => {
		console.log('executeSave', payload, verificationData);
		if (status?.policyStatus == 1 && verificationData?.isAcknowledge && !skipPolicyCheck) {
			// setCredPayload(payload);
			// setCredentialsData(verificationData);
			fetchSafetyManualsData(appInfo, {
				trades: [payload?.trade] || [],
				userId: payload?.id,
			}, (response: any) => {
				if (response?.length > 0) {
					var pendingPolicies = response.filter((obj: any) => obj.isAcknowledged == false) || [];
					if (pendingPolicies.length > 0) {
						postMessage({ event: 'projectteam', body: { evt: 'policyquickview', selectedRecord: pendingPolicies[0], records: response, credPayload: payload, verificationData: verificationData } })
					} else {
						executeSave(payload, verificationData, true);
					}
				}
			});
			return;
		}
		// setCredPayload(null);
		// setCredentialsData(null);
		if (gblConfig?.currentProjectInfo?.safetyTracking) {
			if (!verificationData) {
				// To-Do Add Safety Related validations and logics - https://monosnap.com/file/36mcV8djD5WVoknkhQpUoocYaTHJxH
				let safetyCredFrame = getSafetyCredIFrame();
				safetyCredFrame?.contentWindow?.postMessage({ event: 'getMDData', userDetails: payload, safetyCredentialsAcknowledged: safetyCredentialsAcknowledged }, '*');
				return;
			} else {
				let verificationDataPromiseList = [new Promise((resolve, reject) => {
					upsertUserDetails(appInfo, payload, function (res: any) {
						console.log('executeSave upsertUserDetails callback', payload);
						resolve(res);
						if (res) {
						}
					});
				})];
				if (verificationData) {
					console.log('settings isAcknowledge to verificationData', verificationData, safetyCredentialsAcknowledged, new Date());
					verificationData.isAcknowledge = safetyCredentialsAcknowledged;
				}
				if (verificationData && (verificationData.isAcknowledge || verificationData.isAttestated)) {
					verificationDataPromiseList.push(new Promise(function (resolve, reject) {
						upsertWorker(appInfo, verificationData, function (res: any) {
							console.log('executeSave upsertWorker callback', verificationData);
							resolve(res);
							if (res) {
							}
						});
					}));
				}
				setToastMessage('Please wait...');
				setShowToastMessage(true);
				setTimeout(() => {
					setShowToastMessage(false);
				}, 1000);
				Promise.all(verificationDataPromiseList).then((results: any) => {
					console.log('all  Promise callback', payload, verificationData, results);
					let res = results[0], safetyResponse, isSafetyAvailable = false;
					if (results.length > 1) {
						isSafetyAvailable = true;
						safetyResponse = results[1];
						setReloadSafetyCred(new Date());
						commonApiCalls(selectedUserData);
						const SkillsIds = selectedUserData?.skills?.map((o: any) => o.objectId).join(';');
						const pendingDocsPayload = { tradeId: selectedUserData?.trade?.objectId, userId: selectedUserData?.objectId, skillId: SkillsIds };
						callPendingDocs(pendingDocsPayload, 1);
					}

					if (verificationData.isAcknowledge && results.length > 1) {
						setToastMessage('Safety credentials succesfully verified');
					} else {
						setToastMessage('User updated successfully');
					}
					// if (res.success && (!isSafetyAvailable || (isSafetyAvailable && safetyResponse.success))) {

					// }
					// if (safetyVerficationCB && safetyVerficationCB.isDisabled && !safetyVerficationCB.isDisabled() && verificationData && verificationData.isAcknowledge && (safetyStatus !== 2 && safetyStatus !== 3)) {
					// 	// show toast as  "Safety credentials succesfully verified."
					// }
					setShowToastMessage(true);
					dispatch(setTriggerSafetyViolationApis(true));
				});
			}
		} else {
			let promiseList = [new Promise((resolve, reject) => {
				upsertUserDetails(appInfo, payload, function (res: any) {
					console.log('executeSave upsertUserDetails callback', payload);
					resolve(res);
					if (res) {
					}
				});
			})];
			setToastMessage('Please wait...');
			setShowToastMessage(true);
			setTimeout(() => {
				setShowToastMessage(false);
			}, 1000);
			Promise.all(promiseList).then((results: any) => {
				console.log('all  Promise callback', payload, results);
				setToastMessage('User updated successfully');
				setShowToastMessage(true);
				dispatch(setTriggerSafetyViolationApis(true));
			});
		}

	}

	const showWarningMessage = (value: boolean) => {
		if (value) setWarningMessage(value);
		else setWarningMessage(false);
	};
	const resetRefreshFlag = (flag: boolean) => {
		setRefreshCerts(flag);
	};
	const tabConfig = [
		{
			tabId: 'userDetails',
			label: 'Details',
			showTab: projectPlanSettings?.ProjectTeamTabs?.Details,
			// showCount: false,
			iconCls: 'common-icon-user-details',
			content: <UserDetails userdata={selectedUserData} setSelectedTrade={setSelectedTrade} focusRTLSId={focusRTLSId} focusBLEId={focusBLEId} fetchPendingDocsApiCall={fetchPendingDocsApiCall} onChange={(data: any) => { setUserDetails(data) }} activeTab={activeTab} iframeEventData={iframeEventData} isOnlyCompanyManager={isOnlyCompanyManager} />
		}, {
			tabId: 'userBadge',
			label: 'Badge',
			showTab: projectPlanSettings?.ProjectTeamTabs?.Badge,
			iconCls: 'common-icon-badge',
			content: <UserBadge userdata={selectedUserData} activeTab={activeTab} isOnlyCompanyManager={isOnlyCompanyManager}></UserBadge>
		}, {
			tabId: 'safetyCredentials',
			label: 'Credentials',
			showTab: (projectPlanSettings?.ProjectTeamTabs?.Credentials && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking),
			iconCls: 'common-icon-SafetyPermit',
			showTabIndicator: true,
			tabIndicatorContent: (safetyStatus == 2 || safetyStatus == 3 || safetyStatus == 5) ? <span className='common-icon-tickmark' style={{ color: '#10d628' }} /> : null,
			content: <SafetyCred url={appInfo?.safetyCredUrl} userId={selectedUserData?.objectId} tradeName={selectedUserData?.trade?.name} reload={reloadSafetyCred} safetyTracking={appInfo?.gblConfig?.currentProjectInfo?.safetyTracking}/>
		}, {
			tabId: 'safetyPolicies',
			label: 'Policies',
			showTab: (projectPlanSettings?.ProjectTeamTabs?.Policies && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking),
			showCount: true,
			showTabIndicator: true,
			tabIndicatorContent: pendingPolicyCount > 0
				? <span className='common-icon-exclamation' style={{ color: '#f2bb13' }} />
				: policyStatus !== 0 && pendingPolicyCount === 0 ? <span className='common-icon-tickmark' style={{ color: '#10d628' }} /> : null,
			count: pendingPolicyCount > 0 ? pendingPolicyCount : null,
			iconCls: 'common-icon-orgconsole-safety-policies',
			content: <SafetyPolicies userdata={selectedUserData} selectedTrade={selectedTrade} activeTab={activeTab} commonApiCalls={commonApiCalls} iframeEventData={iframeEventData} executeSave={executeSave} fetchPendingDocsApiCall={fetchPendingDocsApiCall} />
		}, {
			tabId: 'certifications',
			label: 'Certifications',
			showTab: (projectPlanSettings?.ProjectTeamTabs?.Certifications && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking),
			showCount: true,
			showTabIndicator: true,
			count: pendingCertificateCount > 0 ? pendingCertificateCount : null,
			iconCls: 'common-icon-certification',
			tabIndicatorContent: certificateStatus == 0 ? null :
				(certificateStatus === 1 || certificateStatus === 4 || certificateStatus === 6 || certificateStatus === 5) ?
					<span className='common-icon-exclamation' style={{ color: '#f2bb13' }} />
					: pendingCertificateCount === 0 ? <span className='common-icon-tickmark' style={{ color: '#10d628' }} /> : null,
			content: <Certifications userdata={selectedUserData} selectedTrade={selectedTrade} activeTab={activeTab} commonApiCalls={commonApiCalls} iframeEventData={iframeEventData} onCertificationsChange={(data: any) => { setCertificationsData(data) }} refreshCerts={refreshCerts} resetRefreshFlag={resetRefreshFlag} isOnlyCompanyManager={isOnlyCompanyManager} />
		},
		{
			tabId: 'safetyViolation',
			label: 'Violations',
			showCount: hasViolated ?? false,
			showTabIndicator: true,
			tabIndicatorContent: (/* violationCount && violationCount > 0 &&  */hasViolated) ?
				<span className='common-icon-exclamation' style={{ color: '#f2bb13' }} />
				: /* (violationCount === 0 && !hasViolated) ? <span className='common-icon-tickmark' style={{ color: '#10d628' }} /> : */ null,
			count: status?.violationCount > 0 ? status?.violationCount : null,
			iconCls: 'common-icon-safety-violation',
			disabled: false,
			showTab: (localhost || projectPlanSettings?.ProjectTeamTabs?.Violations && (gblConfig?.isAdmin || gblConfig?.isProjectAdmin || gblConfig?.isSafetyManager) && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking) ? true : false,
			content: <SafetyViolation userdata={selectedUserData} activeTab={activeTab} status={status} userViolationActivity={userViolationActivity} warningMessage={warningMessage} showWarningMessage={showWarningMessage} />
		}
	];

	const SubTitleContent = (props: any) => {
		const { headerData, status } = props;
		if ((selectedUserData?.safetyStatus === 8 ?? false)) {
			return <></>;
		} else if (hasViolated && ((selectedUserData?.safetyStatus !== 7 ?? false) || (selectedUserData?.safetyStatus === 7 ?? false)) && subTitleText) {
			return <div style={{
				display: 'flex',
				gap: '6px',
				alignItems: 'center',
				background: '#ed143d1a',//getSafteyStatusRightBackground(status?.safetyStatus),
				padding: '4px 6px',
				borderRadius: '2px',
				marginTop: '10px',
				marginLeft: '-14%',
				width: 'fit-content'

			}}>
				<span className='common-icon-safety-violation'
					style={{
						color: 'crimson',//getSafteyStatusColor(status?.safetyStatus),
						fontSize: "20px", marginTop: "-1px",
					}}
				/>
				<div style={{
					fontSize: '14px',
					fontFamily: "Roboto-Regular",
					color: 'crimson',//getSafteyStatusColor(status?.safetyStatus),
					fontWeight: 500
				}}>
					{subTitleText}</div>
			</div>
		}
		else { return <></> };
	};
	const handleActiveTab = (value: any) => {
		setActiveTab(value);
		if (value === 'safetyViolation') {
			if (status?.hasViolated && (status?.safetyStatus != 7 || status?.safetyStatus != 8) && status?.violationCount == 0 && selectedUserData?.status == 'Active')
				showWarningMessage(true);
			else
				showWarningMessage(false);

		}
		// else {
		// 	showWarningMessage(false);
		// }
	};
	const handleViolationActions = (e: any, type: string) => {
		dispatch(setViolationActionsFired({ triggered: true, actionButton: type }));
		setTimeout(function () {
			commonApiCalls(selectedUserData);
		}, 1000);

	};
	const RolesData: any = useAppSelector(getRolesData);
	const getRoleOptions = () => {
		let groupedList: any = [];
		const FinalData = RolesData.filter((ele: any, ind: any) => ind === RolesData.findIndex((elem: any) => elem.id === ele.id && elem.text === ele.text))

		FinalData.map((data: any) => {
			groupedList.push({
				...data,
				label: data.value,
				value: data.id
			});
		});
		return groupedList
	}
	const CategoriesData: any = useAppSelector(getcategoriesData);

	const handleSaveUserDetails = () => {
		let selectedRoles = [], globalRole, workCategory;
		if (activeTab == 'certifications') {
			if (certificationsData?.length > 0) {
				var modifiedCertsData = certificationsData.filter((ob: any) => { return ob.isModified === true }),
					certsData = modifiedCertsData.map((obj: any) => {
						return {
							"documentId": obj.id,
							"name": obj.name,
							"expiresOn": obj.expiresOn && obj.trackExpiration == true ? obj.expiresOn : null,
							"isAcknowledged": obj.isAcknowledged,
							"hasQuestion": obj.hasQuestion,
							"certificateRegistered": obj.certificateRegistered,
							"userUploadedCertificates": [],
							"userDeletedCertificates": []
						};
					}),
					certPayload = {
						"userId": selectedUserData?.objectId,
						"verifiedBy": appInfo?.gblConfig?.currentUserId,
						"documentFor": "worker",
						"currentDateTime": new Date(),
						"documentInfo": certsData || []
					};
				if (certsData?.length > 0)
					UpsertCertificateData(appInfo, certPayload, function () {
						setToastMessage('User updated successfully');
						setShowToastMessage(true);
						setRefreshCerts(true);
						const SkillsIds = selectedUserData?.skills?.map((o: any) => o.objectId).join(';');
						const pendingDocsPayload = { tradeId: selectedUserData?.trade?.objectId, userId: selectedUserData?.objectId, skillId: SkillsIds };
						callPendingDocs(pendingDocsPayload, 1);
						// fetchSafetyCertificationData(appInfo, {
						// 	trades: selectedUserData?.trade?.objectId ? [selectedUserData?.trade?.objectId, 0] : [],
						// 	userId: selectedUserData?.objectId,
						// }, (response: any) => {

						// });
					});
			}

		} else {
			if (userDetails?.workCategory) {
				workCategory = CategoriesData?.filter((o: any) => userDetails?.workCategory == (o.id)).map((o: any) => { return { id: o.id, value: o.name } })
				workCategory = workCategory.length > 0 ? workCategory[0] : null;
			}
			if (userDetails?.roleIds?.length > 0) {
				globalRole = userDetails?.roleIds[0];
				selectedRoles = getRoleOptions()?.filter((o: any) => userDetails?.roleIds?.includes(o.id)).map((o: any) => { return { id: o.id, value: o.label } })
			}
			const Payload = {
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				phone: userDetails.phone,
				barcode: userDetails.barcode,
				calendarId: userDetails.calendar,
				company: {
					id: userDetails?.company?.id,
					value: userDetails?.company?.displayField
				},
				defaultLocation: userDetails.defaultLocation,
				gpsTagId: userDetails?.gpsTagId,
				projectId: appInfo?.projectId,
				globalrole: globalRole,
				role: selectedRoles,
				rtlsId: userDetails?.rtlsId,
				shiftId: userDetails?.shift,
				skills: userDetails?.skills,
				trade: userDetails?.trade?.id,
				workcategory: workCategory,
				skillMapping: (userDetails?.skills && userDetails?.skills.length > 0) ? {
					skillIds: userDetails?.skills,
					userId: selectedUserData.objectId
				} : {
					skillIds: [],
					userId: selectedUserData.objectId
				},
				id: selectedUserData.objectId,
				isUser: true,
				thumbnailId: userImage
			}
			console.log('save Click', Payload);

			const rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
			if (userDetails?.rtlsId !== selectedUserData?.rtlsId && (rtlsConnectorType == 1 || rtlsConnectorType == 3)) {
				checkIsRTLSIdExists(appInfo, { rtlsId: userDetails?.rtlsId, userId: selectedUserData.objectId }, function (isRTLSIdExists: any) {
					if (isRTLSIdExists === true) {
						setAlert({
							open: true,
							title: "Confirmation",
							contentText: 'Would you like to change tag assignment to this user and remove from other user?',
							handleAction: (event: any, type: any) => {
								setAlert({
									open: false
								});
								if (type == 'yes') {
									executeSave(Payload, false, false);
								} else {
									// To-Do - focus the RTLS tag field
									rtlsConnectorType == 1 ? setFocusRTLSId(true) : setFocusBLEId(!focusBLEId)
								}
							},
							actions: true,
							dailogClose: true
						});
					} else {
						executeSave(Payload, false, false);
					}
				});
			} else {
				executeSave(Payload, false, false);
			}
		}
	};

	console.log(selectedUserData);
	const lidProps = {
		title: selectedUserData.firstName + ' ' + selectedUserData.lastName,
		subtitle: <SubTitleContent headerData={selectedUserData} status={status} />,
		showSubTitle: true,
		draggableRightPanel: false,
		defaultTabId: props.defaultTabId,
		tabPadValue: 10,
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContent headerData={selectedUserData} status={status} rolesData={rolesData} showWarningMessage={showWarningMessage} imageuploadid={(value: any) => { setUserImage(value) }} />,
			collapsibleContent: <CollapseContent headerData={selectedUserData} status={status} showWarningMessage={showWarningMessage} />
		},
		tabs: tabConfig,

		footer: {
			hideNavigation: true,
			leftNode: <FooterContent hasViolated={hasViolated} SafetyStatus={status?.safetyStatus} userViolationActivity={userViolationActivity} activeTab={activeTab} safetyCredData={safetyCredData} isOnlyCompanyManager={isOnlyCompanyManager} setSafetyCredentialsAcknowledged={setSafetyCredentialsAcknowledged} />,
			rightNode: <>{
				<>
					{activeTab === 'safetyViolation' ? (
						<>
							{(hasViolated && status?.safetyStatus !== 7) ? (
								<IQButton
									disabled={false}
									className='btn-save-changes'
									variant="outlined"
									style={{ color: 'white', background: '#EE7A3A', border: 'none' }}
									onClick={(e: any) => handleViolationActions(e, 'Not Allow')}
									startIcon={<span className="common-icon-allow-back-icon"></span>}
								>
									NO LONGER ALLOW ON THIS JOB
								</IQButton>
							) : ''}
							{(hasViolated && status?.safetyStatus === 7) ? (
								<IQButton
									disabled={false}
									className='btn-allow-back'
									variant="outlined"
									onClick={(e: any) => handleViolationActions(e, 'Allow')}
									startIcon={<span className="common-icon-allow-back-icon"></span>}
								>
									ALLOW BACK TO THIS JOB SITE
								</IQButton>
							) : ''
							}
						</>
					) : (
						<IQButton
							disabled={false}
							className='btn-save-changes'
							variant="outlined"
							// color='white'
							onClick={() => { handleSaveUserDetails() }}
						// startIcon={<Gavel />}
						>
							SAVE
						</IQButton>
					)}
				</>
			}

			</>
		}
	};

	return (
		<>
			<div className='ProjectTeam-lineitem-detail-panel'>
				<IQGridLID {...lidProps} {...props} handleActiveTab={handleActiveTab} />

			</div>
			<SUIAlert
				open={alert.open}
				contentText={alert.contentText}
				title={alert.title}
				onAction={alert.handleAction}
				showActions={alert.actions}
				DailogClose={alert.dailogClose}
			/>
			{
				showToastMessage &&
				<Alert severity="success" className='floating-toast-cls in-lefttoolbar' onClose={() => { setShowToastMessage(false) }}>
					<span className="toast-text-cls">
						{toastMessage}</span>
				</Alert>

			}
		</>

	)
};

export default memo(ProjectTeamApplicationsLID);