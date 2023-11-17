import React, { useCallback, useEffect } from "react";
import { List, ListItem, ListItemAvatar, InputLabel, Card, Avatar, Grid, ListItemText, Typography, Stack, Box, TextField, FormControlLabel, Radio, Button, RadioGroup } from "@mui/material"
import IQToggle from "components/iqtoggle/IQToggle";
import IQTooltip from "components/iqtooltip/IQTooltip";
import infoicon from "resources/images/common/infoicon.svg";
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSafetyProbationPopOver } from "../operations/ptGridSlice";
import { isLocalhost } from "app/utils";
import { appInfoData } from "data/appInfo";
import { getServer, setServer } from "app/common/appInfoSlice";
import { ClickAwayListener } from '@mui/base';
import { upsertProbationData } from "../operations/ptDataAPI";
import { postMessage } from "app/utils";

const ProbationCard = (props: any) => {
	const { ...others } = props;
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	let appInfo = useAppSelector(getServer);
	const [anchorEl, setAnchorEl] = React.useState();
	const [open, setOpen] = React.useState(false);
	const id = open ? 'simple-popover' : undefined;
	const { rolesData } = useAppSelector((state) => state?.ptGridData);
	const dispatch = useAppDispatch();
	const [safetyProbation, setSafetyProbation] = React.useState<any>();
	const [safetyProbationChanged, setSafetyProbationChanged] = React.useState<any>();
	const [safetyProbationTimer, setSafetyProbationTimer] = React.useState<any>();
	React.useEffect(() => {
		if (appInfo?.currentProjectInfo) {
			let info = appInfo?.currentProjectInfo;
			setSafetyProbation({
				"projectId": appInfo?.projectId,
				"allowUserRenewal": info?.allowUserRenewal ?? false,
				"userRenewalDays": info?.userRenewalDays ?? 0,
				"allowUserProbation": info?.allowUserProbation ?? false,
				"userProbationDays": info?.userProbationDays ?? 0,
				"probationType": info?.probationType ?? 1,
			})
		}
	}, [appInfo])
	const handleClick = (e?: any) => {
		if (e) setAnchorEl(e.currentTarget);
		setOpen(!open);
	};
	const handleClose = () => {
		setOpen(false);
		setAnchorEl(undefined);
		dispatch(setSafetyProbationPopOver(false));
	};
	const getProbationData = (formDataClone: any) => {
		console.log('getProbationData--->', formDataClone, new Date() );
		upsertProbationData(appInfo, formDataClone, (response: any) => {
			// console.log("upsert Probation Data Response", response);
			postMessage({ event: 'projectteam', body: { evt: 'updateprobationsettings', settings: formDataClone } });
			const toastMsgData: any = {
				"event": "showMessage",
				"data": {
					"event": "showMessage",
					"msg": "Updated successfully"
				}
			};
			window && window["onmessage"] && window["onmessage"](toastMsgData);
		});

		if (appInfo['currentProjectInfo']) {
			let currentProjectInfo = appInfo['currentProjectInfo'];
			currentProjectInfo = Object.assign({}, currentProjectInfo, { allowUserRenewal: formDataClone.allowUserRenewal, userRenewalDays: formDataClone.userRenewalDays, allowUserProbation: formDataClone.allowUserProbation, userProbationDays: formDataClone.userProbationDays, probationType: formDataClone.probationType });
			const updatedAppInfo = Object.assign({}, appInfo, { currentProjectInfo: currentProjectInfo });
			// appInfo['currentProjectInfo'].allowUserRenewal = formDataClone.allowUserRenewal;
			// appInfo['currentProjectInfo'].userRenewalDays = formDataClone.userRenewalDays;
			// appInfo['currentProjectInfo'].allowUserProbation = formDataClone.allowUserProbation;
			// appInfo['currentProjectInfo'].userProbationDays = formDataClone.userProbationDays;
			// appInfo['currentProjectInfo'].probationType = formDataClone.probationType;
			dispatch(setServer(updatedAppInfo));
			console.log("appInfo Test", updatedAppInfo);
		}
	};
	const handleChange = (value: any, name: any) => {
		const formDataClone = { ...safetyProbation, [name]: value };
		setSafetyProbation(formDataClone);
		setSafetyProbationChanged(true);
		setTimeout(() => {
			setSafetyProbationChanged(false);
		}, 100);
	};
	React.useEffect(() => {
		console.log('safetyProbationChanged--->', safetyProbationChanged, safetyProbation, new Date() );
		if (safetyProbationChanged) {
			clearTimeout(safetyProbationTimer);
			const clearTimer = setTimeout(() => {
				getProbationData(safetyProbation);
			}, 2000);
			setSafetyProbationTimer(clearTimer);
			// return () => clearTimeout(clearTimer);
		}
	}, [safetyProbationChanged, safetyProbation]);
	const handleNotificationSettings = (e: any) => {
		// e.target.tagName !== 'DIV' && console.log('Notification Settings Handler', rolesData, safetyProbation);
		e.target.tagName !== 'DIV' && postMessage({ event: 'projectteam', body: { evt: 'opennotificationsettings', rolesData: rolesData } });
	};
	return (
		<ClickAwayListener
			mouseEvent="onMouseDown"
			touchEvent="onTouchStart"
			onClickAway={handleClose}
		>
			<div>
				<span className='common-icon-Safety-Settings icon-size' onClick={handleClick} />
				<Popover
					id={id}
					open={open} anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<div className="probation-card-cls">
						<Card
							style={{
								width: '100%',
								padding: 10,
							}}
						>
							<div
								style={{
									padding: 10,
									display: 'flex',
									alignContent: 'center',
									alignItems: 'center',
									justifyContent: 'flex-start',
									gap: '10px',

								}}
							>
								<IQToggle
									checked={safetyProbation?.allowUserProbation}
									switchLabels={["ON", "OFF"]}
									onChange={(e, value) => {
										handleChange(value, 'allowUserProbation')
									}}
									disabled={false}
									edge={"end"}
								/>

								<Typography style={{
									fontSize: '14px',
									margin: '0 0 0 8px'
								}}>Probation Period</Typography>

								<IQTooltip title={`
								Turn this settings on if you like to have workers for the distinguished 'Short Service' period.
								`} arrow={true}>
									<Box
										component="img"
										alt="Info icon"
										src={infoicon}
										className="image"
										width={12}
										height={12}
										style={{ marginLeft: "4px", marginRight: 10 }}
									/>
								</IQTooltip>

								<TextField
									disabled={!safetyProbation?.allowUserProbation}
									value={safetyProbation?.userProbationDays}
									id="outlined-size-small"
									defaultValue={safetyProbation?.userProbationDays}
									size="small"
									type="number"
									inputProps={{
										style: {
											height: "10px",
										},
									}}
									onFocus={event => {
										event.target.select();
									}}
									onChange={(e: any) => handleChange(Number(e?.target?.value), 'userProbationDays')}
								/>

								<Typography
									style={{
										fontSize: '14px'
									}}
								>Day(s)</Typography>
							</div>

							<div
								style={{
									display: 'grid',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									defaultValue={safetyProbation?.probationType ?? 1}
									name="radio-buttons-group"
								>
									<FormControlLabel
										disabled={!safetyProbation?.allowUserProbation}
										value={1} control={<Radio />}
										onChange={(value: any) => handleChange((Number(value?.target?.defaultValue ?? 1)), 'probationType')}
										label="Start Probation when Worker is Verified" />
									<FormControlLabel
										disabled={!safetyProbation?.allowUserProbation}
										value={2} control={<Radio />}
										onChange={(value: any) => handleChange((Number(value?.target?.defaultValue ?? 2)), 'probationType')}
										label="Start Probation when first seen at the jobsite" />
								</RadioGroup>
							</div>
							<div
								style={{
									padding: 10,
									display: 'flex',
									alignContent: 'center',
									alignItems: 'center',
									justifyContent: 'center',
									justifyItems: 'center',
									gap: '10px'
								}}
							>
								<IQToggle
									checked={safetyProbation?.allowUserRenewal}
									switchLabels={["ON", "OFF"]}
									onChange={(e, value) => {
										handleChange(value, 'allowUserRenewal')
									}}
									disabled={false}
									edge={"end"}
								/>

								<Typography style={{
									fontSize: '14px',
									margin: '0 0 0 8px'
								}}>Safety Renewal Credentials</Typography>

								<IQTooltip title={`
								Turn this settings on if you want Workers to register again for the Safety Credentials, Certs, Policies based on the days set here.
								`} arrow={true}>
									<Box
										component="img"
										alt="Info icon"
										src={infoicon}
										className="image"
										width={12}
										height={12}
										style={{ marginLeft: "4px", marginRight: 10 }}
									/>
								</IQTooltip>

								<TextField
									disabled={!safetyProbation?.allowUserRenewal}
									id="outlined-size-small"
									defaultValue={safetyProbation?.userRenewalDays}
									size="small"
									type="number"
									value={safetyProbation?.userRenewalDays}
									inputProps={{
										style: {
											height: "10px",
										},
									}}
									onFocus={event => {
										event.target.select();
									}}
									onChange={(e: any) => handleChange(Number(e?.target?.value), 'userRenewalDays')}
								/>

								<Typography
									style={{
										fontSize: '14px'
									}}
								>Day(s)</Typography>
							</div>

							<div
								style={{
									padding: 10,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'flex-start',
									gap: '4px'
								}}
								onClick={(e: any) => handleNotificationSettings(e)}
							>
								<span className="common-icon-email-message" style={{ fontSize: '20px' }} />
								<Typography
									style={{
										fontSize: '14px',
										color: '#0590cd',
										cursor: 'pointer',
										lineHeight: '1.1'
									}}
								>Notification Settings</Typography>
							</div>
						</Card>
					</div>
				</Popover>
			</div>
		</ClickAwayListener>
	)
};
export default ProbationCard;