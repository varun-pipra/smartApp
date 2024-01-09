import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { postMessage, isLocalhost, getSafetyCredIFrame } from "app/utils";
import './UserDetails.scss';
import { Grid, InputLabel, TextField, Card, Stack, InputAdornment, Box, Chip, MenuItem, Select, styled, TooltipProps, Tooltip, tooltipClasses } from '@mui/material';
import { getServer, } from "app/common/appInfoSlice";
import Toast from 'components/toast/Toast';
import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown";
import SUIEmailSelector from 'sui-components/Email/Email';
import SmartDropDown from "components/smartDropdown";
import { fetchCategoriesData, getCompanyData, getTradeData, getRolesData, getSkillsData, getShiftsData, getCalendarData, getEmailData, getcategoriesData, fetchCompaniesData, fetchTradesData, fetchSkillsData } from '../../../operations/ptDataSlice';
import { makeStyles, createStyles } from '@mui/styles';
import IQButton from 'components/iqbutton/IQButton';
import Uniqueid from '../../../projectteamcontent/customComponents/uniqueid/Uniqueid';
import { QRCodeAlertUI } from '../../../projectteamcontent/customComponents/customComponents';
import SUIAlert from 'sui-components/Alert/Alert';
import ProjectLocation from '../../../projectteamcontent/projectLocation/ProjectLocation';
import { getLocationLevels, getLocationTags } from '../../../operations/ptDataAPI';
import CompanyIcon from "resources/images/Comapany.svg";
import infoicon from "resources/images/common/infoicon.svg";
import ProjectTeamRolesTooltip from 'features/projectsettings/projectteam/projectteamcontent/RolesTootip/ProjectTeamRolesTooltip';
import { getRoles } from 'utilities/projectteam/enums';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
const UserDetails = (props: any) => {
	const defaultdata: any = {
		firstName: '',
		lastName: '',
		phone: '',
		calendar: '',
		shift: '',
		company: { color: '', id: '', displayField: '', thumbnailId: '', },
		workCategory: '',
		trade: { color: '', id: '', displayField: '' },
		roleIds: [],
		skills: [],
		rtlsId: '',
		gpsTagId: '',
		barcode: '',
		QRCodeImage: '',
		defaultLocation: '',
		levelId: null
	}
	const { userdata, focusRTLSId = false, focusBLEId = false, fetchPendingDocsApiCall, iframeEventData, isOnlyCompanyManager } = props;
	const classes = useStyles();
	const appInfo = useAppSelector(getServer);
	const dispatch = useAppDispatch();
	const containerStyle = useMemo(() => ({ width: "100%", height: "300px" }), []);
	const [selectedLineItem, setSelectedLineItem] = useState<any>({});
	const CompanyData: any = useAppSelector(getCompanyData);
	const TradeData: any = useAppSelector(getTradeData);
	const RolesData: any = useAppSelector(getRolesData);
	const SkillsData: any = useAppSelector(getSkillsData);
	const CalendraData: any = useAppSelector(getCalendarData);
	const ShiftsData: any = useAppSelector(getShiftsData);
	const EmailData: any = useAppSelector(getEmailData);
	const CategoriesData: any = useAppSelector(getcategoriesData);
	const [user, setUser] = React.useState({ ...defaultdata })
	const iframeID = "projectTeamIframe";
	const appType = "ProjectTeam";
	const [alert, setAlert] = React.useState<any>({
		open: false,
		contentText: '',
		title: '',
		handleAction: '',
		actions: true,
		dailogClose: false
	});
	const [rtlsTextDisplay, setRtlsTextDisplay] = React.useState<any>();
	const [rtlsConnector, setRtlsConnector] = React.useState<any>();
	const isEnForced = appInfo?.gblConfig?.enforceCompanyTradeRelationship
	const serviceUrl = isLocalhost ? 'https://barcode-ltk5o3tq2a-uk.a.run.app/barcode/generatebarcode?bfrmt=' : appInfo?.gblConfig?.barcodeImageGeneratorService;

	const [companyOptions, setCompanyOptions] = useState([]);
	const [tradeOptions, setTradeOptions] = useState([]);
	const [suggestCompanyValues, setSuggestCompanyValues] = useState([]);
	const [suggestTradeValues, setSuggestTradeValues] = useState([]);
	const [dynamicClose, setDynamicClose] = React.useState(false);
	const [locationLevelOptions, setLocationLevelOptions] = useState<any>([]);
	const [locationTagOptions, setLocationTagOptions] = useState<any>([]);
	const [defautlevelvalue, setDefautlevelvalue] = useState<any>();
	const [resetBarcode, setResetBarcode] = React.useState<any>();
	const { selectedMembers } = useAppSelector((state: any) => state.ptGridData);
	const [rolesTooltipData, setRolesTooltipData] = React.useState({});
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	React.useEffect(() => {
		if (userdata?.trade?.objectId) {
			dispatch(fetchCategoriesData({ appInfo: appInfo, tradeId: userdata?.trade?.objectId }))
		}
		setUser({
			...user,
			firstName: userdata?.firstName,
			lastName: userdata?.lastName,
			thumbnailUrl: userdata?.thumbnailUrl,
			email: userdata?.email,
			phone: userdata?.phone,
			calendar: userdata?.calendar?.objectId,
			shift: userdata?.shift?.id,
			company: {
				color: userdata?.company?.color,
				id: userdata?.company?.objectId,
				displayField: userdata?.company?.name,
				thumbnailId: userdata?.company?.thumbnailId,
			},
			workCategory: userdata?.workCategory?.id,
			trade: {
				color: userdata?.color,
				id: userdata?.trade?.objectId,
				displayField: userdata?.trade?.name,
			},
			roleIds: userdata.roleIds,
			skills: userdata?.skills?.map((data: any) => { return data.objectId }),
			barcode: userdata?.barcode,
			rtlsId: userdata?.rtlsId,
			gpsTagId: userdata?.gpsTagId,
			defaultLocation: userdata?.defaultLocation,
			levelId: userdata?.levelId,
			hourlyRate: userdata?.hourlyRate
		});
	}, [userdata])
	useEffect(() => {
		if(user?.roleIds?.length > 0 ?? false) {
			setRolesTooltipData({
				objectId : selectedMembers?.[0]?.objectId,
				roleIds : user?.roleIds
			})
		};
	},[user])
	React.useEffect(() => {
		const imageUrl = user.barcode ? serviceUrl + `QR&val=${user.barcode}&w=240&h=243` : '';
		setUser({
			...user,
			QRCodeImage: imageUrl,
		})
	}, [user.barcode, resetBarcode])

	let isListenerAttached = false;

	/* React.useEffect(() => {
		if (isListenerAttached) return;
		isListenerAttached = true;

		// Listen to message from parent IFrame window
		window["addEventListener"]("message", function (event) {
			let data = event.data;
			data = typeof data == "string" ? JSON.parse(data) : data;
			data =
				data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
			if (data) {
				switch (data.event || data.evt) {
					case "refreshcompanies":
						console.log('refreshcompanies', new Date());
						dispatch(fetchCompaniesData(appInfo));
						setUser({
							...user,
							company: {
								color: data?.data?.selectedItem?.colorCode,
								id: data?.data?.selectedItem?.id,
								displayField: data?.data?.selectedItem?.name,
								thumbnailId: data?.data?.selectedItem?.thumbnailId,
							}
						});
						setDynamicClose(!dynamicClose);
						break;
					case "refreshtrades":
						console.log('refreshtrades', new Date());
						dispatch(fetchTradesData(appInfo));
						setUser({
							...user
						});
						setDynamicClose(!dynamicClose);
						break;
				}
			}
		}, false);
	}, []); */
	React.useEffect(() => {
		console.log('****Received iframeEventData UserDetails', iframeEventData, new Date());
		if (iframeEventData) {
			switch (iframeEventData.event || iframeEventData.evt) {
				case "refreshcompanies":
					console.log('refreshcompanies', new Date());
					dispatch(fetchCompaniesData(appInfo));
					setUser({
						...user,
						company: {
							color: iframeEventData?.data?.selectedItem?.colorCode,
							id: iframeEventData?.data?.selectedItem?.id,
							displayField: iframeEventData?.data?.selectedItem?.name,
							uniqueId: iframeEventData?.data?.selectedItem?.uniqueId,
							thumbnailId: iframeEventData?.data?.selectedItem?.thumbnailId,
						}
					});
					setDynamicClose(!dynamicClose);
					break;
				case "refreshtrades":
					console.log('refreshtrades', new Date());
					dispatch(fetchTradesData(appInfo));
					setUser({
						...user,
						trade: {
							color: iframeEventData?.data?.selectedItem?.color,
							id: iframeEventData?.data?.selectedItem?.objectId || iframeEventData?.data?.selectedItem?.id,
							uniqueId: iframeEventData?.data?.selectedItem?.uniqueId,
							displayField: iframeEventData?.data?.selectedItem?.name,
						}
					});
					setDynamicClose(!dynamicClose);
					break;
				case "refreshskills":
					console.log('refreshskills', new Date());
					dispatch(fetchSkillsData(appInfo));
					setDynamicClose(!dynamicClose);
					break;
			}
		}
	}, [iframeEventData])
	const CompanyFields = () => {
		let data = getCompanyOptions();
		if (user.trade.displayField !== '' && !isEnForced) {
			let filterCompanies: any = [...CompanyData]?.filter((x: any) => {
				return x?.trade?.some((item: any) => item?.name === user.trade.displayField)
			});
			if (filterCompanies.length > 0) {
				let mapFields = filterCompanies.map((item: any) => ({
					...item, displayField: item.name, isSuggested: true, color: item?.colorCode,
					thumbnailUrl: item?.thumbnailUrl
				}));
				let filterData = companyOptions?.filter((item: any) => { return !mapFields?.some((value: any) => value?.id === item?.id) });
				setCompanyOptions(filterData);
				setSuggestCompanyValues(mapFields);
			} else {
				setSuggestCompanyValues([]);
			};
		} else {
			setCompanyOptions(data);
		};
	}
	React.useEffect(() => {
		if (CompanyData?.length > 0) {
			let data = getCompanyOptions();
			setCompanyOptions(data);
			CompanyFields();
		};
	}, [CompanyData]);
	React.useEffect(() => {
		if (TradeData?.length > 0 && userdata) {
			let data = getTradesOptions();
			let tradeData: any = [];
			const enForcedData: any = [...CompanyData]?.filter((x: any) => x?.name === userdata?.company?.name);
			if (enForcedData.length > 0) {
				for (let i = 0; i < enForcedData.length; i++) {
					for (let j = 0; j < enForcedData[i].trade.length; j++) {
						tradeData.push({
							...enForcedData[i].trade[j],
							color: enForcedData[i].trade[j]?.color,
							id: enForcedData[i].trade[j]?.objectId,
							displayField: enForcedData[i].trade[j]?.name,
							isSuggested: true
						})
					}
				};
			}
			if (isEnForced) {
				setSuggestTradeValues(tradeData);
			} else {
				if (tradeData.length > 0) {
					let mapFields = tradeData.map((item: any) => ({
						...item, displayField: item.name, isSuggested: true, color: item?.colorCode,
						thumbnailUrl: item?.thumbnailUrl
					}));
					setSuggestTradeValues(mapFields);
				}
				setTradeOptions(data);
			};
		};
	}, [TradeData]);
	const getCompanyOptions = () => {
		let groupedList: any = [];
		CompanyData.map((data: any) => {
			groupedList.push({
				...data,
				color: data.colorCode,
				displayField: data.name,
				thumbnailUrl:data?.thumbnailUrl
			});
		});
		return groupedList
	};
	const getTradesOptions = () => {
		let groupedList: any = [];
		TradeData.map((data: any, index: any) => {
			groupedList.push({
				...data,
				displayField: data.name
			});
		});
		return groupedList
	}
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
	const getSkillsOptions = () => {
		let groupedList: any = [];
		SkillsData.map((data: any) => {
			groupedList.push({
				...data,
				value: data.id,
				label: data.name,
				displayLabel: `${data.name + ' - ' + data.tradeName}`
			});
		});
		return groupedList
	}
	const getCalendarOptions = () => {
		let groupedList: any = [];
		CalendraData.map((data: any) => {
			groupedList.push({
				...data,
				label: data.name,
				value: data.id
			});
		});
		return groupedList
	}
	const getShiftsOptions = () => {
		let groupedList: any = [];
		ShiftsData.map((data: any) => {
			groupedList.push({
				...data,
				label: data.name,
				value: data.id
			});
		});
		return groupedList
	}
	const getCategoriesOptions = () => {
		let groupedList: any = [];
		CategoriesData.map((data: any) => {
			groupedList.push({
				...data,
				label: data.name,
				value: data.id
			});
		});
		return groupedList
	};
	const filterCompanyValues = (value: any) => {
		if (value && value.some((x: any) => x.hasOwnProperty('displayField'))) {
			let filterCompanies: any = [...CompanyData]?.filter((x: any) => {
				return x?.trade?.some((item: any) => item?.name === value?.[0]?.displayField)
			});
			if (filterCompanies.length > 0) {
				let mapFields = filterCompanies.map((item: any) => ({
					...item, displayField: item.name, isSuggested: true, color: item?.colorCode,
					thumbnailUrl: item?.thumbnailUrl
				}));
				let filterData = companyOptions?.filter((item: any) => { return !mapFields?.some((value: any) => value?.id === item?.id) });
				setCompanyOptions(filterData);
				setSuggestCompanyValues(mapFields);
			} else {
				setSuggestCompanyValues([]);
			};
		} else {
			CompanyFields();
			setSuggestCompanyValues([]);
		};

	};
	const filterTradeValues = (value: any) => {
		let filterTrades: any = [...CompanyData]?.filter((x: any) => x?.name === value?.[0]?.displayField)?.[0].trade;
		if (filterTrades.length > 0) {
			let mapFields = filterTrades.map((data: any) => ({ ...data, displayField: data.name, isSuggested: true, color: data?.colorCode }));
			let filterData = tradeOptions?.filter((item: any) => { return !mapFields?.some((value: any) => value?.uniqueId === item?.uniqueId) });
			setTradeOptions(filterData);
			setSuggestTradeValues(mapFields);
			let mapData: any = [];
			for (let i = 0; i < mapFields.length; i++) {
				if (mapFields[i].isPrimary ?? false) {
					mapData.push({
						color: mapFields?.[i]?.color,
						id: mapFields?.[i]?.objectId,
						displayField: mapFields?.[i]?.name
					})

				};
			}
			if (mapData.length > 0) {
				setUser({ ...user, 'trade': mapData?.[0] });
			} else {
				setUser({ ...user, 'trade': defaultdata.trade });
			};

			//}

		} else {
			setSuggestTradeValues([]);
		};
	};
	const handleOnChange = (name: any, value: any) => {
		let updateddata;
		if (name == 'trade') {
			dispatch(fetchCategoriesData({ appInfo: appInfo, tradeId: value[0]?.objectId }))
			const selectedTrade = { color: value[0]['color'], id: value[0]?.objectId, name: value[0]?.name };
			updateddata = { ...user, [name]: { color: value[0]['color'], id: value[0]?.objectId, displayField: value[0]?.name } };
			if(value?.length === 0 || value?.[0]?.length === 0) {
				updateddata = { ...updateddata, ['workCategory']: null};
			};
			updateddata = { ...updateddata, ['hourlyRate']: null };
			filterCompanyValues(value);
			fetchPendingDocsApiCall(updateddata);
			let safetyCredFrame = getSafetyCredIFrame();
			props.setSelectedTrade(selectedTrade);
			safetyCredFrame?.contentWindow?.postMessage({ event: 'tradechange', trade: selectedTrade }, '*');
		}
		else if (name == 'company') {
			updateddata = { ...user, [name]: { color: value[0]['color'], id: value[0]['id'], displayField: value[0]['displayField'], thumbnailId: value[0]['thumbnailUrl'] } };
			filterTradeValues(value);
		} else if (name == 'skills') {
			updateddata = { ...user, [name]: value }
			fetchPendingDocsApiCall(updateddata)
		} else if(name === 'workCategory') {
			updateddata = { ...user, [name]: value };
			let GetRatePerHour = (CategoriesData || [])?.find((x:any) => x.id === value)?.trades?.filter((item:any) => item.name === user?.trade?.displayField);
			updateddata = { ...updateddata, ['hourlyRate']: GetRatePerHour?.[0]?.defaultHourlyRate };
		} else {
			updateddata = { ...user, [name]: value }
		};
		setUser(updateddata);
		setDynamicClose(!dynamicClose);
	};
	console.log('user deatils', user);
	const handlePhoneChange = (name: any, value: any) => {
		let updateddata;
		const reg = new RegExp(/[\+?\d-() ]+/);
		if(reg.test(value) && value.length <= 15) {
			updateddata = { ...user, [name]: value }
			setUser(updateddata);
		} else if(value === "") {
			updateddata = { ...user, [name]: value }
			setUser(updateddata);
		};
	};
	React.useEffect(() => {
		props.onChange(user);
	}, [user]);
	const inputRTLSElement = React.useRef<HTMLInputElement>(null);
	const inputBLEElement = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		setTimeout(() => {
			//inputRTLSElement.current?.focus()
		}, 1000);
	}, [focusRTLSId])
	React.useEffect(() => {
		console.log('focusBLEId************', focusBLEId, new Date());
		setTimeout(() => {
			//inputBLEElement.current?.focus()
		}, 1000);
	}, [focusBLEId])


	React.useEffect(() => {
		const rtlsConnectorType = isLocalhost ? 1 : appInfo?.rtlsConnectorType;
		const connector = isLocalhost ? { id: 2, type: 1, status: 1 } : appInfo?.rtlsConnector;
		if (rtlsConnectorType) {
			setRtlsTextDisplay(rtlsConnectorType);
		}
		setRtlsConnector(connector);
	}, [appInfo])

	/** Default loaction functions start */
	React.useEffect(() => {
		const Payload = { type: "Location" }
		getLocationLevels(appInfo, Payload, (response: any) => {
			setLocationLevelOptions(response)
		});
	}, [appInfo])

	React.useEffect(() => {
		if (user?.levelId == '' || user?.levelId == null || user?.levelId == undefined) {
			if (locationLevelOptions?.length > 0) {
				setDefautlevelvalue(locationLevelOptions?.slice(-1)[0]['levelId']);
				LocationLevelStageHandler(locationLevelOptions?.slice(-1)[0]['levelId']);
			}
		}
		else {
			LocationLevelStageHandler(user?.levelId);
		}
	}, [locationLevelOptions, user?.levelId])

	const getLocationTagsOptions = (Tags: any) => {
		let groupedList: any = [];
		const FinalData = Tags.filter((ele: any, ind: any) => ind === Tags.findIndex((elem: any) => elem.id === ele.id && elem.text === ele.text))
		FinalData.map((data: any) => {
			groupedList.push({
				...data
			});
		});
		return groupedList
	}
	const LocationLevelStageHandler = (value: any) => {
		const payload = {
			type: "Location",
			isSetOnly: false,
			hierarchy: value
		}
		getLocationTags(appInfo, payload, (response: any) => {
			setLocationTagOptions(getLocationTagsOptions(response))
		});
	}

	/** Default loaction functions End */


	const viewEditHandler = (e: any) => {
		e.stopPropagation();
		postMessage({
			event: 'projectteam',
			body: {
				evt: 'viewsup-info',
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType,
				supplementalInfoItemID: userdata?.supplementalInfoItemID
			}
		});

	}

	const BarCodeHandler = (name: any) => {
		setAlert({
			open: true,
			title: "Acquire Barcode",
			contentText: <QRCodeAlertUI
				ClickHandler={(value: any) => {
					setAlert({ open: false });
					value && setUser({ ...user, [name]: value });
				}}
			/>,
			handleAction: (event: any, type: any) => {
				setAlert({
					open: false
				});
			},
			actions: false,
			dailogClose: true
		});
	}

	const UniqueIdModelHandler = (value: any) => {
		value && setUser({
			...user,
			barcode: value
		})
	}

	const printUniqueCode = () => {
		if (user.QRCodeValue || user.barcode) {
			postMessage({
				event: 'projectteam', body: {
					evt: 'printUniqueCode',
					barcodeValue: user.QRCodeValue || user.barcode
				}
			});
		}
	}

	const handleAdd = (selectedItem: any, searchValue: any, type: any) => {
		console.log("Handle Add New ", selectedItem, searchValue, type);
		let eventType, options;
		switch (type) {
			case 'company':
				eventType = 'addnewcompany';
				options = companyOptions;
				break;
			case 'trade':
				eventType = 'addnewtrade';
				options = tradeOptions;
				break;
			case 'skill':
				eventType = 'addnewskill';
				options = SkillsData;
				setDynamicClose(!dynamicClose);
				break;

			default:
				break;
		}
		postMessage({
			event: 'projectteam', body: {
				evt: eventType, searchValue: searchValue, listData: options
			}
		});
	};
	const AutoWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: "none",
		}
	});
	return (<div className='ProjectTeam-userDetails'>
		<Grid container direction={'row'} spacing={3}>
			<Grid item sm={11.8}>
				{user?.firstName && <SUIEmailSelector
					emailOptions={EmailData}
					selectedEmailList={(values: any) => { handleOnChange("cCEmails", values) }}
					emailLabel={'Email'}
					emailIcon={<span className='common-icon-BiddingCCEmails userdetails_icons' />}
					defaultSelectedValue={[
						{
							email: user?.email,
							firstName: user?.firstName,
							lastName: user?.lastName,
							thumbnail: user?.thumbnailUrl
						}
					]}
					width={'100%'}
					required={true}
					disabled={true}
					displayInTextField={'email'}
				/>}
			</Grid>
			<Grid item sm={5.9} >
				<InputLabel required className='inputlabel' sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red'
					}
				}}>First Name</InputLabel>
				<TextField
					id="bidPackage"
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<span className='common-icon-Last-Name userdetails_icons' />
							</InputAdornment>
						)
					}}
					placeholder='Enter First Name'
					name='firstName'
					variant="standard"
					value={user?.firstName}
					onChange={(e: any) => handleOnChange('firstName', e.target?.value)}
				/>
			</Grid>
			<Grid item sm={5.9}>
				<InputLabel required className='inputlabel' sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red'
					}
				}}>Last Name</InputLabel>
				<TextField
					id="bidPackage"
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<span className='common-icon-Last-Name userdetails_icons' />
							</InputAdornment>
						)
					}}
					placeholder='Enter Last Name'
					name='email'
					variant="standard"
					value={user?.lastName}
					onChange={(e: any) => handleOnChange('lastName', e.target?.value)}
				/>
			</Grid>
			<Grid item sm={5.9} >
				<InputLabel className='inputlabel'>Phone</InputLabel>
				<TextField
					id="bidPackage"
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<span className='common-icon-phone userdetails_icons userdetails_icon_Color' />
							</InputAdornment>
						)
					}}
					placeholder='Enter Phone Number'
					name='Phone'
					variant="standard"
					value={user?.phone}
					onChange={(e: any) => handlePhoneChange('phone', e.target?.value)}
				/>
			</Grid>
			<Grid item sm={5.9} style={{ opacity: (isOnlyCompanyManager) ? 0.5 : 1, pointerEvents: (isOnlyCompanyManager) ? 'none' as React.CSSProperties["pointerEvents"] : '' as React.CSSProperties["pointerEvents"]}}>
				<InputLabel required className='inputlabel' sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red'
					}
				}}>Company</InputLabel>
				<SUIBaseDropdownSelector
					value={[user?.company]}
					width="100%"
					menuWidth="450px"
					placeHolder={'Select'}
					dropdownOptions={companyOptions ?? []}
					noDataFoundMsg={<div className="no-rows-msg"><span className="common-icon-No-Item-Available"></span><div className="empty-rows-mark">No match found</div><div>You can add it by clicking + button</div></div>}
					handleValueChange={(value: any) => { handleOnChange('company', value) }}
					showFilterInSearch={false}
					showSearchInSearchbar={true}
					icon={<span className='common-icon-company-new userdetails_icons userdetails_icon_Color' />}
					basecustomline={true}
					image={true}
					hideTooltip={true}
					multiSelect={false}
					showSuggested={(suggestCompanyValues.length === 0 ? false : true)}
					suggestedDropdownOptions={suggestCompanyValues ?? []}
					handleAdd={(a: any, b: any) => handleAdd(a, b, 'company')}
					suggestedText={'Suggested (based on trade):'}
					dynamicClose={dynamicClose}
					enforcedRelationship={isEnForced}
					moduleName={"userDetails"}
					showIconInField={true}
				></SUIBaseDropdownSelector>
			</Grid>
			<Grid item sm={5.7}>
				<InputLabel className='inputlabel' >Trade</InputLabel>
				<SUIBaseDropdownSelector
					value={[user?.trade]}
					width="100%"
					menuWidth="450px"
					placeHolder={'Select'}
					dropdownOptions={tradeOptions ?? []}
					noDataFoundMsg={<div className="no-rows-msg"><span className="common-icon-No-Item-Available"></span><div className="empty-rows-mark">No match found</div><div>You can add it by clicking + button</div></div>}
					handleValueChange={(value: any) => { handleOnChange('trade', value) }}
					showFilterInSearch={false}
					showSearchInSearchbar={true}
					icon={<span className='common-icon-orgconsole-trades userdetails_icons userdetails_icon_Color' />}
					basecustomline={true}
					image={false}
					multiSelect={false}
					showSuggested={(suggestTradeValues.length === 0 ? false : true)}
					suggestedDropdownOptions={suggestTradeValues ?? []}
					handleAdd={(a: any, b: any) => handleAdd(a, b, 'trade')}
					displayChips={true}
					suggestedText={'Suggested (based on company):'}
					dynamicClose={dynamicClose}
					enforcedRelationship={isEnForced}
					chipEventTrigger={true}
					moduleName={"userDetails"}
				></SUIBaseDropdownSelector>
			</Grid>
			<Grid item sm={0.2} style={{paddingLeft : 0 }} className='roles-section-cls'>
			<InputLabel className='inputlabel' ></InputLabel>
				<span className='common-icon-Project-Info'></span>
			</Grid>
			<Grid item sm={5.7} style={{ opacity: (isOnlyCompanyManager) ? 0.5 : 1, pointerEvents: (isOnlyCompanyManager) ? 'none' as React.CSSProperties["pointerEvents"] : '' as React.CSSProperties["pointerEvents"]}}>
				<SmartDropDown
					options={getRoleOptions()}
					LeftIcon={<span className='common-icon-Approval-Role userdetails_icons userdetails_icon_Color' />}
					dropDownLabel="Roles"
					doTextSearch={true}
					isSearchField={true}
					isMultiple={true}
					selectedValue={user?.roleIds}
					isFullWidth
					outSideOfGrid={true}
					handleChange={(value: any) => handleOnChange('roleIds', value)}
					handleChipDelete={(value: any) => handleOnChange('roleIds', value)}
					menuProps={classes.menuPaper}
					sx={{ fontSize: '18px' }}
					Placeholder={'Select'}
					showCheckboxes={true}
					hideNoRecordMenuItem={true}
					reduceMenuHeight={true}
					isReadOnly={isOnlyCompanyManager}
				/>
			</Grid>
			<Grid item sm={0.1} style={{paddingLeft : 0 }} className='roles-section-cls'>
			<InputLabel className='inputlabel' ></InputLabel>
				{user?.roleIds?.length ? (
					<AutoWidthTooltip
						className={"pt-RolesTooltip-main"}
						title={
							<ProjectTeamRolesTooltip
								params={{ data: rolesTooltipData}}
								appInfo={appInfo}
								rolesVal={user?.roleIds &&  {data: rolesTooltipData}}
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
						<span className='common-icon-Project-Info'></span>
					</AutoWidthTooltip>
				) : (
					<IQTooltip title={`No role selected`} arrow={true} placement={"bottom"}>
						<span className='common-icon-Project-Info'></span>
					</IQTooltip>
				)}
			</Grid>
			<Grid item sm={5.9}>
				<SmartDropDown
					disabled={CategoriesData?.length === 0 || !user?.trade?.displayField}
					LeftIcon={<span className='common-icon-work-category userdetails_icons'></span>}
					options={getCategoriesOptions()}
					dropDownLabel="Work Category"
					isSearchField={false}
					required={false}
					outSideOfGrid={true}
					selectedValue={user?.workCategory}
					isFullWidth
					handleChange={(value: any) => handleOnChange('workCategory', value)}
					displayEmpty={true}
					Placeholder={'Select'}
					showColumnHeader={false}
					hideNoRecordMenuItem={true}
					menuProps={classes.menuPaper}
				/>
			</Grid>
			<Grid item sm={5.9}>
				<InputLabel className='inputlabel'>Hourly Rate</InputLabel>
				<TextField
					id="hourlyRate"
					className='hourly-rate-cls'
					fullWidth
					disabled={CategoriesData?.length === 0 || !user?.trade?.displayField}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<span className='common-icon-hourly-rate userdetails_icons' />
								<span style={{marginLeft : '6px',lineHeight: '0.8', color: CategoriesData?.length === 0 || !user?.trade?.displayField ? '#999' : '#333333' }}>$</span>
							</InputAdornment>
						)
					}}
					name='hourlyRate'
					variant="standard"
					value={amountFormatWithOutSymbol(user?.hourlyRate)}
					onChange={(e: any) => handleOnChange('hourlyRate', e.target?.value)}
				/>
			</Grid>
			<Grid item sm={11.6}>
				<SmartDropDown
					options={getSkillsOptions()}
					LeftIcon={<span className='common-icon-orgconsole-skills-certs userdetails_icons userdetails_icon_Color' />}
					dropDownLabel="Skills"
					doTextSearch={true}
					isSearchField={true}
					isMultiple={true}
					selectedValue={user?.skills}
					isFullWidth
					outSideOfGrid={true}
					handleChange={(value: any) => handleOnChange('skills', value)}
					handleChipDelete={(value: any) => handleOnChange('skills', value)}
					menuProps={classes.menuPaper}
					sx={{ fontSize: '18px' }}
					Placeholder={'Select'}
					isSearchPlaceHolder={'Search'}
					showCheckboxes={true}
					reduceMenuHeight={true}
					showAddButton={true}
					noDataFoundMsg={<div className="no-rows-msg"><span className="common-icon-No-Item-Available"></span><div className="empty-rows-mark">No match found</div><div>You can add it by clicking + button</div></div>}
					isCustomSearchField={false}
					handleAddCategory={(sVal: any) => handleAdd('', sVal, 'skill')}
					dynamicClose={dynamicClose}
				/>
			</Grid>
			<Grid item sm={0.1} style={{paddingLeft : 0 }} className='roles-section-cls'>
			<InputLabel className='inputlabel' ></InputLabel>
				<span className='common-icon-Project-Info'></span>
			</Grid>
			<Grid item sm={5.9}>
				<SmartDropDown
					LeftIcon={<span className='common-icon-calendar-31 userdetails_icons userdetails_icon_Color'></span>}
					options={getCalendarOptions()}
					dropDownLabel="Calendar"
					isSearchField={false}
					required={false}
					outSideOfGrid={true}
					selectedValue={user?.calendar}
					isFullWidth
					handleChange={(value: any) => handleOnChange('calendar', value)}
					displayEmpty={true}
					Placeholder={'Select'}
					showColumnHeader={false}
					hideNoRecordMenuItem={true}
					menuProps={classes.menuPaper}
				/>
			</Grid>
			<Grid item sm={5.9}>
				<SmartDropDown
					LeftIcon={<span className='common-icon-Shifts userdetails_icons userdetails_icon_Color'></span>}
					options={getShiftsOptions()}
					dropDownLabel="Shift"
					isSearchField={false}
					required={false}
					outSideOfGrid={true}
					selectedValue={user?.shift}
					isFullWidth
					handleChange={(value: any) => handleOnChange('shift', value)}
					Placeholder={'Select'}
					showColumnHeader={false}
					hideNoRecordMenuItem={true}
					menuProps={classes.menuPaper}
				/>

			</Grid>
		</Grid>
		<Grid container direction={'row'} spacing={3} mt={1}>
			<Grid item sm={5.9}>
				<Uniqueid
					label={'Unique ID'}
					labelIcon={false}
					url={user?.QRCodeImage}
					urlLabel={user?.barcode}
					onSubmit={(value) => { UniqueIdModelHandler(value) }}
					modelsx={{}}
					printSumbmit={() => { printUniqueCode() }}
					checkbox={(value: any, currentId: any) => {
						console.log('value', value);
						(value == false && currentId !== user?.barcode) ? setUser({
							...user,
							barcode: '',
							QRCodeImage: ''
						}) : setUser({
							...user,
							barcode: userdata?.barcode
						});
						setResetBarcode(new Date());
					}}
				/>
			</Grid>
			<Grid item sm={5.9}>
				<Grid container direction={'row'} spacing={3}>
					{rtlsConnector && <Grid item sm={12}>
						<InputLabel className='inputlabel'>{rtlsTextDisplay == 1 ? 'Scan or Type RTLS ID' : rtlsTextDisplay == 3 ? 'Scan or Type BLE ID' : ''}</InputLabel>
						{rtlsTextDisplay == 1 ?
							< TextField
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<span className='common-icon-location11 userdetails_icons' />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position='end' onClick={() => { BarCodeHandler('BLEID') }} style={{ cursor: 'Pointer' }}>
											<span className='common-icon-barcode1 userdetails_icons' />
										</InputAdornment>
									)
								}}
								//placeholder='Scan or Type RTLS ID'
								name='RTLSID'
								variant="standard"
								value={user?.rtlsId}
								inputRef={inputRTLSElement}
								onFocus={e => e.currentTarget.select()}
								onChange={(e: any) => handleOnChange('rtlsId', e.target?.value)}
							/>
							: rtlsTextDisplay == 3 ? < TextField
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<span className='common-icon-location11 userdetails_icons' />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position='end' onClick={() => { BarCodeHandler('BLEID') }} style={{ cursor: 'Pointer' }}>
											<span className='common-icon-barcode1 userdetails_icons' />
										</InputAdornment>
									)
								}}
								placeholder='Scan or Type BLE ID'
								name='BLEID'
								variant="standard"
								value={user?.rtlsId}
								inputRef={inputBLEElement}
								onFocus={e => e.currentTarget.select()}
								onChange={(e: any) => handleOnChange('rtlsId', e.target?.value)}
							/>
								: null}
					</Grid>}
					<Grid item sm={12}>
						<InputLabel className='inputlabel'>Scan or Type GPS Tag ID</InputLabel>
						<TextField
							id="bidPackage"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<span className='common-icon-location11 userdetails_icons' />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position='end' onClick={() => { BarCodeHandler('GPSTagID') }} style={{ cursor: 'Pointer' }}>
										<span className='common-icon-barcode1 userdetails_icons' />
									</InputAdornment>
								)
							}}
							//placeholder='Scan or Type GPS Tag ID'
							name='GPSTagID'
							variant="standard"
							value={user?.gpsTagId}
							onChange={(e: any) => handleOnChange('gpsTagId', e.target?.value)}
						/>
					</Grid>

				</Grid>
			</Grid>
			<Grid item sm={11.9}>
				<ProjectLocation
					label={'Default location for the day'}
					Placeholder={'Select Default Location'}
					tagOptions={locationTagOptions}
					selectedTagValue={user?.defaultLocation}
					tagStage_handler={(value: any) => handleOnChange('defaultLocation', value)}
					isMultiple={false}
					limitTags={false}
					LevelOptions={[...locationLevelOptions]}
					selectedLevelValue={user?.levelId == 0 || user?.levelId == null ? defautlevelvalue : user.levelId}
					LevelStage_handler={(value: any) => { LocationLevelStageHandler(value?.levelId) }}
				/>
			</Grid>
		</Grid>

		{userdata?.supplementalInfoItemID && <Grid container direction={'row'} spacing={3} mt={2}>
			<Grid item sm={5.9}>
				<IQButton
					disabled={false}
					className='btn-viewedit-changes'
					variant="outlined"
					onClick={(e) => { viewEditHandler(e) }}
				>
					VIEW/EDIT SUPPLEMENTAL INFO
				</IQButton>
			</Grid>
		</Grid>}
		{/* {
			showToastMessage?.displayToast ? <Toast message={showToastMessage?.message} interval={2000} /> : null

		} */}
		<SUIAlert
			open={alert.open}
			contentText={alert.contentText}
			title={alert.title}
			onAction={alert.handleAction}
			showActions={alert.actions}
			DailogClose={alert.dailogClose}
		/>
	</div>)
}
export default memo(UserDetails);