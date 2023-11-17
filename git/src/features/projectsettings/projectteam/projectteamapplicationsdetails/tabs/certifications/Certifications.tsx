import React, { memo, useEffect, useRef, useState } from "react";
import SUILineItem from "sui-components/LineItem/LineItem";
import "./Certifications.scss";
import ProgressBar from "components/progressbar/ProgressBar";
import { CustomCheckBox } from "features/projectsettings/projectteam/CustomCheckbox";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { Alert, Button, Stack } from "@mui/material";
import convertDateToDisplayFormat, { convertTimeToDisplayFormat, convertISOToDispalyFormat } from "utilities/commonFunctions";
import { formatDate } from "utilities/datetime/DateTimeUtils";
import { getServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { uploadLocalFile } from "features/bidmanager/stores/FilesAPI";
import { appInfoData } from "data/appInfo";
import { isLocalhost } from "app/utils";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Badge from "@mui/material/Badge";
import Mp4Png from "resources/images/mp4.png";
import PdfSvg from "resources/images/Pdf.svg";
import { fetchSafetyCertificationData } from "features/projectsettings/projectteam/operations/ptDataAPI";
import { resendPoliciesCertificationLink, UpsertCertificateData } from "../../../operations/ptDataAPI";
import { postMessage } from "app/utils";
import Tooltip from '@mui/material/Tooltip';
import CustomTooltip from "features/budgetmanager/aggrid/customtooltip/CustomToolTip";

const Certifications = (props: any) => {
	const { userdata, selectedTrade, activeTab, commonApiCalls, onCertificationsChange, iframeEventData, isOnlyCompanyManager, refreshCerts, resetRefreshFlag = (flag: boolean) => { }, ...others } = props;
	const isCompMountedOnce = useRef(false);
	const rowHeight = 100;
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [showToastMessage, setToastMessage] = useState(false);
	const { safetyCertifications } = useAppSelector(
		(state: any) => state?.projectTeamData
	);
	const [rowData, setRowData] = React.useState<any>([]);
	const [tempData, setTempData] = React.useState<any>([]);
	const [progressBarCount, setProgressBarCount] = React.useState({
		verified: 0,
		total: 0,
		percentage: 0,
	});
	const [gridApi, setGridApi] = useState<any>();
	const [style, setStyle] = useState({
		height: '100%',
		width: '100%',
	});
	useEffect(() => {
		if ((gridApi ?? false) && rowData) {
			gridApi?.sizeColumnsToFit();
			//gridApi.setDomLayout('autoHeight');
		};
	}, [rowData, gridApi]);
	const GridApiCall = () => {
		fetchSafetyCertificationData(appInfo, {
			trades: userdata.trade?.objectId ? [userdata.trade?.objectId, 0] : [],
			userId: userdata?.objectId,
		}, (response: any) => {
			response = response.map((obj: any) => {
				if (!(obj?.isAcknowledged && obj?.certificateRegistered) || obj?.files?.length == 0 || (obj?.stageName == 'Expired' || obj?.stageName == 'About To Expire')) {
					obj.disabled = false;
					if (obj?.stageName == 'Expired')
						obj.isAcknowledged = false;
				} else
					obj.disabled = true;
				return obj;
			});
			setRowData(response);
			let progressCount = getProgressBarCount(response);
			setProgressBarCount(progressCount);
			onCertificationsChange(response);
			resetRefreshFlag(false);
		});
	};
	React.useEffect(() => {
		if ((userdata && userdata?.objectId && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking) || refreshCerts) {
			GridApiCall();
		};
		//}, [userdata, activeTab, isCompMountedOnce]);
	}, [userdata, refreshCerts]);
	React.useEffect(() => {
		if (selectedTrade && Object.keys(selectedTrade).length > 0 && userdata && userdata?.objectId) {
			fetchSafetyCertificationData(appInfo, {
				trades: selectedTrade?.id ? [selectedTrade?.id, 0] : [],
				userId: userdata?.objectId,
			}, (response: any) => {
				response = response.map((obj: any) => {
					if (!(obj?.isAcknowledged && obj?.certificateRegistered) || obj?.files?.length == 0 || (obj?.stageName == 'Expired' || obj?.stageName == 'About To Expire')) {
						obj.disabled = false;
						if (obj?.stageName == 'Expired')
							obj.isAcknowledged = false;
					} else
						obj.disabled = true;
					return obj;
				});
				setRowData(response);
				let progressCount = getProgressBarCount(response);
				setProgressBarCount(progressCount);
				onCertificationsChange(response);
				resetRefreshFlag(false);
			});
		};
	}, [selectedTrade]);
	React.useEffect(() => {
		if (userdata && (isCompMountedOnce.current ?? false)) {
			isCompMountedOnce.current = false;
		};
	}, [userdata]);

	React.useEffect(() => {
		console.log('****Received iframeEventData in Certificates', iframeEventData, new Date());
		if (iframeEventData && userdata && userdata?.objectId) {
			switch (iframeEventData.event || iframeEventData.evt) {
				case "certificate-upload":
					let certFiles = iframeEventData.data,
						modifiedRecords = rowData.filter((obj: any) => obj.isModified),
						mergedCerts = [];

					for (var key in modifiedRecords) {
						if (modifiedRecords[key].id == certFiles.files[0].documentId) {
							certFiles.files[0].expiresOn = modifiedRecords[key].expiresOn;
							certFiles.files[0].isAcknowledged = modifiedRecords[key].isAcknowledged;
							mergedCerts.push(certFiles.files[0]);
						} else {
							mergedCerts.push({
								"documentId": modifiedRecords[key].id,
								"name": modifiedRecords[key].name,
								"expiresOn": modifiedRecords[key].expiresOn,
								"isAcknowledged": modifiedRecords[key].isAcknowledged,
								"certificateRegistered": modifiedRecords[key].certificateRegistered,
								"userUploadedCertificates": [],
								"userDeletedCertificates": []
							})
						}
					}
					let payload = {
						"userId": userdata?.objectId,
						"verifiedBy": null,
						"documentFor": "worker",
						"currentDateTime": new Date(),
						"documentInfo": mergedCerts
					}

					UpsertCertificateData(appInfo, payload, function () {
						GridApiCall();
					});
					break;
			}
		}
	}, [iframeEventData, userdata]);
	const getProgressBarCount = (array: any) => {
		let result = []?.concat(...array?.map((o: any) => o)).reduce(
			(c, { certificateRegistered, isAcknowledged }) => {
				if (certificateRegistered) {
					c.total++;
				};
				if (isAcknowledged) {
					c.verified++;
				};
				c.percentage = (c.verified / c.total) * 100;
				return c;
			},
			{ verified: 0, total: 0, percentage: 0 }
		);
		return result;
	};

	const getAwardedColor = (result: String) => {
		if (result?.toLowerCase() === "na") return "#9A9A9A";
		else if (result?.toLowerCase() === "pass") return "#10D628";
		else if (result?.toLowerCase() === "fail") return "crimson";
		else return null;
	};
	const getExtensionPath = (extension: any, url: any) => {
		if (extension.includes("mp4")) return Mp4Png;
		else if (extension.includes("pdf")) return PdfSvg;
		else return url;
	};
	const handleDisabled = (certificateRegistered: any, isAcknowledged: any) => {
		if (isAcknowledged) return true;
		else return certificateRegistered ? false : true;
	};
	const headers = [
		{
			headerName: "YES/NO",
			maxWidth: 105,
			flex: 1,
			cellRenderer: (params: any) => {
				return (
					<Stack className="toggle-section-cls">
						<ToggleButtonGroup
							color="primary"
							value={params?.data?.certificateRegistered}
							exclusive
							onChange={(e: any, value: any) => handleChange(e, value, params, 'certificateRegistered')}
							aria-label="Platform"
							size={"small"}
							disabled={params?.data?.isAcknowledged ? true : false}>
							<ToggleButton value={true}>YES</ToggleButton>
							<ToggleButton value={false}>NO</ToggleButton>
						</ToggleButtonGroup>
					</Stack>
				);
			},
		},
		{
			headerName: "CERTIFICATES / CERTIFICATIONS",
			minWidth: 150,
			flex: 2,
			cellStyle: {
				display: "block",
				alignItems: "center",
				paddingTop: "30px",
				paddingRight: "0px",
			},
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params?.data?.name && params?.data?.name?.length > 20 ? params?.data?.name : null;
			},
			valueGetter: (params: any) => params?.data?.name ?? "",
		},
		{
			headerName: "",
			minWidth: 60,
			maxWidth: 70,
			flex: 1,
			cellStyle: {
				display: "flex",
				alignItems: "center",
			},
			cellRenderer: (params: any) => {
				return (
					params.data.hasQuestion && (
						<span className="awarded-icon-cls">
							<span
								className="common-icon-medal"
								style={{
									color: getAwardedColor(params?.data?.result) ?? "#9A9A9A",
									fontSize: "20px",
								}}
								onClick={(e: any) => showResult(e, params)}
							/>
						</span>
					)
				);
			},
		},
		{
			headerName: "",
			maxWidth: 115,
			flex: 1,
			cellStyle: {
				display: "flex",
				alignItems: "center",
			},
			cellRenderer: (params: any) => {
				let path = getExtensionPath(
					params?.data?.extension,
					params?.data?.files?.[0]?.thumbnailUrl
				);
				return path !== null && path !== undefined ? (
					<div onClick={(e: any) => handleThumbnail(e, params)}>
						<Badge className="thumb-count-cls"
							badgeContent={
								params?.data?.files
									? (params?.data?.files?.length === 1
										? null
										: `${'+' + (params?.data?.files?.length - 1)}`)
									: null
							}
							color="primary"
							style={{
								color: "#00AAFA",
								fontSize: "14px",
							}}
						>
							<img
								src={path}
								className="thumbnailUrl-cls"
							/>
						</Badge>
					</div>
				) : (
					<Button className="thumbnailUrl-cls" style={{ display: 'grid' }}
						onClick={(e: any) => handleThumbnail(e, params)}
						disabled={params?.data?.isAcknowledged || !params?.data?.certificateRegistered}
					>
						<span className="common-icon-upload-file" style={{ fontSize: '45px', textAlign: 'center' }} />
						<Button
							component="label"
							size="small"
							disabled={params?.data?.isAcknowledged || !params?.data?.certificateRegistered}
							className="upload-button-cls"
						//onClick={(e: any) => handleThumbnail(e, params)}
						>
							Upload File

						</Button>
					</Button>
				);
			},
		},
		{
			headerName: "TYPE",
			maxWidth: 70,
			cellStyle: {
				display: "grid",
				textAlign: "center",
			},
			flex: 1,
			valueGetter: (params: any) => params?.data?.fileType === 'Certificate' ? 'File' : 'Test'
		},
		{
			headerName: "RENEWAL / EXPIRATION DATE",
			minWidth: 160,
			flex: 1,
			cellRenderer: (params: any) => {
				let stageValue = (params?.data?.stageName ?? '');
				let tooltipText = (stageValue === "Expired") ? "This certificate is expired, please upload a new certificate and update the expiration date" :
					(stageValue === "About To Expire") ? "This certificate is about to expire soon, please upload a new certificate and update the expiration date" : null;
				return (
					<div style={{ display: 'inline-block', alignItems: 'center' }}>
						{params?.data?.trackExpiration ?? false ? (
							<DatePickerComponent
								containerClassName="iq-customdate-cont"
								disabled={params?.data?.isAcknowledged || !params?.data?.certificateRegistered}
								defaultValue={params?.data?.expiresOn && convertDateToDisplayFormat(
									params?.data?.expiresOn
								)}
								onChange={(e: any) => handleChange(e, e, params, "expiresOn")}
								maxDate={new Date("12/31/9999")}
								minDate={
									convertDateToDisplayFormat(params?.data?.expiresOn) ?? ""
								}
								onOpenPickNewDate={false}
								allowInLineEdit={true}
								style={{
									pointerEvents: handleDisabled(
										params?.data?.certificateRegistered ?? false,
										params?.data?.isAcknowledged ?? false
									)
										? "none"
										: "auto",
								}}
								render={
									<InputIcon
										className={(params?.data?.stageName == 'Expired') ? "custom-input rmdp-input expired" : "custom-input rmdp-input"}
										placeholder="Expires On"
										title={(params?.data?.disabled || !params?.data?.certificateRegistered) ? "" : "MM/DD/YYYY"}
										style={{
											pointerEvents: handleDisabled(
												params?.data?.certificateRegistered ?? false,
												params?.data?.isAcknowledged ?? false
											)
												? "none"
												: "auto",
										}}
									/>
								}
							/>
						) : (
							<>NA</>
						)}
						{( (params?.data?.fileType == 'Certificate' && ((stageValue === "Expired") || (stageValue === "About To Expire"))) ?? false) ? (
							<Tooltip
								placement="bottom"
								arrow={true}
								sx={{
									"& .MuiTooltip-tooltip": {
										background: "#333",
									},
								}}
								title={tooltipText}
							>
								<span
									className="common-icon-certs-exclamation"
									style={{ color: "red", fontSize: "24px" }}
								/>
							</Tooltip>
						) : null}
					</div>
				);
			},
		},
		{
			headerName: "VERIFIED",
			maxWidth: 95,
			flex: 1,
			cellStyle: {
				display: "grid",
				alignItems: "center",
			},
			cellRenderer: (params: any) => {
				return <div onClick={() => {
					const toastMsgData: any = {
						"event": "showMessage",
						"data": {
							"event": "showMessage",
							"msg": "Please fill the renewal date before verifying the certificate"
						}
					};
					(params?.data?.certificateRegistered && params?.data?.trackExpiration && !params?.data?.expiresOn && !params?.data.isAcknowledged) ?
						window && window["onmessage"] && window["onmessage"](toastMsgData) : ''
				}}>
					<CustomCheckBox checked={params}
						handleChange={(e: any) => handleChange(e, e.target.checked, params, 'isAcknowledged')}
						disabled={isOnlyCompanyManager || params?.data?.disabled || !params?.data?.certificateRegistered || (params?.data?.trackExpiration && !params?.data?.expiresOn) || (params?.data?.fileType == 'Certification' && !(params?.data?.result == 'Pass' || params?.data?.result == 'Fail'))}
					/>
				</div>
			},
		},
		{
			headerName: "VERIFIED ON/BY",
			minWidth: 155,
			flex: 1,
			cellRenderer: (params: any) => {
				let paramData = params?.data;
				return (
					<div>
						<span>{paramData?.acknowledgedOn && formatDate(paramData?.acknowledgedOn + 'Z')}</span>
						<span className="verifiedOn-cls">{paramData?.acknowledgedBy}</span>
					</div>
				);
			},
		},
	];
	headers.forEach((item: any) => {
		if (!item.cellStyle)
			item.cellStyle = { display: "flex", alignItems: "left" };

		if (!item.suppressMenu) item.suppressMenu = true;

		if (!item.sortable) item.sortable = false;
	});
	const [columns, setColumns] = React.useState<any>(headers);
	const [changeValue, setChangeValue] = useState<any>()
	React.useEffect(() => {
		if (changeValue?.selectedRow) {
			let data = [...rowData];
			data.map((item: any, index: any) => {
				if (item?.id === changeValue?.selectedRow?.id) {
					data[index][changeValue?.type] = changeValue.value;
				};
			});
			let progressCount = getProgressBarCount(data);
			setProgressBarCount(progressCount);
			gridApi.forEachNodeAfterFilterAndSort(function (rowNode: any) {
				let index: any = [...data].findIndex((x) => x.id === changeValue.selectedRow.id);
				if (index !== -1) {
					gridApi.applyTransaction({ update: data });
				}
			});
			setChangeValue(null);
			onCertificationsChange(data);
		}
	}, [changeValue]);
	/** 
		  * Triggers when there's any change in the grid selected row fields.
		* @param e 
		* @param value String || Boolean
		* @param row Object 
		* @param type  String
		* @author Ram Nadendla
	*/
	const handleChange = (e: any, value: any, row: any, type: any) => {
		row.data["isModified"] = true;
		setChangeValue({
			event: e,
			value: value,
			selectedRow: row.data,
			type: type
		});
	};
	const handleThumbnail = (e: any, row: any) => {
		row?.data?.certificateRegistered && postMessage({ event: 'projectteam', body: { evt: 'uploadcertificates', record: row?.data } })
		console.log("Image Event Listener", e, row, row.data);
	};
	const showResult = (e: any, row: any) => {
		console.log('show result', row?.data);
		if (row?.data?.result == 'Pass' || row?.data?.result == 'Fail')
			postMessage({ event: 'projectteam', body: { evt: 'showresult', selectedRecord: row?.data } })
	};
	const handleFileChange = (event: any) => {
		event.preventDefault();
		let data = event?.target?.files;
		if (data) {
			let fileObject = new FormData();
			fileObject.append("file", data);
			console.log("FormData", fileObject);
		}
	};
	const resendLink = () => {
		resendPoliciesCertificationLink(appInfo, { userId: userdata?.objectId, type: "certifications" }, function () {
			// show toast - Certification link sent successfully
			setToastMessage(true);
		});
	};
	useEffect(() => {
		if (showToastMessage) {
			setTimeout(() => {
				setToastMessage(false);
			}, 3000)
		}
	}, [showToastMessage])
	return (
		<div className="project-team-certifications safety-certifications-cotainer-tab">
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div className="progress-header-text">
					<b>
						{progressBarCount?.verified} of {progressBarCount?.total}
					</b>{" "}
					certifications successfully completed
				</div>
				<div className="email-hotlink-cls" onClick={() => resendLink()}>
					<span className="common-icon-BiddingCCEmails userEmail_icons" />
					<span className="email-cls">Resend the Certification Link</span>
				</div>
			</div>
			<div className="certifications_progress-bar-wrapper">
				<ProgressBar count={progressBarCount?.percentage} />
			</div>
			<br />
			<div style={{ height: 'calc(100% - 1px)', flex: 1 }} className="ag-theme-alpine">
				<div style={style}>
					<SUILineItem
						tableref={(val: any) => setGridApi(val)}
						headers={columns}
						data={rowData}
						enbleAddBtn={false}
						readOnly={true}
						showAddRow={false}
						rowHeight={rowHeight}
						nowRowsMsg={"<div>No Certificates/Certifications Available for this User</div>"}
						getRowClass={(params: any) => {
							const isActive = params?.data?.disabled//params?.data?.isAcknowledged && params?.data.certificateRegistered;
							return isActive
								? "project-team-row-disabled-cls"
								: "project-team-row-active-cls";
						}}
					/>
				</div>
			</div>
			{
				showToastMessage &&
				<Alert severity="success" className='floating-toast-cls' onClose={() => { setToastMessage(false) }}>
					<span className="toast-text-cls">
						Certification link sent successfully</span>
				</Alert>

			}
		</div>
	);
};

export default memo(Certifications);
