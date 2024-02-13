import React, { memo, useEffect, useRef, useState } from "react";
import SUILineItem from "sui-components/LineItem/LineItem";
import "./SafetyPolicies.scss";
import ProgressBar from "components/progressbar/ProgressBar";
import { CustomCircularCheckBox } from "features/projectsettings/projectteam/CustomCheckbox";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import { isLocalhost } from "app/utils";
import { appInfoData } from "data/appInfo";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { fetchSafetyManualsData } from "features/projectsettings/projectteam/operations/ptDataAPI";
import { resendPoliciesCertificationLink, upsertPolicyData } from "../../../operations/ptDataAPI";
import { Alert } from "@mui/material";
import { postMessage } from "app/utils";
import { getDate } from "utilities/datetime/DateTimeUtils";

const SafetyPolicies = (props: any) => {
	const { userdata, selectedTrade, activeTab, commonApiCalls, iframeEventData, executeSave = () => { }, fetchPendingDocsApiCall = () => { }, ...others } = props;
	const isCompMountedOnce = useRef(false);
	const rowHeight = 100;
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { safetyManuals } = useAppSelector((state) => state.projectTeamData);
	const [rowData, setRowData] = React.useState<any>([]);
	const [progressBarCount, setProgressBarCount] = React.useState({ verified: 0, total: 0, percentage: 0 });
	const [showToastMessage, setToastMessage] = useState(false);
	const [toastMessageText, setToastMessageText] = React.useState<any>([]);;
	const gridApiRef = useRef<any>(null);
	const GridApiCall = () => {
		fetchSafetyManualsData(appInfo, {
			trades: userdata.trade?.objectId ? [userdata.trade?.objectId, 0] : [],
			userId: userdata?.objectId,
		}, (response: any) => {
			setRowData(response);
			let progressCount = getProgressBarCount(response);
			setProgressBarCount(progressCount);
		});
	};
	React.useEffect(() => {
		if (userdata && Object.keys(userdata).length > 0 && appInfo?.gblConfig?.currentProjectInfo?.safetyTracking) {
			// && activeTab === 'safetyPolicies' && !isCompMountedOnce?.current) {
			// isCompMountedOnce.current = true;
			GridApiCall();
		};
	}, [userdata]);
	React.useEffect(() => {
		if (selectedTrade && Object.keys(selectedTrade).length > 0 && userdata) {
			fetchSafetyManualsData(appInfo, {
				trades: selectedTrade?.id ? [selectedTrade?.id, 0] : [],
				userId: userdata?.objectId,
			}, (response: any) => {
				setRowData(response);
				let progressCount = getProgressBarCount(response);
				setProgressBarCount(progressCount);
			});
		};
	}, [selectedTrade]);
	//}, [userdata, activeTab, isCompMountedOnce]);
	React.useEffect(() => {
		if (userdata && (isCompMountedOnce.current ?? false)) {
			isCompMountedOnce.current = false;
		};
	}, [userdata]);
	const policyRecurringCall = (testBasedPolicy: any, counter: any) => {
		try {
			var isUpdated = false,
				updatedPolicyIds = testBasedPolicy.map((obj: any) => {
					return obj.documentId;
				});
			GridApiCall();
			setTimeout(function() {
				var updatedRowData = rowData.filter((obj: any) => { return obj.hasQuestion && obj.result == 'NA' && updatedPolicyIds.indexOf(obj.id) > -1});
				isUpdated = updatedRowData.length == 0;
				if(counter < 10 && !isUpdated) {
					policyRecurringCall(testBasedPolicy, counter + 1);
				}
			}, 4000);
		}	
		catch(err) {
			console.log('policy recurring data fetch stopped due to exception');
		}
	}
	React.useEffect(() => {
		console.log('****Received iframeEventData in Safety policies', iframeEventData, new Date());
		if (iframeEventData) {
			let credPayload = iframeEventData?.data?.credPayload,
				verificationData = iframeEventData?.data?.verificationData;
			switch (iframeEventData.event || iframeEventData.evt) {
				case "policy-acknowledged":
					console.log('policy-acknowledged -1', iframeEventData.data, rowData, gridApiRef);
					// update the record with isAcknowledged as true so that when user opens the same 
					// record from the list again, he doesn't have to Acknowledge again.
					// Please Note - This will not make any api call to save the data.
					const modifyData = iframeEventData.data;
					const index = gridApiRef?.current?.selectionService?.lastSelectedNode?.rowIndex;
					const getRows = gridApiRef?.current?.getRenderedNodes()?.map((node: any) => node?.data);
					if (index && index !== -1) {
						let copyData = [...getRows];
						copyData[index] = modifyData;
						gridApiRef?.current?.setRowData([...copyData]);
						let progressCount = getProgressBarCount(copyData);
						setProgressBarCount(progressCount);
						setRowData(copyData);
						console.log('policy-acknowledged -2', copyData, gridApiRef, progressCount);
					};
					break;
				case "policy-onsignature":
					let policyData = iframeEventData.data,
						payload = {
							"userId": userdata?.objectId, //appInfo.gblConfig.currentUserId,
							"verifiedBy": userdata?.objectId, //appInfo.gblConfig.currentUserId,
							"documentFor": "worker",
							"currentDateTime": new Date(),
							"signatureData": {
								"Signature": policyData.signature.signature,
								"SignedOn": new Date()
							},
							"documentInfo": policyData.allPolicies
						}
					console.log('policy-onsignature', payload);
					postMessage({
						event: 'projectteam', body: {
							evt: 'safetymanagerlogin'
						}
					});
					var testBasedPolicy = payload.documentInfo?.filter((obj:any) => obj.hasQuestion && obj.isAcknowledged);
					upsertPolicyData(appInfo, payload, function () {
						if (verificationData) {
							executeSave(credPayload, verificationData, false);
						}
						if(testBasedPolicy.length > 0) {
							setToastMessageText('Acknowledged successfully. Results are getting generated. Please wait or come back later.');
							setToastMessage(true);
							policyRecurringCall(testBasedPolicy, 0);
						}
					});
					break;
				case "policy-verifyall":
					let pendingPolicy = iframeEventData.data.pendingPolicies,
						documentInfo = pendingPolicy.map((obj: any) => {
							return {
								name: obj.name,
								documentId: obj.id,
								isAcknowledged: true,
								hasQuestion: obj.hasQuestion
							}
						}),
						verifyAllPayload = {
							"userId": userdata?.objectId, //appInfo.gblConfig.currentUserId,
							"verifiedBy": appInfo?.gblConfig?.currentUserId,
							"documentFor": "worker",
							"currentDateTime": new Date(),
							"signatureData": null,
							"documentInfo": documentInfo
						}
					if (verificationData) {
						verificationData['policyDetails'] = verifyAllPayload;
						executeSave(credPayload, verificationData, true);
					} else {
						upsertPolicyData(appInfo, verifyAllPayload, function () {
							GridApiCall();
							fetchPendingDocsApiCall(userdata);
						});
					}
					break;
				case "policy-reloaddata":
					// reload policydata with api call here
					console.log('policy-reloaddata', iframeEventData);
					GridApiCall();
					fetchPendingDocsApiCall(userdata, credPayload, verificationData);
					break;
			}
		}
	}, [userdata, iframeEventData]);
	const getProgressBarCount = (array: any) => {
		let result = []?.concat(...array?.map((o: any) => o)).reduce(
			(c, { isAcknowledged }) => {
				if (isAcknowledged) c.verified++;
				c.total++;
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
	const headers = [
		{
			headerName: "",
			field: "rowIndex",
			minWidth: 20,
			flex: 0.5,
			cellRenderer: (params: any) => {
				return (
					<div className="policy-name-first-row">
						<div className="row-count-circle-cls">{params.rowIndex + 1}</div>
					</div>
				);
			},
		},
		{
			headerName: "POLICY NAME",
			field: "name",
			minWidth: 200,
			flex: 2,
			cellRenderer: (params: any) => {
				let paramData = params?.data;
				return (
					<div className="policy-name-first-row">
						<div>
							<span className="safetyPolices-name">{paramData?.name}</span>
							<span className="safetyPolices version-cls">
								{`${`Version` + " " + paramData?.version}`}
							</span>
						</div>
					</div>
				);
			},
		},
		{
			headerName: "",
			maxWidth: 80,
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
			maxWidth: 100,
			flex: 1,
			cellStyle: {
				display: "flex",
				alignItems: "center",
			},
			cellRenderer: (params: any) => {
				return (
					<img
						src={params?.data?.documentThumbnail}
						className="thumbnailUrl-cls"
						onClick={(e: any) => handleThumbnail(e, params)}
					/>
				);
			},
		},
		{
			headerName: "AGREED",
			field: "isAcknowledged",
			maxWidth: 100,
			flex: 1,
			cellStyle: {
				display: "flex",
				alignItems: "center",
			},
			cellRenderer: (params: any) => {
				return (
					<CustomCircularCheckBox checked={params?.data?.isAcknowledged} />
				);
			},
		},
		{
			headerName: "AGREED ON",
			field: "acknowledgedOn",
			minWidth: 150,
			maxWidth: 300,
			flex: 2,
			cellRenderer: (params: any) => {
				let paramData = params?.data;
				return (
					<div>
						{paramData?.acknowledgedOn || paramData?.acknowledgedBy ? (
							<span>{convertDateToDisplayFormat(paramData?.acknowledgedOn ?? "")}, {paramData?.acknowledgedBy}</span>
						) : <>-</>}

					</div>
				);
			},
		}
	];
	const [columns, setColumns] = React.useState<any>(headers);
	headers.forEach((item: any) => {
		if (!item.cellStyle)
			item.cellStyle = { display: "flex", alignItems: "left" };

		if (!item.suppressMenu) item.suppressMenu = true;

		if (!item.sortable) item.sortable = false;
	});
	const handleThumbnail = (e: any, row: any) => {
		gridApiRef.current = (row.api);
		let getAllRows = row?.api?.getRenderedNodes()?.map((node: any) => node?.data);
		postMessage({ event: 'projectteam', body: { evt: 'policyquickview', selectedRecord: row.data, records: getAllRows } })
		console.log("Thumbnail Event Listener", e, row, getAllRows);
	};
	const showResult = (e: any, row: any) => {
		console.log('show result', row?.data);
		if (row?.data?.result == 'Pass' || row?.data?.result == 'Fail')
			postMessage({ event: 'projectteam', body: { evt: 'showresult', selectedRecord: row?.data } })
	};
	const resendLink = () => {
		resendPoliciesCertificationLink(appInfo, { userId: userdata?.objectId, type: "policies" }, function () {
			// show toast - Safety Policies link sent successfully
			setToastMessageText('Safety Policies link sent successfully');
			setToastMessage(true);
		});
	};
	useEffect(() => {
		if (showToastMessage) {
			setTimeout(() => {
				setToastMessage(false);
			}, 3000)
		}
	}, [showToastMessage]);
	const [gridApi, setGridApi] = useState<any>();
	const [style, setStyle] = useState({
		height: '100%',
		width: '100%',
	});
	// useEffect(() => {
	// 	if ((gridApi ?? false) && rowData) {
	// 		//gridApi.sizeColumnsToFit();
	// 		gridApi.setDomLayout('autoHeight');
	// 	}
	// }, [rowData, gridApi]);
	return (
		<div className="safetyPolicies safety-policies-cotainer-tab">
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div className="progress-header-text">
					<b>
						{progressBarCount?.verified} of {progressBarCount?.total}
					</b>{" "}
					policies has been Acknowledged
				</div>
				<div className="email-hotlink-cls" onClick={() => resendLink()}>
					<span className="common-icon-BiddingCCEmails userEmail_icons" />
					<span className="email-cls">Resend the Safety Policies Link</span>
				</div>
			</div>
			<div className="safety-policies_progress-bar-wrapper">
				<ProgressBar count={progressBarCount?.percentage} />
			</div>
			<br />
			<div style={{ height: 'calc(100% - 1px)', flex: 1 }} className="ag-theme-alpine">
				<div style={style}>
					<SUILineItem
						tableref={(val: any) => setGridApi(val)}
						headers={columns}
						data={rowData ?? []}
						enbleAddBtn={false}
						readOnly={true}
						showAddRow={false}
						rowHeight={rowHeight}
						nowRowsMsg={"<div>No Policies to Verify</div>"}
					/>
				</div>
			</div>
			{
				showToastMessage &&
				<Alert severity="success" className='floating-toast-cls' onClose={() => { setToastMessage(false) }}>
					<span className="toast-text-cls">
						{toastMessageText}</span>
				</Alert>

			}
		</div>
	);
};

export default memo(SafetyPolicies);
