import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "app/hooks";
import {
	getServer
} from "app/common/appInfoSlice";
import { isLocalhost } from "app/utils";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { fetchRoleInfo } from "../../operations/ptDataAPI";
import './ProjectTeamRolesTooltip.scss';

const ProjectTeamRolesTooltip = (props: any) => {
	const [rolesTooltipBool, setRolesTooltipBool] = useState<any>(false);
	const [activeRoleItem, setACtiveRoleItem] = useState<any>({});
	const [rolesDataArr, setRolesDataArr] = useState<any>([]);
	const [activeIndex, setActiveIndex] = useState<any>(0);
	const appInfo = useAppSelector(getServer);
	const [localhost] = React.useState(isLocalhost);
	const AutoWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: "none",
		},
	});

	const tmplRef = useRef<any>();
	const cellRef = useRef<any>();

	useEffect(() => {
		if (rolesDataArr && rolesDataArr?.length > 0) {
			setACtiveRoleItem(rolesDataArr[0]);
		}
	}, [rolesDataArr]);

	useEffect(() => {
		window.addEventListener("click", onOutsideClick);

		return () => {
			window.removeEventListener("click", onOutsideClick);
		};
	}, []);

	/**
	 * Triggers when user clicks on anywhere in the document.
	 * Closes the roles tooltip when current target not cell/tooltip
	 * @param e 
	 * @author Srinivas Nadendla
	 */
	const onOutsideClick = (e: any) => {
		const { target } = e;
		if (!rolesTooltipBool) {
			if (
				!tmplRef.current.contains(target) &&
				!cellRef.current.contains(target)
			) {
				setRolesTooltipBool(false);
			}
		}
	};

	/**
	 * Make an API and update the local state with the response data
	 * @param data Current row data
	 * @author Srinivas Nadendla
	 */
	const fetchRolesData = (data: any) => {
		fetchRoleInfo(props.appInfo, { roleIds: data?.roleIds?.join(';'), userId: data?.objectId }, (res: any) => {
			if (res?.success) {
				setRolesDataArr(res.values);
			} else {
				setRolesDataArr([]);
			}
		})
	};

	useEffect(() => {
		props?.params?.data && fetchRolesData(props?.params?.data)
	}, [props?.params?.data])
	/**
	 * On Previous arrow click set the activeIndex state to current - 1
	 * @param e 
	 * @author Srinivas Nadendla
	 */
	const onPrevClick = (e: any) => {
		e.stopPropagation();
		if (activeIndex > 0) {
			setActiveIndex(activeIndex - 1);
		}
	};

	/**
	 * On Next arrow click set the activeIndex state to current + 1
	 * @param e 
	 * @author Srinivas Nadendla
	 */
	const onNextClick = (e: any) => {
		e.stopPropagation();
		if (activeIndex < rolesDataArr?.length - 1) {
			setActiveIndex(activeIndex + 1);
		}
	};

	/**
	 * Whenever activeIndex state changes - update the activeRoleItem data
	 */
	useEffect(() => {
		setACtiveRoleItem(rolesDataArr[activeIndex]);
	}, [activeIndex]);

	/**
	 * @returns Tooltip body to render inside tooltip
	 * @author Srinivas Nadendla
	 */
	const TooltipTmpl = () => {
		return (
			< div ref={tmplRef} className="project-team-roles-tooltip" >
				<div className="project-team-roles-tooltip_header">
					<div className="project-team-roles-tooltip_header-left">
						<div className="project-team-roles-tooltip_header-icon-wrapper">
							<div className="project-team-roles-tooltip_header-icon common-icon-portfolio-newtag"></div>
						</div>
						<div className="project-team-roles-tooltip_header-title">
							{activeRoleItem?.name ? activeRoleItem?.name : "Loading..."}
						</div>
					</div>
					{rolesDataArr?.length > 1 && (
						<div className="project-team-roles-tooltip_header-right">
							<span
								className={
									"common-icon-previous-arrow " +
									(activeIndex === 0 ? "common-icon-previous-arrow_disabled" : "")
								}
								onClick={(e: any) => onPrevClick(e)}
							></span>
							{activeIndex + 1} of {rolesDataArr?.length}
							<span
								className={
									"common-icon-next-arrow " +
									(activeIndex === rolesDataArr?.length - 1
										? "common-icon-next-arrow_disabled"
										: "")
								}
								onClick={(e: any) => onNextClick(e)}
							></span>
						</div>
					)}
				</div>
				<div className="project-team-roles-tooltip_body">
					<div className="project-team-roles-tooltip_overview">
						<div className="project-team-roles-tooltip_overview-title">
							General Overview:
						</div>
						<div className="project-team-roles-tooltip_overview-desc">
							{activeRoleItem?.description}
						</div>
					</div>
					<div className="project-team-roles-tooltip_access">
						<div className="project-team-roles-tooltip_access-title">
							Apps access to:
						</div>
						<div className="project-team-roles-tooltip_access-list-wrapper">
							{activeRoleItem?.apps?.length > 0 &&
								activeRoleItem?.apps.map((item: any) => {
									return (
										<div
											className="project-team-roles-tooltip_access-list-item"
											key={item.uniqueId}
										>
											<div className="project-team-roles-tooltip_access-list-item-top">
												<div className="project-team-roles-tooltip_access-list-item-top-left">
													<div className="project-team-roles-tooltip_access-app-img">
														<img alt="" src={item.dockIcon} />
													</div>
													<div className="project-team-roles-tooltip_access-app-name">
														{item.name}
													</div>
												</div>
												<div className="project-team-roles-tooltip_access-list-item-top-right">
													<span>Can Create Item: </span>{" "}
													<span
														className={
															item?.canCreateItem
																? "project-team-roles-tooltip_access-yes"
																: ""
														}
													>
														{item?.canCreateItem ? "Yes" : "No"}
													</span>
												</div>
											</div>
											{item.description && (
												<div className="project-team-roles-tooltip_access-list-item-bottom">
													{item.description}
												</div>
											)}											
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div >
		);
	};

	return (

		// <AutoWidthTooltip
		// 	arrow
		// 	key={props.uniqeId}
		// 	title={TooltipTmpl()}
		// 	open={rolesTooltipBool}
		// 	disableFocusListener
		// 	disableHoverListener
		// 	disableTouchListener
		// > 
		// <span
		// 	ref={cellRef}
		// 	tabIndex={0}
		// 	className={`pt-${props?.params?.column?.colId}`}
		// 	style={{ cursor: props.rolesVal ? "pointer" : "none", pointerEvents: rolesTooltipBool ? 'none' : 'auto' }}
		// 	onClick={(e: any) => {
		// 		console.log('roles')
		// 		e.stopPropagation();
		// 		setRolesTooltipBool(true);
		// 		fetchRolesData(props?.params?.data);
		// 	}}
		// >
		// 	{props.rolesVal}
		// </span> 

		// </AutoWidthTooltip>

		< div ref={tmplRef} className="project-team-roles-tooltip" >
			<div className="project-team-roles-tooltip_header">
				<div className="project-team-roles-tooltip_header-left">
					<div className="project-team-roles-tooltip_header-icon-wrapper">
						<div className="project-team-roles-tooltip_header-icon common-icon-portfolio-newtag"></div>
					</div>
					<div className="project-team-roles-tooltip_header-title">
						{activeRoleItem?.name ? activeRoleItem?.name : "Loading..."}
					</div>
				</div>
				{rolesDataArr?.length > 1 && (
					<div className="project-team-roles-tooltip_header-right">
						<span
							className={
								"common-icon-previous-arrow " +
								(activeIndex === 0 ? "common-icon-previous-arrow_disabled" : "")
							}
							onClick={(e: any) => onPrevClick(e)}
						></span>
						{activeIndex + 1} of {rolesDataArr?.length}
						<span
							className={
								"common-icon-next-arrow " +
								(activeIndex === rolesDataArr?.length - 1
									? "common-icon-next-arrow_disabled"
									: "")
							}
							onClick={(e: any) => onNextClick(e)}
						></span>
					</div>
				)}
			</div>
			<div className="project-team-roles-tooltip_body">
				<div className="project-team-roles-tooltip_overview">
					<div className="project-team-roles-tooltip_overview-title">
						General Overview:
					</div>
					<div className="project-team-roles-tooltip_overview-desc">
						{activeRoleItem?.description}
					</div>
					<div className="plandetails-cls">

						{(localhost || (appInfo?.gblConfig?.projectPlan?.indexOf('Planner') >= 0 || appInfo?.gblConfig?.projectPlan?.indexOf('Field') >= 0 || appInfo?.gblConfig?.projectPlan?.indexOf('One') >= 0)) && <div className="plans-cls">
							<span className="common-icon-planner"></span>
							<span className="plan-label" style={{ paddingRight: 12, fontSize: 14 }}>PLANNER &trade; :&nbsp;</span>
							<span className="boardsandschedule-cls">Can create Boards and Schedule: <span
								className={
									activeRoleItem?.canCreateBoards
										? "project-team-roles-tooltip_access-yes"
										: ""
										}
							>
								{activeRoleItem?.canCreateBoards ? "Yes" : "No"}
							</span>
							</span>
						</div>}

						{(isLocalhost || (appInfo?.gblConfig?.projectPlan?.indexOf('Field') >= 0 || appInfo?.gblConfig?.projectPlan?.indexOf('One') >= 0)) && <div  className="plans-cls">
							<span className="common-icon-field"></span>
							<span className="plan-label" style={{ paddingRight: 12, fontSize: 14 }}>FIELD &trade; :&nbsp;</span>
							<span className="boardsandschedule-cls" style={{paddingRight: 12}}>Can Upload Drawings: <span
									className={
										activeRoleItem?.canUploaddrawings
											? "project-team-roles-tooltip_access-yes"
											: ""
											}
								>
									{activeRoleItem?.canUploaddrawings ? "Yes" : "No"}
								</span></span>&nbsp;
							<span className="boardsandschedule-cls">Can Upload Files: <span
										className={
											activeRoleItem?.canUploadFiles
												? "project-team-roles-tooltip_access-yes"
												: ""
												}
									>
										{activeRoleItem?.canUploadFiles ? "Yes" : "No"}
								</span></span>
						</div>}
					
						{(isLocalhost || appInfo?.gblConfig?.projectPlan?.indexOf('One') >= 0) &&<div  className="plans-cls">
							<span className="common-icon-pro"></span>
							<span className="plan-label" style={{ paddingRight: 12, fontSize: 14 }}>ONE &trade; :&nbsp;</span>
							<span className="boardsandschedule-cls">Can Access AppStudio: <span
									className={
										activeRoleItem?.canAccessAppStudio == "Yes"
											? "project-team-roles-tooltip_access-yes"
											: ""
											}
								>
									{activeRoleItem?.canAccessAppStudio}
								</span></span>
						</div>}
						{/* {(isLocalhost || appInfo?.gblConfig?.projectPlan?.indexOf('One') == -1) && <div>
							<span className="plan-label app-studio" style={{ paddingRight: 12, fontSize: 13 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
								<span className="boardsandschedule-cls">Can Access AppStudio: <span
									className={
										activeRoleItem?.canAccessAppStudio == "Yes"
											? "project-team-roles-tooltip_access-yes"
											: ""
											}
								>
									{activeRoleItem?.canAccessAppStudio}
								</span></span>
						</div>} */}
					</div>
				</div>
				<div className="project-team-roles-tooltip_access">
					<div className="project-team-roles-tooltip_access-title">
						Apps access to:
					</div>
					<div className="project-team-roles-tooltip_access-list-wrapper">
						{activeRoleItem?.apps?.length > 0 &&
							activeRoleItem?.apps.map((item: any) => {
								return (
									<div
										className="project-team-roles-tooltip_access-list-item"
										key={item.uniqueId}
									>
										<div className="project-team-roles-tooltip_access-list-item-top">
											<div className="project-team-roles-tooltip_access-list-item-top-left">
												<div className="project-team-roles-tooltip_access-app-img">
													<img alt="" src={item.dockIcon} />
												</div>
												<div className="project-team-roles-tooltip_access-app-name">
													{item.name}
												</div>
											</div>
											<div className="project-team-roles-tooltip_access-list-item-top-right">
												<span>Can Create Item: </span>{" "}
												<span
													className={
														item?.canCreateItem
															? "project-team-roles-tooltip_access-yes"
															: ""
													}
												>
													{item?.canCreateItem ? "Yes" : "No"}
												</span>
											</div>
										</div>
										{item.description && (
											<div className="project-team-roles-tooltip_access-list-item-bottom">
												{item.description}
											</div>
										)}
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</div >
	);
};
export default ProjectTeamRolesTooltip;
