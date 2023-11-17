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
import { memberPrivilegeApi, approveWorkersApi, memberInviteApi, deleteMemberApi, fetchPtGridDataList, fetchSSRPtGridDataList, getUserRTLSData } from "features/projectsettings/projectteam/operations/ptGridAPI";
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

const useStyles2: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 'calc(100% - 350px) !important',
			maxWidth: '315px !important',
			minWidth: '315px !important',
		}
	})
);

const ProjectTeamWindowSSR = (props: any) => {
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
	const pttooltipRef = useRef<any>();
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
	const [filterListPayload, setFilterListPayload] = React.useState<any>({});
	const [filterClose, setFilterClose] = React.useState(false);
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
	const [CallGridApi, setCallGridApi] = React.useState(false);
	const [companyOptions, setCompanyOptions] = useState([]);
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
	const customSortingArrFields = ['skills', 'roles'];
	const customSortingFields = ['lastName', 'email', 'phone']; //-->
	const customFilterFields = ['permissions', 'onlineStatus', 'companyManagerAttestation', 'status'];
	const hideColumns = ['company','roles',"tradeName","skills","workCategoryName","safetyStatus","policyStatus","certificateStatus",'projectZonePermissions'];
	const isMTA = localhost ? true : (appInfo?.gblConfig?.project?.isProjectCentralZone) || false;
	const generalPermissions = isMTA ? assignUnassignData : assignUnassignDataNonMTA;
	const filterPayloadRef = useRef<any>(null);
	const [groupKey, setGroupKey] = React.useState<any>('');
	const [filteredValues, setFilteredValues] = React.useState<any>({});
	const radioRef = useRef<any>(null);
	const ptTitle = appInfo?.viewConfig?.title.indexOf('Team Orientation');
	const [selectedWorker, setSelectedWorker] = React.useState<any>('');
	const escapeRegExp = (s: any) => {
		return s.replace(/_[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	const defaultDates = {
		startDate: '',
		endDate: ''
	};
	let mainGridPayload = {
		"projectId": appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId,
		"limit": 10000,
		"offset": 0,
		"sortBy": 'lastName',
		"sortDirection": 'ASC'
	};
	const [customDates, setCustomDates] = React.useState<any>(defaultDates);
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
	const safetyGroupOptions = [
		{ text: "Safety Status", value: "safetyStatus", iconCls: 'common-icon-Safety-Onboarding-Flyer', groupName:'' },
		{ text: "Policy Status", value: "policyStatus", iconCls: 'common-icon-orgconsole-safety-policies', groupName:'' },
		{ text: "Certification Status", value: "certificateStatus", iconCls: 'common-icon-certification', groupName:'' }
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
	React.useEffect(() => {
		if (selectedWorker) {
			console.log("To-Do select the worker in the grid by  selectedWorker: objectId/id and open right panel");
		}
	}, [selectedWorker]);
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
	const handleOnlineStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		radioRef.current = event.target.value;
		if (event.target.value !== 'custom') {
			let statusPayload = { ...filterPayloadRef?.current, ['onlineStatus']: event.target.value };
			setFilterListPayload(statusPayload);
		};
	};
	const handleOnChange = (value: any, name: any) => {
		const datesClone = { ...customDates, [name]: value };
		setCustomDates(datesClone);
	};
	const handleApply = () => {
		let statusPayload = { ...filterPayloadRef?.current, ['onlineStatus']: customDates };
		setFilterListPayload(statusPayload);
		onFilterMenuClose(false);
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
		const [selectedStatus, setSelectedStatus] = useState<any>('');
		return (
			<div style={{ padding: 10, marginLeft:15 }}>
				<RadioGroup
					aria-labelledby="online-status-group-label"
					value={selectedStatus}
					onChange={(e: any) => {
						setSelectedStatus(e.target.value);
					}}
					name="radio-buttons-group"
				//onChange={handleOnlineStatusChange}
				>
					<FormControlLabel
						value="now"
						control={<Radio />}
						label="Beaconing Now"
					/>
					<FormControlLabel value="today" control={<Radio />} label="Today" />
					<FormControlLabel
						value="yesterday"
						control={<Radio />}
						label="Yesterday"
					/>
					<FormControlLabel
						value="currentWeek"
						control={<Radio />}
						label="This Week"
					/>
					<FormControlLabel value="custom" control={<Radio />} label="Custom" />
				</RadioGroup>
				{selectedStatus === "custom" && (
					<>
						<div className="onlinestatus-custom-cls">
							<DatePickerComponent
								zIndex={9999}
								defaultValue={customDates.startDate}
								containerClassName={"iq-customdate-cont"}
								maxDate={new Date()}
								onChange={(val: any) => handleOnChange(val, 'startDate')}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
										style={{ background: "#f7f7f7" }}
									/>
								}
							/>
							<DatePickerComponent
								zIndex={9999}
								defaultValue={customDates.endDate}
								containerClassName={"iq-customdate-cont"}
								maxDate={new Date()}
								onChange={(val: any) => handleOnChange(val, 'endDate')}
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
							<Button variant="outlined" className="cancel-btn" onClick={() => onFilterMenuClose(false)}>CANCEL</Button>
							<Button variant="outlined" className="apply-btn" onClick={() => handleApply}>APPLY</Button>
						</div>
					</>
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
		const { iconCls, color, baseCustomLine = false, label, count, colName = '', ...rest } = props;
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
						color: customSortingStatusForFields.includes(groupKeyValue?.current?.value) && getColorForStatusGroup(label,groupKeyValue?.current?.value)
					}}
				></span>
				<span className="custom-group-header-label-cls">{`${label} (${count})`}</span>
			</div>
		)
	});
	const groupOptions = useMemo(() => {
		var groupingMenu = [{ text: "Name", value: "firstName", iconCls: 'common-icon-name-id', groupName: "Name" },
				{ text: "Companies", value: "company", iconCls: 'common-icon-company-new', groupName: "Companies" },
				{ text: "Work Team", value: "workCategoryName", iconCls: 'common-icon-work-team', groupName: "WorkTeams" },
				{ text: "Trades", value: "tradeName", iconCls: 'common-icon-trade', groupName: "Trades" },
				{ text: "Skills", value: "skills", iconCls: 'common-icon-orgconsole-skills-certs', groupName: "Skills" },
				{ text: "Roles", value: "roles", iconCls: 'common-icon-Approval-Role', groupName: "Roles" }
				//{ text: "Last Seen", value: "lastSeen", iconCls: 'common-icon-connecting', groupName:"LastSeen" },
				// { text: "Permissions", value: "projectZonePermissions", iconCls: 'common-icon-none', groupName:"Permissions" },
			],
		// if (appInfo?.gblConfig?.currentProjectInfo?.safetyTracking){
		   	groupingMenu = [...groupingMenu, ...safetyGroupOptions];
		// }
		return groupingMenu;
	}, [appInfo, isLocalhost]);
	const [groups, setGroups] = React.useState(groupOptions);
	const financePermissions = assignUnassignData2.filter((obj:any) => obj.value != '');
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
					...generalPermissions, ...financePermissions
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
		
		filterMenu = [...filterMenu, ...safetyFilterOptions, ...attestmentMenu];
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
			byKeyName: "name",
			type: "Array",
			searchBy: 'projectZonePermissions'
		},
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
			if ((filterObj[item]?.includes("all")) ?? false) {
				filterObj[item]?.shift();
			};
			if (filterObj[item]?.length === 0) {
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
					} else if (obj[key] !== null) return find.includes(obj[key]);
				});
			});
			let unique: any = [];
			res.map((x: any) => unique.filter((a: any) => a.rowNum === x.rowNum).length > 0 ? null : unique.push(x));
			return unique;
		} else return data;
	};
	const onFilterChange = (filterValues: any) => {
		// if (Object.keys(filterValues).length !== 0) {
		// 	let filterObj = filterValues;
		// 	Object.keys(filterObj).filter((item) => {
		// 		if (filterObj[item]?.length === 0) {
		// 			delete filterObj[item]
		// 		};
		// 	});
		// 	Object.keys(filteredValues)?.length > 0 && [...safetyStatusFilteredData]?.length > 0 ?
		// 		[...safetyStatusFilteredData] : Object.keys(filteredValues)?.length > 0 ?
		// 			[...storeFilterData] : [...localRowData];
		// 	if (!_.isEqual(filteredValues, filterObj)
		// 		&& Object.keys(filterObj).length > 0
		// 		&& Object.keys(filterObj).length <= 1) {
		// 		setFilteredValues(filterObj);
		// 		let data = filterData([...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : [...localRowData], filterObj, true);
		// 		setRowData(data);
		// 	} else if (!_.isEqual(filteredValues, filterObj)
		// 		&& Object.keys(filterObj).length > 1) {
		// 		setFilteredValues(filterObj);
		// 		let data = filterData([...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : [...storeFilterData], filterObj, true);
		// 		setRowData(data);
		// 	} else {
		// 		if (!_.isEqual(filteredValues, filterObj)
		// 			&& Object.keys(filterValues).length === 0) {
		// 			setFilteredValues(filterObj)
		// 			setRowData([...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : [...localRowData]);
		// 		};
		// 	}
		// } else {
		// 	if (!_.isEqual(filteredValues, filterValues)
		// 		&& Object.keys(filterValues).length === 0) {
		// 		setFilteredValues(filterValues)
		// 		setRowData([...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : [...localRowData]);
		// 	};
		// };
		let filterPayload = { ...filterValues };
		if (Object.keys(filterPayload).length === 0) {
			filterPayload = filterValues;
			filterPayloadRef.current = filterValues;
			onFilterMenuClose(false);
		} else {
			Object.keys(filterValues).filter((item) => {

				if (item !== 'onlineStatus') {
					if (filterValues[item].includes('all')) {
						filterPayload[item] = [];
					} else if (item == "permissions") {
						filterPayload[item] = filterValues[item];
					} else {
						filterPayload[item] = getIds(filterValues[item], item);
					}
				};
				// if (item === 'safetyStatus' && filterListPayload?.safetyStatus?.length > 0 && filterValues?.safetyStatus?.length > 0) {
				// 	let safetyStatusData = [...filterListPayload.safetyStatus, ...filterPayload?.safetyStatus];
				// 	filterPayload[item] = Array.from(new Set(safetyStatusData));
				// } else if (item === 'safetyStatus' && filterValues?.safetyStatus?.length > 0) {
				// 	filterPayload[item] = filterPayload?.safetyStatus;
				// } else if ((safetyStatusRef?.current ?? false)) {
				// 	filterPayload['safetyStatus'] = safetyStatusRef?.current?.ids;
				// 	safetyStatusRef.current = null;
				// };
			});
			// if (filterListPayload?.onlineStatus && ((filterListPayload?.onlineStatus !== "" || filterListPayload?.onlineStatus?.startDate) ?? false)) {
			// 	filterPayload['onlineStatus'] = filterListPayload?.onlineStatus;
			// };
			// onFilterMenuClose(false);
		};
		Object.keys(filterPayload).filter((item) => {
			if (filterPayload[item]?.length === 0) {
				delete filterPayload[item]
			};
		});
		setFilterListPayload(filterPayload);
	};
	useEffect(() => {
		if (filteredValues) {
			setReAssignState(true);
		}
	}, [filteredValues])
	const onFilterMenuClose = (val: boolean) => {
		if (!val) {
			filterPayloadRef.current = filterListPayload;
			setFilterClose(true);
		};
	};
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
		var name = params.data.firstName;
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
		if (key === 'companies') {
			let getCompanyFilters = checkCompaniesFilters(formattedData);
			setGridFilters(getCompanyFilters);
			setFilteredValues(getCompanyFilters);
			setReAssignState(true);
		};
		setFilters(filtersCopy);
	};
	const checkSafetyStatusFilters = () => {
		let safetyStatusFilter:any = localhost ? getCookie(`safetyStatusFilter_-1_${CookieTitle}`) :  getCookie(`safetyStatusFilter_${appInfo.projectId}_${CookieTitle}`);
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
	const checkCompaniesFilters = (array?:any) => {
		let filter:any = localhost ? getCookie(`filters_-1_${CookieTitle}`) :  getCookie(`filters_${appInfo.projectId}_${CookieTitle}`);
		if (filter) {
			let CookieFilter;
			try {
				CookieFilter = JSON.parse(filter);
				let companiesList = array.map((item:any) => { return item.name });
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
		};
	};
	useEffect(() => {
		if (appInfo) {
			let search:any = getCookie(`searchText_${appInfo.projectId}_${CookieTitle}`);
			let group:any = getCookie(`groupKey_${appInfo.projectId}_${CookieTitle}`);
			let filter:any = getCookie(`filters_${appInfo.projectId}_${CookieTitle}`);
			let toggle:any = getCookie(`activeToggle_${appInfo.projectId}_${CookieTitle}`);
			console.log("project-team-appInfo", search, group, filter, toggle);
			if (filter) {
				let CookieFilter;
				try {
					CookieFilter = JSON.parse(filter);
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
			searchKey.current = search ?? "";
			setSearchText(search ?? "");
			setGridGroupValue(group);
			groupKeyValue.current = group ?? "";
			setGroupKey(group ?? "");
			setGridSearchText(search ?? "");
			if(toggle === 'safety') {
				setActiveToggle(!appInfo?.gblConfig?.currentProjectInfo?.safetyTracking ? 'member' : 'safety');
			} else if (toggle === 'rtls') {
				setActiveToggle(appInfo?.rtlsConnectorType == 1 || appInfo?.rtlsConnectorType == 3 ? 'rtls' : 'member');
			} else if (toggle === 'usergroups') {
				const canShowUserGroups = (!appInfo?.isMTA && appInfo?.projectId > 0 && !appInfo?.gblConfig?.isZoneProject);
				setActiveToggle(canShowUserGroups ? 'usergroups' : 'member');
			} else {
				setActiveToggle(ptTitle === -1 || !appInfo?.gblConfig?.currentProjectInfo?.safetyTracking ? 'member' : 'safety');
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
			let filter:any = getCookie(`filters_-1_${CookieTitle}`);
			let search:any = getCookie(`searchText_-1_${CookieTitle}`);
			let group:any = getCookie(`groupKey_-1_${CookieTitle}`);
			let toggle:any = getCookie(`activeToggle_-1_${CookieTitle}`);
			setGridGroupValue(group);
			if (filter) {
				let CookieFilter;
				try {
					CookieFilter = JSON.parse(filter);
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
				projectId: 123, isFromORG: true, isMTA: true, fullScreen: true, viewConfig: { workerId: 22923872, fromSafetyTab: true, title: 'Team Orientation' }/* , gblConfig: {
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
			activityColor = null, groupHeader, groupHeaderText;
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
		} else if (activeDuration < lastSeenTimeDiff && today <= lastSeenTimestamp) {
			groupHeader = 2;
			groupHeaderText = 'Today';
		} else if ((today - 86400000) <= lastSeenTimestamp && lastSeenTimestamp < today) {
			groupHeader = 3;
			groupHeaderText = 'Yesterday';
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
			activityHeaderText: groupHeaderText
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
		postMessage({
			event: "help",
			body: {
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType
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
		// appInfo && isRolesDataLoaded && fetchPtGridDataList(appInfo, mainGridPayload, (response: any, totalCount: any) => {
		// 	dispatch(setPtGridData(response));
		// });		
		setLoadMask(true, 'project-team-gridcls');
		if (activeToggle === "rtls") {
			setRTLSDataLoadedAt(new Date());
		};
		gridApi.setServerSideDatasource(datasource);
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
					setLocalToastMessage('This worker is not part of your company.You can view/update workers records that belong to your company.');
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
		setGridFilters({ ...existingFilters, "safetyStatus": values.names });
		setGridSafetyStatusFilters(values);
		setFilteredValues({ ...existingFilters, "safetyStatus": values.names });
	};

	const statusFilterClose = (saftetyFlag: boolean) => {
		if (
			// (!_.isEqual(gridSafetyStatusFilters?.names, filteredValues?.safetyStatus)) && 
			(!saftetyFlag)) {
			onFilterMenuClose(false);
			// gridApi.setServerSideDatasource(datasource);
		}
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
		const mappedSKills: any = [];
		selectedValues.forEach((objectId: any) => {
			const skillObj = skillsData.find((rec: any) => rec.objectId == objectId);
			mappedSKills.push(skillObj);
		});
		validateAndPreparePayload('skills', params, { ...params.node.data, skills: mappedSKills });

	}

	const handleOnRolesChange = (selectedValues: any = [], params: any) => {
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
				return a.localeCompare(b);
			} else if (type === "date") {
				return new Date(a)?.getTime() - new Date(b)?.getTime();
			} else if(type === "time") {
				
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
		postMessage({
			event: 'projectteam', body: {
				evt: eventType, searchValue: searchValue, listData: options
			}
		});
	};

	const handleSorting = (e: any) => {
		let AfterSortData;
		if(e === 'desc') {
			AfterSortData =  [...rowData].sort((a: any, b: any) => a?.safetyStatusText?.localeCompare(b?.safetyStatusText));
		} else if(e === 'asc') {
			AfterSortData =  [...rowData].sort((a: any, b: any) => b?.safetyStatusText?.localeCompare(a?.safetyStatusText));
		};
		setRowData(AfterSortData);
	};
	const onFilterOpened = () => {

	};
	/**
	 * All the columns cofigs related to all toggle's avaialble
	 * For maintanability purpose + to reduce duplicate instances for columns
	 */
	const allColumns: any = [
		{
			headerName: "",
			field: "grouping",
			valueGetter: (params: any) => params?.data?.groupInfo?.name,
			hide: true,
			rowGroup: false,
			pinned: "left"
		},
		{
			headerName: "",
			field: "thumbnailUrl",
			pinned: "left",
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
									setLocalToastMessage('This worker is not part of your company.You can view/update workers records that belong to your company.');
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
			pinned: "left",
			width: 150,
			minWidth: 100,
			valueGetter: firstCharValueGetter,
			keyCreator: firstCharKeyCreator,
			//editable: isCellEditable,
			sortable: true,
			comparator : (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
				return (valueA?.name ?? valueA)?.localeCompare((valueB?.name ?? valueB), 'en', { numeric: true })
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
											setDefaultTabId("safetyViolation");
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
			pinned: "left",
			width: 150,
			minWidth: 100,
			sort: 'asc',
			editable: isCellEditable,
			cellRenderer: (params: any) => {
				return (
					<span className="projectteam_gridColumn"
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
			field: "CompanyName",
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<CompanyCardTooltip
							className={'pt-CompanyTooltip-main'}
							title={<CompanyTooltip data={params?.data} />}
							// open={params?.data?.company?.name == 'MKSA29-1' ? true : false}
							placement={'right'}
							arrow
							sx={{
								'.MuiTooltip-tooltip ': {
									padding: '0px'
								},
							}}
						>
							<span //className={`pt-${params?.column?.colId}`}
								onClick={(event: any) => {
									if (event.detail == 2) {
										dispatch(setCurrentSelection(params?.data));
										setDefaultTabId("userDetails");
										setOpenRightPanel(true);
									}
								}}>
								{params?.data?.company?.name}
							</span>
						</CompanyCardTooltip>
					);
				},
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
					}}>{params?.data?.regions}</span>; // class name is fieldname
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
				let list1: any = [];
				let list2: any = [];
				if (nodeA?.data?.projectZonePermissions ?? false) {
					let
						isMTA = appInfo?.isMTA,
						zonePermission = nodeA?.data?.projectZonePermissions || [],
						adminValues: any = {
							'Admin': isMTA ? 'Super Admin' : 'Admin',
							'ProjectAdmin': 'Admin',
							'AdminWithBilling': 'Admin with Billing',
							'ProjectTeamManager': 'Project Team Manager',
							'CompanyManager': 'Company Manager'
						};

					if (adminValues[nodeA?.data?.userPermissionType])
						list1.push(adminValues[nodeA?.data?.userPermissionType]);
					for (var indx in zonePermission) {
						list1.push(zonePermission[indx].name);
					};

				};
				if (nodeB?.data?.projectZonePermissions ?? false) {
					let
						isMTA = appInfo?.isMTA,
						zonePermission = nodeB?.data?.projectZonePermissions || [],
						adminValues: any = {
							'Admin': isMTA ? 'Super Admin' : 'Admin',
							'ProjectAdmin': 'Admin',
							'AdminWithBilling': 'Admin with Billing',
							'ProjectTeamManager': 'Project Team Manager',
							'CompanyManager': 'Company Manager'
						};

					if (adminValues[nodeB?.data?.userPermissionType])
						list2.push(adminValues[nodeB?.data?.userPermissionType]);
					for (var indx in zonePermission) {
						list2.push(zonePermission[indx].name);
					};
				};
				list1 = list1?.join(", ");
				list2 = list2?.join(", ");
				return rtlsSortComparator(list1, list2, isDescending, 'string');
				// return list1?.localeCompare(list2, 'en', { numeric: true });
			},
			keyCreator: (params: any) => {
				let list = [],
					isMTA = appInfo?.isMTA,
					zonePermission = params?.data?.projectZonePermissions || [],
					adminValues: any = {
						'Admin': isMTA ? 'Super Admin' : 'Admin',
						'ProjectAdmin': 'Admin',
						'AdminWithBilling': 'Admin with Billing',
						'ProjectTeamManager': 'Project Team Manager',
						'CompanyManager': 'Company Manager'
					};

				if (adminValues[params?.data?.userPermissionType])
					list.push(adminValues[params?.data?.userPermissionType]);
				for (var indx in zonePermission) {
					list.push(zonePermission[indx].name);
				};
				return list?.join(", ");
			},
			cellRenderer: (params: any) => {
				let list = [],
					isMTA = appInfo?.isMTA,
					zonePermission = params?.data?.projectZonePermissions || [],
					adminValues: any = {
						'Admin': isMTA ? 'Super Admin' : 'Admin',
						'ProjectAdmin': 'Admin',
						'AdminWithBilling': 'Admin with Billing',
						'ProjectTeamManager': 'Project Team Manager',
						'CompanyManager': 'Company Manager'
					};

				if (adminValues[params?.data?.userPermissionType])
					list.push(adminValues[params?.data?.userPermissionType]);
				for (var indx in zonePermission) {
					list.push(zonePermission[indx].name);
				}
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					let list = [],
						isMTA = appInfo?.isMTA,
						zonePermission = params?.data?.projectZonePermissions || [],
						adminValues: any = {
							'Admin': isMTA ? 'Super Admin' : 'Admin',
							'ProjectAdmin': 'Admin',
							'AdminWithBilling': 'Admin with Billing',
							'ProjectTeamManager': 'Project Team Manager',
							'CompanyManager': 'Company Manager'
						};

					if (adminValues[params?.data?.userPermissionType])
						list.push(adminValues[params?.data?.userPermissionType]);
					for (var indx in zonePermission) {
						list.push(zonePermission[indx].name);
					}
					return (
						<span className="pt-permissions" onClick={(event: any) => {
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
			}
		},
		{
			headerName: "Role",
			field: "roles",
			cellRenderer: (params: any) => {
				const canEdit = isCellEditable(params);
				return (
					<>
						<AutoWidthTooltip
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
						>
							<div>
								{canEdit && (
									<div className="pt-role-column">
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
									</div>
								)}
								{!canEdit && (
									<span
										className="pt-role-column"
									>
										{getRoles(params?.data?.roles)}
									</span>
								)}
							</div>
						</AutoWidthTooltip>
					</>
				);
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<>

							<AutoWidthTooltip
								className={'pt-CompanyTooltip-main'}
								title={<ProjectTeamRolesTooltip
									params={params}
									appInfo={appInfo}
									rolesVal={
										params?.data?.roles &&
										getRoles(params?.data?.roles)
									}
								></ProjectTeamRolesTooltip>}
								placement={'right'}
								arrow
								sx={{
									'.MuiTooltip-tooltip ': {
										padding: '0px'
									},
								}}
								enterDelay={1500}
							>
								<span className='pt-role-column'
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
									}}>{getRoles(params?.data?.roles)}</span>
							</AutoWidthTooltip>
						</>
					)
				},
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span //className={`pt-${params?.column?.colId}`} 
							onClick={(event: any) => {
								if (event.detail == 2) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								}
							}}>{params?.data?.trade?.name}</span>
					);
				},
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
							<SmartDropDown
								options={getSkillsOptions()}
								//LeftIcon={<span className='common-icon-orgconsole-skills-certs userdetails_icons userdetails_icon_Color' />}
								dropDownLabel=""
								isSearchField={true}
								isMultiple={true}
								selectedValue={params.data ? params?.data?.skills?.map((data: any) => data.objectId || data) : []}
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
								isCustomSearchField={false}
								handleAddCategory={(sVal: any) => handleAdd('', sVal, 'skill')}
								dynamicClose={dynamicClose}
								insideGridCellEditor={true}
								handleListClose={(value: any) => {
									handleOnSkillsChange(value, params);
								}}
							/>
						}
						{!canEdit && <span className={`pt-${params?.column?.colId}`}>
							{params.data?.skills &&
								params.data.skills.map((obj: any) => obj.name).join(", ")}{" "}
						</span>}
					</>
				);
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span className={`pt-${params?.column?.colId}`} onClick={(event: any) => {
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
							{params.data?.skills &&
								params.data.skills.map((obj: any) => obj.name).join(", ")}{" "}
						</span>
					);
				},
			}
		},
		{
			headerName: "Work Teams",
			field: "workTeams",
			minWidth: 170,
			hide : true,
			keyCreator: (params: any) => {return AddNoneToEmptyRec(params?.data?.teams)},
			valueGetter: (params: any) => {return AddNoneToEmptyRec(params?.data?.teams)}
		},
		{
			headerName: "Work Category",
			field: "WorkPlannerCategoryName",
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span //className={`pt-${params?.column?.colId}`} 
							onClick={(event: any) => {
								if (event.detail == 2) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								}
							}}>{params?.data?.workCategory?.name ? params?.data?.workCategory?.name : 'None'}</span>
					);
				},
			}
		},
		{
			headerName: "Safety Status",
			minWidth: 300,
			field: "safetyStatus",
			pinned: activeToggle === "safety" ? "left" : "",
			headerComponent: CustomHeader,
			sortable: true,
			headerComponentParams: {
				options: SafetyStatusOptions,
				columnName: 'Safety Status',
				filterUpdated: (values: any) => onSafetyStatusFilterUpdated(values),
				statusFilterClose: (val: any) => statusFilterClose(val),
				showSorting: true,
				handleSorting: (e: any) => handleSorting(e),
				onFilterOpened: onFilterOpened,
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
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span
							className={"pt-safetyStatus " + getSafteyStatusCls(params?.data?.safetyStatus)}
							style={{ backgroundColor: getSafteyStatusColor(params?.data?.safetyStatus) }}
							onClick={(event: any) => {
								if (event.detail == 2) {
									dispatch(setCurrentSelection(params?.data));
									setDefaultTabId("userDetails");
									setOpenRightPanel(true);
								}
							}}
						>
							{" "}
							{getSafteyStatus(params?.data?.safetyStatus)}{" "}
						</span>
					);
				},
			}
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span
							className={`pt-${params?.column?.colId}` + " " + getPolicyStatusCls(params?.data?.policyStatus)}
							onClick={(event: any) => {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("safetyPolicies");
								setOpenRightPanel(true);
							}}
						>
							{getPolicyStatus(params?.data?.policyStatus)}
						</span>
					);
				},
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span
							className={
								"pt-certificateStatus " +
								getCertificateStatusCls(params?.data?.certificateStatus)
							}
							onClick={(event: any) => {
								dispatch(setCurrentSelection(params?.data));
								setDefaultTabId("certifications");
								setOpenRightPanel(true);
							}}
						>
							{" "}
							{getCertificateStatus(params?.data?.certificateStatus)}{" "}
						</span>
					);
				},
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
			field: "GlobalId",
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
			},
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return (
						<span className={`pt-${params?.column?.colId}`}
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
							}}>{params?.data?.lastSeen}</span>
					);
				},
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
			field: "CompanyManagerAttestimate",
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
			if (customSortingStatusForFields?.includes(item?.field)) {
				item.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any, isDescending: any) => {
					return valueA - valueB
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
		"grouping",
		"thumbnailUrl",
		"firstName",
		"lastName",
		"CompanyName",
		"email",
		// "regions",
		"rtlsId",
		"gpsTagId",
		"projectZonePermissions",
		"roles",
		"tradeName",
		"skills",
		"WorkPlannerCategoryName",
		// "safetyStatus",
		// "policyStatus",
		// "certificateStatus",
		"safetyVerifiedOn",
		"GlobalId",
		"phone",
		"createdDate",
		"modifiedDate",
		"lastSeen",
		"workTeams"
	];

	const rtlsColOrder = [
		"grouping",
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
		'company','roles',"tradeName","skills","workCategoryName",
		"safetyStatus","policyStatus","certificateStatus",'projectZonePermissions',
		"workTeams"
	];

	const safetyColOrder = [
		"grouping",
		"thumbnailUrl",
		"firstName",
		"lastName",
		"safetyStatus",
		"policyStatus",
		"certificateStatus",
		"safetyVerifiedOn",
		"CompanyName",
		"email",
		"phone",
		"projectZonePermissions",
		"roles",
		"tradeName",
		"skills",
		"WorkPlannerCategoryName",
		"GlobalId",
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
			if(appData?.gblConfig?.currentProjectInfo?.safetyTracking) {
				var isRegion = orderToFollow.findIndex((x: any) => x === "regions") > -1,
					safetyindex = isRegion? 14: 13;

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
				safetyOrderCols.push("CompanyManagerAttestimate");
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
			// if(activeToggle === 'rtls' && hideColumns?.includes(fieldId)) {
			// 	colConfig.hide = true;
			// };
			// if((activeToggle === 'rtls' && fieldId === "lastSeen")) {
			// 	colConfig.hide = true;
			// } else if(activeToggle === 'safety' || activeToggle === 'member') {
			// 	colConfig.hide = false;
			// };
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
		if (activeToggle === 'safety' || activeToggle === 'member' || activeToggle === "usergroups") {
			if (groupOptions?.length > 0 && groups?.length > 0) {
				let index = groups.findIndex((x: any) => x.text === "Last Seen");
				if (index !== -1) {
					setGroups(groups.filter((x: any) => x.text !== "Last Seen"));
				};
			};
			if (filters?.length > 0) {
				let index = filters.findIndex((x: any) => x.text === "Online Status");
				if (index !== -1) {
					setFilters(filters.filter((x: any) => x.text !== "Online Status"));
				}
			};
		} else if (activeToggle === 'rtls') {
			if (groupOptions?.length > 0 && groups?.length > 0) {
				let index = groups.findIndex((x: any) => x.text === "Last Seen");
				if (index === -1) {
					setGroups([...groupOptions, { text: "Last Seen", value: "lastSeen", iconCls: 'common-icon-connecting', groupName: 'LastSeen' }]);
				};
			};
			// if (filters?.length > 0) {
			// 	let index = filters.findIndex((x: any) => x.text === "Online Status");
			// 	if (index === -1) {
			// 		setFilters([...filters, {
			// 			text: "Online Status",
			// 			value: "onlineStatus",
			// 			iconCls: 'common-icon-connecting',
			// 			key: "onlineStatus",
			// 			children: {
			// 				type: "radio",
			// 				component: <OnlineStatusFilterComp />,
			// 			},
			// 		}]);
			// 	}
			// };
		}
		//End
		if (groupKey.length) {
			orderedCols[0].rowGroup = true;
			// orderedCols[1].checkboxSelection = false;
			// orderedCols[1].headerCheckboxSelection = false;
		}
		setColumns(orderedCols);
	};
	useEffect(() => {
		getColumnsBasedOnOrder();
		if(activeToggle && appInfo) {
			addCookie(`activeToggle_${appInfo?.projectId}_${CookieTitle}`, activeToggle);
		};
	}, [activeToggle, rolesData, rowData, formattedSafetyColumns, appInfo]);
	useEffect(() => {
		if((columns ?? false) && (appInfo ?? false) && (gridApi ?? false)) {
			let sorting = getCookie(`sorting_${appInfo.projectId}_${CookieTitle}`);
			if (sorting) {
				let SortingCookie;
				try {
					SortingCookie = JSON.parse(sorting);
					gridApi.columnModel.applyColumnState({
						state: SortingCookie,
						defaultState: { sort: null },
					});
				} catch (e) {
					return console.error(e);
				}
			};
		}
	},[columns])
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
	console.log("dfjosidjfiodsjf", columns);
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
			setReAssignState(false);
		};
	}, [reAssignState, filteredValues, localRowData, searchText, groupKey]);
	/**
	 * Triggers when there's any change in the selection and all selected records can be fetched using 
	 * event?.api?.getSelectedRows() or event?.api?.getSelectedNodes()
	 * @param event 
	 * @author Srinivas Nadendla
	 */
	const onSelectionChanged = (event: any) => {
		const selectedRowItems = event?.api?.getSelectedRows() || [];
		const selectedNodes = event?.api?.getSelectedNodes();
		if(selectedNodes.length === 0 && openRightPanel) {
			setOpenRightPanel(!openRightPanel);
			dispatch(setSelectedMembers([]));
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
		const searchFields = ['lastName', 'trade', 'company', 'skills', 'roles', 'phone', 'barcode', 'rtlsId', 'gpsTagId', 'safetyStatusText', 'policyStatusText', 'certificateStatusText', 'source'];
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
									return searchRegex.test(row[field][i][objField]?.toString());
								});
							}
						} else {
							return false;
						};
					} else if (isNaN(row[field]) && typeof row[field] === 'object') {
						return Object.keys(row[field]).some((objField) => {
							return searchRegex.test(row[field][objField]?.toString());
						})
					} else {
						return searchRegex.test(row[field]?.toString());
					}
				} else if (field === 'email' || field === 'firstName' && (row[field] ?? false)) {
					return row[field].includes(lowerSearchTxt);
				};
			});
		});
		return filteredRows;
	};
	const debounceOnSearch = useCallback(_.debounce((val) => {
		setSearchText(val);
		// if (val !== "") {
		// 	const lowerSearchTxt: string = val?.toLowerCase() || "";
		// 	let searchData: any = Object.keys(filteredValues)?.length > 0 && [...safetyStatusFilteredData]?.length > 0 ?
		// 		[...safetyStatusFilteredData] : [...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : Object.keys(filteredValues)?.length > 0 ?
		// 			[...storeFilterData] : [...localRowData];
		// 	const filteredData = searchData.filter(
		// 		(obj: any) => {
		// 			if (Object.keys(obj).includes('modifiedBy')) {
		// 				delete obj.modifiedBy;
		// 			};
		// 			if (Object.keys(obj).includes('createdBy')) {
		// 				delete obj.createdBy;
		// 			};
		// 			return JSON.stringify(obj).toLowerCase().includes(lowerSearchTxt);
		// 		}
		// 	);
		// 	setRowData(filteredData);
		// }
	}, 2000), [localRowData, filteredValues]);
	const onGridSearch = (searchTxt: string) => {
		if (searchTxt === "") {
			// if (Object.keys(filteredValues)?.length > 0) {
			// 	let data = Object.keys(filteredValues)?.length > 0 && [...safetyStatusFilteredData]?.length > 0 ?
			// 		[...safetyStatusFilteredData] : [...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] :
			// 			Object.keys(filteredValues)?.length > 0 ? [...storeFilterData] : [...localRowData];
			// 	setRowData(data);
			// } else {
			// 	setRowData([...safetyStatusFilteredData]?.length > 0 ? [...safetyStatusFilteredData] : [...localRowData]);
			// };
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
		if (((selectedVal ?? false) && selectedVal !== "")) {
			let index = groupOptions.findIndex((x: any) => x.value === selectedVal);
			if (index > -1) {
				// columnsCopy.forEach((col: any) => {					
				// 	if (col.rowGroup = selectedVal === col.field) {
				// 		col.rowGroup = selectedVal === col.field;
				// 	};	
				// });
				let groupValue = {
					"name": groupOptions[index]?.groupName,
					"displayName": groupOptions[index].text,
					"value": groupOptions[index]?.value,
				}

				groupKeyValue.current = groupValue;
				setGroupKey([groupValue]);
			}
			columnsCopy[0].rowGroup = true;
			// columnsCopy[1].checkboxSelection = false;
			// columnsCopy[1].headerCheckboxSelection = false;
			// columnsCopy[0].hide = false;
		} else {
			groupKeyValue.current = null;
			columnsCopy[0].rowGroup = false;
			// columnsCopy[1].checkboxSelection = true;
			// columnsCopy[1].headerCheckboxSelection = true;
			// columnsCopy[0].hide = true;
			setGroupKey("");
		}
		setColumns(columnsCopy);
		// if (((selectedVal ?? false) && selectedVal !== "")) {
		// 	setGroupKey(selectedVal);
		// 	const columnsCopy = [...columns];
		// 	columnsCopy.forEach((col: any) => {
		// 		if (selectedVal && col.field === 'firstName'
		// 			|| col.field === 'thumbnailUrl'
		// 		) {
		// 			col.hide = true;
		// 			//col.sort = 'asc';
		// 			//	col.rowGroup = true;
		// 		};
		// 		// if (!col.sortable) {
		// 		// 	col.sortable = true;
		// 		// };
		// 		col.sortable = true;
		// 		if (col.rowGroup = selectedVal === col.field) {
		// 			col.rowGroup = selectedVal === col.field;
		// 		};

		// 	});
		// 	setColumns(columnsCopy);
		// } else if (selectedVal === undefined) {
		// 	setGroupKey(null);
		// 	const columnsCopy = [...columns];
		// 	columnsCopy.forEach((col: any) => {
		// 		if (col.rowGroup || col.hide) {
		// 			col.hide = false;
		// 			col.rowGroup = false;
		// 		};
		// 		//col.sortable = false;
		// 	});
		// 	if ((gridApi?.columnModel?.applyColumnState)) {
		// 		gridApi.columnModel.applyColumnState({
		// 			state: [
		// 				{
		// 					colId: 'lastName',
		// 					sort: 'asc'
		// 				}
		// 			],
		// 			defaultState: { rowGroup: false, sort: null },
		// 		});
		// 	};
		// 	gridApi.columnModel.resetColumnState();
		// 	setColumns(columnsCopy);
		// }
	};

	const getIconForGroup = () => {
		let gv = groupOptions.find((go:any) => go?.text == groupKeyValue?.current?.displayName)
		return gv?.iconCls;
	}

	const GroupRowInnerRenderer = (params: any) => {
		return (
			<div style={{ display: 'flex' }}>
				<CustomGroupHeader iconCls={getIconForGroup()} color={`#${params?.data?.groupInfo?.color}`} baseCustomLine={groupKeyValue?.current?.displayName == 'Companies' ? true : false}
					label={params?.data?.groupInfo?.name} count={params?.data?.groupInfo?.dataCount}
				/>
			</div>
		)
	};

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			innerRenderer: GroupRowInnerRenderer,
			pinned: "left"
		};
	}, []);

	const autoGroupColumnDef = useMemo(() => {
		return {
			flex: 1,
			minWidth: 280,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			pinned: "left",
			// };

			// return {
			// 	headerName: "First Name",
			// 	field: "firstName",
			// 	cellRenderer: "agGroupCellRenderer",
			// 	pinned: "left",
			// 	resizable: true,
			// 	suppressMultiSort: true,
			// 	suppressMenu: true,
			// 	sortable: true,
			// 	sortingOrder: ['asc', 'desc'],
			// 	sort: "asc",
			// 	minWidth: 250,
			// 	suppressSorting: true,
			// 	//checkboxSelection: (params: any) => params.node.level === 0 ? false : true,
			// 	headerCheckboxSelection: true,
			// 	comparator: function (valueA: any, valueB: any) {
			// 		return (valueA == valueB) ? 0 : (valueA > valueB) ? 1 : -1;
			// 	},
			// 	editable: isCellEditable,
			cellRendererParams: {
				suppressCount: false,// Make it to true to see the count next to value
				checkbox: true,
				/**
				 * Rendering grouping header when node.group is true
				 * @param params 
				 * @returns Grouping Header text/html based on column key/field
				 * @author Srinivas Nadendla
				 */
				innerRenderer: (params: any) => {
					console.log('params==>', params);
					// if (params.node.group && (groupKey ?? false)) {
					// 	const colName = groupKey;
					// 	const data = params?.node?.childrenAfterGroup?.[0]?.data || {};
					// 	if (colName === "roles") {
					return (
						<div style={{ display: 'flex' }}>
							<CustomGroupHeader iconCls={getIconForGroup()} color={`#${params?.data?.groupInfo?.color}`} baseCustomLine={groupKey[0].displayName == 'Companies' ? true : false}
								label={params?.data?.groupInfo.name + ' (' + params?.data?.groupInfo.dataCount + ')'}
							/>
						</div>
					)
					// } 
					// else if (colName === "company") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-company-new'} color={`#${data?.company?.color}`} baseCustomLine={true}
					// 				label={data?.company?.name ? data?.company?.name : "None"}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === "certificateStatus") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-certification'} baseCustomLine={false}
					// 				label={getCertificateStatus(data?.certificateStatus)} colName={colName}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === "policyStatus") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
					// 				label={getPolicyStatus(data?.policyStatus)} colName={colName}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === "safetyStatus") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-Safety-Onboarding-Flyer'} baseCustomLine={false}
					// 				label={getSafteyStatus(data?.safetyStatus)} colName={colName}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === "tradeName") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-trade'} baseCustomLine={false}
					// 				label={data?.trade?.name ? data?.trade?.name : 'None'}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === "skills") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-orgconsole-skills-certs'} baseCustomLine={false}
					// 				label={AddNoneToEmptyRec(data?.skills)}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === 'firstName') {
					// 	let ab = firstCharKeyCreator(params);
					// 	return ab?.substring(0, 1).toUpperCase() || "";
					// } else if (colName === "workCategoryName") {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-work-team'} baseCustomLine={false}
					// 				label={data?.workCategory?.name ? data?.workCategory?.name : "None"}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === 'lastSeen') {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-connecting'} baseCustomLine={false}
					// 				label={data?.activityHeaderText ? data?.activityHeaderText : "None"}
					// 			/>
					// 		</div>
					// 	)
					// } else if (colName === 'projectZonePermissions') {
					// 	return (
					// 		<div style={{ display: 'flex' }}>
					// 			<CustomGroupHeader iconCls={'common-icon-none'} baseCustomLine={false}
					// 				label={(data?.userPermissionType ?? false) ? data?.userPermissionType : 'None'}
					// 			/>
					// 		</div>
					// 	)
					// };
					// };
					// let color,
					// 	icon,
					// 	hasSafetyIcon = false,
					// 	hasRTLSIcon = false,
					// 	rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
					// if (params?.data?.isViolated) {
					// 	color = 'red';
					// 	icon = 'common-icon-exclamation';
					// 	hasSafetyIcon = true;
					// }
					// if (activeToggle === "rtls" && (rtlsConnectorType == 1 || rtlsConnectorType == 3) && params?.data?.activityColor) {
					// 	hasRTLSIcon = true;
					// }
					// return (
					// 	<div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
					// 		<Box
					// 			component="img"
					// 			sx={{
					// 				height: 35,
					// 				width: 35,
					// 				// maxHeight: { xs: 233, md: 167 },
					// 				// maxWidth: { xs: 350, md: 250 },
					// 				display: "flex",
					// 			}}
					// 			className="thumbnail_image"
					// 			alt={params?.data?.firstName}
					// 			src={params?.data?.thumbnailUrl}
					// 			onMouseOver={(e: any) => {
					// 				userImageHandleOver(e, params);
					// 			}}
					// 			onClick={(event: any) => {
					// 				if (event.detail == 2) {
					// 					const currentRec = params?.data,
					// 						canEdit = canEditProjectTeamRec(currentRec, appInfo?.gblConfig, true);
					// 					if (canEdit) {
					// 						dispatch(setCurrentSelection(params?.data));
					// 						setDefaultTabId("userDetails");
					// 						setOpenRightPanel(true);
					// 					} else {
					// 						setOpenRightPanel(false);
					// 						setLocalToastMessage('This worker is not part of your company.You can view/update workers records that belong to your company.');
					// 					}
					// 				}
					// 			}}
					// 		/>
					// 		<span className="projectteam_gridColumn"> {params?.data?.firstName}</span>
					// 		{hasRTLSIcon ? <span className="common-icon-connecting icon_size status_icon" style={{ color: params?.data?.activityColor }} /> : ''}
					// 		{hasSafetyIcon ? <span className={` ${icon} icon_size status_icon`} style={{ color: color }} /> : ''}
					// 	</div>
					// );
				},
			},
		}
	}, [groupKey, activeToggle, RTLSUserData]);
	console.log("djiosdfjisd", columns);
	/** grid tooltip code starts */
	const onCellMouseOver = (params: any) => {
		const el = params.event.target;
		const boundingClient = el.getBoundingClientRect();
		const topPosition = boundingClient.y - (1 * boundingClient.height - 95) + "px";
		const leftPosition = boundingClient.width + boundingClient.left - 110 + "px";
		const columnID = params?.column?.colId;
		const rtlsColumn = ['lastSeen', 'lastLocation', 'timeSpentToday', 'firstSeenToday', 'firstSeenEver', 'timeSpentEver'].indexOf(columnID) > -1;
		let tooltipText = '';
		if (rtlsColumn && params?.data && params?.data?.sourceText && params?.data[columnID]) {
			if (el.classList.contains('pt-timeSpentEver-info')) {
				tooltipText = 'RTLS User Report';
			} else {
				tooltipText = params?.data?.sourceText;
			}
			let display = true;
			if (pttooltipRef?.current) {
				pttooltipRef.current.style.display = display ? 'block' : 'none';
				pttooltipRef.current.style.top = topPosition;
				pttooltipRef.current.style.left = leftPosition;
				pttooltipRef.current.innerHTML = tooltipText;
			}
			return;
		}
		if (el.classList.contains("ag-cell") || el.classList.contains('ag-cell-value')) {
			const groupCell = el?.querySelector(`.pt-${columnID}`);
			let display = groupCell?.offsetWidth < groupCell?.scrollWidth;
			if (groupCell && columnID == 'email') {
				tooltipText = params?.data?.email;
			}
			else if (groupCell && columnID == 'roles') {
				tooltipText = params?.data?.roles;
			}
			else if (groupCell && columnID == 'tradeName') {
				tooltipText = params?.data?.trade?.name;
			}
			else if (groupCell && columnID == 'phone') {
				tooltipText = params?.data?.phone;
			}
			else if (groupCell && columnID == 'rtlsId') {
				tooltipText = params?.data?.rtlsId;
			}
			else if (groupCell && columnID == 'skills') {
				tooltipText = params?.data?.skills.map((obj: any) => obj.name).join(", ");
			}
			else if (groupCell && columnID == 'policyStatus') {
				tooltipText = getPolicyStatus(params?.data?.policyStatus);
			} else if (groupCell && columnID == "projectZonePermissions") {
				tooltipText = (groupCell.innerHTML) || '';
			}
			else {
				if (el) {
					tooltipText = '';
					display = false;
				}
			}
			if (pttooltipRef?.current) {
				pttooltipRef.current.style.display = display ? 'block' : 'none';
				pttooltipRef.current.style.top = topPosition;
				pttooltipRef.current.style.left = leftPosition;
				pttooltipRef.current.innerHTML = tooltipText;
			}
		}
		else {
			let display = el.offsetWidth < el.scrollWidth;
			if (el && columnID == 'email') {
				tooltipText = params?.data?.email;
			}
			else if (el && columnID == 'roles') {
				tooltipText = getRoles(params?.data?.roles);
			}
			else if (el && columnID == 'tradeName') {
				tooltipText = params?.data?.trade?.name;
			}
			else if (el && columnID == 'phone') {
				tooltipText = params?.data?.phone;
			}
			else if (el && columnID == 'rtlsId') {
				tooltipText = params?.data?.rtlsId;
			}
			else if (el && columnID == 'skills') {
				tooltipText = params?.data?.skills.map((obj: any) => obj.name).join(", ");
			}
			else if (el && columnID == 'policyStatus') {
				tooltipText = getPolicyStatus(params?.data?.policyStatus);
			} else if (el && columnID == "projectZonePermissions") {
				tooltipText = (el.innerHTML) || '';
			}
			else {
				tooltipText = '';
				display = false;
			}

			if (pttooltipRef?.current) {
				pttooltipRef.current.style.display = display ? 'block' : 'none';
				pttooltipRef.current.style.top = topPosition;
				pttooltipRef.current.style.left = leftPosition;
				pttooltipRef.current.innerHTML = tooltipText;
			}
		}

	}

	useEffect(() => {
		var elements = document.querySelectorAll(".sui-grid");
		if (elements) {
			for (var i = 0; i < elements.length; i++) {
				elements[i].addEventListener('mouseout', (e: any) => {
					if (pttooltipRef?.current) {
						pttooltipRef.current.style.display = 'none';
					}
				});
			}
		}
	}, [gridApi])
	/** grid tooltip code ends */

	// * On any event trigger in main grid these useEffect will call to initiated the datasource for server side.
	useEffect(() => {
		if (filterClose && !_.isEqual(filterListPayload, (filtersPayload))) {
			gridApi.setServerSideDatasource(datasource);
			setLoadMask(true, 'project-team-gridcls');
			setFilterClose(false);
			dispatch(setFiltersPayload(filterListPayload));
		}
	}, [filterClose, filterListPayload]);

	useEffect(() => {
		if (gridApi && appInfo && isRolesDataLoaded) {
			gridApi.setServerSideDatasource(datasource);
			setLoadMask(true, 'project-team-gridcls');
			setFilterClose(false);
		};
	}, [gridApi, searchText, RTLSUserData, appInfo, isRolesDataLoaded, groupKey]);


	//  * Creating the datasoucre for the severside rendering.
	const datasource = {
		getRows(params: any) {
			console.log('[Datasource] - rows requested by grid: ', params.request);
			const { startRow, endRow } = params.request;
			Object.keys(filterListPayload).filter((item) => {
				if (item === 'permissions' && filterListPayload['permissions'].includes("all")) {
					filterListPayload[item]?.shift();
				};
			});
			const groupByValueKey = groupKey.length ? params.request.groupKeys.length ? [
				{
					"name": params.request.groupKeys[0]
				}
			] : "" : "";

			let payload = {
				"projectId": isLocalhost ? "190e55b8-5907-42cd-9d94-13024a8ea568" : appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId,
				"filters": filterListPayload,
				"limit": 50,
				"offset": startRow,
				// "sortBy": params?.sortModel?.[0]?.colId ?? 'lastName',
				"sortModel": [
					{
						"sortBy": params?.request?.sortModel?.[0]?.colId ?? 'lastName',
						"sortDirection": params?.request?.sortModel?.[0]?.sort ?? 'asc',
					}
				],
				"searchText": searchText,
				// "sortDirection": params?.sortModel?.[0]?.sort.toUpperCase() ?? 'ASC',
				"groupBy": groupKey,
				"groupByValue": groupByValueKey
			};
			// console.log("dfhsdiufus", payload, activeToggle)
			// dispatch(setMainGridPayload(payload));
			// if ((activeToggle !== 'rtls') || (CallGridApi)) {
			// (activeToggle == 'rtls') && setRTLSDataLoadedAt(new Date());
			fetchSSRPtGridDataList(appInfo, payload, (response: any, totalCount: any) => {
				setLoadMask(false, 'project-team-gridcls');
				setCallGridApi(false);
				let dataArray = response;
				// setLocalRowData([...localRowData, ...array]); //TO be used for filter/search..etc
				setGridTotalCount(totalCount);
				if ((activeToggle == 'rtls' && groupKey == "" && groupByValueKey == "") ||
					(activeToggle == 'rtls' && groupByValueKey.length)) {
					const array: any = [];
					dataArray.map((data: any, i: any) => {
						let obj = {};
						let RTLSobj = {};
						// workTeams = '';
						// if (data?.teams && data?.teams?.length > 0) {
						// 	workTeams = data?.teams?.map((o: any) => o.name).join(', ')
						// }
						const isOwner = (appInfo?.gblConfig?.project?.createdBy?.globalId == data?.globalId);
						if (data.safetyData) {
							obj = { ...data, ...data.safetyData, isOwner };
						} else {
							obj = { ...data, isOwner };
						};
						if (RTLSUserData && RTLSUserData.length > 0) {
							const RTLSUser = RTLSUserData.filter((ob: any) => ob.userId == data.objectId);
							RTLSUser[0] ? RTLSobj = { ...obj, ...prepareRTLSData(RTLSUser[0]) } : false;
						};
						if (Object.keys(RTLSobj).length)
							array.push(RTLSobj);
						else
							array.push(obj);
					});
					params.successCallback(array, totalCount);
				} else {
					params.successCallback(response, totalCount);
				}
				if (totalCount == '0') {
					gridApi.showNoRowsOverlay();
				}

			});
			// } else if (activeToggle === 'rtls' && (RTLSUserData?.length > 0 ?? false)) {
			// 	const getGridRows = localRowData;
			// 	const array: any = [];
			// 	getGridRows.map((item: any) => {
			// 		let obj = {};
			// 		const RTLSUser = RTLSUserData.filter((ob: any) => ob.userId == item.objectId);
			// 		RTLSUser[0] ? obj = { ...item, ...prepareRTLSData(RTLSUser[0]) } : false;
			// 		array.push(obj);
			// 	});
			// 	params.successCallback(array, array.length);
			// };
		}
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
			workcategory: workCategory,
			skillMapping: {
				skillIds: (updatedRec?.skills || []).map((o: any) => o.objectId),
				userId: updatedRec?.objectId,
			},
			id: updatedRec?.objectId,
			isUser: true,
		};
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
		}else if(activeToggle === 'usergroups'){			
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
					statusText: item.status === 'Active' ? 'active' : item.status === "Disabled" ? 'deactivated' : item.status
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
				array.push(obj);
			});
			setRowData([...array]);
			setLocalRowData([...array]); //TO be used for filter/search..etc
			setReAssignState(true);
		}
	}, [ptGridData, RTLSUserData]);
	const initialGroupOrderComparator = useCallback((params: any) => {
		const a = params?.nodeA?.key || '';
		const b = params?.nodeB?.key || '';
		return a < b ? -1 : a > b ? 1 : 0;
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
		if((gridApi ?? false) && (appInfo ?? false)) {
			const colState = gridApi?.columnModel?.getColumnState();
			const sortState = colState?.filter((s:any) => {return s.sort != null}).map((s:any) => {return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex }});
			addCookie(`sorting_${appInfo?.projectId}_${CookieTitle}`,  JSON.stringify(sortState || ''));
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
					return canEditProjectTeamRec(rowData, appInfo?.gblConfig, true);
				}}
				manualLIDOpen={openRightPanel}
				onDetailClose={() => {
					setOpenRightPanel(false);
					setDefaultTabId("userDetails");
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
								onFilterMenuClose: onFilterMenuClose,
								defaultFilters: gridFilters,
								defaultSearchText: gridSearchText,
								defaultGroups: gridGroupValue,
								headerStatusFilters: gridSafetyStatusFilters
							},
						},
						grid: {
							headers: columns,
							data: [],
							//getRowId: (params: any) => params?.data?.rowNum,
							grouped: true,
							rowModelType: "serverSide",
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
							onCellMouseOver: onCellMouseOver,
							suppressDragLeaveHidesColumns: true,
							groupSelectsChildren: true,
							suppressRowClickSelection: false,
							// initialGroupOrderComparator: (e: any) => initialGroupOrderComparator(e),
							animateRows: false,
							groupDisplayType: 'groupRows',
							groupRowRendererParams: groupRowRendererParams,
							suppressScrollOnNewData: true,
							onSortChanged:onSortChanged
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
			<div ref={pttooltipRef} id="project-team-grid-tooltip-id" className="Projectteam-suiGrid-tooltip" style={{ display: 'none' }}></div>
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

export default memo(ProjectTeamWindowSSR);