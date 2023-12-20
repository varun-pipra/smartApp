import React, { memo, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
import {
	Button, IconButton,
	Box, TextField
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { makeStyles, createStyles } from '@mui/styles';

import "./ProjectTeamWindow.scss";

import { appInfoData } from "data/appInfo";
import convertDateToDisplayFormat, {
	triggerEvent,
	stringToUSDateTime,
	setLoadMask
} from "utilities/commonFunctions";
import GridWindow from "components/iqgridwindow/IQGridWindow";
import { postMessage, isLocalhost, getSafetyCredIFrame, currency } from "app/utils";
import {
	getServer,
	setServer,
	setFullView,
	setCurrencySymbol,
	setAppWindowMaximize,
	setCostUnitList,
} from "app/common/appInfoSlice";
import LeftToolbarButtons from "./projectteamcontent/toolbarbuttons/LeftToolbarButtons";
import RightToolbarButtons from "./projectteamcontent/toolbarbuttons/RightToolbarButtons";
import { memberPrivilegeApi, approveWorkersApi, memberInviteApi, deleteMemberApi, fetchPtGridDataList, getUserRTLSData, fetchRegionsData } from "features/projectsettings/projectteam/operations/ptGridAPI";
import { fetchRoleInfo, upsertUserDetails, checkIsRTLSIdExists } from "./operations/ptDataAPI";
import {
	fetchProjectTeamRolesData,
	fetchHasSupplementalInfo,
	fetchSafetyColumns,
	fetchRTLSUsers,
	setPtGridData,
	setSafetyProbationPopOver,
	setMainGridPayload,
	setFiltersPayload,
	setCurrentSelection,
	setSelectedMembers
} from "./operations/ptGridSlice";
import {
	fetchRolesData,
	fetchTradesData,
	fetchEmailSuggestions,
	fetchCompaniesData,
	fetchShiftsData,
	fetchActiveCalendars,
	fetchSkillsData,
	fetchCategoriesData,
	fetchWorkTeamsData,
	getSkillsData,
	getTradeData,
	getWorkTeams,
	getCompanyData,
	getcategoriesData,
	setTriggerSafetyViolationApis
} from "./operations/ptDataSlice";
import { formatDate, getDate, getTime, fromSecondsToHourMinutes } from "utilities/datetime/DateTimeUtils";
import {
	getCertificateStatus,
	getCertificateStatusCls,
	getSafteyStatus,
	getSafteyStatusColor,
	getSafteyStatusCls,
	getPolicyStatus,
	getPolicyStatusCls,
	getRoles,
	SafetyStatusOptions,
	canEditProjectTeamRec
} from "utilities/projectteam/enums";
import ProjectTeamApplicationsLID from "./projectteamapplicationsdetails/ProjectTeamApplicationsLID";
var tinycolor = require("tinycolor2");
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import SUICompanyCard from "sui-components/CompanyCard/CompanyCard";
import { styled } from "@mui/material/styles";
import IQTooltip from 'components/iqtooltip/IQTooltip';
import CustomHeader from 'features/bidmanager/bidmanagercontent/bidmanagergrid/CustomHeader';
import SUIAlert from 'sui-components/Alert/Alert';
import Toast from "components/toast/Toast";
import ProjectTeamRolesTooltip from './projectteamcontent/RolesTootip/ProjectTeamRolesTooltip';
import { QRCodeAlertUI, CompanyTooltip } from './projectteamcontent/customComponents/customComponents';
import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown";
import SmartDropDown from "components/smartDropdown";
import CompanyIcon from "resources/images/Comapany.svg";
import _ from "lodash";
import { assignUnassignData, assignUnassignData2, assignUnassignDataNonMTA } from 'data/projectteam/menudata';
import CustomCellEditor from './projectteamcontent/customComponents/CellEditors/CustomCellEditor';
import CustomDropDownEditor from './projectteamcontent/customComponents/CellEditors/CustomDropDownEditor';
import moment from "moment";
import { Alert } from "@mui/material";
import { RowHeightParams } from "ag-grid-community";
import { addCookie, getCookie } from "./utils";
import CustomTooltip from "features/budgetmanager/aggrid/customtooltip/CustomToolTip";

const useStyles2: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 'calc(100% - 350px) !important',
			maxWidth: '315px !important',
			minWidth: '315px !important',
		}
	})
);

const ProjectTeamWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [rowData, setRowData] = React.useState<any>([]);
	const [localRowData, setLocalRowData] = React.useState<any>([]);
	const [gridTotalCount, setGridTotalCount] = React.useState<any>(0);
	const [popTitle, setPopTitle] = React.useState(' ');
	const [fullScreen, setFullScreen] = React.useState(true);
	const [openRightPanel, setOpenRightPanel] = useState(false);
	// const [currentSelection, setCurrentSelection] = useState<any>();
	const domEventRef = React.useRef(false);
	const [alert, setAlert] = React.useState<any>({
		open: false,
		contentText: '',
		title: '',
		handleAction: '',
		actions: true,
		dailogClose: false
	});
	const [showToastMessage, setShowToastMessage] = React.useState<any>('');
	const [localToastMessage, setLocalToastMessage] = React.useState<any>('');
	useEffect(() => { setTimeout(() => { setShowToastMessage('') }, 3000) }, [showToastMessage]) // clearing the last value from the usestate
	useEffect(() => { setTimeout(() => { setLocalToastMessage('') }, 3000) }, [localToastMessage]) // clearing the last value from the usestate
	const {
		ptGridData,
		rolesData,
		isRolesDataLoaded,
		hasSupplementalInfo,
		safetyColumns,
		originalGridApiData,
		RTLSUserData,
		filtersPayload,
		selectedMembers,
		currentSelection
	} = useAppSelector((state: any) => state.ptGridData);
	const groupKeyValue = useRef<any>(null);
	const classes = useStyles2();
	const skillsData: any = useAppSelector(getSkillsData);
	const tradesData: any = useAppSelector(getTradeData);
	const workTeamsData: any = useAppSelector(getWorkTeams);
	const companiesData: any = useAppSelector(getCompanyData);
	const [defaultTabId, setDefaultTabId] = useState<any>('');
	const [iframeEventData, setIframeEventData] = React.useState<any>({});
	const [activeToggle, setActiveToggle] = useState<any>("member");
	const [RTLSDataLoadedAt, setRTLSDataLoadedAt] = useState<any>([]);
	const [columns, setColumns] = useState<any>([]);
	const [formattedSafetyColumns, setFormattedSafetyColumns] = useState<any>([]);
	// const [selectedRecords, setSelectedRecords] = React.useState<any>([]);
	const [mousePos, setMousePos] = useState<any>({
		top: '-9999px',
		left: '-9999px', // hide div first
		data: '',
		display: false
	});
	const [companyOptions, setCompanyOptions] = useState([]);
	const [gridSkillsOptions, setGridSkillsOptions] = useState([]);
	const [totalRowCount, setTotalRowCount] = useState(rowData?.length);
	const CompanyData: any = useAppSelector(getCompanyData);
	const CategoriesData: any = useAppSelector(getcategoriesData);
	const [dynamicClose, setDynamicClose] = useState<any>(false);
	const [isEnForced, setIsEnforced] = useState(false);
	const [reAssignState, setReAssignState] = React.useState(false);
	const iframeID = "projectTeamIframe";
	const appType = "ProjectTeam";
	const [searchText, setSearchText] = React.useState<string>('');
	const customSortingDateFields = ['safetyVerifiedOn', 'createdDate', 'modifiedDate', 'modifiedBy', 'createdBy']; //-->
	const customSortingStatusForFields = ['certificateStatus', 'policyStatus', 'safetyStatus']; //-->
	const customSortingObjFields = ['company', 'tradeName', 'shift'];
	const customSortingArrFields = ['skills', 'roles','regions'];
	const customSortingFields = ['lastName', 'email', 'phone']; //-->
	const customFilterFields = ['permissions', 'onlineStatus', 'companyManagerAttestation', 'status'];
	const hideRtlsColumns = ['company', 'roles', "tradeName", "skills", "workCategoryName", "safetyStatus", "policyStatus", "certificateStatus", 'projectZonePermissions'];
	const isMTA = localhost ? true : (appInfo?.gblConfig?.project?.isProjectCentralZone) || false;
	const [groupKey, setGroupKey] = React.useState<any>('');
	const [filteredValues, setFilteredValues] = React.useState<any>({});
	const radioRef = useRef<any>('');
	const ptTitle = appInfo?.viewConfig?.title.indexOf('Team Orientation');
	const [selectedWorker, setSelectedWorker] = React.useState<any>('');
	const escapeRegExp = (s: any) => {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};
	const isCompMountedOnce = useRef(false);
	const filteredRef = useRef<any>({});
	const [onlineStatusAssignState, setOnlineStatusAssignState] = React.useState(false);
	let mainGridPayload = {
		"projectId": appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId,
		"limit": 10000,
		"offset": 0,
		"sortBy": 'lastName',
		"sortDirection": 'ASC'
	};
	const datesRef = React.useRef<any>({});
	const localRowDataRef = React.useRef<any>([]);
	//Grid Management State's
	const [gridGroupValue, setGridGroupValue] = React.useState('');
	const [gridSearchText, setGridSearchText] = React.useState('');
	const [gridFilters, setGridFilters] = React.useState({});
	const [gridSafetyStatusFilters, setGridSafetyStatusFilters] = React.useState<any>({});
	//End
	const activeColsTab = useRef<any>(null);
	let safetyStatusFilterFormat: any = {
		"ids": [],
		"names": []
	};
	const firstNameCellOldValRef = useRef<any>('');
	const firstNameTextFieldRef = useRef<any>('');
	const searchKey = useRef<any>(null);
	const CookieTitle = `${appInfo?.viewConfig?.title === "Team Orientation" ? 'teamOrientaion' : 'projectTeam'}`;
	const [skillsAdded, setSkillsAdded] = React.useState(false);
	const [companiesAdded, setCompaniesAdded] = React.useState(false);
	const [gridSelectedRowIds, setGridSelectedRowIds] = React.useState<string[]>([]);
	const [regionsData, setRegionsData] = React.useState([]);
	const [regionsOriginalData, setRegionsOriginalData] = React.useState([]);
	const safetyGroupOptions = [
		{ text: "Safety Status", value: "safetyStatus", iconCls: 'common-icon-Safety-Onboarding-Flyer' },
		{ text: "Policy Status", value: "policyStatus", iconCls: 'common-icon-orgconsole-safety-policies' },
		{ text: "Certification Status", value: "certificateStatus", iconCls: 'common-icon-certification' }
	];
	const safetyFilterOptions = [{
		text: "Safety Status",
		value: "safetyStatus",
		iconCls: 'common-icon-SafetyPermit main',
		key: "safetyStatus",
		hidden: !appInfo?.gblConfig?.currentProjectInfo?.safetyTracking,
		children: {
			type: "checkbox",
			items: [
				{ text: "Not Submitted", value: "Not Submitted", id: 0, iconCls: 'common-icon-SafetyPermit', color: "#FF0000" },
				{ text: "Partially Registered", value: "Partially Registered", id: 6, iconCls: 'common-icon-SafetyPermit', color: "#F9D108" },
				{ text: "Awaiting Verification", value: "Awaiting Verification", id: 1, iconCls: 'common-icon-SafetyPermit', color: "#FFA500" },
				{ text: "Verified - FULL SERVICE", value: "Verified - FULL SERVICE", id: 2, iconCls: 'common-icon-SafetyPermit', color: "#008000" },
				{ text: "Verified - IN PROBATION", value: "Verified - IN PROBATION", id: 3, iconCls: 'common-icon-SafetyPermit', color: "#808080" },
				{ text: "Probation - Awaiting Full Service", value: "Probation - Awaiting Full Service", id: 5, iconCls: 'common-icon-SafetyPermit', color: "royalblue" },
				{ text: "Renewal Required", value: "Renewal Required", id: 4, iconCls: 'common-icon-SafetyPermit', color: "#DC143C" },
				{ text: "Removed - Violation Repeat Offender", value: "Removed - Violation Repeat Offender", id: 7, iconCls: 'common-icon-SafetyPermit', color: "#333333" },
				{ text: "Probation - Violation Repeat Offender", value: "Probation - Violation Repeat Offender", id: 8, iconCls: 'common-icon-SafetyPermit', color: "#B307CD" },
			],
		},
	},
	{
		text: "Policy Status",
		value: "policyStatus",
		iconCls: 'common-icon-orgconsole-safety-policies main',
		key: "policyStatus",
		children: {
			type: "checkbox",
			items: [
				{ id: 1, text: "Pending", value: "Pending", iconCls: 'common-icon-orgconsole-safety-policies', color: 'red' },
				{ id: 2, text: "Worker Acknowledged", value: "Worker Acknowledged", iconCls: 'common-icon-orgconsole-safety-policies', color: 'green' },
			],
		},
	},
	{
		text: "Certification Status",
		value: "certificateStatus",
		iconCls: 'common-icon-certification main',
		key: "certificateStatus",
		children: {
			type: "checkbox",
			items: [
				{ id: 0, text: "N/A", value: "N/A", iconCls: 'common-icon-certification', color: '#999' },
				{ id: 1, text: "Not Verified", value: "Not Verified", iconCls: 'common-icon-certification', color: 'darkred' },
				{ id: 2, text: "Verified", value: "Verified", iconCls: 'common-icon-certification', color: 'green' },
				{ id: 5, text: "Pending", value: "Pending", iconCls: 'common-icon-certification', color: '#f9d108' },
				{ id: 6, text: "About to Expire", value: "About to Expire", iconCls: 'common-icon-certification', color: 'orange' },
				{ id: 7, text: "Expired", value: "Expired", iconCls: 'common-icon-certification', color: 'red' }
			],
		},
	}];
	const attestmentMenu = [{
		text: "Company Manager Attestation",
		value: "companyManagerAttestation",
		iconCls: 'common-icon-worker-attestment',
		key: "companyManagerAttestation",
		children: {
			type: "checkbox",
			items: [
				{ text: "Confirmed", value: "Confirmed", id: 0 },
				{ text: "Awaiting Response", value: "AwaitingResponse", id: 1 },
			],
		},
	}];
	const GetPermissionList = (data: any, key?: boolean) => {
		let list = [],
			isMTA = appInfo?.isMTA,
			zonePermission = data?.projectZonePermissions || [],
			adminValues: any = {
				'Admin': isMTA ? 'Super Admin' : 'Admin',
				'ProjectAdmin': 'Admin',
				'AdminWithBilling': 'Admin with Billing',
				'ProjectTeamManager': 'Project Team Manager',
				'CompanyManager': 'Company Manager'
			};

		if (adminValues[data?.userPermissionType])
			list.push(adminValues[data?.userPermissionType]);
		for (var indx in zonePermission) {
			var record = assignUnassignData2.find((obj: any) => zonePermission[indx] == obj.value);
			if (record) {
				list.push(record.text);
			} else {
				list.push(zonePermission[indx].name);
			}
		};
		if (key) return list.length === 0 ? null : list.join(", ");
		else return list.length === 0 ? 'None' : list.join(", ");
	};
	const CompanyCardTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip
			{...props}
			classes={{ popper: className }}
			onOpen={(e: any) => {
				setTimeout(function () {
					const isDropDownExpanded = document.getElementsByClassName(
						"base-search-text-field"
					).length;
					const toolpTipEle: any = document.getElementsByClassName(
						"pt-CompanyTooltip-main"
					)[0];
					if (isDropDownExpanded && toolpTipEle) {
						toolpTipEle.style.display = "none";
					}
				}, 200);
			}}
		/>
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			borderRadius: 5,
			maxWidth: 550,
		},
	});
	const AutoWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }}
			onOpen={(e: any) => {
				setTimeout(function () {
					const isDropDownExpanded = document.getElementsByClassName(
						"smart-dropdown-search-box"
					).length;
					const toolpTipEle: any = document.getElementsByClassName(
						"pt-RolesTooltip-main"
					)[0];
					if (isDropDownExpanded && toolpTipEle) {
						toolpTipEle.style.display = "none";
					}
				}, 200);
			}}
		/>
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: "none",
		},
	});
	const handleOnlineStatusChange = (val: any) => {
		radioRef.current = val;
		if (val !== '' && val !== 'custom') {
			let onlineStatus = { ...filteredValues, ['onlineStatus']: val };
			setFilteredValues(onlineStatus);
			setGridFilters(onlineStatus);
		};
	};
	const handleApply = (customDates: any) => {
		const { startDate, endDate } = customDates;
		if (startDate !== '' && endDate !== '') {
			let onlineStatusFilter = { ...filteredRef.current, ['onlineStatus']: [customDates] };
			onFilterChange(onlineStatusFilter);
		}
	};
	const handleOnlineStatusClear = (setSelectedStatus: any, setCustomDates: any) => {
		radioRef.current = '';
		datesRef.current = '';
		let onlineStatusFilter = filteredRef.current;
		if (onlineStatusFilter.hasOwnProperty('onlineStatus')) {
			delete onlineStatusFilter.onlineStatus;
		};
		filteredRef.current = onlineStatusFilter;
		onFilterChange(onlineStatusFilter, true);
		setSelectedStatus('');
		setCustomDates({ startDate: "", endDate: "" });
		setReAssignState(true);
		setOnlineStatusAssignState(true);
	};
	const getCompanyOptionsForInline = (params: any) => {
		let options = {
			companyOptions: [],
			suggestedOptions: [],
		};
		let data = getCompanyOptions();
		if (params?.data?.trade?.name && !isEnForced) {
			let filterCompanies: any = [...CompanyData]?.filter((x: any) => {
				return x?.trade?.some((item: any) => item?.name === params?.data?.trade?.name)
			});
			if (filterCompanies?.length > 0) {
				let mapFields = filterCompanies.map((item: any) => ({
					...item, displayField: item.name, isSuggested: true, color: item?.colorCode,
					thumbnailUrl: item?.thumbnailUrl === "" ? CompanyIcon
						: item?.thumbnailUrl
				}));
				let filterData = companyOptions?.filter((item: any) => { return !mapFields?.some((value: any) => value?.id === item?.id) });
				options.companyOptions = filterData;
				options.suggestedOptions = mapFields;
			} else {
				options.suggestedOptions = [];
				options.companyOptions = data
			};
		} else {
			options.companyOptions = data;
		};
		return options;
	}

	/**
	 * @returns Custom Online status filter component with radio buttons
	 */
	const OnlineStatusFilterComp = memo(() => {
		const [selectedStatus, setSelectedStatus] = useState<any>(radioRef.current ?? '');
		const [customDates, setCustomDates] = React.useState({
			startDate: datesRef.current.startDate ?? "",
			endDate: datesRef.current.endDate ?? ""
		});
		React.useEffect(() => {
			datesRef.current = customDates;
		}, [customDates]);
		return (
			<div style={{ padding: 10, marginLeft: 15 }}>
				<RadioGroup
					defaultValue={radioRef.current ?? ''}
					aria-labelledby="online-status-group-label"
					value={radioRef.current ?? ''}
					onChange={(e: any) => {
						handleOnlineStatusChange(e.target.value);
						setSelectedStatus(e.target.value);
					}}
					name={radioRef.current ?? ''}
				>
					<FormControlLabel
						value="Now"
						control={<Radio />}
						label="Beaconing Now"
					/>
					<FormControlLabel
						value="Today"
						control={<Radio />}
						label="Today"
					/>
					<FormControlLabel
						value="Yesterday"
						control={<Radio />}
						label="Yesterday"
					/>
					<FormControlLabel
						value="This Week"
						control={<Radio />}
						label="This Week"
					/>
					<FormControlLabel value="custom" control={<Radio />} label="Custom" />
				</RadioGroup>
				{selectedStatus === "custom" && (
					<div>
						<div className="onlinestatus-custom-cls">
							<DatePickerComponent
								showOtherDays={true}
								zIndex={9999}
								defaultValue={customDates?.startDate}
								containerClassName={"iq-customdate-cont"}
								maxDate={new Date()}
								onChange={(val: any) => setCustomDates({ ...customDates, ['startDate']: val })}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
										style={{ background: "#f7f7f7" }}
									/>
								}
							/>
							<DatePickerComponent
								showOtherDays={true}
								zIndex={9999}
								defaultValue={customDates?.endDate}
								containerClassName={"iq-customdate-cont"}
								maxDate={new Date()}
								onChange={(val: any) => setCustomDates({ ...customDates, ['endDate']: val })}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
										style={{ background: "#f7f7f7" }}
									/>
								}
							/>
						</div>
						<div className="onlinestatus-footer-cls">
							<Button variant="outlined" className="cancel-btn" onClick={() => handleOnlineStatusClear(setSelectedStatus, setCustomDates)}>CANCEL</Button>
							<Button variant="outlined" className="apply-btn" onClick={() => handleApply(customDates)}>APPLY</Button>
						</div>
					</div>
				)}
			</div>
		);
	});

	const getColorForStatusGroup = (label: any, key: any) => {
		let data = [...filters];
		const index = data?.findIndex((x: any) => x?.value === key);
		const getChild = data?.[index]?.children?.items;
		const getChildIndex = getChild?.findIndex((y: any) => y?.text === label);
		return getChild?.[getChildIndex]?.color ?? '';
	};

	const CustomGroupHeader = memo((props: any) => {
		const { iconCls, color, baseCustomLine = false, label, colName = '', ...rest } = props;
		return (
			<div className="custom-group-header-cls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
				{baseCustomLine && (
					<div className={"base-custom-line pt-group"} style={{ backgroundColor: color, width: '4px', height: '36px' }}></div>
				)}
				<span className={iconCls}
					style={{
						marginRight: '10px',
						marginTop: '0px',
						border: 'thin solid #666',
						borderRadius: '50%',
						padding: '4px',
						backgroundColor: '#fff',
						color: customSortingStatusForFields.includes(colName) && getColorForStatusGroup(label, colName)
					}}
				></span>
				<span className="custom-group-header-label-cls">{label}</span>
			</div>
		)
	});
	const groupOptions = useMemo(() => {
		var groupingMenu = [{ text: "Name", value: "firstName", iconCls: 'common-icon-name-id' },
		{ text: "Companies", value: "company", iconCls: 'common-icon-company-new' },
		{ text: "Work Team", value: "workTeams", iconCls: 'common-icon-work-team' },
		{ text: "Trades", value: "tradeName", iconCls: 'common-icon-trade' },
		{ text: "Skills", value: "skills", iconCls: 'common-icon-orgconsole-skills-certs' },
		{ text: "Permissions", value: "projectZonePermissions", iconCls: 'common-icon-none' },
		{ text: "Roles", value: "roles", iconCls: 'common-icon-Approval-Role' }];
		var lastSeenMenu = [{ text: "Last Seen", hidden: true, value: "lastSeen", iconCls: 'common-icon-connecting' }];

		// if (appInfo?.gblConfig?.currentProjectInfo?.safetyTracking){
		groupingMenu = [...groupingMenu, ...safetyGroupOptions, ...lastSeenMenu];
		// }
		return groupingMenu;
	}, [appInfo, isLocalhost]);
	const [groups, setGroups] = React.useState(groupOptions);
	const financePermissions = assignUnassignData2.filter((obj: any) => obj.value != '');
	const filterOptions = useMemo(() => {
		var filterMenu = [{
			text: "Companies",
			value: "companies",
			iconCls: 'common-icon-company-new',
			key: "companies",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Work Team",
			value: "workTeams",
			iconCls: 'common-icon-work-team',
			key: "workTeams",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Trades",
			value: "trades",
			iconCls: 'common-icon-trade',
			key: "trades",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Skills",
			value: "skills",
			iconCls: 'common-icon-orgconsole-skills-certs',
			key: "skills",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Status",
			value: "status",
			iconCls: 'common-icon-Status-new',
			key: "status",
			children: {
				type: "checkbox",
				items: [
					{ id: 0, text: "Active", value: "active" },
					{ id: 1, text: "Deactivated", value: "deactivated" },
				],
			},
		},
		{
			text: "Permissions",
			value: "permissions",
			iconCls: 'common-icon-none',
			key: "permissions",
			children: {
				type: "checkbox",
				items: [
					...assignUnassignData, ...assignUnassignDataNonMTA, ...financePermissions
				],
			},
		},
		{
			text: "Roles",
			value: "roles",
			iconCls: 'common-icon-Approval-Role',
			key: "roles",
			children: {
				type: "checkbox",
				items: [],
			},
		}],
			onlineStatusFilter = [{
				text: "Online Status",
				value: "onlineStatus",
				iconCls: 'common-icon-connecting',
				key: "onlineStatus",
				hidden: true,
				children: {
					type: "radio",
					component: <OnlineStatusFilterComp />,
					items: []
				},
			}];

		filterMenu = [...filterMenu, ...safetyFilterOptions, ...attestmentMenu, ...onlineStatusFilter];
		return filterMenu;
	}, [appInfo, isLocalhost]);

	const getIds = (array: any, key: any) => {
		let idsArray: any = [];
		let filtersCopy = [...filters];
		let findFilterItem = filtersCopy.find((x: any) => x?.key === key);
		if ((findFilterItem && findFilterItem?.children?.items?.length > 0) ?? false) {
			findFilterItem.children.items.filter((item: any) => {
				if (array.includes(item.name ?? item.value ?? item.text)) {
					idsArray.push(item.id ?? item.objectId)
				}
			});
			return idsArray;
		} else return idsArray;
	};
	const filterBy: any = {
		companies: {
			searchBy: "company",
			byKeyName: "objectId",
			type: "Object"
		},
		trades: {
			byKeyName: "objectId",
			type: "Object",
			searchBy: "trade"
		},
		workTeams: {
			byKeyName: "id",
			type: "Array",
			searchBy: "teams"
		},
		skills: {
			byKeyName: "objectId",
			type: "Array",
			searchBy: 'skills'
		},
		safetyStatus: {
			type: "Number",
			byKeyName: "safetyStatus"
		},
		policyStatus: {
			type: "Number",
			byKeyName: "policyStatus"
		},
		certificateStatus: {
			type: "Number",
			byKeyName: "certificateStatus"
		},
		roles: {
			byKeyName: "objectId",
			type: "Array",
			searchBy: 'roles'
		},
		companyManagerAttestation: {
			byKeyName: "companyManagerAttestation",
			type: 'String',
			searchBy: "companyManagerAttestation"
		},
		status: {
			byKeyName: "statusText",
			type: 'String',
			searchBy: "statusText"
		},
		permissions: {
			byKeyName: "permissionTypeText",
			type: "String",
			searchBy: 'permissionTypeText'
		},
		onlineStatus: {
			byKeyName: "onlineStatusFilterText",
			type: "String",
			searchBy: 'onlineStatusFilterText'
		},
	};
	const GetSortingCookie = () => {
		let sorting = getCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`);
		if (sorting) {
			try {
				return JSON.parse(sorting);

			} catch (e) {
				console.error(e);
			}
		};
	};
	const AddNoneToEmptyRec = (array: any) => {
		if (array?.length > 0 ?? false) {
			const joinNames: any = array?.map((obj: any) => { return obj.name });
			return joinNames.join(', ');
		} else {
			return 'None'
		}
	};
	const GetFiltersData = (array: any, obj: any) => {
		const data = [...array];
		let filterObj: any = { ...obj };
		Object.keys(filterObj).filter((item) => {
			if (!customFilterFields.includes(item)) {
				filterObj[item] = getIds(filterObj[item], item);
			};
			if (filterObj[item]?.length === 0) {
				delete filterObj[item]
			};
			if (filterObj[item] === "" || filterObj[item] === undefined || filterObj[item] === null) {
				delete filterObj[item]
			};
		});
		if (data.length > 0 && Object.keys(filterObj).length !== 0) {
			let filterValues = [...data];
			let res = filterValues.filter((obj: any) => {
				return Object.entries(filterObj).every(([key, find]: any) => {
					let searchKey = filterBy[key].byKeyName;
					if (filterBy[key]?.type === "Object" && obj[filterBy[key].searchBy] !== null)
						return find.includes(obj[filterBy[key].searchBy][searchKey]);
					else if (filterBy[key]?.type === "Array" && obj[filterBy[key].searchBy] !== null) {
						return obj[filterBy[key].searchBy].some((item: any) => {
							if (item[searchKey] !== null) return find.includes(item[searchKey]);
							else return false;
						});
					} else if (filterBy[key]?.type === "String" && (find?.length ?? false) &&
						find?.[0].hasOwnProperty('startDate') && find?.[0]?.startDate !== '' &&
						find?.[0].hasOwnProperty('endDate') && find?.[0]?.endDate !== ''
						&& key === 'onlineStatus') {
						const sDate = new Date(find?.[0]?.startDate).getTime();
						let eDate: any = new Date(find?.[0]?.endDate);
						eDate?.setHours(new Date().getHours());
						eDate?.setMinutes(new Date().getMinutes());
						eDate?.setSeconds(new Date().getSeconds());
						eDate = eDate.getTime();
						if ((obj?.lastSeen ?? false) && obj.lastSeen !== "") {
							let time = new Date(obj.lastSeen).getTime();
							return (sDate <= time && time <= eDate);
						} else {
							return false;
						};
					} else if (filterBy[key]?.type === "String" && obj[filterBy[key].searchBy] !== null && obj[filterBy[key].searchBy] !== undefined && key === 'onlineStatus') {
						return obj[filterBy[key].searchBy] && obj[filterBy[key].searchBy].includes(find);
					} else if (filterBy[key]?.type === "String" && obj[filterBy[key].searchBy] !== null && obj[filterBy[key].searchBy] !== undefined && key !== 'permissions')
						return find.includes(obj[filterBy[key].searchBy]);
					else if (filterBy[key]?.type === "String" && obj[filterBy[key].searchBy] !== null && key === 'permissions') {
						let keyText: any = obj[filterBy[key].searchBy]?.split(', ');
						return find.some((item: any) => {
							return keyText.includes(item);
						});
					}
					else if (obj[key] !== null && !customFilterFields.includes(key)) return find?.includes(obj?.[key]);
				});
			});
			let unique: any = [];
			res.map((x: any) => unique.filter((a: any) => a.rowNum === x.rowNum).length > 0 ? null : unique.push(x));
			return unique;
		} else return data;
	};
	const onFilterChange = (filterValues: any, val?: any) => {
		if (filterValues.hasOwnProperty('onlineStatus') && radioRef.current === '') {
			delete filterValues.onlineStatus;
		};
		if ((val ?? false) && radioRef.current !== '') {
			radioRef.current = ''
			setOnlineStatusAssignState(true);
		};
		if (Object.keys(filterValues).length !== 0) {
			let filterObj = filterValues;
			Object.keys(filterObj).filter((item) => {
				if (filterObj[item]?.length === 0) {
					delete filterObj[item]
				};
				if (filterObj[item] === "" || filterObj[item] === undefined || filterObj[item] === null) {
					if (item === 'onlineStatus') {
						radioRef.current = '';
					};
					delete filterObj[item];
				};
			});
			if (!_.isEqual(filteredValues, filterObj) && Object.keys(filterObj).length > 0) {
				setFilteredValues(filterObj);
				if (filterObj?.onlineStatus?.[0]?.hasOwnProperty('startDate') && filterObj?.onlineStatus?.[0]?.hasOwnProperty('endDate')) {
					setGridFilters(filterObj);
				};
				if (filterObj?.safetyStatus?.length > 0 ?? false) {
					setGridSafetyStatusFilters(checkSafetyStatusFromFilteredData(filterObj?.safetyStatus))
				};
			} else {
				if (!_.isEqual(filteredValues, filterObj)
					&& Object.keys(filterValues).length === 0) {
					setFilteredValues(filterObj);
					setGridSafetyStatusFilters(safetyStatusFilterFormat);
				};
			}
		} else {
			if (Object.keys(filterValues).length === 0) {
				setFilteredValues(filterValues);
				setGridSafetyStatusFilters(safetyStatusFilterFormat);
			};
		};
	};
	useEffect(() => {
		if (filteredValues) {
			filteredRef.current = filteredValues;
			setReAssignState(true);
		}
	}, [filteredValues])
	const [filters, setFilters] = useState<any>(filterOptions);
	const [gridApi, setGridApi] = useState<any>();

	useEffect(() => {
		if (rolesData?.length && filters?.length) {
			const FinalData = rolesData.filter((ele: any, ind: any) => ind === rolesData.findIndex((elem: any) => elem.id === ele.id && elem.text === ele.text))
			const formattedRoles = FinalData.map((rec: any) => {
				return { ...rec, text: rec.value, value: rec.value, id: rec.id }
			});
			const filtersCopy = [...filters];
			let rolesItem = filtersCopy.find((rec: any) => rec.value === 'roles');
			rolesItem.children.items = formattedRoles;
			setFilters(filtersCopy);
		}
	}, [rolesData]);

	useEffect(() => {
		if (skillsData?.length && filters?.length) {
			findAndUpdateFiltersData(skillsData, 'skills');
		}
	}, [skillsData]);

	useEffect(() => {
		if (tradesData?.length && filters?.length) {
			findAndUpdateFiltersData(tradesData, 'trades', true);
		}
	}, [tradesData]);

	useEffect(() => {
		if (workTeamsData?.length && filters?.length) {
			findAndUpdateFiltersData(workTeamsData, 'workTeams', true);
		}
	}, [workTeamsData]);

	useEffect(() => {
		if (companiesData?.length && filters?.length) {
			findAndUpdateFiltersData(companiesData, 'companies', true);
		}
	}, [companiesData]);
	const getSortedData = (array: any) => {
		if ((array?.length > 0 ?? false)) {
			return array.sort((a: any, b: any) => a?.text?.localeCompare(b?.text));
		};
	};
	useEffect(() => {
		if ((filters?.length > 0 ?? false)) {
			filters.forEach((element: any) => {
				if (element?.key !== "permissions" && element?.key !== "safetyStatus") {// Does not require sorting for permissions
					element.children.items = getSortedData(element.children.items);
				}
			});
		};
	}, [filters])
	const firstCharKeyCreator = (params: any) => {
		var nameObj = params.value;
		return nameObj?.code;
	};
	const firstCharValueGetter = (params: any) => {
		var name = params?.data?.firstName ?? "";
		var code = name.substring(0, 1).toUpperCase();
		return {
			name: name,
			code: code,
		};
	}
	/**
	 * 
	 * @param data Array of records
	 * @param key String filter base name
	 * @author Srinivas Nadendla
	 */
	const findAndUpdateFiltersData = (data: any, key: string, val?: boolean) => {
		const formattedData = data.map((rec: any) => {
			if (val ?? false) {
				return { ...rec, text: rec.name, value: rec.name, id: rec.id, color: rec.colorCode ?? rec?.color?.substring(1), basecustomline: true }
			} else {
				return { ...rec, text: rec.name, value: rec.name, id: rec.id }
			}
		});
		const filtersCopy = [...filters];
		let currentItem = filtersCopy.find((rec: any) => rec.value === key);
		currentItem.children.items = formattedData;
		if (key === 'companies' && !isCompMountedOnce?.current) {
			isCompMountedOnce.current = true;
			let getCompanyFilters = checkCompaniesFilters(formattedData);
			setGridFilters(getCompanyFilters);
			setFilteredValues(getCompanyFilters);
		};
		setFilters(filtersCopy);
	};
	const checkSafetyStatusFilters = () => {
		let safetyStatusFilter: any = localhost ? getCookie(`safetyStatusFilter_-1_${CookieTitle}`) : getCookie(`safetyStatusFilter_${appInfo.projectId}_${CookieTitle}`);
		if (safetyStatusFilter?.length > 0) {
			let values = safetyStatusFilter;
			let safetyStatusObj = [...filters].find((x) => x.text === 'Safety Status');
			safetyStatusObj = safetyStatusObj.children.items;
			let format: any = {
				"ids": [],
				"names": values
			};
			for (let i = 0; i < safetyStatusObj.length; i++) {
				if (values.includes(safetyStatusObj[i].text)) {
					format.ids.push(safetyStatusObj[i].id);
				}
			};
			return format;
		} else {
			return {
				"ids": [],
				"names": []
			};
		};
	};
	const checkSafetyStatusFromFilteredData = (filter: any) => {
		if (filter?.length > 0) {
			let safetyStatusObj = [...filters].find((x) => x.text === 'Safety Status');
			safetyStatusObj = safetyStatusObj.children.items;
			let format: any = {
				"ids": [],
				"names": filter
			};
			for (let i = 0; i < safetyStatusObj.length; i++) {
				if (filter.includes(safetyStatusObj[i].text)) {
					format.ids.push(safetyStatusObj[i].id);
				}
			};
			return format;
		} else {
			return {
				"ids": [],
				"names": []
			};
		};
	};
	const checkCompaniesFilters = (array?: any) => {
		let filter: any = localhost ? getCookie(`filters_-1_${CookieTitle}`) : getCookie(`filters_${appInfo.projectId}_${CookieTitle}`);
		if (filter) {
			let CookieFilter;
			try {
				CookieFilter = JSON.parse(filter);
				let companiesList = array.map((item: any) => { return item.name });
				let filterMenuOptions: any = CookieFilter;
				const companyName = appInfo?.gblConfig?.currentUserCompany?.name;
				const isOnlyCompanyManager = (appInfo?.gblConfig?.isCompanyManager || appInfo?.gblConfig?.isComplianceManager) && !(appInfo?.gblConfig?.isAdmin || appInfo?.gblConfig?.isProjectAdmin);
				if (isOnlyCompanyManager && filterMenuOptions?.companies?.length > 0 && companiesList?.includes(companyName)) {
					if (filterMenuOptions?.companies && (!filterMenuOptions?.companies?.includes(companyName) ?? false)) {
						filterMenuOptions['companies'] = [...filterMenuOptions?.companies, companyName];
						return filterMenuOptions;
					} else return filterMenuOptions;
				} else if (isOnlyCompanyManager && companiesList?.includes(companyName)) {
					filterMenuOptions['companies'] = [companyName];
					return filterMenuOptions;
				} else {
					return filterMenuOptions;
				};
			} catch (e) {
				return console.error(e);
			}
		} else if (appInfo && (array?.length > 0 ?? false)) {
			let companiesList = array.map((item: any) => { return item.name });
			const companyName = appInfo?.gblConfig?.currentUserCompany?.name;
			let filterMenuOptions: any = {};
			const isOnlyCompanyManager = (appInfo?.gblConfig?.isCompanyManager || appInfo?.gblConfig?.isComplianceManager) && !(appInfo?.gblConfig?.isAdmin || appInfo?.gblConfig?.isProjectAdmin);
			if (isOnlyCompanyManager && companiesList?.includes(companyName)) {
				filterMenuOptions['companies'] = [companyName];
				return filterMenuOptions;
			} else {
				return filterMenuOptions;
			};
		}
	};
	const GridListApi = () => {
		fetchPtGridDataList(appInfo, mainGridPayload, (response: any, totalCount: any) => {
			dispatch(setPtGridData(response));
		});
	};
	useEffect(() => {
		if (appInfo) {
			let search: any = getCookie(`searchText_${appInfo.projectId}_${CookieTitle}`);
			let group: any = getCookie(`groupKey_${appInfo.projectId}_${CookieTitle}`);
			let filter: any = getCookie(`filters_${appInfo.projectId}_${CookieTitle}`);
			let toggle: any = getCookie(`activeToggle_${appInfo.projectId}_${CookieTitle}`);
			console.log("project-team-appInfo", search, group, filter, toggle);
			if (filter) {
				let CookieFilter;
				try {
					CookieFilter = JSON.parse(filter);
					if (CookieFilter.hasOwnProperty('onlineStatus')) {
						if (CookieFilter?.onlineStatus
							&& CookieFilter?.onlineStatus?.[0]?.hasOwnProperty('startDate')
							&& CookieFilter?.onlineStatus?.[0]?.hasOwnProperty('endDate')) {
							delete CookieFilter?.onlineStatus;
							// handleOnlineStatusChange('custom');
							// radioRef.current = 'custom';
							// datesRef.current = CookieFilter.onlineStatus;
							// let today = new Date().setHours(0, 0, 0, 0),
							// fromDate = `${new Date(today).toISOString().split('.')[0]}Z`;
							// dispatch(fetchRTLSUsers({ appInfo: appInfo, fromDate: fromDate }));
						} else {
							radioRef.current = CookieFilter.onlineStatus;
							let today = new Date().setHours(0, 0, 0, 0),
								fromDate = `${new Date(today).toISOString().split('.')[0]}Z`;
							dispatch(fetchRTLSUsers({ appInfo: appInfo, fromDate: fromDate }));
						};
					};
					setFilteredValues(CookieFilter);
					setGridFilters(CookieFilter);
				} catch (e) {
					return console.error(e);
				}
			};
			setLoadMask(true, 'project-team-gridcls');
			dispatch(fetchProjectTeamRolesData(appInfo));
			dispatch(fetchHasSupplementalInfo(appInfo));
			dispatch(fetchSafetyColumns(appInfo));
			dispatch(fetchSkillsData(appInfo));
			dispatch(fetchTradesData(appInfo));
			dispatch(fetchWorkTeamsData(appInfo));
			dispatch(fetchCompaniesData(appInfo));
			appInfo?.viewConfig?.title ? setPopTitle(appInfo?.viewConfig?.title) : setPopTitle('Project Team');
			/* appInfo?.fullScreen &&  */
			setFullScreen(appInfo?.fullScreen || false);
			setGridSafetyStatusFilters(checkSafetyStatusFilters());
			if((appInfo?.orgId ?? false)) {
				fetchRegionsData(appInfo)
				.then((res: any) => {
					if(res?.length) {
						setRegionsOriginalData(res);
						const mapData = (res || []).map((data: any) => ({
								...data,
								value: data.id,
								label: data.name,
								displayLabel : data.name
						}));
						setRegionsData(mapData);
					}
				})
				.catch((error: any) => {
					console.log("error", error);
				});
			};
			searchKey.current = search ?? "";
			setSearchText(search ?? "");
			setGridGroupValue(group);
			groupKeyValue.current = group ?? "";
			setGroupKey(group ?? "");
			setGridSearchText(search ?? "");
			if (toggle === 'safety') {
				setActiveToggle(appInfo?.gblConfig?.currentProjectInfo?.safetyTracking ? 'safety' : 'member');
			} else if (toggle === 'rtls') {
				setActiveToggle(appInfo?.rtlsConnectorType == 1 || appInfo?.rtlsConnectorType == 3 ? 'rtls' : 'member');
			} else if (toggle === 'usergroups') {
				const canShowUserGroups = (!appInfo?.isMTA && appInfo?.projectId > 0 && !appInfo?.gblConfig?.isZoneProject);
				setActiveToggle(canShowUserGroups ? 'usergroups' : 'member');
			} else if (toggle === 'member') {
				setActiveToggle('member');
			} else {
				setActiveToggle(ptTitle > -1 && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking ? 'safety' : 'member');
			};
			setSelectedWorker(appInfo?.viewConfig?.workerId);
			setIsEnforced(appInfo?.gblConfig?.enforceCompanyTradeRelationship);
			/* dispatch(fetchCategoriesData({ appInfo, tradeId: 66 }));
			dispatch(fetchPendingDocs({
				appInfo, payload: {
					tradeId: 123,
					userId: 123,
					skillId: 123
				}
			}));
			dispatch(fetchSafetyManuals({
				appInfo, payload: {
					trades: [66, 0],
					userId: 123
				}
			}));
			dispatch(fetchSafetyCertifications({
				appInfo, payload: {
					trades: [66, 0],
					userId: 123
				}
			})); */

			/* 
			
			
			dispatch(fetchEmailSuggestions(appInfo));
			dispatch(fetchShiftsData(appInfo));
			dispatch(fetchActiveCalendars(appInfo));
			 */
		}
	}, [appInfo]);

	useEffect(() => {
		if (appInfo) {
			if (domEventRef.current) return;
			domEventRef.current = true;
			document.body.addEventListener("click", respondDomEvent);
			document.body.addEventListener("mousemove", respondDomEvent);
			document.body.addEventListener("touchstart", respondDomEvent);
			document.body.addEventListener("touchmove", respondDomEvent);
		}
	}, [appInfo]);

	useEffect(() => {
		if (localhost) {
			let filter: any = getCookie(`filters_123_teamOrientaion`);
			let search: any = getCookie(`searchText_123_teamOrientaion`);
			let group: any = getCookie(`groupKey_123_teamOrientaion`);
			let toggle: any = getCookie(`activeToggle_123_teamOrientaion`);
			setGridGroupValue(group);
			if (filter) {
				let CookieFilter;
				try {
					CookieFilter = JSON.parse(filter);
					if (CookieFilter.hasOwnProperty('onlineStatus')) {
						if (CookieFilter?.onlineStatus
							&& CookieFilter?.onlineStatus?.[0]?.hasOwnProperty('startDate')
							&& CookieFilter?.onlineStatus?.[0]?.hasOwnProperty('endDate')) {
							delete CookieFilter?.onlineStatus;
							// handleOnlineStatusChange('custom');
							// radioRef.current = 'custom';
							// datesRef.current = CookieFilter.onlineStatus;
							// let today = new Date().setHours(0, 0, 0, 0),
							// fromDate = `${new Date(today).toISOString().split('.')[0]}Z`;
							// dispatch(fetchRTLSUsers({ appInfo: appInfo, fromDate: fromDate }));
						} else {
							radioRef.current = CookieFilter.onlineStatus;
							let today = new Date().setHours(0, 0, 0, 0),
								fromDate = `${new Date(today).toISOString().split('.')[0]}Z`;
							dispatch(fetchRTLSUsers({ appInfo: appInfo, fromDate: fromDate }));
						};
					};
					setFilteredValues(CookieFilter);
					setGridFilters(CookieFilter);
				} catch (e) {
					return console.error(e);
				}
			};
			groupKeyValue.current = group ?? "";
			setSearchText(search ?? "");
			setGridSearchText(search ?? "");
			searchKey.current = search ?? "";
			setGridSafetyStatusFilters(checkSafetyStatusFilters());
			setGroupKey(group ?? "");
			dispatch(setCurrencySymbol(currency["USD"]));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
			setActiveToggle(toggle);
			// Below is for Project Team
			//dispatch(setServer({ projectId: -1 }));
			// Below is for Team Orientation
			dispatch(setServer({
				projectId: 123, isFromORG: true, isMTA: true, fullScreen: true, viewConfig: { workerId: "6b1e6c11-2549-4012-bd05-008339e692ab0", fromSafetyTab: true, title: 'Team Orientation' }/* , gblConfig: {
					projectPlanSettings: {
						ProjectTeamTabs: {
							"Details": true,
							"Badge": false,
							"Credentials": true,
							"Policies": false,
							"Certifications": true,
							"Violations": false
						}
					}
				} */
			}));
			// Below is for Team Orientation in Enterprise
			// dispatch(setServer({projectId: 123, isFromORG: true, isMTA: false, fullScreen: true, viewConfig: { workerId: 22923872, fromSafetyTab: true, title: 'Team Orientation' }}));

			setSelectedWorker(appInfo?.viewConfig?.workerId);
			// dispatch(fetchProjectTeamGridData(appInfo));
			window.onmessage = (event: any) => {
				let data = event.data;
				data = typeof data == "string" ? JSON.parse(data) : data;
				data =
					data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
				let iframeEvent = data.evnt || data.event || data.evt;
				if (iframeEvent) {
					switch (iframeEvent) {
						case "updatetotalcount":
							const pTitle = appInfo?.viewConfig?.title || popTitle || '';
							if (data.data && data.data.totalCount > 0 && pTitle && pTitle.indexOf('Team Orientation') >= 0) {
								setPopTitle('Team Orientation (' + data.data.totalCount + ')');
							} else if (pTitle && pTitle.indexOf('Team Orientation') >= 0) {
								setPopTitle('Team Orientation');
							}
							break;
						case "showMessage":
							console.log('showMessage', data, new Date());
							data.msg && setLocalToastMessage(data.msg);
							if (data.data && data.data.msg) {
								setLocalToastMessage(data.data.msg);
							}
							break;

					}
					setIframeEventData(data);
					setTimeout(() => {
						setIframeEventData(false);
					}, 10);
				}
			}
		} else {
			if (!appInfo) {
				let structuredData: any = {};
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof data == "string" ? JSON.parse(data) : data;
					data =
						data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
					if (data) {
						let iframeEvent = data.evnt || data.event || data.evt;
						switch (iframeEvent) {
							case "hostAppInfo":
								structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(
									setCurrencySymbol(
										currency[
										structuredData?.currencyType as keyof typeof currency
										]
									)
								);
								// dispatch(fetchProjectTeamGridData(structuredData));
								break;
							case "updatetotalcount":
								const pTitle = appInfo?.viewConfig?.title || popTitle || '';
								if (data.data && data.data.totalCount > 0 && ((pTitle && pTitle.indexOf('Team Orientation') >= 0) || (structuredData?.viewConfig?.title && structuredData?.viewConfig?.title.indexOf('Team Orientation') >= 0))) {
									setPopTitle('Team Orientation (' + data.data.totalCount + ')');
								} else if (pTitle && pTitle.indexOf('Team Orientation') >= 0) {
									setPopTitle('Team Orientation');
								}
								break;
							case "getlocalfiles":
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case "updateparticipants":
								triggerEvent("updateparticipants", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "updatecommentbadge":
								triggerEvent("updatecommentbadge", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "refresh":
								// refreshGrid();
								setGridRefreshedAt(new Date());
								break;
							case "showMessage":
								console.log('showMessage', data, new Date());
								data.msg && setLocalToastMessage(data.msg);
								if (data.data && data.data.msg) {
									setLocalToastMessage(data.data.msg);
								}
								break;
							case "safetycredentialcropimage":
								console.log('**** RECEIVED safetycredentialcropimage and posted to parent frame', data.data, new Date());
								postMessage({
									event: 'projectteam',
									body: { evt: 'safetycredentialcropimage', data: data.data }
								});
								break;
							case "setsafetycredentialcropimage":
								console.log('**** RECEIVED setsafetycredentialcropimage and posted to safety cred frame', data.data, new Date());
								let safetyCredFrame = getSafetyCredIFrame();
								safetyCredFrame?.contentWindow?.postMessage({ event: 'setsafetycredentialcropimage', data: data.data }, '*');
								break;
							case "safetycredentialquickview":
								console.log('**** RECEIVED safetycredentialquickview and posted to parent frame', data.data, new Date());
								postMessage({
									event: 'projectteam',
									body: { evt: 'safetycredentialquickview', data: data.data }
								});
								break;
							case "switchtomemberstab":
								console.log('**** RECEIVED switchtomemberstab', data.data, new Date());
								setActiveToggle('member');
								break;
							default:
								// Sending to individual widgets
								if (iframeEvent === 'refreshskills') {
									setSkillsAdded(true);
								} else if (iframeEvent === 'refreshcompanies') {
									setCompaniesAdded(true);
								};
								console.log('Setting setIframeEventData', data, new Date());
								setIframeEventData(data);
								setTimeout(() => {
									// resetting iframe data
									setIframeEventData(false);
								}, 10);
								break;
						}
					}
				};
				postMessage({
					event: "hostAppInfo",
					body: {
						iframeId: iframeID,
						roomId: appInfo && appInfo.presenceRoomId,
						appType: appType,
					},
				});
			}
		}
	}, [localhost, appData]);
	useEffect(() => {
		if (appInfo && skillsAdded) {
			dispatch(fetchSkillsData(appInfo));
			getSkillsOptions();
		} else if (appInfo && companiesAdded) {
			dispatch(fetchCompaniesData(appInfo));
			getCompanyOptions();
		}
	}, [appInfo, skillsAdded, companiesAdded]);
	useEffect(() => {
		if (skillsAdded) {
			setSkillsAdded(false);
			setColumns(columns);
			GridListApi();
		} else if (companiesAdded) {
			setCompaniesAdded(false);
			setColumns(columns);
			GridListApi();
		}
	}, [gridSkillsOptions, companyOptions])
	/**
	 * Formatting api dynamic columns to ag grid format and
	 * Setting it local state to further use
	 * @author Srinivas Nadendla
	 *  */
	useEffect(() => {
		const formattedSafCols = safetyColumns.filter((rec: any) => {
			if (rec.type == 'Signature' || rec.isHidden) {
				return false;
			} else {
				return true;
			}
		}).map((rec: any) => {
			// To-Do condition for file type "File"
			if (rec.type == 'Datetime') {
				return {
					...rec, headerName: rec.name, field: rec.dataIndex, menuTabs: [], cellRenderer: (params: any) => {
						return <span className={`pt-${params?.column?.colId}`}
							onClick={(event: any) => {
								if (event.detail == 2) {
									const currentRec = params?.data,
										canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
									if (canEdit) {
										dispatch(setCurrentSelection(params?.data));
										setDefaultTabId("userDetails");
										setOpenRightPanel(true);
									}
								}
							}}
						>{params.data[rec.dataIndex] && formatDate(params.data[rec.dataIndex])}</span>; // class name is fieldname
					}
				};
			} else {
				return { ...rec, headerName: rec.name, field: rec.dataIndex, menuTabs: [], type: undefined };
			}
		});
		setFormattedSafetyColumns(formattedSafCols);
	}, [safetyColumns]);

	// useEffect(() => {
	// 	setRoles(rolesData);
	// }, [rolesData]);
	const { triggerSafetyViolationApis } = useAppSelector((state: any) => state?.projectTeamData);
	// React.useEffect(() => {
	// 	if (triggerSafetyViolationApis) {
	// 		setGridRefreshedAt(new Date());
	// 	};
	// }, [triggerSafetyViolationApis])
	const prepareRTLSData = (data: any) => {
		let beconSettings = appInfo?.beconSettings;
		if (isLocalhost) {
			beconSettings = {
				"timeUnit": "seconds",
				"LocationBeaconDuration": 300,
				"ActiveBeaconTimespan": 300,
				"LocationBeaconFrequency": 30,
				"userStatus": {
					"active": {
						"color": "00ff00",
						"duration": 300
					},
					"idle": {
						"color": "FFFB33",
						"duration": 1800
					},
					"inactive": {
						"color": "ff0000",
						"duration": 3600
					}
				}
			};
		}
		let currentTimestamp = new Date().getTime(),
			firstSeenToday = (data.firstSeen && getTime(new Date(data.firstSeen).toISOString())) || '',
			lastSeen = (data.lastSeen && formatDate(new Date(data.lastSeen).toISOString())) || '',
			lastLocation = data.lastSeenLocationName || '',
			firstSeenEver = (data.firstEverSeen && formatDate(new Date(data.firstEverSeen).toISOString())) || '',
			source = data.lastSeenDeviceType || '',
			lastSeenTimestamp = new Date(data.lastSeen).getTime(),
			lastSeenTimeDiff = Math.round((currentTimestamp - lastSeenTimestamp) / 1000),
			timeSpentToday = (data.timeSpentTodaySeconds && fromSecondsToHourMinutes(data.timeSpentTodaySeconds)) || '',
			timeSpentEver = (data.timeSpentEverSeconds && fromSecondsToHourMinutes(data.timeSpentEverSeconds)) || '',
			activeDuration = beconSettings?.userStatus?.active?.duration,
			idleDuration = beconSettings?.userStatus?.idle?.duration,
			inactiveDuration = beconSettings?.userStatus?.inactive?.duration,
			activityColor = null, groupHeader, groupHeaderText, filterText;
		if (lastSeenTimeDiff <= activeDuration) {
			activityColor = `#${beconSettings?.userStatus?.active?.color}`;
		} else if (lastSeenTimeDiff <= idleDuration && lastSeenTimeDiff > activeDuration) {
			activityColor = `#${beconSettings?.userStatus?.idle?.color}`;
		} else if (lastSeenTimeDiff <= inactiveDuration && lastSeenTimeDiff > idleDuration) {
			activityColor = `#${beconSettings?.userStatus?.inactive?.color}`;
		}
		let today = new Date().setHours(0, 0, 0, 0),
			firstDayOfWeek = new Date(), day = firstDayOfWeek.getDay(),
			diff = firstDayOfWeek.getDate() - day + (day == 0 ? -6 : 1),
			monday = new Date(firstDayOfWeek.setDate(diff)).setHours(0, 0, 0, 0),
			sourceText;

		if (lastSeenTimeDiff <= activeDuration) {
			groupHeader = 1;
			groupHeaderText = 'Now';
			filterText = 'Now,Today,This Week';
		} else if (activeDuration < lastSeenTimeDiff && today <= lastSeenTimestamp) {
			groupHeader = 2;
			groupHeaderText = 'Today';
			filterText = 'Today,This Week';
		} else if ((today - 86400000) <= lastSeenTimestamp && lastSeenTimestamp < today) {
			groupHeader = 3;
			groupHeaderText = 'Yesterday';
			filterText = 'Yesterday,This Week';
		} else if (monday <= lastSeenTimestamp && lastSeenTimestamp < (today - 86400000)) {
			groupHeader = 4;
			groupHeaderText = 'This Week';
		} else if ((monday - 604800000) <= lastSeenTimestamp && lastSeenTimestamp < monday) {
			groupHeader = 5;
			groupHeaderText = 'Last Week';
		} else if (lastSeenTimestamp < (monday - 604800000)) {
			groupHeader = 6;
			groupHeaderText = 'Older';
		} else {
			groupHeader = 7;
			groupHeaderText = 'None';
		}

		switch (source) {
			case 'phone':
			case 'tablet':
				sourceText = 'RTLS-Phone';
				break;
			case 'ble_tag':
				sourceText = 'RTLS-Tag';
				break;
			case 'gps':
				sourceText = 'GPS';
				break;
			case 'kiosk':
				sourceText = 'Kiosk';
				break;
			case 'smartgate':
				sourceText = 'SmartGate';
				break;
			case 'gps-tag':
				sourceText = 'GPS-Tag';
				break;
			case 'gps device':
				sourceText = 'GPS Device';
				break;
		}
		return {
			firstSeenTimestamp: data.firstSeen,
			firstSeenToday: firstSeenToday,
			lastSeen: lastSeen,
			timeSpentToday: timeSpentToday,
			lastLocation: lastLocation,
			firstSeenEver: firstSeenEver,
			timeSpentEver: timeSpentEver,
			timeSpentTodaySeconds: data.timeSpentTodaySeconds,
			timeSpentEverSeconds: data.timeSpentEverSeconds,
			source: source,
			sourceText: sourceText,
			activityColor: activityColor,
			activityHeader: groupHeader,
			activityHeaderText: groupHeaderText,
			onlineStatusFilterText: filterText
		};
	};
	const handleClose = () => {
		postMessage({
			event: "closeiframe",
			body: {
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType
			}
		});
	};
	const handleHelp = () => {
		console.log('help');
		postMessage({
			event: "help",
			body: {
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType,
				isFromHelpIcon: true
			}
		});
	}
	const navigateHome = () => {
		postMessage({
			event: "gohome",
			body: {
				iframeId: iframeID,
				appType: appType
			}
		});
	}
	const respondDomEvent = (e: any) => {
		let data = {
			type: e.type,
			pageX: e.pageX,
			pageY: e.pageY
		};
		let iFrameDetection = (window === window.parent) ? false : true;
		iFrameDetection && postMessage({ evt: 'domevent', event: 'domevent', data: data });
	};
	const refreshGrid = () => {
		appInfo && isRolesDataLoaded && fetchPtGridDataList(appInfo, mainGridPayload, (response: any, totalCount: any) => {
			const data = response.map((item: any) => ({
				...item,
				rtlsId: item.rtlsId ? item.rtlsId : '',
				gpsTagId: item.gpsTagId ? item.gpsTagId : '',
				safetyStatusText: getSafteyStatus(item.safetyStatus),
				policyStatusText: getPolicyStatus(item.policyStatus),
				certificateStatusText: getCertificateStatus(item.certificateStatus),
				statusText: item.status === 'Active' ? 'active' : item.status === "Disabled" ? 'deactivated' : item.status,
				permissionTypeText: GetPermissionList(item),
				permissionTypeSortText: GetPermissionList(item, true),
			}))
			dispatch(setPtGridData(data));
		});
		setLoadMask(true, 'project-team-gridcls');
		if (activeToggle === "rtls") {
			setRTLSDataLoadedAt(new Date());
		};
		gridApi && gridApi.deselectAll();
	}
	const [gridRefreshedAt, setGridRefreshedAt] = React.useState<any>(false);
	useEffect(() => {
		gridRefreshedAt && refreshGrid();
	}, [gridRefreshedAt]);
	const deleteMembers = () => {
		setLoadMask(true, 'project-team-gridcls');
		deleteMemberApi(appInfo, selectedMembers, (() => {
			refreshGrid();
		}))
	}
	const reInviteMembers = () => {
		setLoadMask(true, 'project-team-gridcls');
		let workerIds = selectedMembers.map((item: any) => item.objectId);
		memberInviteApi(appInfo, workerIds, ((res: any) => {
			if (res.success) {
				setLoadMask(false, 'project-team-gridcls');
				setShowToastMessage('Invites sent successfully');
			}
		}));
	}
	const verifyMembers = () => {
		setLoadMask(true, 'project-team-gridcls');
		let workerIds = selectedMembers.map((item: any) => item.objectId);
		approveWorkersApi(appInfo, { workerIds }, ((res: any) => {
			setLoadMask(false, 'project-team-gridcls');
			if (res.success) {
				refreshGrid();
			} else {
				setShowToastMessage('Request failed!');
			}
		}));
	}
	const memberPrivilegeChange = () => {
		setLoadMask(true, 'project-team-gridcls');
		let workerIds = selectedMembers.map((item: any) => item.objectId),
			msg = selectedMembers[0].status === "Active" ? 'User(s) successfully deactivated' : 'User(s) successfully activated';
		memberPrivilegeApi(appInfo, workerIds, selectedMembers[0].status, ((res: any) => {
			setLoadMask(false, 'project-team-gridcls');
			if (!res.success) {
				msg = 'Something went wrong. Please try again';
			} else {
				refreshGrid();
			}
			setLocalToastMessage(msg);
		}));
	}
	const leftToolBarHandler = useCallback((e: any) => {
		//e.preventDefault();
		const action = e.currentTarget.getAttribute('data-action');
		let evtData = {
			event: 'projectteam',
			body: {
				evt: action,
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType,
				selectedRecords: selectedMembers,
				membersList: localRowData
			}
		};
		switch (action) {
			case 'refresh': {
				refreshGrid();
				break;
			}
			case 'add': {
				postMessage(evtData);
				break;
			}
			case 'pick-org': {
				postMessage(evtData);
				break;
			}
			case 'edit': {
				const activeRec = (selectedMembers.length == 1 && selectedMembers[0]);
				const canEdit = canEditProjectTeamRec(activeRec, appInfo?.gblConfig, true);
				if (canEdit) {
					dispatch(setCurrentSelection(activeRec));
					setOpenRightPanel(true);
				} else {
					setOpenRightPanel(false);
					dispatch(setCurrentSelection(null));
					appInfo?.gblConfig?.isCompanyManager && setLocalToastMessage('This worker is not part of your company.You can view/update workers records that belong to your company.');
				}
				break;
			}
			case 'delete': {
				setAlert({
					open: true,
					title: "Project Team",
					contentText: <span>Are you sure you want to delete the selected user(s)?</span>,
					handleAction: (event: any, type: any) => {
						setAlert({
							open: false
						});
						if (type === 'yes') {
							deleteMembers();
						}
					}
				});
				break;
			}
			case 'act-dect': {
				memberPrivilegeChange();
				break;
			}
			case 'livelink': {
				postMessage(evtData);
				break;
			}
			case 'livechat': {
				postMessage(evtData);
				break;
			}
			case 'email': {
				let emailList = selectedMembers.map((item: any) => item.email);
				window.open('mailto:' + emailList.join(',') + '?subject=&body=');
				break;
			}
			case 'supplemental': {
				postMessage(evtData);
				break;
			}
			case 'procore': {
				postMessage(evtData);
				break;
			}
			case 'reinvite': {
				setAlert({
					open: true,
					title: "Confirmation",
					contentText: <span>Are you sure you want to re-invite the selected user(s)?</span>,
					handleAction: (event: any, type: any) => {
						setAlert({
							open: false
						});
						if (type === 'yes') {
							reInviteMembers();
						}
					}
				});
				break;
			}
			case 'sap': {
				postMessage(evtData);
				break;
			}
			case 'attestment': {
				postMessage(evtData);
				break;
			}
			case 'managecompany': {
				postMessage(evtData);
				break;
			}
			case 'verify': {
				setAlert({
					open: true,
					title: "Verify Users",
					contentText: "Are you sure you would like to verify the selected user(s)?",
					handleAction: (event: any, type: any) => {
						setAlert({
							open: false
						});
						if (type === 'yes') {
							verifyMembers();
						}
					}
				});
				break;
			}
			case 'probation': {
				dispatch(setSafetyProbationPopOver(true));
				//postMessage(evtData);
				break;
			}
			default: {
				break;
			}
		}
	}, [selectedMembers, appInfo, rowData]);

	const QRCodeHandler = () => {
		setAlert({
			open: true,
			title: "Acquire Barcode",
			contentText: <QRCodeAlertUI ClickHandler={(value: any) => { setAlert({ open: false }); setSearchText(value); console.log('qrcode', value) }} />,
			handleAction: (event: any, type: any) => {
				setAlert({
					open: false
				});
				if (type === 'yes') {
					reInviteMembers();
				}
			},
			actions: false,
			dailogClose: true
		});
	}

	const userImageHandleOver = useCallback((e: any, params: any) => {
		const { pageX, pageY } = e;
		const { data } = params;
		const str = data?.globalId.toString();
		let evtData = {
			event: "launchcontactcard",
			body: { iframeId: iframeID, roomId: appInfo && appInfo.presenceRoomId, appType: appType },
			data: {
				pageX: pageX,
				pageY: pageY,
				openAction: 'hover',
				userId: '',
				userIntId: ''
			}
		};
		if (data?.globalId != '' && str.substring(0, 8) != "00000000") {
			evtData.data.userId = data?.globalId;
		} else if (data?.objectId && data?.objectId != '') {
			evtData.data.userIntId = data?.objectId;
		}
		let target = e.target;
		let timer = setTimeout(() => {
			postMessage(evtData);
		}, 500);
		target.addEventListener('mouseleave', function () {
			clearTimeout(timer);
		})
	}, [appInfo]);

	const getCompanyOptions = () => {
		let groupedList: any = [];
		companiesData.map((data: any) => {
			groupedList.push({
				...data,
				color: data.colorCode,
				displayField: data.name,
				thumbnailUrl: (data?.thumbnailUrl === "" ?? false) ? CompanyIcon
					: data?.thumbnailUrl
			});
		});
		return groupedList
	};
	React.useEffect(() => {
		if (CompanyData?.length > 0) {
			let data = getCompanyOptions();
			setCompanyOptions(data);
		};
	}, [CompanyData]);

	const getRoleOptions = () => {
		let groupedList: any = [];
		const FinalData = rolesData.filter((ele: any, ind: any) => ind === rolesData.findIndex((elem: any) => elem.id === ele.id && elem.text === ele.text))

		FinalData.map((data: any) => {
			groupedList.push({
				...data,
				label: data.value,
				value: data.id
			});
		});
		return groupedList
	}
	const getSkillsOptions = () => {
		let groupedList: any = [];
		skillsData.map((data: any) => {
			groupedList.push({
				...data,
				value: data.id,
				label: data.name,
				displayLabel: `${data.name + ' - ' + data.trade?.name}`
			});
		});
		setGridSkillsOptions(groupedList);
		return groupedList
	};

	const getTradesOptions = () => {
		let groupedList: any = [];
		tradesData.map((data: any, index: any) => {
			groupedList.push({
				...data,
				displayField: data.name
			});
		});
		return groupedList
	}
	/**
	 * Keeping it as a seperate col object as this needs to added dynamically
	 */
	const supplimentCol = {
		headerName: "Supplemental Info",
		field: "supplementalInfoItemID",
		minWidth: 210,
		cellRenderer: (params: any) => {
			return params?.data?.supplementalInfoItemID && (
				<Button
					className="supplemetal-info-btn"
					variant="contained"
					onClick={(e: any) => {
						e.stopPropagation();
						postMessage({
							event: 'projectteam',
							body: {
								evt: 'viewsup-info',
								iframeId: iframeID,
								roomId: appInfo && appInfo.presenceRoomId,
								appType: appType,
								supplementalInfoItemID: params?.data?.supplementalInfoItemID
							}
						});
						// setCurrentSelection(params?.data);
						// setDefaultTabId("userDetails");
						// setOpenRightPanel(true);
					}}
				>
					View/Update Info
				</Button>
			);
		},
	};

	/**
	 * Callback method, triggers from parent customHeader/Filter component on selection change
	 * Filters out the local table data based on the options selected and sets it to rowData state
	 * @param values Object 
	 * @author Srinivas Nadendla
	 */
	const onSafetyStatusFilterUpdated = (values: any) => {
		let existingFilters = { ...filteredValues };
		if (values?.ids?.length === 0 && existingFilters.hasOwnProperty('safetyStatus')) {
			delete existingFilters.safetyStatus;
			setFilteredValues({ ...existingFilters });
			setGridFilters({ ...existingFilters });
			setGridSafetyStatusFilters(values);
		} else {
			setGridFilters({ ...existingFilters, "safetyStatus": values.names });
			setFilteredValues({ ...existingFilters, "safetyStatus": values.names });
			setGridSafetyStatusFilters(values);
		};
	};
	/**
	 * Using a generic method for all cell edits, we can change the logic in future if needed in one place
	 * @param params row node data
	 * @returns boolean
	 */
	const isCellEditable = (params: any) => {
		return canEditProjectTeamRec(params?.data, appInfo?.gblConfig, true);
	};

	const handleOnSkillsChange = (selectedValues: any = [], params: any) => {
		const selectedValuesStr = selectedValues.sort().toString();
		let skillsFromParams: any = [];
		(params.data.skills || []).forEach((skill: any) => {
			skillsFromParams.push(skill.objectId);
		});
		const skillIdsStr = skillsFromParams.sort().toString();
		if (selectedValuesStr === skillIdsStr) {
			return;//Exiting from the func when there's no change in selection.
		}

		const mappedSKills: any = [];
		selectedValues.forEach((objectId: any) => {
			const skillObj = skillsData.find((rec: any) => rec.objectId == objectId);
			mappedSKills.push(skillObj);
		});
		validateAndPreparePayload('skills', params, { ...params.node.data, skills: mappedSKills });

	}

	const handleOnRegionsChange = (selectedValues: any = [], params: any) => {
		const selectedValuesStr = selectedValues.sort().toString();
		let regionsFromParams: any = [];
		(params.data.regions || []).forEach((region: any) => {
			regionsFromParams.push(region.id);
		});
		const regionsIdsStr = regionsFromParams.sort().toString();
		if (selectedValuesStr === regionsIdsStr) {
			return;
		};

		let mappedRegions: any = [];
		selectedValues.forEach((recId: any) => {
			const regionObj = (regionsOriginalData|| []).find((rec: any) => rec.id == recId);
			mappedRegions.push(regionObj);
		});
		mappedRegions = (mappedRegions|| [])?.filter((x:any) => x?.id);
		validateAndPreparePayload("regions", params, { ...params.node.data, regions: mappedRegions });
	};

	const handleOnRolesChange = (selectedValues: any = [], params: any) => {
		const selectedValuesStr = selectedValues.sort().toString();
		let roleIdsFromParams: any = [];
		(params.data.roles || []).forEach((role: any) => {
			roleIdsFromParams.push(role.objectId);
		});
		const rolesIdsStr = roleIdsFromParams.sort().toString();
		if (selectedValuesStr === rolesIdsStr) {
			return;//Exiting from the func when there's no change in selection.
		}

		const mappedRoles: any = [];
		selectedValues.forEach((objectId: any) => {
			const rolesObj: any = rolesData.find((rec: any) => rec.id == objectId) || {};
			mappedRoles.push({ ...rolesObj, objectId: rolesObj?.id });
		});
		//setDynamicClose(!dynamicClose);
		validateAndPreparePayload('roles', params, { ...params.node.data, roleIds: selectedValues, roles: mappedRoles });

	}

	const handleCompanyChange = (selectedVal: any, params: any) => {
		if (selectedVal?.length > 0) {
			const oldCompanyObj: any = companyOptions.find((rec: any) => rec.id == params.data.company?.objectId) || {};
			if (selectedVal[0].id === oldCompanyObj.id) return;//Exiting from func if there's no change in selection
			const companyObj: any = companyOptions.find((rec: any) => rec.id == selectedVal?.[0]?.id) || {};

			validateAndPreparePayload('company', params, { ...params.node.data, company: { ...companyObj, objectId: companyObj?.id } });
		}
	}

	/**
	 * Sorts the empty records to bottom of the grid always
	 */
	const rtlsSortComparator = (a: any, b: any, isInverted: any, type: any) => {
		if (a === b) {
			return 0;
		} else if (!a) {
			return isInverted ? -1 : 1;
		} else if (!b) {
			return isInverted ? 1 : -1;
		} else {
			if (type === "string") {
				return a?.localeCompare(b);
			} else if (type === "date") {
				return new Date(a)?.getTime() - new Date(b)?.getTime();
			} else if (type === "time") {

			}

		}
	};

	const handleAdd = (selectedItem: any, searchValue: any, type: any) => {
		let eventType, options;
		switch (type) {
			case 'skill':
				eventType = 'addnewskill';
				options = skillsData;
				break;
			case 'company':
				eventType = 'addnewcompany';
				options = companyOptions;
				break;
			default:
				break;
		}
		setDynamicClose(!dynamicClose);
		setColumns(columns);
		postMessage({
			event: 'projectteam', body: {
				evt: eventType, searchValue: searchValue, listData: options
			}
		});
	};

	const handleSorting = (e: any) => {
		gridApi.columnModel.applyColumnState({
			state: [{ colId: 'safetyStatus', sort: e }],
			defaultState: { sort: null }
		});
	};
	/**
	 * All the columns cofigs related to all toggle's avaialble
	 * For maintanability purpose + to reduce duplicate instances for columns
	 */
	const allColumns: any = [
		{
			headerName: "",
			field: "thumbnailUrl",
			pinned: 'left',
			lockPosition: "left",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			minWidth: 80,
			maxWidth: 80,
			sortable: false,
			cellRenderer: (params: any) => {
				return (
					<Box
						component="img"
						sx={{
							height: 35,
							width: 35,
							// maxHeight: { xs: 233, md: 167 },
							// maxWidth: { xs: 350, md: 250 },
							display: "flex",
						}}
						className="thumbnail_image"
						alt={params?.data?.firstName}
						src={params?.data?.thumbnailUrl}
						onMouseOver={(e: any) => {
							userImageHandleOver(e, params);
						}}
						onClick={(event: any) => {
							if (event.detail == 2) {
								const currentRec = params?.data,
									canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
								if (canEdit) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								} else {
									setOpenRightPanel(false);
									dispatch(setCurrentSelection(null));
									appInfo?.gblConfig?.isCompanyManager && setLocalToastMessage('This worker is not part of your company.You can view/update workers records that belong to your company.');
								}
							}
						}}
					/>
				);
			},
		},
		{
			headerName: "First Name",
			field: "firstName",
			pinned: 'left',
			lockPosition: "left",
			width: 150,
			minWidth: 100,
			valueGetter: firstCharValueGetter,
			keyCreator: firstCharKeyCreator,
			//editable: isCellEditable,
			sortable: true,
			comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
				return (valueA?.name ?? valueA)?.localeCompare((valueB?.name ?? valueB), 'en', { numeric: true })
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				let color,
					icon,
					hasSafetyIcon = false,
					hasRTLSIcon = false,
					rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
				if (params?.data?.isViolated && params?.data?.safetyStatus != 8) {
					color = 'red';
					icon = 'common-icon-exclamation';
					hasSafetyIcon = true;
				}
				if (activeToggle === "rtls" && (rtlsConnectorType == 1 || rtlsConnectorType == 3) && params?.data?.activityColor) {
					hasRTLSIcon = true;
				};
				const StrLength = params.data.firstName.length;
				if (params?.data?.firstName ?? false) {
					if ((hasSafetyIcon || hasRTLSIcon)) {
						return StrLength > 11 ? params.data.firstName : null;
					} else {
						return StrLength > 14 ? params.data.firstName : null;
					}
				}
			},
			cellRenderer: (params: any) => {
				let color,
					icon,
					hasSafetyIcon = false,
					hasRTLSIcon = false,
					rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
				if (params?.data?.isViolated && params?.data?.safetyStatus != 8) {
					color = 'red';
					icon = 'common-icon-exclamation';
					hasSafetyIcon = true;
				}
				if (activeToggle === "rtls" && (rtlsConnectorType == 1 || rtlsConnectorType == 3) && params?.data?.activityColor) {
					hasRTLSIcon = true;
				}
				return (
					<>
						{!params.data.showFirstNameEditor && (
							<>
								<span
									className="projectteam_gridColumn"
									style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
									onClick={(event: any) => {
										const currentRec = params?.data,
											canEdit = canEditProjectTeamRec(
												currentRec,
												appInfo?.gblConfig,
												true
											);
										if (event.detail == 2) {
											if (canEdit) {
												dispatch(setCurrentSelection(params?.data));
												setDefaultTabId("userDetails");
												setOpenRightPanel(true);
											}
										} else {
											if (canEdit) {
												firstNameCellOldValRef.current = params.data.firstName;
												params.node.setData({
													...params.node.data,
													showFirstNameEditor: true,
												});
												setTimeout(() => {
													if (firstNameTextFieldRef.current) firstNameTextFieldRef.current.focus();
												}, 100)
											}
										}
									}}
								>
									{params?.data?.firstName}
								</span>
								{hasRTLSIcon ? (
									<span
										className="common-icon-connecting icon_size status_icon"
										style={{ color: params?.data?.activityColor }}
									/>
								) : (
									""
								)}
								{hasSafetyIcon ? (
									<span
										className={` ${icon} icon_size status_icon`}
										style={{ color: color, cursor: "pointer" }}
										onClick={(event: any) => {
											dispatch(setCurrentSelection(params?.data));
											setDefaultTabId("safetyViolation" + '&' + Date.now());
											setOpenRightPanel(true);
										}}
									/>
								) : (
									""
								)}
							</>
						)}{" "}
						{params.data.showFirstNameEditor && (
							<div className="pt-first-name_editor-cls">
								<TextField
									inputRef={firstNameTextFieldRef}
									defaultValue={params.data?.firstName}
									onBlur={() => {
										//Check for value changed or not - hit api only when there is a change
										if (firstNameCellOldValRef.current !== params.data.firstName) {
											validateAndPreparePayload('firtsName', params, {
												...params.node.data,
												showFirstNameEditor: false
											});
										} else {
											params.node.setData({
												...params.node.data,
												showFirstNameEditor: false
											})
										}
										firstNameCellOldValRef.current = '';
									}}
									onChange={(e: any) => {
										params.node.setData({
											...params.node.data,
											firstName: e.target.value
										});
									}}
								></TextField>
							</div>
						)}
					</>
				);
			},
		},
		{
			headerName: "Last Name",
			field: "lastName",
			pinned: 'left',
			lockPosition: "left",
			width: 150,
			minWidth: 100,
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params.data.lastName && params.data.lastName.length > 20 ? params.data.lastName : null;
			},
			// sort: 'asc',
			editable: isCellEditable,
			cellRenderer: (params: any) => {
				return (
					<span className="projectteam_gridColumn"
						style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
						onClick={(event: any) => {
							if (event.detail == 2) {
								const currentRec = params?.data,
									canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
								if (canEdit) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								}
							}
						}}>
						{params?.data?.lastName}
					</span>
				);
			},
		},
		{
			headerName: "Company",
			field: "company",
			minWidth: 150,
			valueGetter: (params: any) => params?.data?.company?.name,
			keyCreator: (params: any) => {
				return params?.data?.company?.name ? params?.data?.company?.name : 'None'
			},
			//editable: isCellEditable,
			cellRenderer: (params: any) => {
				const options = getCompanyOptionsForInline(params);
				const isOnlyCompanyManager = (appInfo?.gblConfig?.isCompanyManager || appInfo?.gblConfig?.isComplianceManager) && !(appInfo?.gblConfig?.isAdmin || appInfo?.gblConfig?.isProjectAdmin);
				const canEdit = isCellEditable(params) && !isOnlyCompanyManager;
				return (
					<>
						<CompanyCardTooltip
							className={"pt-CompanyTooltip-main"}
							title={<CompanyTooltip data={params?.data} />}
							// open={params?.data?.company?.name == 'MKSA29-1' ? true : false}
							placement={"right"}
							arrow
							sx={{
								".MuiTooltip-tooltip ": {
									padding: "0px",
								},
							}}
							enterDelay={1000}
							disableFocusListener
							disableTouchListener
						>
							<div>
								{canEdit && (
									<div className={`pt-${params?.column?.colId}`}>
										<SUIBaseDropdownSelector
											value={[
												{
													id: params?.data?.company?.objectId,
													displayField: params?.data?.company?.name,
													color: params?.data?.company?.color,
													thumbnailId: params?.data?.company?.thumbnailId,
												},
											]}
											width="100%"
											menuWidth="450px"
											placeHolder={""}
											dropdownOptions={options.companyOptions || []}
											noDataFoundMsg={
												<div className="no-rows-msg">
													<span className="common-icon-No-Item-Available"></span>
													<div className="empty-rows-mark">No match found</div>
													<div>You can add it by clicking + button</div>
												</div>
											}
											handleValueChange={(value: any) => {
												handleCompanyChange(value, params);
											}}
											showFilterInSearch={false}
											showSearchInSearchbar={true}
											basecustomline={true}
											image={true}
											hideTooltip={true}
											multiSelect={false}
											showSuggested={
												options.suggestedOptions.length === 0 ? false : true
											}
											suggestedDropdownOptions={options.suggestedOptions || []}
											handleAdd={(a: any, b: any) => handleAdd(a, b, "company")}
											suggestedText={"Suggested (based on trade):"}
											dynamicClose={dynamicClose}
											enforcedRelationship={isEnForced}
											moduleName={"userDetails"}
											insideGridCellEditor={true}
											handleListOpen={() => {
												const toolpTipEle: any =
													document.getElementsByClassName(
														"pt-CompanyTooltip-main"
													)[0];
												if (toolpTipEle) {
													toolpTipEle.style.display = "none";
												}
											}}
										></SUIBaseDropdownSelector>
									</div>
								)}
								{!canEdit && <span>{params?.data?.company?.name}</span>}
							</div>
						</CompanyCardTooltip>
					</>
				);
			}
		},
		{
			headerName: "Email",
			field: "email",
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}}>{params?.data?.email}</span>; // class name is fieldname
			},
			minWidth: 250
		},
		{
			headerName: "Regions",
			field: "regions",
			minWidth: 100,
			cellRenderer: (params: any) => {
				const canEdit = (appInfo?.orgId ?? false);
					return (
						<>
						{canEdit &&
							<div className={`pt-${params?.column?.colId}`}>
								<SmartDropDown
									options={regionsData || []}
									dropDownLabel=""
									isSearchField={true}
									isMultiple={true}
									selectedValue={(params.data && params?.data?.regions?.length) ? params?.data?.regions?.map((data: any) => data?.id || data?.name) : []}
									isFullWidth
									outSideOfGrid={true}
									menuProps={classes.menuPaper}
									sx={{ fontSize: '18px' }}
									Placeholder={''}
									showCheckboxes={true}
									reduceMenuHeight={true}
									showAddButton={false}
									doTextSearch={true}
									isCustomSearchField={false}
									dynamicClose={dynamicClose}
									insideGridCellEditor={true}
									handleListClose={(value: any) => {
										handleOnRegionsChange(value, params);
									}}
								/>
							</div>
						}
						{!canEdit && <span className={`pt-${params?.column?.colId}`}>
							{params?.data?.regions &&
								params?.data?.regions?.map((obj: any) => obj.name).join(", ")}{" "}
						</span>}
					</>
					)
			},
		},
		{
			headerName: "RTLS ID",
			field: "rtlsId",
			minWidth: 100,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}
				>{params?.data?.rtlsId}</span>; // class name is fieldname
			},
		},
		{
			headerName: "GPS Tag ID",
			field: "gpsTagId",
			minWidth: 150,
			editable: isCellEditable,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}
				>{params?.data?.gpsTagId}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Permissions",
			field: "projectZonePermissions",
			minWidth: 200,
			comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
				return rtlsSortComparator(nodeA?.data?.permissionTypeSortText, nodeB?.data?.permissionTypeSortText, isDescending, 'string');
			},
			keyCreator: (params: any) => {
				let list = [],
					isMTA = appInfo?.isMTA,
					zonePermission = params?.data?.projectZonePermissions || [],
					adminValues: any = {
						'Admin': isMTA ? 'Full Access with All Permissions (Super Admin)' : 'Admin access for the Assigned Role (Admin)',
						'ProjectAdmin': 'Admin access for the Assigned Role (Admin)',
						'AdminWithBilling': 'Admin access for the Assigned Role & Purchase Add-ons (Admin with Billing)',
						'ProjectTeamManager': 'Can Add Users and Companies (Project Team Manager)',
						'Company Manager': 'Can Add and Manage my Company Workers and Attestation (Company Manager)',
						'Compliance Manager': 'Manage my Company’s Certificate of Insurance and Diversity Information (Compliance Manager)'
					};

				if (adminValues[params?.data?.userPermissionType])
					list.push(adminValues[params?.data?.userPermissionType]);
				for (var indx in zonePermission) {
					var record = assignUnassignData2.find((obj: any) => zonePermission[indx].name == obj.value);
					if (record) {
						if (appInfo?.gblConfig?.projectPlanSettings?.Modes?.financeMode == true)
							list.push(record.text);
					} else {
						list.push(adminValues[zonePermission[indx].name]);
					}
				};
				return list?.join(", ");
			},
			cellRenderer: (params: any) => {
				let list = [],
					isMTA = appInfo?.isMTA,
					zonePermission = params?.data?.projectZonePermissions || [],
					adminValues: any = {
						'Admin': isMTA ? 'Full Access with All Permissions (Super Admin)' : 'Admin access for the Assigned Role (Admin)',
						'ProjectAdmin': 'Admin access for the Assigned Role (Admin)',
						'AdminWithBilling': 'Admin access for the Assigned Role & Purchase Add-ons (Admin with Billing)',
						'ProjectTeamManager': 'Can Add Users and Companies (Project Team Manager)',
						'Company Manager': 'Can Add and Manage my Company Workers and Attestation (Company Manager)',
						'Compliance Manager': 'Manage my Company’s Certificate of Insurance and Diversity Information (Compliance Manager)'
					};

				if (adminValues[params?.data?.userPermissionType])
					list.push(adminValues[params?.data?.userPermissionType]);
				for (var indx in zonePermission) {
					var record = assignUnassignData2.find((obj: any) => zonePermission[indx].name == obj.value);
					if (record) {
						if (appInfo?.gblConfig?.projectPlanSettings?.Modes?.financeMode == true)
							list.push(record.text);
					} else {
						list.push(adminValues[zonePermission[indx].name]);
					}
				};
				return (
					<span className="pt-projectZonePermissions" onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}>
						{
							list?.join(", ")
						}{" "}
					</span>
				);
			}
		},
		{
			headerName: "Role",
			field: "roles",
			cellRenderer: (params: any) => {
				const canEdit = isCellEditable(params);

				return (
					<>
						{params.data?.roles?.length > 0 ?
							(<AutoWidthTooltip
								className={"pt-RolesTooltip-main"}
								title={
									<ProjectTeamRolesTooltip
										params={params}
										appInfo={appInfo}
										rolesVal={
											params?.data?.roles && getRoles(params?.data?.roles)
										}
									></ProjectTeamRolesTooltip>
								}
								placement={"right"}
								arrow
								sx={{
									".MuiTooltip-tooltip ": {
										padding: "0px",
									},
								}}
								enterDelay={1500}
								disableFocusListener
								disableTouchListener
							>
								<div className="pt-role-column">
									{canEdit && (
										<SmartDropDown
											options={getRoleOptions()}
											dropDownLabel=""
											isSearchField={true}
											isMultiple={true}
											selectedValue={
												params.data
													? params?.data?.roles?.map(
														(data: any) => data.objectId || data
													)
													: []
											}
											isFullWidth
											outSideOfGrid={true}
											// handleChange={(value: any) =>
											// 	handleOnRolesChange(value, params)
											// }
											menuProps={classes.menuPaper}
											sx={{ fontSize: "18px" }}
											Placeholder={""}
											showCheckboxes={true}
											reduceMenuHeight={true}
											isCustomSearchField={false}
											insideGridCellEditor={true}
											doTextSearch={true}
											dynamicClose={dynamicClose}
											handleListOpen={() => {
												const toolpTipEle: any = document.getElementsByClassName(
													"pt-RolesTooltip-main"
												)[0];
												if (toolpTipEle) {
													toolpTipEle.style.display = "none";
												}
											}}
											handleListClose={(value: any) => {
												handleOnRolesChange(value, params);
											}}
										/>
									)}
									{!canEdit &&
										getRoles(params?.data?.roles)
									}
								</div>
							</AutoWidthTooltip>) : (<div className="pt-role-column">{canEdit && (
								<SmartDropDown
									options={getRoleOptions()}
									dropDownLabel=""
									isSearchField={true}
									isMultiple={true}
									selectedValue={
										params.data
											? params?.data?.roles?.map(
												(data: any) => data.objectId || data
											)
											: []
									}
									isFullWidth
									outSideOfGrid={true}
									// handleChange={(value: any) =>
									// 	handleOnRolesChange(value, params)
									// }
									menuProps={classes.menuPaper}
									sx={{ fontSize: "18px" }}
									Placeholder={""}
									showCheckboxes={true}
									reduceMenuHeight={true}
									doTextSearch={true}
									isCustomSearchField={false}
									insideGridCellEditor={true}
									dynamicClose={dynamicClose}
									handleListOpen={() => {
										const toolpTipEle: any = document.getElementsByClassName(
											"pt-RolesTooltip-main"
										)[0];
										if (toolpTipEle) {
											toolpTipEle.style.display = "none";
										}
									}}
									handleListClose={(value: any) => {
										handleOnRolesChange(value, params);
									}}
								/>
							)}</div>)
						}
					</>
				);
			}
		},
		{
			headerName: "Trade",
			field: "tradeName",
			minWidth: 150,
			keyCreator: (params: any) => {
				return params?.data?.trade?.name ? params?.data?.trade?.name : 'None'
			},
			valueGetter: (params: any) => params?.data?.trade?.name,
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.trade?.name}</span>;
			}
		},
		{
			headerName: "Skills",
			field: "skills",
			minWidth: 150,
			cellRenderer: (params: any) => {
				const canEdit = isCellEditable(params);
				return (
					<>
						{canEdit &&
							<div className={`pt-${params?.column?.colId}`}>
								<SmartDropDown
									options={getSkillsOptions()}
									//LeftIcon={<span className='common-icon-orgconsole-skills-certs userdetails_icons userdetails_icon_Color' />}
									dropDownLabel=""
									isSearchField={true}
									isMultiple={true}
									selectedValue={(params.data && params?.data?.skills?.length) ? params?.data?.skills?.map((data: any) => data.objectId || data) : []}
									isFullWidth
									outSideOfGrid={true}
									//handleChange={(value: any) => handleOnSkillsChange(value, params)}
									menuProps={classes.menuPaper}
									sx={{ fontSize: '18px' }}
									Placeholder={''}
									showCheckboxes={true}
									reduceMenuHeight={true}
									showAddButton={true}
									noDataFoundMsg={<div className="no-rows-msg"><span className="common-icon-No-Item-Available"></span><div className="empty-rows-mark">No match found</div><div>You can add it by clicking + button</div></div>}
									doTextSearch={true}
									isCustomSearchField={false}
									handleAddCategory={(sVal: any) => handleAdd('', sVal, 'skill')}
									dynamicClose={dynamicClose}
									insideGridCellEditor={true}
									handleListClose={(value: any) => {
										handleOnSkillsChange(value, params);
									}}
								/>
							</div>
						}
						{!canEdit && <span className={`pt-${params?.column?.colId}`}>
							{params.data?.skills &&
								params.data.skills.map((obj: any) => obj.name).join(", ")}{" "}
						</span>}
					</>
				);
			}
		},
		{
			headerName: "Work Teams",
			field: "workTeams",
			minWidth: 170,
			hide: true,
			keyCreator: (params: any) => { return AddNoneToEmptyRec(params?.data?.teams) },
			valueGetter: (params: any) => { return AddNoneToEmptyRec(params?.data?.teams) }
		},
		{
			headerName: "Work Category",
			field: "workCategoryName",
			minWidth: 170,
			keyCreator: (params: any) => {
				return params?.data?.workCategory?.name ? params?.data?.workCategory?.name : 'None'
			},
			valueGetter: (params: any) => params?.data?.workCategory?.name,
			comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
				return rtlsSortComparator(nodeA.data?.workCategory?.name, nodeB?.data?.workCategory?.name, isDescending, 'string');
				// return nodeA.data?.workCategory?.name?.localeCompare(nodeB?.data?.workCategory?.name, 'en', { numeric: true })
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.workCategory?.name}</span>; // class name is fieldname
			}
		},
		{
			headerName: "Safety Status",
			minWidth: 300,
			field: "safetyStatus",
			pinned: activeToggle === "safety" ? "left" : "",
			lockPosition: activeToggle === "safety" ? "left" : "",
			headerComponent: CustomHeader,
			sortable: true,
			valueGetter: (params: any) => getSafteyStatus(params?.data?.safetyStatus),
			keyCreator: (params: any) => {
				return getSafteyStatus(params?.data?.safetyStatus) ? getSafteyStatus(params?.data?.safetyStatus) : 'None'
			},
			headerComponentParams: {
				options: SafetyStatusOptions,
				columnName: 'Safety Status',
				filterUpdated: (values: any) => onSafetyStatusFilterUpdated(values),
				showSorting: true,
				handleSorting: (e: any) => handleSorting(e),
				defaultFilters: gridSafetyStatusFilters
			},
			cellRenderer: (params: any) => {
				return (
					<span
						className={"pt-safetyStatus " + getSafteyStatusCls(params?.data?.safetyStatus)}
						style={{ backgroundColor: getSafteyStatusColor(params?.data?.safetyStatus) }}
						onClick={(event: any) => {
							if (event.detail == 2) {
								const currentRec = params?.data,
									canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
								if (canEdit) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								}
							}
						}}
					>
						{" "}
						{getSafteyStatus(params?.data?.safetyStatus)}{" "}
					</span>
				);
			},
		},
		{
			headerName: "Policy Status",
			minWidth: 200,
			field: "policyStatus",
			cellRenderer: (params: any) => {
				return (
					<span
						className={`pt-${params?.column?.colId}` + " " + getPolicyStatusCls(params?.data?.policyStatus)}
						onClick={(event: any) => {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("safetyPolicies");
								setOpenRightPanel(true);
							}
						}}
					>
						{getPolicyStatus(params?.data?.policyStatus)}
					</span>
				);
			}
		},
		{
			headerName: "Certification Status",
			minWidth: 210,
			field: "certificateStatus",
			cellRenderer: (params: any) => {
				return (
					<span
						className={
							"pt-certificateStatus " +
							getCertificateStatusCls(params?.data?.certificateStatus)
						}
						onClick={(event: any) => {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("certifications");
								setOpenRightPanel(true);
							}
						}}
					>
						{" "}
						{getCertificateStatus(params?.data?.certificateStatus)}{" "}
					</span>
				);
			}
		},
		{
			headerName: "Verified Date",
			field: "safetyVerifiedOn",
			minWidth: 150,
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params.data?.safetyVerifiedOn && getDate(params.data?.safetyVerifiedOn)}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Smartapp Account",
			field: "isRegistered",
			minWidth: 190,
			sortable: true,
			comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
				let a = nodeA.data?.globalId && nodeA.data?.globalId.indexOf('00000000') > -1 ? 'No' : 'Yes';
				let b = nodeB.data?.globalId && nodeB.data?.globalId.indexOf('00000000') > -1 ? 'No' : 'Yes'
				return a?.localeCompare(b);
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{(!params.data?.globalId || (params.data?.globalId && params.data?.globalId.indexOf('00000000') > -1)) ? 'No' : 'Yes'}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Phone",
			field: "phone",
			minWidth: 150,
			editable: isCellEditable,
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}
				>{params?.data?.phone}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Created Date",
			field: "createdDate",
			minWidth: 190,

			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}
				>{params.data?.createdDate && formatDate(params.data?.createdDate)}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Last Modified Date",
			field: "modifiedDate",
			minWidth: 190,
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}
				>{params.data?.modifiedDate && formatDate(params.data?.modifiedDate)}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Last Seen",
			field: "lastSeen",
			minWidth: 160,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'date');
			},
			keyCreator: (params: any) => {
				return (params?.data?.activityHeaderText ?? false) ? params?.data?.activityHeaderText : 'None'
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}>{params?.data?.lastSeen}</span>; // class name is fieldname
			}
		},
		{
			headerName: "Last Location",
			field: "lastLocation",
			minWidth: 150,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span
					className={`pt-${params?.column?.colId}`}
					style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
					onClick={(event: any) => {
						if (event.detail == 2) {
							const currentRec = params?.data,
								canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
							if (canEdit) {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("userDetails");
								setOpenRightPanel(true);
							}
						}
					}}>{params?.data?.lastLocation}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Total Trackable Time",
			field: "timeSpentToday",
			minWidth: 210,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.timeSpentToday}</span>; // class name is fieldname
			},
		},
		{
			headerName: "First Seen Today",
			field: "firstSeenToday",
			minWidth: 175,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				//return a?.localeCompare(b, 'en', { numeric: true });
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.firstSeenToday}</span>; // class name is fieldname
			},
		},
		{
			headerName: "First Seen Ever",
			field: "firstSeenEver",
			minWidth: 160,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.firstSeenEver}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Total Trackable Time Ever",
			field: "timeSpentEver",
			minWidth: 250,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <><span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.timeSpentEver}</span>{params?.data?.timeSpentEver && <span onClick={(event: any) => {
					const { pageX, pageY } = event;
					let evtData = {
						event: "rtlsuserreport",
						data: {
							pageX: pageX,
							pageY: pageY,
							userData: params?.data
						}
					};
					postMessage(evtData);
				}} className={`common-icon-Project-Info pt-${params?.column?.colId}-info`}></span>}</>; // class name is fieldname
			},
		},
		{
			headerName: "Source",
			field: "sourceText",
			minWidth: 100,
			comparator: (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
				return rtlsSortComparator(a, b, isInverted, 'string');
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params?.data?.sourceText}</span>; // class name is fieldname
			}
		},
		{
			headerName: "Company Manager Attestation",
			field: "companyManagerAttestation",
			width: 270,
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params.data?.companyManagerAttestation === 'AwaitingResponse' ? 'Awaiting Response' : 'Confirmed'}</span>; // class name is fieldname
			}
		},
		{
			headerName: "Probation Period",
			field: "probationPeriod",
			minWidth: 160,
			sortable: true,
			comparator: (valueA: any, valueB: any) => {
				return valueA - valueB;
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params.data?.probationPeriod > 0 ? (params.data?.probationPeriod == 1 ? '1 day' : params.data?.probationPeriod + ' days') : ''}</span>; // class name is fieldname
			},
		},
		{
			headerName: "Renew Required",
			field: "renewalRequired",
			sortable: true,
			minWidth: 160,
			comparator: (valueA: any, valueB: any) => {
				return valueA - valueB;
			},
			cellRenderer: (params: any) => {
				return <span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
					if (event.detail == 2) {
						const currentRec = params?.data,
							canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
						if (canEdit) {
							dispatch(setCurrentSelection(params?.data));
							setDefaultTabId("userDetails");
							setOpenRightPanel(true);
						}
					}
				}}>{params.data?.renewalRequired > 0 ? (params.data?.renewalRequired == 1 ? '1 day' : params.data?.renewalRequired + ' days') : ''}</span>; // class name is fieldname
			},
		},
		supplimentCol,
	];
	allColumns.forEach((item: any) => {
		if (!item.sortable && item.field !== 'thumbnailUrl') item.sortable = true;
		if (!item.sortingOrder) item.sortingOrder = ['asc', 'desc'];
		if (!item.sort) {
			item.sort = null;
			item.sortIndex = null;
		}
		if (!item.suppressMenu) item.suppressMenu = true;
		if (!item?.comparator) {
			if (customSortingDateFields?.includes(item?.field)) {
				item.comparator = (a: any, b: any, nodeA: any, nodeB: any, isInverted: any) => {
					return rtlsSortComparator(a, b, isInverted, 'date');
				};
			};
			if (['certificateStatus', 'policyStatus']?.includes(item?.field)) {
				let colName = item.field === 'policyStatus' ? 'policyStatusText' : item.field === 'certificateStatus' ? 'certificateStatusText' : item.field;
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					if ((nodeA?.data?.[colName] ?? false) && (nodeB?.data?.[colName] ?? false)) {
						return rtlsSortComparator(nodeA?.data?.[colName], nodeB?.data?.[colName], isDescending, 'string');
					};
				}
			};
			if (customSortingObjFields.includes(item?.field)) {
				let colName = item.field === 'tradeName' ? 'trade' : item.field;
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					return rtlsSortComparator(nodeA?.data?.[colName]?.name, nodeB?.data?.[colName]?.name, isDescending, 'string');
				}
			};
			if (customSortingArrFields.includes(item?.field)) {
				let colName = item.field;
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					let a = getRoles(nodeA?.data?.[colName]);
					let b = getRoles(nodeB?.data?.[colName]);
					return rtlsSortComparator(a, b, isDescending, 'string');
					// return a?.localeCompare(b, 'en', { numeric: true });
				}
			};
			if (customSortingFields.includes(item?.field)) {
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					return valueA?.localeCompare(valueB, 'en', { numeric: true })
				};
			};
			if (!customSortingArrFields.includes(item?.field) && !customSortingObjFields.includes(item?.field) &&
				!customSortingStatusForFields.includes(item?.field) && !customSortingDateFields.includes(item?.field) &&
				!customSortingFields.includes(item?.field)) {
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					return valueA?.localeCompare(valueB, 'en', { numeric: true })
				};
			}
		}
	}
	);
	const memberColOrder = [
		"thumbnailUrl",
		"firstName",
		"lastName",
		"company",
		"email",
		// "regions",
		"rtlsId",
		"gpsTagId",
		"projectZonePermissions",
		"roles",
		"tradeName",
		"skills",
		"workCategoryName",
		// "safetyStatus",
		// "policyStatus",
		// "certificateStatus",
		"safetyVerifiedOn",
		"isRegistered",
		"phone",
		"createdDate",
		"modifiedDate",
		"lastSeen",
		"workTeams"
	];

	const rtlsColOrder = [
		"thumbnailUrl",
		"firstName",
		"lastName",
		// "regions",
		"lastSeen",
		"lastLocation",
		"timeSpentToday",
		"firstSeenToday",
		"firstSeenEver",
		"timeSpentEver",
		"sourceText",
		'company', 'roles', "tradeName", "skills", "workCategoryName",
		"safetyStatus", "policyStatus", "certificateStatus", 'projectZonePermissions',
		"workTeams"
	];

	const safetyColOrder = [
		"thumbnailUrl",
		"firstName",
		"lastName",
		"safetyStatus",
		"policyStatus",
		"certificateStatus",
		"safetyVerifiedOn",
		"company",
		"email",
		"phone",
		"projectZonePermissions",
		"roles",
		"tradeName",
		"skills",
		"workCategoryName",
		"isRegistered",
		// "regions",
		"rtlsId",
		"gpsTagId",
		"createdDate",
		"modifiedDate",
		"lastSeen",
		"workTeams"
	];
	/**
	 * Triggers when there is any change in the right side toggle.
	 * Pickinhg the order of the columns based on activeToggle and 
	 * Finding all matched columns based on fieldId keys and setting it to local column state.
	 * This way we can keep all columns in one array and maintain multiple array's with just field keys.
	 * 
	 * Adding supplimentCol all the way end - as safety columns will have dynamic columns in between 
	 * @author Srinivas Nadendla
	 */
	const getColumnsBasedOnOrder = () => {
		let orderedCols: any = [];
		let orderToFollow: any = [];

		if (activeToggle === "member" || activeToggle === "usergroups") {
			orderToFollow = memberColOrder;
			if (appInfo?.isFromORG) {
				orderToFollow.splice(6, 0, 'regions');
			}
			if (appInfo?.gblConfig?.currentProjectInfo?.safetyTracking || isLocalhost) {
				var isRegion = orderToFollow.findIndex((x: any) => x === "regions") > -1,
					safetyindex = isRegion ? 14 : 13;

				orderToFollow.splice(safetyindex, 0, 'safetyStatus');
				orderToFollow.splice(safetyindex + 1, 0, 'policyStatus');
				orderToFollow.splice(safetyindex + 2, 0, 'certificateStatus');
			}
		} else if (activeToggle === "rtls") {
			orderToFollow = rtlsColOrder;
			if (appInfo?.isFromORG) {
				orderToFollow.splice(3, 0, 'regions');
			};
		} else if (activeToggle === "safety") {
			const safetyOrderCols = [...safetyColOrder];
			if (
				appInfo?.currentProjectInfo?.isWorkerAttestmentOn &&
				appInfo?.isCompanyManager
			) {
				safetyOrderCols.push("companyManagerAttestation");
			}
			if (appInfo?.currentProjectInfo?.allowUserProbation) {
				safetyOrderCols.push("probationPeriod");
			}
			if (appInfo?.currentProjectInfo?.allowUserRenewal) {
				safetyOrderCols.push("renewalRequired");
			}
			orderToFollow = safetyOrderCols;
			if (appInfo?.isFromORG) {
				orderToFollow.splice(16, 0, 'regions');
			}
		}
		orderToFollow.forEach((fieldId: any) => {
			let colConfig = allColumns.find((col: any) => col.field === fieldId);
			colConfig.menuTabs = [];
			if (activeToggle === 'rtls' && hideRtlsColumns?.includes(fieldId)) {
				colConfig.hide = true;
			};
			if ((activeToggle === 'safety' || activeToggle === 'member') && fieldId === "lastSeen") {
				colConfig.hide = true;
			} else if (activeToggle === 'rtls' && fieldId === "lastSeen") {
				colConfig.hide = false;
			} else if (activeToggle === 'safety' || activeToggle === 'member') {
				colConfig.hide = false;
			};
			if (fieldId === 'workTeams') {
				colConfig.hide = true;
			};
			orderedCols.push(colConfig);
		});
		if (activeToggle === "safety") {
			//For safety toggle - add dynamic columns
			orderedCols = orderedCols.concat(formattedSafetyColumns);
		}
		if (hasSupplementalInfo) {
			orderedCols.push(supplimentCol);
		};

		//Removing the last seen and online status in groups and filter
		if (groupOptions?.length > 0 && groups?.length > 0) {
			let canShow = appInfo?.gblConfig?.currentProjectInfo?.safetyTracking || isLocalhost;
			groups.map((x: any) => {
				if (x.text === "Safety Status" || x.text === "Policy Status" || x.text === "Certification Status") {
					x.hidden = !canShow;
				} else if (x.text === "Last Seen") {
					x.hidden = (activeToggle === 'safety' || activeToggle === 'member' || activeToggle === "usergroups");
				}
			})
			setGroups(groups);
		}
		if (filters?.length > 0) {
			let canShow1 = appInfo?.gblConfig?.currentProjectInfo?.safetyTracking || isLocalhost,
				canShow2 = canShow1 && (appInfo?.gblConfig?.currentProjectInfo?.isWorkerAttestmentOn || isLocalhost);
			filters.map((x: any) => {
				if (x.text === "Safety Status" || x.text === "Policy Status" || x.text === "Certification Status") {
					x.hidden = !canShow1;
				} else if (x.text === "Company Manager Attestation") {
					x.hidden = !canShow2;
				} else if (x.text === "Online Status") {
					x.hidden = !(activeToggle === 'rtls');
				} else if (x.text === "Permissions" && x?.children?.items?.length > 0) {
					const isMTA = appInfo?.isMTA;
					x.children.items.map((pi: any) => {
						if (pi.isMTA === true) {
							pi.hidden = !isMTA;
						} else if (pi.isMTA === false) {
							pi.hidden = isMTA;
						}
					})
				}
			})
			setFilters(filters);
		}
		//End
		if ((groupKeyValue?.current ?? false) && groupKeyValue?.current !== "" && groupKey !== "") {
			if (groupKeyValue?.current !== "") {
				orderedCols.forEach((col: any) => {
					if (col.rowGroup = groupKeyValue.current === col.field) {
						col.rowGroup = groupKeyValue.current === col.field;
					};
				});
			};
		};
		if ((orderedCols ?? false) && (appInfo ?? false) && (gridApi ?? false)) {
			const SortingCol = GetSortingCookie();
			orderedCols.forEach((element: any) => {
				if ((SortingCol === undefined || SortingCol === null) && element.field === 'lastName') {
					element.sort = 'asc';
					element.sortIndex = 0;
				} else if ((SortingCol ?? false) && SortingCol?.[0]?.colId === element.field) {
					element.sort = SortingCol[0].sort;
					element.sortIndex = SortingCol[0].sortIndex;
				} else {
					element.sort = null;
					element.sortIndex = null;
				}
			});
		};
		setColumns(orderedCols);
	};
	useEffect(() => {
		getColumnsBasedOnOrder();
		if (activeToggle && appInfo) {
			addCookie(`activeToggle_${appInfo?.projectId}_${CookieTitle}`, activeToggle);
		};
	}, [activeToggle, rolesData, rowData, formattedSafetyColumns, appInfo]);
	useEffect(() => {
		console.log('updatetotalcount', rowData, new Date());
		const pTitle = appInfo?.viewConfig?.title || popTitle || '';
		if (rowData?.length > 0 && pTitle && pTitle.indexOf('Team Orientation') >= 0) {
			setPopTitle('Team Orientation (' + rowData.length + ')');
		} else if (pTitle && pTitle.indexOf('Team Orientation') >= 0) {
			setPopTitle('Team Orientation');
		}
	}, [rowData]);
	useEffect(() => {
		if (groupKey !== "" && (currentSelection ?? false) && Object.keys(currentSelection)?.length > 0) {
			gridApi && gridApi.deselectAll();
			dispatch(setSelectedMembers([]));
		};
	}, [groupKey]);
	useEffect(() => {
		if (reAssignState && appInfo) {
			let data: any;
			if (groupKey !== "") {
				onGridGroupingChange(groupKey ?? groupKeyValue?.current)
			};
			if (filteredValues && Object.keys(filteredValues)?.length > 0 && localRowData?.length > 0) {
				data = GetFiltersData([...localRowData], filteredValues);
				if (searchKey.current !== "" ?? searchText) {
					let searchData = SearchBy((searchKey.current ?? searchText), data);
					setRowData(searchData);
				} else {
					setRowData(data);
				};
			} else if ((searchKey.current !== "" ?? searchText) && localRowData?.length > 0) {

				let searchData = SearchBy((searchKey.current ?? searchText), [...localRowData]);
				setRowData(searchData);
			} else {
				setRowData([...localRowData]);
			};
			addCookie(`groupKey_${appInfo?.projectId}_${CookieTitle}`, groupKeyValue?.current ?? groupKey);
			addCookie(`filters_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(filteredValues || ''));
			addCookie(`searchText_${appInfo?.projectId}_${CookieTitle}`, searchText);
			if (Object.keys(filteredValues).length === 0) {
				setGridFilters(filteredValues);
			};
			setReAssignState(false);
		};
	}, [reAssignState, filteredValues, localRowData, searchText, groupKey]);
	useEffect(() => {
		if (onlineStatusAssignState && radioRef.current === '') {
			let filterState = { ...filteredValues };
			if (filterState.hasOwnProperty('onlineStatus')) {
				delete filterState.onlineStatus;
			};
			setFilteredValues(filterState);
			setGridFilters(filterState);
			setOnlineStatusAssignState(false);
		};
	}, [onlineStatusAssignState])
	/**
	 * Triggers when there's any change in the selection and all selected records can be fetched using 
	 * event?.api?.getSelectedRows() or event?.api?.getSelectedNodes()
	 * @param event 
	 * @author Srinivas Nadendla
	 */
	const onSelectionChanged = (event: any) => {
		const selectedRowItems = event?.api?.getSelectedRows() || [];
		const selectedNodes = event?.api?.getSelectedNodes();
		// console.log('onSelectionChanged', event);
		const selectedRowIds = selectedNodes.map((n: any) => n.id).filter(Boolean) as string[];
		setGridSelectedRowIds(selectedRowIds);
		if (selectedNodes.length === 0 && openRightPanel && gridSelectedRowIds.length > 0) {
			gridSelectedRowIds?.forEach((id) => {
				const node = gridApi?.getRowNode(id)?.selected;
				if (!node) {
					gridApi?.getRowNode(id)?.setSelected(true);
				}
			})
		} else if (selectedNodes.length === 0 && openRightPanel) {
			setOpenRightPanel(!openRightPanel);
			dispatch(setSelectedMembers([]));
			dispatch(setCurrentSelection(null));
		} else {
			// selectedMembers is previously selected rows
			const newlySelectedRow = selectedRowItems.filter((s: any) => {
				return selectedMembers?.indexOf(s) == -1
			});
			const selectedRow = newlySelectedRow?.length > 0 ? newlySelectedRow[0] : selectedNodes?.length > 0 ? selectedNodes[selectedNodes.length - 1].data : {};
			if (!openRightPanel && !currentSelection
				|| currentSelection?.objectId !== selectedRow?.objectId) {
				dispatch(setCurrentSelection(selectedRow));
			}
			else if (openRightPanel && !currentSelection && selectedRow) {
				dispatch(setCurrentSelection(selectedRow));
			}
			dispatch(setSelectedMembers(selectedRowItems));
		}
	};
	/**
	 * Triggers when user enters a text on search input field and
	 * Searching in all rows data by converting whole object to string and
	 * Setting the rowData state with filtered data
	 * @param searchTxt String 
	 * @author Srinivas Nadendla
	 */
	const SearchBy = (val: any, array: any) => {
		const searchFields = ['firstName', 'phone', 'email', 'lastName', 'trade', 'company', 'skills', 'roles', 'barcode', 'rtlsId', 'gpsTagId', 'safetyStatusText', 'policyStatusText', 'certificateStatusText', 'source'];
		const CustomFileds = ['firstName', 'phone', 'email', 'lastName'];
		const lowerSearchTxt: string = val?.toLowerCase() || "";
		let searchData: any = array;
		const searchRegex = new RegExp(escapeRegExp(lowerSearchTxt), "i");
		let filteredRows: any = searchData?.filter((row: any) => {
			return Object.keys(row).some((field) => {
				if (searchFields.includes(field)) {
					if (Array.isArray(row[field])) {
						if (row[field]?.length > 0) {
							for (let i = 0; i < row[field].length; i++) {
								return Object.keys(row[field][i]).some((objField) => {
									return searchRegex?.test(row[field][i][objField]?.toString());
								});
							}
						} else {
							return false;
						};
					} else if (isNaN(row[field]) && typeof row[field] === 'object' && field == 'company') {
						return searchRegex?.test(row[field]['name']?.toString());
					} else if (isNaN(row[field]) && typeof row[field] === 'object') {
						return Object.keys(row[field]).some((objField) => {
							return searchRegex?.test(row[field][objField]?.toString());
						})
					} else {
						if ((lowerSearchTxt?.includes('+') ?? false) && CustomFileds.includes(field)) return row[field]?.includes(lowerSearchTxt);
						else return searchRegex?.test(row?.[field]?.toString());
					}
				};
			});
		});
		return filteredRows;
	};
	const debounceOnSearch = useCallback(_.debounce((val) => {
		searchKey.current = val;
		setSearchText(val);
		setReAssignState(true);
	}, 2000), [localRowData, filteredValues, rowData]);
	const onGridSearch = (searchTxt: string) => {
		if (searchTxt === "") {
			searchKey.current = "";
			debounceOnSearch(searchTxt);
		} else if (searchTxt !== "") {
			debounceOnSearch(searchTxt);
		};
	};
	/**
	 * Triggers on group selction menu change
	 * Based on selected value marking rowGroup to true/false dynamically and
	 * Updating the local columns state with the updated column configs
	 * @param selectedVal string/undefined selcted option from grouping dropdown
	 * @author Srinivas Nadendla
	 */
	const onGridGroupingChange = (selectedVal: any) => {
		const columnsCopy = [...columns];
		const SortingCol = GetSortingCookie();
		if (((selectedVal ?? false) && selectedVal !== "")) {
			setGroupKey(selectedVal);
			groupKeyValue.current = selectedVal;
			columnsCopy.forEach((col: any) => {
				if (col.rowGroup = selectedVal === col.field) {
					col.rowGroup = selectedVal === col.field;
				};
				if ((SortingCol === undefined || SortingCol === null) && col.field === 'lastName') {
					col.sort = 'asc';
					col.sortIndex = 0;
				} else if ((SortingCol ?? false) && SortingCol?.[0]?.colId === col.field) {
					col.sort = SortingCol[0].sort;
					col.sortIndex = SortingCol[0].sortIndex;
				} else {
					col.sort = null;
					col.sortIndex = null;
				};
			});
			setColumns(columnsCopy);
			setReAssignState(true);
		} else if (selectedVal === undefined) {
			setGroupKey('');
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				if (col.rowGroup) {
					col.rowGroup = false;
				};
				if ((SortingCol === undefined || SortingCol === null) && col.field === 'lastName') {
					col.sort = 'asc';
					col.sortIndex = 0;
				} else if ((SortingCol ?? false) && SortingCol?.[0]?.colId === col.field) {
					col.sort = SortingCol[0].sort;
					col.sortIndex = SortingCol[0].sortIndex;
				} else {
					col.sort = null;
					col.sortIndex = null;
				};
			});
			setColumns(columnsCopy);
			setReAssignState(true);
		};
	};
	/**
	 * Triggers once user done editing cell
	 * @param params 
	 */
	const onCellEditOver = (params: any) => {
		if (params.newValue == params.value) return;
		const colName = params.colDef.field;
		let updatedRec: any = {};
		//If needed add seperate case for each col
		switch (colName) {
			case "firstName":
			case "lastName":
			case "phone":
			case "gpsTagId":
			case "phone":
			case "rtlsId":
			case "regions":
				updatedRec = { ...params.node.data, [colName]: params.newValue };
				break;
			default:
				break;
		}

		validateAndPreparePayload(colName, params, updatedRec);
	};

	const validateAndPreparePayload = (colName: any, params: any, updatedRec: any) => {
		let selectedRoles = [],
			globalRole,
			workCategory;

		if (updatedRec?.workCategory) {
			workCategory = CategoriesData?.filter(
				(o: any) => updatedRec?.workCategory == o.id
			).map((o: any) => {
				return { id: o.id, value: o.name };
			});
			workCategory = workCategory.length > 0 ? workCategory[0] : null;
		}
		if (updatedRec?.roleIds?.length > 0) {
			globalRole = updatedRec?.roleIds[0];
			selectedRoles = getRoleOptions()
				?.filter((o: any) => updatedRec?.roleIds?.includes(o.id))
				.map((o: any) => {
					return { id: o.id, value: o.label };
				});
		}

		const payload = {
			firstName: updatedRec.firstName,
			lastName: updatedRec.lastName,
			phone: updatedRec.phone,
			barcode: updatedRec.barcode,
			company: {
				id: updatedRec?.company?.objectId,
				value: updatedRec?.company?.displayField || updatedRec?.company?.name,
			},
			defaultLocation: updatedRec.defaultLocation,
			gpsTagId: updatedRec?.gpsTagId,
			projectId: appInfo?.projectId,
			globalrole: globalRole,
			role: selectedRoles,
			rtlsId: updatedRec?.rtlsId,
			skills: updatedRec?.skills,
			regions:updatedRec?.regions,
			workcategory: workCategory,
			skillMapping: {
				skillIds: (updatedRec?.skills || []).map((o: any) => o.objectId),
				userId: updatedRec?.objectId,
			},
			id: updatedRec?.objectId,
			isUser: true,
		};
		console.log("diosdfiodsiods", payload.regions);
		const rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
		if (colName === 'rtlsId' &&
			updatedRec?.rtlsId !== params?.value &&
			(rtlsConnectorType == 1 || rtlsConnectorType == 3)
		) {
			checkIsRTLSIdExists(
				appInfo,
				{ rtlsId: updatedRec?.rtlsId, userId: updatedRec.objectId },
				function (isRTLSIdExists: any) {
					if (isRTLSIdExists === true) {
						setAlert({
							open: true,
							title: "Confirmation",
							contentText:
								"Would you like to change tag assignment to this user and remove from other user?",
							handleAction: (event: any, type: any) => {
								setAlert({
									open: false,
								});
								if (type == "yes") {
									executeSave(payload, params, updatedRec);
								}
							},
							actions: true,
							dailogClose: true,
						});
					} else {
						executeSave(payload, params, updatedRec);
					}
				}
			);
		} else {
			executeSave(payload, params, updatedRec);
		}
	};

	const executeSave = (payload: any, params: any, updatedRec: any) => {
		setLoadMask(true, 'project-team-gridcls');
		upsertUserDetails(appInfo, payload, function (res: any) {
			setLoadMask(false, 'project-team-gridcls');
			if (res?.success) {
				params.node.setData(updatedRec);
				setLocalToastMessage('User updated successfully');
			} else {
				setLocalToastMessage('Request failed!');
			}

		});
	}

	useEffect(() => {
		if (activeToggle === "rtls") {
			let today = new Date().setHours(0, 0, 0, 0),
				fromDate = `${new Date(today).toISOString().split('.')[0]}Z`;
			dispatch(fetchRTLSUsers({ appInfo: appInfo, fromDate: fromDate }));
		} else if (activeToggle === 'usergroups') {
			postMessage({
				event: 'projectteam',
				body: { evt: 'openusergroups', data: {} }
			});
		}
	}, [activeToggle, RTLSDataLoadedAt]);

	useEffect(() => {
		if ((appInfo ?? false) && (isRolesDataLoaded ?? false)) {
			dispatch(setMainGridPayload(mainGridPayload));
			fetchPtGridDataList(appInfo, mainGridPayload, (response: any, totalCount: any) => {
				let data = response.map((item: any) => ({
					...item,
					rtlsId: item.rtlsId ? item.rtlsId : '',
					gpsTagId: item.gpsTagId ? item.gpsTagId : '',
					safetyStatusText: getSafteyStatus(item.safetyStatus),
					policyStatusText: getPolicyStatus(item.policyStatus),
					certificateStatusText: getCertificateStatus(item.certificateStatus),
					statusText: item.status === 'Active' ? 'active' : item.status === "Disabled" ? 'deactivated' : item.status,
					permissionTypeText: GetPermissionList(item),
					permissionTypeSortText: GetPermissionList(item, true),

				}))
				dispatch(setPtGridData(data));
			});
		};
	}, [appInfo, isRolesDataLoaded]);

	useEffect(() => {
		if ((ptGridData.length > 0 ?? false) || (RTLSUserData.length > 0 ?? false)) {
			const array: any = [];
			ptGridData.map((data: any, i: any) => {
				let obj = {},
					workTeams = '';
				if (data?.teams && data?.teams?.length > 0) {
					workTeams = data?.teams?.map((o: any) => o.name).join(', ')
				}
				if (data.safetyData) {
					obj = { ...data, workTeams, ...data.safetyData };
				} else {
					obj = { ...data, workTeams };
				}

				const isOwner = (appInfo?.gblConfig?.project?.createdBy?.globalId == data?.globalId);
				if (RTLSUserData && RTLSUserData.length > 0) {
					const RTLSUser = RTLSUserData.filter((ob: any) => ob.userId == data.objectId);
					RTLSUser[0] ? obj = { ...data, ...prepareRTLSData(RTLSUser[0]) } : false;
				}
				obj = { ...obj, isOwner };
				if((data?.regions ?? false) && regionsData?.length && data?.regions?.length) {
					const mapFields = (data?.regions || [])?.map((item:any) => {
						let obj = [...regionsData].find((rec:any) => rec.name === item.name);
						return  obj ?? [];
					});
					obj = { ...data, ['regions'] : mapFields};
				};
				array.push(obj);
			});
			if (!_.isEqual(array, rowData)) {
				setRowData([...array]);
			};
			if (!_.isEqual(array, localRowData)) {
				setLocalRowData([...array]); //TO be used for filter/search..etc
			}
			setReAssignState(true);
			localRowDataRef.current = [...array];
			if (((currentSelection ?? false) && Object.keys(currentSelection)?.length > 0) || selectedMembers?.length > 0) {
				if (((currentSelection ?? false) && Object.keys(currentSelection)?.length > 0)) {
					let a = [...array].find((item: any) => item?.id === currentSelection?.id);
					dispatch(setCurrentSelection(a));
				};
				if (selectedMembers?.length > 0) {
					let b = [...array].filter((item: any) => item?.id === selectedMembers?.[0]?.id);
					dispatch(setSelectedMembers(b));
				};
			};
		}
	}, [ptGridData, RTLSUserData]);
	const initialGroupOrderComparator = useCallback((params: any) => {
		const a = params?.nodeA?.key || '';
		const b = params?.nodeB?.key || '';
		return a < b ? -1 : a > b ? 1 : 0;
	}, []);
	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current ?? groupKey;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "roles") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-Approval-Role'} baseCustomLine={false}
							label={AddNoneToEmptyRec(data?.roles)}
						/>
					</div>
				)
			} else if (colName === "company") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-company-new'} color={`#${data?.company?.color}`} baseCustomLine={true}
							label={data?.company?.name ?? "None"}
						/>
					</div>
				)
			} else if (colName === "certificateStatus") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-certification'} baseCustomLine={false}
							label={getCertificateStatus(data?.certificateStatus)} colName={colName}
						/>
					</div>
				)
			} else if (colName === "policyStatus") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getPolicyStatus(data?.policyStatus)} colName={colName}
						/>
					</div>
				)
			} else if (colName === "safetyStatus") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-Safety-Onboarding-Flyer'} baseCustomLine={false}
							label={getSafteyStatus(data?.safetyStatus)} colName={colName}
						/>
					</div>
				)
			} else if (colName === "tradeName") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-trade'} baseCustomLine={false}
							label={data?.trade?.name ?? 'None'}
						/>
					</div>
				)
			} else if (colName === "skills") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-skills-certs'} baseCustomLine={false}
							label={AddNoneToEmptyRec(data?.skills)}
						/>
					</div>
				)
			} else if (colName === 'firstName') {
				let ab = props.value;
				return ab?.substring(0, 1).toUpperCase() ?? "None";
			} else if (colName === "workTeams") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-work-team'} baseCustomLine={false}
							label={AddNoneToEmptyRec(data.teams)}
						/>
					</div>
				)
			} else if (colName === 'lastSeen') {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-connecting'} baseCustomLine={false}
							label={data?.activityHeaderText ?? "None"}
						/>
					</div>
				)
			} else if (colName === 'projectZonePermissions') {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-none'} baseCustomLine={false}
							label={data?.permissionTypeText ?? 'None'}
						/>
					</div>
				)
			}
		};
	};
	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer
		};
	}, []);

	const getRowHeight = useCallback((params: RowHeightParams) => {
		if (params.node.level === 0) {
			return groupKey === '' ? 55 : 38;
		}
		if (params.node.level === 1) {
			return 55;
		}
		return 55;
	}, [groupKey]);
	const onSortChanged = () => {
		if ((gridApi ?? false) && (appInfo ?? false)) {
			const colState = gridApi?.columnModel?.getColumnState();
			const sortState = colState?.filter((s: any) => { return s.sort != null }).map((s: any) => { return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex } });
			const SortCol = GetSortingCookie();
			if (groupKey !== '') {
				if (sortState.length > 0) {
					addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(sortState || ''));
				} else {
					const defaultSort = [{ colId: 'lastName', sort: 'asc', sortIndex: 0 }];
					addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(defaultSort || ''));
				}
			} else {
				if ((SortCol ?? false) && (SortCol?.length !== 0) && sortState.length === 0) {
					addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(SortCol || ''));
				} else if (sortState.length > 0) {
					addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(sortState || ''));
				} else {
					const defaultSort = [{ colId: 'lastName', sort: 'asc', sortIndex: 0 }];
					addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`, JSON.stringify(defaultSort || ''));
				}
			};
		};
	};
	const colDefs = useMemo(() => {
		return columns
	}, [columns]);
	const onFirstDataRendered = () => {
		if (selectedWorker && (gridApi ?? false)) {
			const workerRec = [...rowData].filter((x: any) => {
				if (x.objectId == selectedWorker) return true;
				else if (x.id == selectedWorker) return true;
			});
			console.log("Selected Worker Id", workerRec, selectedWorker)
			if ((workerRec?.length > 0 ?? false)) {
				gridApi.forEachNode((node: any) => {
					if (node?.data?.objectId == selectedWorker || node?.data?.id == selectedWorker) {
						gridApi.ensureIndexVisible(node.rowIndex, 'top');
						node.setSelected(true);
						dispatch(setSelectedMembers(workerRec));
						setOpenRightPanel(true);
					}
				})
			};
		};
	};
	const componentPropsChanged = (params: any) => {
		if (openRightPanel && currentSelection && gridApi && params) {
			gridSelectedRowIds?.forEach((id) => {
				const node = gridApi?.getRowNode(id)?.selected;
				if (!node) {
					gridApi?.getRowNode(id)?.setSelected(true);
				}
			})
		};
	};
	return (
		<>
			<GridWindow
				open={true}
				title={popTitle}
				className={`project-team-cls project-team-gridcls teamorientation-${appInfo?.viewConfig?.fromSafetyTab || false
					}`}
				// iconCls='common-icon-vendor-pay-applications'
				appType={appType}
				appInfo={{ ...appInfo, fullScreen: fullScreen }}
				iFrameId={iframeID}
				defaultTabId={defaultTabId}
				// iframeEventData, setIframeEventData
				iframeEventData={iframeEventData}
				setIframeEventData={setIframeEventData}
				zIndex={100}
				onClose={handleClose}
				//isFullView={fullScreen}
				tools={{
					closable: !fullScreen,
					resizable: !fullScreen,
					openInNewTab: false,
					customTools: fullScreen ? (
						<>
							<IQTooltip title="Home" placement={"bottom"}>
								<IconButton
									key={"navigate-to-home"}
									className="navigate-to-home"
									aria-label="Home"
									onClick={navigateHome}
								>
									<span className="common-icon-home header_icon"></span>
								</IconButton>
							</IQTooltip>
							<IQTooltip title="Help" placement={"bottom"}>
								<IconButton
									key={"open-in-new-tab"}
									className='projectteam-help'
									aria-label="help"
									onClick={handleHelp}
								>
									<span className="common-icon-Live-Support-Help header_icon"></span>
								</IconButton>
							</IQTooltip>
						</>
					) : (
						<IQTooltip title="Help" placement={"bottom"}>
							<IconButton
								key={"open-in-new-tab"}
								aria-label="help"
								onClick={handleHelp}
							>
								<span className="common-icon-Live-Support-Help header_icon"></span>
							</IconButton>
						</IQTooltip>
					),
				}}
				PaperProps={{
					sx: {
						width: "95%",
						height: "90%",
					}
				}}
				lidCondition={(rowData: any) => {
					/* let status;
					rowData?.status.toLowerCase() === "active" ||
						rowData?.safetyStatus === 7
						? (status = true)
						: (status = false); */
					let canEdit = canEditProjectTeamRec(rowData, appInfo?.gblConfig, true);
					if (canEdit) {
						setOpenRightPanel(true);
						setDefaultTabId("userDetails");
					}
					return canEdit;
				}}
				manualLIDOpen={openRightPanel}
				onDetailClose={() => {
					setOpenRightPanel(false);
					setDefaultTabId("userDetails");
					dispatch(setCurrentSelection(null));
				}}
				toast={showToastMessage}
				// toastTimeout={1000}
				content={{
					detailView: ProjectTeamApplicationsLID,
					gridContainer: {
						toolbar: {
							leftItems: (
								<LeftToolbarButtons
									dataInfo={{
										activeTab: activeToggle,
										appInfo: appInfo,
										clickHandler: leftToolBarHandler,
										refreshGrid: refreshGrid,
									}}
								/>
							),
							rightItems: (
								<RightToolbarButtons
									toggleValue={activeToggle}
									// safetyTracking={appInfo?.gblConfig?.currentProjectInfo?.safetyTracking}
									rightButtonsToggleChange={(value: any) => {
										setActiveToggle(value)
										setReAssignState(true)
										activeColsTab.current = value;
									}
									}
									QRCodeEvent={(e: any) => QRCodeHandler()}
								/>
							),
							searchComponent: {
								show: true,
								type: "regular",
								searchText: searchText,
								groupOptions: groups,
								filterOptions: filters,
								onSearchChange: onGridSearch,
								onGroupChange: onGridGroupingChange,
								onFilterChange: onFilterChange,
								defaultFilters: gridFilters,
								defaultSearchText: gridSearchText,
								defaultGroups: gridGroupValue,
								headerStatusFilters: gridSafetyStatusFilters
							},
						},
						grid: {
							headers: colDefs,
							data: rowData,
							//getRowId: (params: any) => params?.data?.rowNum,
							grouped: true,
							groupIncludeTotalFooter: false,
							tableref: (val: any) => setGridApi(val),
							groupIncludeFooter: false,
							onCellEditingStopped: onCellEditOver,
							rowClassRules: {
								"project-team-row-disabled-cls": (params: any) => {
									const isActive =
										params?.data?.status?.toLowerCase() === "active";
									const memberGId = params?.data?.globalId;
									const projectMemberId =
										appInfo?.gblConfig?.project?.createdBy?.globalId || "";
									return !isActive || memberGId == projectMemberId || params?.data?.isOwner;
								},
								"project-team-row-active-cls": (params: any) => {
									const isActive =
										params?.data?.status?.toLowerCase() === "active";
									const memberGId = params?.data?.globalId;
									const projectMemberId =
										appInfo?.gblConfig?.project?.createdBy?.globalId || "";
									return isActive && memberGId !== projectMemberId && !params?.data?.isOwner;
								},
							},
							onSelectionChanged: (e: any) => onSelectionChanged(e),
							getRowHeight: getRowHeight,
							rowHeight: 55,
							headerHeight: 50,
							nowRowsMsg: searchText === "" ? '<div>Add new Project Team member by clicking "+" button</div>' : null,
							emptyMsg: searchText === "" ? 'No Project Team member available' : 'No search results found',
							suppressDragLeaveHidesColumns: true,
							groupSelectsChildren: true,
							suppressRowClickSelection: false,
							initialGroupOrderComparator: (e: any) => initialGroupOrderComparator(e),
							animateRows: false,
							groupDisplayType: 'groupRows',
							groupRowRendererParams: groupRowRendererParams,
							suppressScrollOnNewData: true,
							onSortChanged: onSortChanged,
							onFirstDataRendered: onFirstDataRendered,
							componentPropsChanged: componentPropsChanged
						}
					}
				}}
			/>
			<SUIAlert
				open={alert.open}
				contentText={alert.contentText}
				title={alert.title}
				onAction={alert.handleAction}
				showActions={alert.actions}
				DailogClose={alert.dailogClose}
			/>
			{showToastMessage?.length > 0 && (
				<Alert
					severity="success"
					className="floating-toast-cls in-lefttoolbar"
					onClose={() => {
						setShowToastMessage("");
					}}
				>
					<span className="toast-text-cls">{showToastMessage}</span>
				</Alert>
			)}
			{localToastMessage?.length > 0 && (
				<Alert
					severity="success"
					className="floating-toast-cls in-lefttoolbar"
					onClose={() => {
						setLocalToastMessage("");
					}}
				>
					<span className="toast-text-cls">{localToastMessage}</span>
				</Alert>
			)}
		</>
	);
};

export default memo(ProjectTeamWindow);