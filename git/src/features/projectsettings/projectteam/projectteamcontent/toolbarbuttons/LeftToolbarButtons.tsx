import { Alert, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { getServer, setServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { isLocalhost, postMessage } from "app/utils";
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import IQToggle from "components/iqtoggle/IQToggle";
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { assignUnassignData, assignUnassignData2, assignUnassignDataNonMTA, generalPermissionsMap, generalPermissionsMapNonMTA, timelogAssignUnassignData, userPermissionTypeMap } from 'data/projectteam/menudata';
import React, { memo, useState } from "react";
import MultipleMenuSelect from 'sui-components/MultipleMenuSelect/MultipleMenu';
import { getReports, updateGeneralPermissions, updateSettings, updateVendorPermissions } from "../../operations/ptDataAPI";
import ProbationCard from '../../projectteamapplicationsdetails/SafetyProbationCard';
import './toolbar.scss';
// Component definition
const LeftToolbarButtons = (props: any) => {
	const{isReadOnly = false, ...rest} =props;
	const isFromOrgStaff = window.location.href?.includes('staff');
	const getAllowedCompanyManager = function (rec: any, gblConfig: any) {
		let isAllowed = false;
		if (gblConfig) {
			if (gblConfig?.isProjectAdmin || gblConfig?.isSafetyManager || gblConfig?.isProjectTeamManager) return true;
			else if (gblConfig?.isCompanyManager) {
				isAllowed = gblConfig?.currentUserCompany?.id == rec?.company?.objectId;
			}
			/* if (gblConfig?.project?.createdBy?.globalId == rec?.globalId) {
				// Project Owner
				isAllowed = false;
			} */
		}
		else {
			isAllowed = true;
		}
		return isAllowed;
	};
	const dispatch = useAppDispatch();
	const [ localhost ] = React.useState(isLocalhost);
	const { activeTab, appInfo, clickHandler, refreshGrid } = props.dataInfo;
	const { selectedMembers } = useAppSelector((state: any) => state.ptGridData);
	const gblConfig = appInfo?.gblConfig;
	const [ showToastMessage, setShowToastMessage ] = useState(false);
	const [ toastMessage, setToastMessage ] = useState('');
	React.useEffect(() => {
		if (showToastMessage) {
			setTimeout(() => {
				setShowToastMessage(false);
				setToastMessage('');
			}, 3000);
		}
	}, [ showToastMessage ]);
	const [ enforceCompanyTradeRelationship, setEnforceCompanyTradeRelationship ] = React.useState(false);

	let mainAppInfo = useAppSelector(getServer);
	React.useEffect(() => {
		setEnforceCompanyTradeRelationship(appInfo?.gblConfig?.enforceCompanyTradeRelationship);
	}, [ mainAppInfo ]);
	const currentProjectInfo = appInfo?.currentProjectInfo;
	const restrictAddUser = localhost ? false : (gblConfig?.orgSettings?.projectTeam_Restrict) || false;
	const isManager = localhost ? true : (gblConfig?.isUserManager || gblConfig?.isSafetyManager || gblConfig?.isCompanyManager || gblConfig?.isProjectTeamManager);
	const isProjectAdmin = localhost ? true : (gblConfig?.isProjectAdmin || gblConfig?.isProjectTeamManager);
	const isCompanyManager = localhost ? true : (gblConfig?.isCompanyManager);
	const isSafetyManager = localhost ? true : (gblConfig?.isSafetyManager);
	const isMTA = localhost ? true : (gblConfig?.project?.isProjectCentralZone) || false;
	const generalPermissions = isMTA ? assignUnassignData : assignUnassignDataNonMTA;
	let isOrgSubscribed = localhost ? true : (currentProjectInfo?.isOrgSubscribed);
	const assignOrUnassignUserPermission = (permissions: any, isDirty: any) => {
		const checkedVendorPermissions: any = [],
			isSingle = selectedMembers.length == 1;
		var showFinanceMsg = true;

		if (permissions && permissions.length > 0) {
			if(permissions.includes('Company Manager') || permissions.includes('Compliance Manager')) {
				if(!isDirty) showFinanceMsg = false;
				// permissions.push('None');
			}
			const hasGeneralPermissions = generalPermissions.map((o: any) => {
				if (permissions.includes(o.value)) {
					isDirty = true;
					return true;
				}
			}).includes(true),
				hasVendorPermissions = vendorMenuItems.map((o: any) => {
					!o.disable && checkedVendorPermissions.push({
						"id": null,
						"name": o.value,
						"isDeleted": true
					});
					if (permissions.includes(o.value) || permissions.includes('Company Manager') || permissions.includes('Compliance Manager') || hasGeneralPermissions) {
						return true;
					}
				}).includes(true),
				hasTimeLogPermissions  = [...timelogAssignUnassignData].map((o: any) => {
					!o.disable && checkedVendorPermissions.push({
						"id": null,
						"name": o.value,
						"isDeleted": true
					});
					if (permissions.includes(o.value) || permissions.includes('Company Manager') || permissions.includes('Compliance Manager') || hasGeneralPermissions) {
						return true;
					}
				}).includes(true);
				checkedVendorPermissions.push({
					"id": null,
					"name": 'Company Manager',
					"isDeleted": true
				});
				checkedVendorPermissions.push({
					"id": null,
					"name": 'Compliance Manager',
					"isDeleted": true
				});
			if (hasGeneralPermissions) {
				let rMap: any = isMTA ? generalPermissionsMap : generalPermissionsMapNonMTA;
				for (const key in permissions) {
					if (rMap[ permissions[ key ] ]) {
						if (isSingle && userPrivileges?.indexOf(permissions[ key ]) >= 0) {
							// it is same role
						} else {
							const { enum: role, msg: msg } = rMap[ permissions[ key ] ];
							if (role !== userPermissionTypeMap[ selectedMembers[ 0 ]?.userPermissionType ]?.enum) {
								let workerIds = selectedMembers.map((item: any) => item.objectId);
								workerIds =Array.from(new Set(workerIds));
								updateGeneralPermissions(appInfo, { role: role, userIds: workerIds }, function () {
									setToastMessage(msg);
									setShowToastMessage(true);
									refreshGrid();
								});
							}
						}
					}
				}
			}
			if (isDirty || hasVendorPermissions || hasTimeLogPermissions || (!hasVendorPermissions && selectedMembers[ 0 ][ 'projectZonePermissions' ] && selectedMembers[ 0 ][ 'projectZonePermissions' ]?.length > 0)) {
				checkedVendorPermissions.map((o: any) => {
					if (permissions.includes(o.name)) {
						o.isDeleted = false;
					}
					return o;
				});
				var onlyCheckedPermissions = checkedVendorPermissions.filter((o: any) => o.name != '');
				let zonePermission = selectedMembers[ 0 ] && selectedMembers[ 0 ][ 'projectZonePermissions' ] && selectedMembers[ 0 ][ 'projectZonePermissions' ].map((o: any) => o.name) || [],
					currentPermissions = checkedVendorPermissions.filter((o: any) => !o.isDeleted && o.name).map((o: any) => o.name);
				if (JSON.stringify(zonePermission.sort()) !== JSON.stringify(currentPermissions.sort())) {
					let workerIds = selectedMembers.map((item: any) => item.objectId);
					workerIds =Array.from(new Set(workerIds));
					updateVendorPermissions(appInfo, { roles: onlyCheckedPermissions, userIds: workerIds }, function () {
						if(showFinanceMsg) {
							setToastMessage('Permission updated successfully.');
							setShowToastMessage(true);
						}
						refreshGrid();
					});
				}
			}
		}
	};
	if (!(gblConfig?.project?.isProjectCentralZone) && !(gblConfig?.isZoneProject) && !(appInfo?.viewConfig?.isGlobalUsers)) {
		isOrgSubscribed = true;
	}
	let isOpenedFromProjCtrl = (appInfo?.viewConfig?.openFrom === 'ProjectCentral');

	//find security on grid line item selection
	let isRegistered = true,
		isSingle = false, isMulti = false, isMultiSelected = false, isActiveInactivAllEqual = false,
		activeInactiveArr: any[] = [], hasInactive = false, hasOwner = false,
		isAllowedCompanyManager = false,
		currentProject, projectMemberId: any,
		isRolesNotAvailable = false,
		isAnyUserSelected = false,
		isCMAConfirmed = false,
		disableVerify = false,
		isSameUserPermissionTypes = false,
		userPrivileges = [ 'None' ],
		userPermissionTypes: any = [],
		vendorMenuItems: any = [],
		timeLogMenuItems:any = [],
		isDeactivedForViolation = false;
	if (selectedMembers.length > 0) {
		let zonePermission = selectedMembers[ 0 ] && selectedMembers[ 0 ][ 'projectZonePermissions' ] || [],
			company = selectedMembers[ 0 ] && selectedMembers[ 0 ][ 'company' ];
		currentProject = gblConfig?.project;
		projectMemberId = currentProject?.createdBy?.globalId || '';
		isMulti = true;
		isMultiSelected = selectedMembers.length > 1;
		isSingle = selectedMembers.length === 1;
		isAllowedCompanyManager = getAllowedCompanyManager(selectedMembers[ 0 ], gblConfig);
		if (isMultiSelected) {
			userPermissionTypes = selectedMembers.map((ob: any) => ob.userPermissionType);
			isSameUserPermissionTypes = userPermissionTypes.every((v: any) => v === userPermissionTypes[ 0 ]);
			if (!isSameUserPermissionTypes) {
				userPrivileges = [];
			}
		}
		if (!isMultiSelected || isSameUserPermissionTypes) {
			var userPermissionType = selectedMembers[ 0 ][ 'userPermissionType' ];
			switch (userPermissionType) {
				case 'Admin':
					userPrivileges = [ 'Super Admin' ];
					break;
				case 'ProjectAdmin':
					userPrivileges = [ 'Admin' ];
					break;
				case 'AdminWithBilling':
					userPrivileges = [ 'Admin with Billing' ];
					break;
				case 'ProjectTeamManager':
					userPrivileges = [ 'Project Team Manager' ];
					break;
				case 'CompanyManger':
					userPrivileges = [ 'Company Manager' ];
					break;
				case 'ComplianceManager':
					userPrivileges = [ 'Compliance Manager' ];
					break;
			}
		}
		zonePermission = zonePermission.map((item: any) => item.name);

		if(gblConfig?.projectPlanSettings?.Modes?.financeMode == true || isLocalhost) {
			vendorMenuItems = assignUnassignData2;
			// vendorMenuItems = vendorMenuItems.filter((obj:any) => { return obj.plan != 'finance';})
		}
		if(vendorMenuItems.length > 0) {
			vendorMenuItems = vendorMenuItems.map((v: any) => {
				let isDisabled = false,
					name = v.value,
					checked = zonePermission.includes(name);

				if (name == "Budget Manager") {
					isDisabled = (gblConfig?.isProjectAdmin) ? false : true;
				} else if (name == "Compliance Manager") {
					isDisabled = (company?.isDiverseSupplier) ? false : true;
				} else if (name == "Client Contract Manager" || name == "Client Pay Manager" || name == "Client Change Event Manager") {
					isDisabled = company?.companyType == "Client" ? false : true;
				}
				v.disable = isDisabled;
				checked && userPrivileges.push(name);
				return v;
			});
		}
		timeLogMenuItems = [...timelogAssignUnassignData];
		if(timeLogMenuItems?.length > 0) {
			timeLogMenuItems = timeLogMenuItems.map((v: any) => {
				let name = v.value, checked = zonePermission.includes(name);
				checked && userPrivileges.push(name);
				return v;
			});
		};
		var complianceMgr: any = generalPermissions.find((obj:any) => { 
			return obj.value == 'Compliance Manager'
		});
		if(complianceMgr ?? false) {
			complianceMgr && (complianceMgr.disable = (company?.isDiverseSupplier) ? false : true);
		};
		if((complianceMgr ?? false) && zonePermission?.includes('Compliance Manager')) {
			if(userPrivileges.includes('None')) userPrivileges.splice(0, 1);
			userPrivileges.push(complianceMgr.value);
		} else if(zonePermission?.includes('Company Manager')) {
			if(userPrivileges.includes('None')) userPrivileges.splice(0, 1);
			if(userPermissionType == 'None') userPrivileges.push('Company Manager');
		}
		selectedMembers.map((rec: any) => {
			activeInactiveArr = [ ...activeInactiveArr, (rec.status === "Active") ];
			if (!(rec.status === "Active") && rec.safetyStatus !== 7) {
				hasInactive = true;
			}
			if (rec.globalId === projectMemberId) {
				hasOwner = true;
			}
			if (rec?.globalId?.indexOf('00000000') > -1) {
				isRegistered = false;
			}
			if (rec?.globalId?.indexOf('00000000') == -1 && (rec.status === "Active")) {
				isAnyUserSelected = true;
			}
			if (rec.safetyStatus == 2 || !(rec.status === "Active")) {
				disableVerify = true;
			}
			if (!isCMAConfirmed && rec.companyManagerAttestation !== 'AwaitingResponse' || !isAllowedCompanyManager) {
				isCMAConfirmed = true;
			}
			let role = [];
			if (rec.securityGroups) {
				for (let i = 0; i < rec.securityGroups.length; i++) {
					role.push({ value: (rec.securityGroups[ i ].name || rec.securityGroups[ i ].value), id: rec.securityGroups.id });
				}
			}
			if (!localhost && (!isRolesNotAvailable && role.length === 0) && (!rec.appRoles || rec.appRoles.length === 0) && (!rec.globalGroups || rec.globalGroups.length === 0)) {
				isRolesNotAvailable = true;
			}
			if (rec.safetyStatus == 7 && !(rec.status === "Active")) {
				isDeactivedForViolation = true;
			}
		});
	}
	isActiveInactivAllEqual = (activeInactiveArr.length > 0) && (arr => arr.every(v => v === arr[ 0 ]))(activeInactiveArr);
	disableVerify = (selectedMembers.length === 0) || disableVerify;
	const disableEdit = isReadOnly ? isReadOnly : !(isSingle && isAllowedCompanyManager && !hasInactive);
	const disableDelete = isReadOnly ? isReadOnly :  !(selectedMembers.length > 0 && !hasOwner);
	const disableActivate = isReadOnly ? isReadOnly :  !(isActiveInactivAllEqual) || isDeactivedForViolation;
	const activeToolTip = !(activeInactiveArr && activeInactiveArr[ 0 ]) ? 'Activate' : 'De-Activate';
	const activeBtnCls = !(activeInactiveArr && activeInactiveArr[ 0 ]) ? 'appzone-itemactivated usractivate' : 'appzone-itemactivated usrdeactivate';
	let hasCompanyManagerPermission = selectedMembers.length > 0;
	selectedMembers.map((s: any) => {
		if (hasCompanyManagerPermission) {
			hasCompanyManagerPermission = getAllowedCompanyManager(s, gblConfig);
		}
	});
	const disableUserPrivilege = (selectedMembers.length == 0) ? true : !(!hasInactive && isRegistered && hasCompanyManagerPermission);

	const disableLiveLink = !(selectedMembers.length > 0 && !hasInactive && isRegistered);
	const disableLiveChat = !(isAnyUserSelected);
	const disableSendEmail = !(isMulti && !hasInactive);
	const disablePrint = isReadOnly ? isReadOnly :  !(isMulti && !hasInactive);
	const disableReInvite = selectedMembers.length === 0 || isRolesNotAvailable;
	const disableWorkerAttestMent = (selectedMembers.length === 0) || isCMAConfirmed;

	const disableAdd = isReadOnly;
	const disableOrgConsole = isReadOnly;
	const disableRefresh = isReadOnly;
	const printerMenuOptions = [
		{ text: "CustomBadge", value: "customBadge", iconCls: 'common-icon-badge icon-size', disabled: disablePrint },
		{ text: "Safety Digest Notification", value: "safetyDigestNotification", iconCls: 'common-icon-safety-digest-notification icon-size', disabled: disablePrint },
		{ text: "SDN", value: "sdn", iconCls: 'common-icon-SDN--1 icon-size', disabled: disablePrint },
		{ text: "Tasks", value: "tasks", iconCls: 'common-icon-task1 icon-size', disabled: disablePrint },
		{ text: "User Badge", value: "userBadge", iconCls: 'common-icon-badge icon-size', disabled: disablePrint },
		{ text: "Work Labor Sheet - This week", value: "workLaborSheet", iconCls: '', disabled: disablePrint },
	];
	const [ printerOptions, setPrinterOptions ] = React.useState<any>([]);
	const printerDatRef = React.useRef(false);
	const onPrintMenuClick = (menuType: any, menuData: any) => {
		let userIds = selectedMembers.map((r: any) => r?.objectId);
			userIds =Array.from(new Set(userIds));
		if (menuData && menuData.value && menuData.value == 'printWorkerBadge') {
			// batchPrint();
			postMessage({ event: 'projectteam', body: { evt: 'batchprint', userIds: userIds } });
			return;
		}
		// GBL.OpenReportViewer(menuData.id + '', '', userIds.join(';'), 'itemprintreport');
		postMessage({ event: 'projectteam', body: { evt: 'itemprintreport', userIds: userIds?.join(';'), reportId: menuData?.id } });
	};

	React.useEffect(() => {
		const array: any = [];
		if (appInfo && appInfo.projectId) {
			const array: any = [];
			if (printerDatRef.current) return;
			getReports(appInfo, (response: any) => {
				// console.log('getReports', response);
				response?.map((data: any) => {
					array.push({ text: data?.name, value: data?.name, id: data?.id, iconCls: 'common-icon-badge icon-size ' + data?.name?.replace(/\s/g, '').toLowerCase(), type: data?.type, disabled: (data?.name == "Safety Digest Notification") ? false : disablePrint });
				});
				printerDatRef.current = true;
				setPrinterOptions([ ...array ]);
			});
		}
	}, [ appInfo ]);
	React.useEffect(() => {
		const array: any = [];
		printerOptions?.map((data: any) => {
			array.push({ ...data, disabled: (data?.text == "Safety Digest Notification") ? false : disablePrint });
		});
		setPrinterOptions([ ...array ]);
	}, [ disablePrint ]);
	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton aria-label='Refresh Project Team List' data-action='refresh' onClick={ clickHandler } disabled={ disableRefresh }>
				<span className='common-icon-refresh icon-size' />
			</IconButton>
		</IQTooltip>
		{ activeTab === 'rtls' || (!isManager) || restrictAddUser ? '' : <IQTooltip title='Add' placement='bottom'>
			<IconButton data-action='add' onClick={ clickHandler } disabled={ disableAdd }>
				<span className='common-icon-add icon-size' />
			</IconButton>
		</IQTooltip> }
		{activeTab === 'rtls' ||  (!isManager) || (!isOrgSubscribed) ? '' : <IQTooltip title={ isMTA ? 'Pick from Org Console' : 'Pick from Global' } placement='bottom'>
			<IconButton data-action='pick-org' onClick={ clickHandler } disabled={ disableOrgConsole }>
				<span className='common-icon-pick-company-org icon-size' />
			</IconButton>
		</IQTooltip> }
		{ (activeTab === 'rtls' || activeTab === 'usergroups') || (!isManager) ? '' : <IQTooltip title='Edit' placement='bottom' >
			<IconButton disabled={ disableEdit } data-action='edit' onClick={ clickHandler }>
				<span className='common-icon-Edit icon-size' />
			</IconButton>
		</IQTooltip> }
		{ (activeTab === 'rtls' || activeTab === 'usergroups') || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isProjectTeamManager) ? '' : <IQTooltip title='Delete' placement='bottom'>
			<IconButton disabled={ disableDelete } aria-label='Delete Project Team Line Item' data-action='delete' onClick={ clickHandler }>
				<span className='common-icon-Delete icon-size' />
			</IconButton>
		</IQTooltip> }
		{ (activeTab === 'rtls' || activeTab === 'usergroups') || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isProjectTeamManager) || (!isMTA) ? '' : <IQTooltip title={ activeToolTip } placement='bottom'>
			<IconButton disabled={ disableActivate } className={ activeBtnCls } data-action='act-dect' onClick={ clickHandler }>
			{activeToolTip === 'Activate' ? (
                    <span className='common-icon-Activate-ap icon-size' />
                ): (
                    <span className='common-icon-Deactivate icon-size' />
                )}
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'member' || (!isManager) ? '' : <IQTooltip title='Assign/Unassign to Security Group' placement='bottom'>
			{/* <IconButton disabled={disableUserPrivilege}>
				<span className='common-icon-none icon-size' />
			</IconButton> */}
			<MultipleMenuSelect
				icon={ <span className='common-icon-none icon-size' /> }
				iconDisable={ disableUserPrivilege }
				options={ vendorMenuItems }
				options2={ generalPermissions }
				options3={timeLogMenuItems}
				userPrivileges={ userPrivileges }
				Menuheading={ vendorMenuItems.length > 0? 'Finance Permissions': '' }
				Menuheading1={'Time Log' }
				MenuOptionsClick={ (data: any, isDirty: any) => { assignOrUnassignUserPermission(data, isDirty); } }
			/>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'member' ? '' : <><IQTooltip title='LiveLink' placement='bottom'>
			<IconButton disabled={ disableLiveLink } data-action='livelink' onClick={ clickHandler }>
				<span className='common-icon-livelink icon-size' />
			</IconButton>
		</IQTooltip>
			<IQTooltip title='LiveChat' placement='bottom'>
				<IconButton disabled={ disableLiveChat } data-action='livechat' onClick={ clickHandler }>
					<span className='common-icon-chatting icon-size' />
				</IconButton>
			</IQTooltip></> }
		{isFromOrgStaff ? null : activeTab !== 'member' || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isSafetyManager && !gblConfig?.isProjectTeamManager) ? '' : <IQTooltip title='Email' placement='bottom'>
			<IconButton disabled={ disableSendEmail } data-action='email' onClick={ clickHandler }>
				<span className='common-icon-email-message icon-size' />
			</IconButton>
		</IQTooltip> }
		{ (activeTab === 'usergroups') || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isSafetyManager && !gblConfig?.isProjectTeamManager) ? '' : <IQTooltip title='Print' placement='bottom'>
			<IconMenu
				showNone={ true }
				noneText={ 'Reports' }
				options={ printerOptions }
				onChange={ (value: any, menuData: any) => {
					console.log('printer', value, menuData);
					if (menuData?.disabled) {
						return;
					}
					onPrintMenuClick(value, menuData);

				} }
				menuProps={ {
					open: true,
					header: props.filterHeader ? props.filterHeader : '',
					placement: 'bottom-start',
				} }
				buttonProps={ {
					'aria-label': '',
					className: 'printer-Submenu',
					disableRipple: true,
					startIcon: <span className='common-icon-Print1 icon-size' />
				} }
				extraMenuItemShow={ true }
				extraMenuItem={ [ { text: "Print Worker Badge", value: "printWorkerBadge", iconCls: 'common-icon-badge icon-size printworkerbadge', disabled: disablePrint } ] }
			/>
		</IQTooltip> }
		{ (activeTab === 'safety' || activeTab === 'usergroups') || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isSafetyManager && !gblConfig?.isProjectTeamManager) ? '' :
			<IQTooltip title={ activeTab === 'rtls' ? 'Worker In/Out Alert Settings' : '' } placement='bottom'>
				{ activeTab === 'member' ?
					<Settings
						toggleDefaultValue={ enforceCompanyTradeRelationship }
						ToggleOnChange={ (value: any) => {
							console.log(value);
							let currentGblConfig = mainAppInfo?.gblConfig || {};
							currentGblConfig = Object.assign({}, currentGblConfig, { enforceCompanyTradeRelationship: value });
							const updatedAppInfo = Object.assign({}, mainAppInfo, { gblConfig: currentGblConfig });
							dispatch(setServer(updatedAppInfo));
							postMessage({ event: 'projectteam', body: { evt: 'membersettings', enforceCompanyTradeRelationship: value } });
							updateSettings(appInfo, { "projectId": appInfo?.projectId, "type": 11, "settingJson": { "enforceCompanyTradeRelationship": value } }, function () {
								setToastMessage('Settings updated successfully');
								setShowToastMessage(true);
							});
						} }
						ToggleDisable={ false }
						disable={isReadOnly}
					/> :
					<IconButton disabled={isReadOnly} onClick={ () => { console.log('Worker In/Out Alert Settings'); postMessage({ event: 'projectteam', body: { evt: 'rtlssettings' } }); } }>
						<span className='common-icon-new-gear icon-size' />
					</IconButton>
				}
			</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'member' || (!isProjectAdmin) || (isOpenedFromProjCtrl) ? '' : <IQTooltip title='Supplemental Info' placement='bottom'>
			<IconButton data-action='supplemental' onClick={ clickHandler }>
				<span className='common-icon-settings-icon icon-size' />
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'member' || (!localhost && !gblConfig?.isUserManager && !gblConfig?.isSafetyManager && !gblConfig?.isProjectTeamManager) || !(isLocalhost ? true : appInfo?.isProcore) ? '' : <IQTooltip title='Sync to Procore' placement='bottom'>
			<IconButton data-action='procore' onClick={ clickHandler }>
				<span className='common-icon-procor-icon icon-size' />
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : (activeTab === 'rtls' || activeTab === 'usergroups') || (!isProjectAdmin) ? '' : <IQTooltip title='Re-invite Users' placement='bottom'>
			<IconButton disabled={ disableReInvite } data-action='reinvite' onClick={ clickHandler }>
				<span className='common-icon-reinvite icon-size' />
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'member' || !(isLocalhost ? true : appInfo?.isSAP) ? '' : <IQTooltip title='Sync Team Members to SAP' placement='bottom'>
			<IconButton data-action='sap' onClick={ clickHandler }>
				<span className='common-icon-sap-setting icon-size' />
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'safety' || !(isSafetyManager) ? '' : <IQTooltip title='' placement='bottom'>
			<IconButton data-action='probation' onClick={ clickHandler }>
				<ProbationCard />
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'safety' || !(isCompanyManager) || !(isLocalhost ? true : gblConfig?.currentProjectInfo?.isWorkerAttestmentOn) ? '' : <IQTooltip title='Attest Worker' placement='bottom'>
			<IconButton className='iq-border-button' disabled={ disableWorkerAttestMent } data-action='attestment' onClick={ clickHandler }>
				<span className='common-icon-worker-attestment icon-size' />
				Attest Worker
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'safety' || !(isCompanyManager) ? '' : <IQTooltip title='Manage Company' placement='bottom'>
			<IconButton className='iq-border-button' data-action='managecompany' onClick={ clickHandler }>
				<span className='common-icon-company icon-size' />
				Manage Company
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff ? null : activeTab !== 'safety' || !(isSafetyManager) ? '' : <IQTooltip title='' placement='bottom'>
			<IconButton aria-label='Verify' disabled={ disableVerify } className='iq-border-button iq-verify-button' data-action='verify' onClick={ clickHandler }>
				<span className='common-icon-Verify icon-size' />
				Verify
			</IconButton>
		</IQTooltip> }
		{isFromOrgStaff && 
		<IQTooltip title='Calendar' placement='bottom'>
			<IconButton aria-label='dates' disabled={ isReadOnly } data-action='dates' onClick={ clickHandler }>
			<span className='common-icon-DateCalendar' />
			</IconButton>
		</IQTooltip> }
		{!isReadOnly && isFromOrgStaff && 
			<IconButton aria-label='reservestaff' className='iq-border-button iq-reverse-button' data-action='reservestaff' onClick={ clickHandler }>
				Reserve Staff
			</IconButton>
		}
		{!isReadOnly && isFromOrgStaff && 
			<IconButton aria-label='managergroups' className='iq-border-button iq-manager-button' data-action='managergroups' onClick={ clickHandler }>
				Manage Groups
			</IconButton>
		}
		{
			showToastMessage &&
			<Alert severity="success" className='floating-toast-cls in-lefttoolbar' onClose={ () => { setShowToastMessage(false); } }>
				<span className="toast-text-cls">
					{ toastMessage }</span>
			</Alert>

		}

	</>;
};
const Settings = (props: any) => {
	const {disable = false,...rest} =props;
	const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
	const [ toggleChecked, setToggleChecked ] = React.useState<any>();
	const open = Boolean(anchorEl);

	React.useEffect(() => {
		if (props.toggleDefaultValue) {
			setToggleChecked(true);
		}
		else {
			setToggleChecked(false);
		}
	}, [ props.toggleDefaultValue ]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton disabled={disable} onClick={ handleClick }><span className='common-icon-new-gear icon-size' /></IconButton>
			<Menu
				id="demo-positioned-menu"
				aria-labelledby="demo-positioned-button"
				anchorEl={ anchorEl }
				open={ open }
				onClose={ handleClose }
			>
				<MenuItem>
					<ListItemIcon key={ `iqmenu-item-icon-` }>
						<IQToggle
							checked={ toggleChecked }
							switchLabels={ [ "ON", "OFF" ] }
							onChange={ (e, value) => {
								setToggleChecked(value);
								props.ToggleOnChange && props.ToggleOnChange(value);
							} }
							disabled={ props.ToggleDisable }
							edge={ "end" }
						/>
					</ListItemIcon>
					<ListItemText style={ { marginLeft: '24px' } }>Enforce Company and Trade Relationship</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
};

export default memo(LeftToolbarButtons);