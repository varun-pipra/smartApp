import { memo } from 'react';

import "./UserBadge.scss";
//import PrintIcon from "@mui/icons-material/Print";
import { Alert, Fab } from "@mui/material";
import SUIUserBadgeCard from "components/UserBadgeCard/UserBadgeCard";
import { useEffect, useRef, useState } from "react";
import SUIAlert from "sui-components/Alert/Alert";
import {
	Button,
	Checkbox,
	InputAdornment,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import UserSelectionTile from "./UserSelectionTile";
import { useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import {
	fetchBadgeLayoutsData,
	fetchWorkerBadgesData,
	fetchPrintersData,
} from "features/projectsettings/projectteam/operations/ptDataAPI";
import { printWorkerBadge } from "features/projectsettings/projectteam/operations/ptGridAPI";
import SUIUserBadgeInfo from "./UserBadgeInfo";
import { postMessage, setCookie, getCookie, isLocalhost } from "app/utils";

const UserBadge = (props: any) => {
	const { userdata, activeTab, isOnlyCompanyManager, ...others } = props;
	const isCompMountedOnce = useRef(false);
	const [showPrintDlg, setShowPrintDlg] = useState(false);
	const appInfo: any = useAppSelector(getServer);
	const [badgeOptions, setBadgeOptions] = useState([]);
	const [badgeOptionsFront, setBadgeOptionsFront] = useState([]);
	const [badgeData, setBadgeData] = useState<any>({});
	const [printerOptions, setPrinterOptions] = useState([]);
	const [selectedPrinterValue, setSelectedPrinterValue] = useState("");
	const [frontBadgeValue, setFrontBadgeValue] = useState("");
	const [backBadgeValue, setBackBadgeValue] = useState("");
	const [encodedNFC, setEncodedNFC] = useState(true);
	const [showToastMessage, setToastMessage] = useState(false);
	const [showPrintBtn, setShowPrintBtn] = useState(false);
	const [localhost] = useState(isLocalhost);
	const tilesData = [
		{
			type: "One Side",
			isActive: true,
			readOnly: badgeData?.side1?.badge?.url ? false : true,
		},
		{
			type: "Both Sides",
			readOnly: badgeData?.side2?.badge?.url ? false : true,
		}
	];
	const [selectedTile, setSelectedTile] = useState(tilesData[0]);

	useEffect(() => {
		if (showToastMessage) {
			setTimeout(() => {
				setToastMessage(false);
			}, 90000);
		}
	}, [showToastMessage]);

	const userBadgeApiCalls = () => {
		console.log('userBadgeApiCalls', new Date());
		let payload = { id: userdata?.objectId };
		fetchBadgeLayoutsData(appInfo, (response: any) => {
			setBadgeOptions(getBadgeCmpFormat(response));
			setBadgeOptionsFront(getBadgeCmpFormatFront(response));
		});
		fetchWorkerBadgesData(appInfo, payload, (response: any) => {
			setBadgeData(response);
			response?.side1?.layout?.name && setFrontBadgeValue(response?.side1?.layout?.name);
			response?.side2?.layout?.name && setBackBadgeValue(response?.side2?.layout?.name);
		});
		fetchPrintersData(appInfo, (response: any) => {
			setPrinterOptions(response);
			let printerName: any = getCookie("UserBadge_PrinterName");
			if (printerName !== "" && response.find((item: any) => item.name == printerName)) {
				setSelectedPrinterValue(printerName);
			} else {
				setSelectedPrinterValue(response?.[0]?.name);
			}
		});
		updateNFCCode();
	};

	const updateNFCCode = () => {
		let nfcValue: any = getCookie("UserBadge_encodedNFC");
		if (nfcValue !== "") {
			setEncodedNFC(nfcValue === "true");
		}
	};

	const showPrintbtnOption = () => {
		let isCompanyManager =
			!(appInfo?.gblConfig?.isUserManager ||
				appInfo?.gblConfig?.isProjectTeamManager) &&
			appInfo?.gblConfig?.isCompanyManager;

		setShowPrintBtn(!isCompanyManager || isLocalhost);
	};

	useEffect(() => {
		setTimeout(() => {
			console.log('Badge Data useEffect', userdata, activeTab, isCompMountedOnce?.current, new Date());
			if (userdata && (activeTab/*  === 'userBadge' */ && !isCompMountedOnce?.current)) {
				userBadgeApiCalls();
				isCompMountedOnce.current = true;
			}
		}, 100);
	}, [userdata, activeTab, isCompMountedOnce]);
	useEffect(() => {
		if (userdata && (isCompMountedOnce.current ?? false)) {
			isCompMountedOnce.current = false;
		};
	}, [userdata]);
	useEffect(() => {
		if (appInfo) {
			showPrintbtnOption();
		}
	}, [appInfo]);

	const onNFCChange = (event: any) => {
		setEncodedNFC(event.target.checked);
	};

	const getBadgeCmpFormat = (response: any) => {
		let options = response.values.map((bVal: any) => {
			let optionObj: any = {
				text: bVal.name,
				value: bVal.name,
				type: bVal.type,
				id: bVal.id,
				children:[]
			};
			if (bVal.hasChildren) {
				bVal.children.forEach((child: any) => {
					optionObj.children.push({
						text: child.name,
						value: child.name,
						id: child.id,
						type: "custom"						
					});
				});
			}
			return optionObj;
		});
		return options.length ? options : [];
	};

	const getBadgeCmpFormatFront = (response: any) => {
		let options = response.values.map((bVal: any) => {
			let optionObj: any = {
				text: bVal.name,
				value: bVal.name,
				type: bVal.type,
				id: bVal.id,
				children:[]
			};
			if (bVal.hasChildren) {
				bVal.children.forEach((child: any) => {
					optionObj.children.push({
						text: child.name,
						value: child.name,
						id: child.id,
						type: "custom"
					});
				});
			}
			return optionObj;
		});
		let blankIndex = options.findIndex((x: any) => x?.text == "Blank");
		blankIndex > -1 && options?.splice(blankIndex, 1)
		return options.length ? options : [];
	};

	const handleFrontChildrenMenu = (item: any, data: any) => {
		setFrontBadgeValue(item?.name ?? item?.text);
		let payload = {
			id: userdata?.objectId,
			layout: item?.id,
		};
		fetchWorkerBadgesData(appInfo, payload, (response: any) => {
			let dataClone = { ...badgeData };
			if (response && dataClone?.side1?.badge) {
				dataClone.side1.badge.id = response.id;
				dataClone.side1.badge.url = response.url;
				setBadgeData(dataClone);
			}
		});
	};

	const handleBackChildrenMenu = (item: any, data: any) => {
		setBackBadgeValue(item?.name ?? item?.text );
		let payload = {
			id: userdata?.objectId,
			layout: item?.id,
		};
		fetchWorkerBadgesData(appInfo, payload, (response: any) => {
			let dataClone = { ...badgeData };
			if (response && dataClone?.side2?.badge) {
				dataClone.side2.badge.id = response.id;
				dataClone.side2.badge.url = response.url;
				setBadgeData(dataClone);
			}
		});
	};

	const handlePrint = (e: any) => {
		let payload, layout1: any, layout2: any;
		if (selectedTile) {
			badgeOptions?.forEach((b: any) => {
				if (!layout1) {
					if (b?.text === (frontBadgeValue || badgeData?.side1?.layout?.name)) {
						layout1 = {...b};
						layout1.name = b.text;
						if(layout1?.text ?? false) {
							delete layout1.text;
						};
						if(layout1?.value ?? false) {
							delete layout1.value;
						};
					} else if (b?.children) {
						if (b?.children?.forEach) {
							b?.children?.forEach((c: any) => {
								if (c?.text === (frontBadgeValue || badgeData?.side1?.layout?.name)) {
									layout1 = { id: c?.id, name:c?.text, type: c?.type};
								}
							})
						} else {
							b?.children?.text === (frontBadgeValue || badgeData?.side1?.layout?.name) ? layout1 = { id: b?.children?.id, name:b?.children?.text, type: b?.children?.type } : '';
						}
					}
				}
				if (!layout2) {
					if (b?.text === (backBadgeValue)) {
						layout2 = {...b};
						layout2.name = b.text;
						if(layout2?.text ?? false) {
							delete layout2.text;
						};
						if(layout2?.value ?? false) {
							delete layout2.value;
						};
					} else if (b?.children) {
						if (b?.children?.forEach) {
							b?.children?.forEach((c: any) => {
								if (c?.text === backBadgeValue) {
									layout1 = { id: c?.id,name:c?.text, type: c?.type };
								}
							})
						} else {
							b?.children?.text === backBadgeValue ? layout1 = { id: b?.children?.id, name:b?.children?.text, type: b?.children?.type } : '';
						}
					}
				}
			});
			if (selectedTile["type"] === "Both Sides") {
				payload = {
					side1: {
						layout: layout1,
						badge: badgeData?.side1?.badge,
					},
					side2: {
						layout: layout2,
						badge: badgeData?.side2?.badge,
					},
					encodeNFC: encodedNFC,
					printerServiceName: selectedPrinterValue
				};
			} else {
				payload = {
					side1: {
						layout: layout1,
						badge: badgeData?.side1?.badge,
					},
					encodeNFC: encodedNFC,
					printerServiceName: selectedPrinterValue
				};
			}
			const toastMsgData: any = {
				"event": "showMessage",
				"data": {
					"event": "showMessage",
					"msg": "Printing Badge"
				}
			};
			window && window["onmessage"] && window["onmessage"](toastMsgData);
			setCookie("UserBadge_encodedNFC", encodedNFC);
			setCookie("UserBadge_PrinterName", selectedPrinterValue);
			printWorkerBadge(
				appInfo,
				payload,
				userdata?.objectId,
				(response: any) => {

				}
			);
		}
	};

	const onSelectedTileChange = (tile: any) => {
		setSelectedTile(tile);
	};

	const onPrintClick = () => {
		setShowPrintDlg(!showPrintDlg);
	};

	const handleFrontSideChange = (value: any) => {
		setFrontBadgeValue(value);
		let layout1: any;
		badgeOptions?.forEach((b: any) => {
			if (!layout1) {
				if (b?.text === value) {
					layout1 = b?.id;
				} else if (b?.children) {
					if (b?.children?.forEach) {
						b?.children?.forEach((c: any) => {
							if (c?.text === value) {
								layout1 = c?.id;
							}
						})
					} else {
						b?.children?.text === value ? layout1 = b?.children?.id : '';
					}
				}
			}
		});
		let payload = {
			id: userdata?.objectId,
			layout: layout1
		};
		fetchWorkerBadgesData(appInfo, payload, (response: any) => {
			if (response) {
				let dataClone = { ...badgeData };
				if (dataClone?.side1?.badge) {
					dataClone.side1.badge.id = response.id;
					dataClone.side1.badge.url = response.url;
					setBadgeData(dataClone);
				}
			}
		});
	};

	const handleBackSideChange = (value: any) => {
		setBackBadgeValue(value);
		let layout1: any;
		badgeOptions?.forEach((b: any) => {
			if (!layout1) {
				if (b?.text === value) {
					layout1 = b?.id;
				} else if (b?.children) {
					if (b?.children?.forEach) {
						b?.children?.forEach((c: any) => {
							if (c?.text === value) {
								layout1 = c?.id;
							}
						})
					} else {
						b?.children?.text === value ? layout1 = b?.children?.id : '';
					}
				}
			}
		});
		let payload = {
			id: userdata?.objectId,
			layout: layout1
		};
		fetchWorkerBadgesData(appInfo, payload, (response: any) => {
			if (response) {
				let dataClone = { ...badgeData };
				if (dataClone?.side2?.badge) {
					dataClone.side2.badge.id = response.id;
					dataClone.side2.badge.url = response.url;
					setBadgeData(dataClone);
				}
			}
		});
	};

	return (
		<div className="user-badge-container">
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "1em",
					justifyContent: "space-between",
				}}
			>
				<div>
					<SUIUserBadgeInfo
						badgeOptions={badgeOptionsFront}
						defaultValue={badgeData?.side1?.layout?.name}
						handleChange={handleFrontSideChange}
						selectedValue={frontBadgeValue}
						handleChildrenMenu={handleFrontChildrenMenu}
					/>
					<SUIUserBadgeCard
						userDetails={badgeData?.side1?.badge?.url}
						cardView="front"
					/>
				</div>

				<div>
					<SUIUserBadgeInfo
						badgeOptions={badgeOptions}
						defaultValue={badgeData?.side2?.layout?.name}
						handleChange={handleBackSideChange}
						selectedValue={backBadgeValue}
						handleChildrenMenu={handleBackChildrenMenu}
					/>
					<SUIUserBadgeCard
						userDetails={badgeData?.side2?.badge?.url}
						cardView="back"
					/>
				</div>
			</div>
			<div style={{ textAlign: "center", marginTop: '50px' }}>
				<SUIAlert
					open={showPrintDlg}
					onAction={() => {
						setShowPrintDlg(false);
					}}
					contentText={
						<>
							<div className="fake-div" style={{ minWidth: 340 }} />
							{printerOptions && printerOptions.length > 1 && (
								<div className="user-badge-alert">
									<Typography>Select printer:</Typography>
									<TextField
										id="input-with-icon-textfield"
										select
										style={{ width: "15em", marginLeft: "20px" }}
										variant="standard"
										value={selectedPrinterValue}
										onChange={(e: any) =>
											setSelectedPrinterValue(e?.target?.value)
										}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<span className="common-icon-print"></span>
												</InputAdornment>
											),
										}}
									>
										{printerOptions.map((item: any, index: Number) => {
											return <MenuItem value={item.name}>{item.name}</MenuItem>;
										})}
									</TextField>
								</div>
							)}
							<br></br>
							<div className="user-badge-alerts">
								<div>
									<UserSelectionTile
										tilesData={tilesData}
										selectedTile={(tile: any) => onSelectedTileChange(tile)}
									></UserSelectionTile>
								</div>
							</div>
							<br></br>
							<div className="user-badge-alert">
								<span>
									<Checkbox
										checked={encodedNFC}
										onChange={(event) => {
											onNFCChange(event);
										}}
									></Checkbox>
									Encoded NFC ID into the Card
								</span>
								<Button className="print-btn" onClick={handlePrint} variant="contained">
									PRINT
								</Button>
							</div>
						</>
					}
					title={"Print Options"}
					showActions={false}
					DailogClose={true}
				></SUIAlert>

				{showPrintBtn && (
					<Fab
						sx={{
							bgcolor: "#333",
							width: '46px',
							height: '46px',
							"&:hover": {
								backgroundColor: "#333",

							},
						}}
						onClick={onPrintClick}
						hidden={isOnlyCompanyManager}
					>
						<span className="user-badge-print-icon common-icon-Print" />
					</Fab>
				)}
			</div>
			{showToastMessage && (
				<Alert
					severity="success"
					className="floating-toast-cls"
					onClose={() => {
						setToastMessage(false);
					}}
				>
					<span className="toast-text-cls">Printing Badge</span>
				</Alert>
			)}
		</div>
	);
};

export const DivElement = (props: any) => {
	const { badgeDataInfo, subChild, handleChange } = props;
	return (
		<div
			style={{ padding: 5 }}
			onClick={() => handleChange(subChild, badgeDataInfo)}
		>
			{subChild?.name}
		</div>
	);
};
export default memo(UserBadge);
