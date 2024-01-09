import './BudgetDetails.scss';

import {
	getCostCodeDivisionList, getCostTypeList, getServer
} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector, useHotLink} from 'app/hooks';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SmartDropDown from 'components/smartDropdown';
import {primaryIconSize} from 'features/budgetmanager/BudgetManagerGlobalStyles';
import VendorList from 'features/budgetmanager/aggrid/vendor/Vendor';
import Location from 'features/common/locationfield/LocationField';
import React, {memo, useState, useEffect, useCallback, useRef} from 'react';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import SaveButtonWhite from 'resources/images/common/SaveButtonWhite.svg';
import {
	StatusColors, StatusIcons,
	getBidStatus, getBidStatusIdFromText
} from 'utilities/bid/enums';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import {amountFormatWithOutSymbol, amountFormatWithSymbol} from 'app/common/userLoginUtils';
import {
	vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons
} from 'utilities/vendorContracts/enums';

import {WarningAmber} from '@mui/icons-material';
import {
	Box, Button, Divider, Fab,
	FormControlLabel,
	Radio, RadioGroup, IconButton, Select, FormControl, InputAdornment, MenuItem, TextField
} from '@mui/material';
import {createStyles, makeStyles} from '@mui/styles';

import {curveList} from '../../../headerpage/HeaderPage';
import {updateBudgetLineItem} from '../../../operations/gridAPI';
import {addRollupTask} from '../../../operations/rightPanelAPI';
import {setSelectedRowData} from "../../../operations/rightPanelSlice";
import {fetchGridData} from '../../../operations/gridSlice';
import {fetchLocationData} from 'features/common/locationfield/LocationStore';

import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import SUIAlert from 'sui-components/Alert/Alert';
import IQSelect from 'components/iqselect/IQSelect';
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import building from 'resources/images/building.jpg';
import {catalogData} from 'data/budgetmanager/catalogData';
import {isLocalhost} from 'app/utils';

var tinycolor = require('tinycolor2');
import {postMessage} from "../../../../../app/utils";
import CostCodeSelect from 'sui-components/CostCodeSelect/costCodeSelect';

interface BudgetDetailsProps {
	onFormSubmit?: (data: any) => void;
	tabSelectedValue: any;
	toast?: any;
};

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			//maxWidth: '160px !important',
			//minWidth: 'fit-content !important',
		},
		wbsMenuPaper: {
			maxHeight: "calc(100% - 400px) !important"
		}
	})
);

const BudgetDetails = (props: BudgetDetailsProps) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const {selectedRow} = useAppSelector(state => state.rightPanel);
	const {settingsData, costCodeDropdownData, divisionCostCodeFilterData, CostCodeAndTypeData} = useAppSelector(state => state.settings);

	const {tabSelectedValue = 'budget-details', toast} = props;
	const costCodeDivisionOpts = useAppSelector(getCostCodeDivisionList);
	const costTypeOpts = useAppSelector(getCostTypeList);
	const [formData, setFormData] = React.useState<any>({
		...selectedRow,
	});
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {rollupTaskData} = useAppSelector((state) => state.rightPanel);
	const {lineItemDescription} = useAppSelector(state => state.tableColumns);
	const {lineItem} = useAppSelector(state => state.gridData);
	const {levels = [], locations = []} = useAppSelector(state => state.location);
	const [location, setLocation] = useState<any>([]);
	const [dynamicClose, setDynamicClose] = useState<any>(false);
	const [rollupDisabelData, setRollupDisabelData] = useState<any>([]);
	const [wbsOptions, setWbsOptions] = useState<any>([]);
	const [selectedLevel, setSelectedLevel] = useState<any>();
	const [alert, setAlert] = useState<any>({show: false, msg: '', type: 'Warning'});
	const [levelValue, setLevelValue] = useState<any>('');
	const [catalogLocalData, setCatalogLocalData] = useState<any>(catalogData);
	const companyDataRef = useRef<any>([]);
	const [divisionDefaultFilters, setDivisionDefaultFilters] = React.useState<any>([]);

	// const [wbsAddButton, setWbsAddButton] = useState<any>(false);
	// const [wbsSearchText, setWbsSearchText] = useState<any>('');
	const CompanyData = useAppSelector((state: any) => state.rightPanel.companyList);
	const [costCodeHiddenOptions, setCostCodeHiddenOptions] = useState<any>([]);
	const [isCostCodeExistsInOptions, setIsCostCodeExistsInOptions] = useState<any>(false);

	const isCostCodeExists = (options: any, costCodeVal: any)=> {
		let isExists: any = false;
		(options || []).forEach((rec: any)=>{
			if (rec.value === costCodeVal) {
				isExists = true;
			} else {
				if(rec.children?.length > 0) {
					rec.children.forEach((childRec: any)=>{
						if(childRec.value === costCodeVal) {
							isExists = true;
						}
					})
				}
			}
		});
		return isExists;
	}

	useEffect(()=> {
		if (formData?.costCode && costCodeDropdownData?.length > 0) {
			let isCostCodeExistsInOptionsList: any =  isCostCodeExists(costCodeDropdownData, formData.costCode);
			setIsCostCodeExistsInOptions(isCostCodeExistsInOptionsList);
			if (!isCostCodeExistsInOptionsList) {
				let obj: any = 
					{
						value: formData?.costCode,
						id: formData?.costCode,
						children: null,
						isHidden: true,
					}
					setCostCodeHiddenOptions([obj]);
			}
		}
	}, [formData?.costCode, costCodeDropdownData])

	const formatCompanyData = () => {
		let list: any = [];
		(CompanyData || []).filter((rec: any) => rec.companyType === 3)?.forEach((data: any) => {
			list.push({
				...data,
				color: data.colorCode,
				id: data.id,
				displayField: data.name,
				thumbnailUrl: data.thumbnailUrl,
			});
		});
		return list;
	};

	useEffect(() => {
		companyDataRef.current = formatCompanyData();
		if(CompanyData?.length && companyDataRef.current?.length > 0 && selectedRow.equipmentManufacturerId) {
			const obj = companyDataRef.current.find((rec: any) => selectedRow.equipmentManufacturerId === rec.objectId);
			setFormData({...formData, equipmentManufacturer: [obj], equipmentManufacturerName: obj?.name});
		}

	}, [CompanyData, selectedRow?.id]);

	React.useEffect(() => {
		if(selectedRow?.id) {
			if(selectedRow.equipmentManufacturerId) {
				const obj = formatCompanyData().find((rec: any) => selectedRow.equipmentManufacturerId === rec.objectId);
				if(obj?.name) {
					setFormData({...selectedRow, equipmentManufacturer: [obj], equipmentManufacturerName: obj?.name});
				}
			} else {
				setFormData(selectedRow);
			}

			let rowLocations = selectedRow.locations || [];
			setLocation(rowLocations?.map((el: any) => {
				return {id: el.id, text: el.name};
			}) || []);
		}
	}, [selectedRow?.id]);

	useEffect(() => {
		const levelVal =
			selectedLevel ??
			(selectedRow.locations && selectedRow.locations.length > 0
				? (selectedRow.locations[0].levelId || selectedRow.locations[0].id)
				: levels.length > 0
					? levels[levels.length - 1]?.levelId
					: undefined);
		setLevelValue(levelVal);
	}, [selectedRow?.locations, levels, selectedLevel]);

	React.useEffect(() => {
		if(lineItem?.id) {
			setFormData({
				...selectedRow,
				equipmentManufacturer: formData?.equipmentManufacturer,
				equipmentModel: formData?.equipmentModel,
				rollupTaskIds: lineItem?.rollupTaskIds,
				addMarkupFee: formData?.addMarkupFee,
				markupFeeType: formData?.markupFeeType,
				markupFeeAmount: formData?.markupFeeAmount,
				markupFeePercentage: formData?.markupFeePercentage,
			});
		}
	}, [lineItem?.id]);

	React.useEffect(() => {
		if(rollupTaskData.length > 0) {
			setWbsOptions(rollupTaskData);
		}
	}, [rollupTaskData]);

	React.useEffect(() => {
		if(wbsOptions.length > 0) {
			// console.log('wbsOptions', wbsOptions);
			const filteredNames = wbsOptions.filter((item: any) => item.budgetItemId !== null && item.budgetItemId !== selectedRow.id).map((item: any) => item.value);
			setRollupDisabelData(filteredNames);
		}
	}, [wbsOptions]);

	const handleDropdownChange = (value: any, name: string) => {
		if(name === 'costCode') {
			const costCodeTuple = value.split('|');
			setFormData({...formData, 'division': costCodeTuple[0], 'costCode': costCodeTuple[1]});
		} 
		else if(name === 'providerSource') {
			setAlert({show: true, type: 'Confirmation', msg: `Are you sure want to update the Provider Source from ${formData?.providerSource == 1 ? 'Self Perform' : 'Trade Partner'} to ${value == 1 ? 'Self Perform' : 'Trade Partner?'}`});			

		} else {
			// if (name == 'markupFeeAmount' && Number(value) > formData?.originalAmount) setAlert({ show: true, msg: 'Amount Should Not be greater then Original Amount.' });
			// else if (name == 'markupFeePercentage' && Number(value) > 100) setAlert({ show: true, msg: 'Percentage Should be between 1 to 100.' });
			if(Number(value) < 0) setAlert({show: true, type: 'Warning', msg: 'Negative Values are not Allowed.'});
			else setFormData({...formData, [name]: value, markupFeeAmount: name == 'markupFeeType' ? null : name == 'markupFeeAmount' ? value : formData?.markupFeeAmount, markupFeePercentage: name == 'markupFeeType' ? null : name == 'markupFeePercentage' ? value : formData?.markupFeePercentage, addMarkupFee: name !== 'addMarkupFee' ? formData?.addMarkupFee : value});
		}
	};

	const gridIcon = React.useMemo<React.ReactElement>(() => {
		return <div className='common-icon-info-icon common-icon-Budgetcalculator'></div>;
	}, []);

	const handleLocationChange = (newValues: any) => {
		// console.log(newValues);
		const locations: any = [];
		newValues?.map((obj: any) => {
			!locations?.map((a: any) => a?.id)?.includes(obj?.id) && locations.push(obj);
		});
		setLocation(locations);
	};

	React.useEffect(() => {
		if(selectedLevel) {
			dispatch(fetchLocationData(selectedLevel));
		}
	}, [selectedLevel]);

	const submitUpdate = () => {
		const data = {
			division: formData?.division,
			costCode: formData?.costCode,
			costType: formData?.costType,
			estimatedStart: new Date(formData?.estimatedStart)?.toISOString(),
			estimatedEnd: new Date(formData?.estimatedEnd)?.toISOString(),
			curve: formData.curve,
			originalAmount: formData?.originalAmount,
			Vendors: formData?.Vendors,
			status: 0,
			description: lineItemDescription ? lineItemDescription : '',
			unitCost: formData?.unitCost,
			unitOfMeasure: formData?.unitOfMeasure,
			unitQuantity: formData?.unitQuantity,
			associatedTo: formData?.associatedTo,
			rollupTaskId: formData?.rollupTaskIds?.[0],
			locationIds: location?.map((el: any) => el.id) || [],
			addMarkupFee: formData?.addMarkupFee,
			markupFeeType: formData?.markupFeeType,
			markupFeeAmount: !formData?.addMarkupFee ? null : formData?.markupFeeAmount,
			markupFeePercentage: !formData?.addMarkupFee ? null : formData?.markupFeePercentage,
			equipmentModel: formData?.equipmentModel,
			equipmentManufacturer: formData?.equipmentManufacturer?.[0]?.name || '',
			equipmentManufacturerId: formData?.equipmentManufacturer?.[0]?.objectId || '',
			equipmentCatalogId: formData?.equipmentCatalogId,
			providerSource: formData?.providerSource
		};

		console.log('data', data);
		updateBudgetLineItem(appInfo, formData.id, data, (res: any) => {
			dispatch(fetchGridData(appInfo));
		});
		toast({displayToast: true, message: 'Budget Details Updated Successfully'});
	};

	const WbsCustomHeader = (props: any) => {
		return (
			<div className="wbs-header-container-cls">
				<span className="wbs-label-cell-cls" style={{margin: '0px 0px 14px 6px'}} onClick={() => handleNone()}>None</span>
				<div className="wbs-auto-create-label-cls" onClick={() => handleAutoCreateWbs()}>
					<IconButton className='add-button' >
						<span className={'common-icon-add addIcon-styles-cls'}></span>
					</IconButton>
					<span className='wbs-label-cell-cls'>Auto Create Work Break Down Structure (WBS) from the Cost Break Down Structure (CBS)</span>
				</div>
				<Divider />
			</div>
		);
	};

	const handleNone = () => {
		handleDropdownChange('', 'rollupTaskIds');
		setDynamicClose(!dynamicClose);
	};

	const handleAutoCreateWbs = () => {
		const newRollup = `${formData?.name} - ${formData.division} - ${formData.costCode} : ${formData.costType}`;

		addRollupTask(appInfo, newRollup, selectedRow?.id).then((response: any) => {
			// console.log('response', response);
			// console.log('neww response.id', response?.id);
			if(response?.name !== null && response?.budgetItemId !== null) {
				const newOption = {label: response?.name, value: response?.id, budgetItemId: response?.budgetItemId};
				setWbsOptions((prevArray: any) => [...prevArray, newOption]);
				setDynamicClose(!dynamicClose);
				toast({displayToast: true, message: `WBS item with name ${newRollup} has been created successfully`});
				handleDropdownChange([response?.id], 'rollupTaskIds');
				dispatch(fetchGridData(appInfo));
			}
		});

	};

	// const wbsHandleSearch = (filteredOptions: any, searchText: any) => {
	// 	if (filteredOptions?.length > 0) {
	// 		setWbsAddButton(true)
	// 		setWbsSearchText('')
	// 	}
	// 	else {
	// 		setWbsAddButton(false)
	// 		setWbsSearchText(searchText)
	// 	}
	// }
	const wbsSelectedData = (value: any) => {
		// console.log('wbsSelectedData', value);
		if(value?.length > 0) {
			if(value?.length > 1) {
				const lastValue = value[value.length - 1];
				// console.log('lastValue', lastValue);
				return [lastValue];
			}
			else {
				return value;
			}
		}
		else {
			return [];
		}
	};

	const getCatalogTooltipTmpl = useCallback(() => {
		return (
			<div className="catalog-tooltip-wrapper">
				<div className="catalog-tooltip-wrapper_img-container">
					<img src={formData?.equipmentThumbnail} alt="Catalog Img" />
				</div>
				<div className="catalog-tooltip-wrapper_body">
					<div className="catalog-tooltip-wrapper_body-title">
						{formData?.equipmentName}
					</div>
					<div className="catalog-tooltip-wrapper_body-type">
						{formData.equipmentManufacturerName}
					</div>

					<div className="catalog-tooltip-wrapper_body-sku">
						<span className="common-icon-sku"></span>SKU: {formData?.equipmentSKU}</div>
					<div className="catalog-tooltip-wrapper_body-ref">
						<span className="common-icon-ref-id"></span> Ref ID: {formData?.referenceId}
					</div>
					<div className="catalog-tooltip-wrapper_body-price">
						<span className="common-icon-price"></span>Price: {currencySymbol}{formData?.equipmentItemPrice?.toLocaleString("en-US")}</div>
				</div>
			</div>
		);
	}, [formData.equipmentName]);

	const onCatalogBtnClick = () => {
		if(isLocalhost) {
			const obj = formatCompanyData().find((rec: any) => catalogLocalData.distributorId === rec.objectId);
			setFormData({
				...formData,
				equipmentCatalogId: catalogLocalData.id,
				equipmentModel: catalogLocalData.sku,
				equipmentManufacturer: [obj],
				equipmentManufacturerName: obj?.name
			});
		} else {
			postMessage({
				event: 'opencatalog',
				body: {
					data: {
						skuType: "SingleCatalog",
						singleQuantity: true
					}
				}
			});
		}
	};

	useEffect(() => {
		window.addEventListener(
			"message",
			(event: any) => {
				let data = event.data;
				data = typeof data == "string" ? JSON.parse(data) : data;
				data =
					data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
				if(data) {
					switch(data.event || data.evt) {
						case "save-catalog":
							if(data.data) {
								let catObj = JSON.parse(data.data)?.[0] || {};
								if(catObj.manufacturer?.id) {
									const obj = companyDataRef.current.find((rec: any) => catObj.manufacturer?.id === rec.objectId);
									setFormData({
										...formData,
										equipmentCatalogId: catObj.id,
										equipmentModel: catObj.sku,
										equipmentManufacturer: [obj],
										equipmentName: catObj?.name,
										equipmentThumbnail: catObj.src,
										equipmentItemPrice: catObj.price,
										referenceId: catObj.referenceId,
										equipmentSKU: catObj.sku,
										equipmentManufacturerName: catObj.manufacturer?.name
									});
								} else {
									setFormData({
										...formData,
										equipmentCatalogId: catObj.id,
										equipmentModel: catObj.sku,
										equipmentName: catObj?.name,
										equipmentThumbnail: catObj.src,
										equipmentItemPrice: catObj.price,
										referenceId: catObj.referenceId,
										equipmentSKU: catObj.sku
									});
								}

							}
							break;
					}
				}
			},
			false
		);
	}, []);

	const getDefaultFilter = () => {
		let inlineFilter: any = [];
		divisionCostCodeFilterData?.map((obj: any) => {
			if(obj?.value == formData?.division) inlineFilter = [obj?.hierarchy];
		});
		return inlineFilter;
	};

	const handleProviderSourceChange = (type:string) => {
		if(type == 'yes') {
			console.log("yeeeee", formData)
			setFormData({...formData, providerSource: formData?.providerSource == 0 ? 1 : 0})
			setAlert({show: false, type: '', msg: ''})
		}
		else setAlert({show: false, type: '', msg: ''})
	}


	return (
		<div className="budget-details-box">
			<div className="budget-details-header">
				<div className="title-action">
					<span className="title">Budget Details</span>
				</div>
			</div>
			<div className="budget-details-content">
				<span className="budget-info-tile">
					<div className="budget-info-label">Original Budget</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{amountFormatWithSymbol(formData?.originalAmount)}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Revised Budget</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{amountFormatWithSymbol(formData?.revisedBudget)}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">
						Remaining Balance
						{formData.balance < 0 ? (
							<IQTooltip
								title="Your Remaining Balance is Negative"
								placement="bottom"
								arrow={true}
							>
								<WarningAmber
									fontSize={primaryIconSize}
									style={{color: "red"}}
								/>
							</IQTooltip>
						) : null}
					</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{amountFormatWithSymbol(formData?.balance)}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Budget ID/CBS</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">{formData.name}</span>
					</div>
				</span>
				<span className="budget-info-tile span-2 division-cost-code-field">
					<div className="budget-info-label">
						Division/Cost Code <span className="required_color">*</span>
						{formData.isCostCodeInvalid ? (
							<IQTooltip
								title="The Division / Cost Code number does not match any code in the new list. Please update a new code."
								placement="bottom"
								arrow={true}
							>
								<WarningAmber
									fontSize={primaryIconSize}
									style={{color: "red"}}
								/>
							</IQTooltip>
						) : null}
					</div>
					<div className="budget-info-data-box">
						{/* <CostCodeDropdown
              label=""
              required={true}
              startIcon={gridIcon}
              options={
                costCodeDivisionOpts?.length > 0 ? costCodeDivisionOpts : []
              }
              outSideOfGrid={false}
              selectedValue={formData.division + "|" + formData.costCode}
              checkedColor={"#0590cd"}
              onChange={(value) => handleDropdownChange(value, "costCode")}
              showFilter={true}
              sx={{
                fontSize: "18px",
                ".MuiSelect-icon": {
                  display: "none",
                },
              }}
              filteringValue={formData.division}
            /> */}
						<CostCodeSelect
							label=" "
							options={costCodeDropdownData?.length > 0 ? costCodeDropdownData : []}
							hiddenOptions = {costCodeHiddenOptions}
							onChange={(value: any) => handleDropdownChange(value, 'costCode')}
							// required={true}
							startIcon={<div className='budget-Budgetcalculator' style={{fontSize: '1.25rem'}}></div>}
							checkedColor={'#0590cd'}
							showFilter={false}
							selectedValue={formData?.division && formData?.costCode ? (isCostCodeExistsInOptions ? (formData?.division + '|' + formData?.costCode) : formData?.costCode) : ''}
							Placeholder={'Select'}
							outSideOfGrid={true}
							showFilterInSearch={true}
							filteroptions={divisionCostCodeFilterData.length > 0 ? divisionCostCodeFilterData : []}
							onFiltersUpdate={(filters: any) => setDivisionDefaultFilters(filters)}
							defaultFilters={divisionDefaultFilters?.length ? divisionDefaultFilters : getDefaultFilter()}
						/>
					</div>
				</span>
				{formData?.costType?.toLowerCase()?.includes("equipment") && (
					<>
						<div className="budget-info-subheader">
							Associate Manufacturer and Model
						</div>
						<span className="budget-info-tile">
							<div className="budget-info-label">Manufacturer</div>
							<div className="budget-info-data-box">
								<SUIBaseDropdownSelector
									value={formData?.equipmentManufacturer || []}
									width="100%"
									menuWidth="200px"
									icon={gridIcon}
									placeHolder={"Select"}
									dropdownOptions={formatCompanyData()}
									handleValueChange={(value: any) =>
										handleDropdownChange(value, "equipmentManufacturer")
									}
									showFilterInSearch={false}
									multiSelect={false}
									companyImageWidth={"17px"}
									companyImageHeight={"17px"}
									showSearchInSearchbar={true}
									addCompany={false}
								></SUIBaseDropdownSelector>
							</div>
						</span>
						<span className="budget-info-tile">
							<div className="budget-info-label">Model Number</div>
							<div className="budget-info-data-box">
								<TextField
									id="equipmentModel"
									fullWidth
									placeholder={`Enter`}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												{gridIcon}
											</InputAdornment>
										),
									}}
									name="equipmentModel"
									variant="standard"
									value={formData?.equipmentModel || ""}
									onChange={(e: any) =>
										setFormData({...formData, equipmentModel: e.target.value})
									}
								/>
							</div>
						</span>
						<span className="budget-info-tile from-catalog-btn-tile">
							<div className="budget-info-label"></div>
							<div>
								{formData?.equipmentName ? (
									<DynamicTooltip
										id="budget-catalog-tooltip"
										title={getCatalogTooltipTmpl()}
										placement="top"
										enterDelay={500}
										enterNextDelay={500}
									>
										<Button
											variant={"contained"}
											startIcon={<span className="common-icon-from-catalog"></span>}
											className="from-catalog-btn"
											onClick={onCatalogBtnClick}
										>
											From Catalog
										</Button>
									</DynamicTooltip>
								) : (
									<Button
										variant={"outlined"}
										startIcon={<span className="common-icon-from-catalog"></span>}
										className="from-catalog-btn"
										onClick={onCatalogBtnClick}
									>
										From Catalog
									</Button>
								)}
							</div>
						</span>
					</>
				)}
				{formData?.allowMarkupFee && (
					<span className="budget-info-tile span-3 mark-up-fee">
						<div className="budget-info-data-box">
							<div className="budget-info-label">
								Do you want to add Mark-up Fee?
							</div>
							<RadioGroup
								row
								name="markupFee"
								className="associated-to"
								value={formData?.addMarkupFee}
								onChange={(e: any) =>
									handleDropdownChange(
										e.target.value == "true" ? true : false,
										"addMarkupFee"
									)
								}
							>
								<FormControlLabel
									value={true}
									control={<Radio />}
									label="Yes"
								/>
								<FormControlLabel
									value={false}
									control={<Radio />}
									label="No"
								/>
								{formData?.addMarkupFee && (
									<>
										<span className="enter-value-cls">Enter Value</span>
										<span>
											<FormControl sx={{m: 1, minWidth: 120}} size="small">
												<Select
													labelId="demo-select-small"
													id="demo-select-small"
													value={
														formData?.markupFeeType == 0
															? "Amount"
															: "Percentage"
													}
													className="cc-schedule-values_select"
													// disabled={props?.readOnly}
													onChange={(event: any) =>
														handleDropdownChange(
															event.target.value == "Amount" ? 0 : 1,
															"markupFeeType"
														)
													}
												>
													<MenuItem value="Amount">Amount</MenuItem>
													<MenuItem value="Percentage">Percentage</MenuItem>
												</Select>
											</FormControl>
										</span>
										<span className="cc-schedule-values_list-item cc-schedule-values_tooltip-section">
											<TextField
												id="standard-basic"
												variant="standard"
												value={
													formData?.markupFeeType == 0
														? amountFormatWithOutSymbol(
															formData?.markupFeeAmount
														)
														: amountFormatWithOutSymbol(
															formData?.markupFeePercentage
														)
												}
												// onBlur={() => handleOnBlur('contingenices', formData?.markupFeeType == 0 ? 'markupFeeAmount' : 'markupFeePercentage')}
												// disabled={props?.readOnly}
												onChange={(e: any) =>
													handleDropdownChange(
														e.target.value?.replaceAll(",", ""),
														formData?.markupFeeType == 0
															? "markupFeeAmount"
															: "markupFeePercentage"
													)
												}
												InputProps={{
													startAdornment: formData?.markupFeeType == 0 && (
														<InputAdornment position="start">
															<span style={{color: "#333333"}}>
																{currencySymbol}
															</span>
														</InputAdornment>
													),
													endAdornment: formData?.markupFeeType == 1 && (
														<InputAdornment position="end">
															<span
																style={{color: "#333333", marginTop: "6px"}}
															>
																{"%"}
															</span>
														</InputAdornment>
													),
												}}
											// error={formData?.markupFeeType == 0 ? formData?.markupFeeAmount > formData?.originalAmount ? true : false : false}
											// sx={{
											// 	'.MuiInputBase-root:before': {
											// 		borderBottom: formData?.markupFeeType == 0 ? formData?.markupFeeAmount > formData?.originalAmount ? '1px solid red	 !important' : '1px solid #ccc !important' : '1px solid #ccc !important'
											// 	},
											// 	'.MuiInputBase-root': {
											// 		width: formData?.markupFeeType == 0 ? formData?.markupFeeAmount > formData?.originalAmount ? '160px' : '100%' : '100%'
											// 	}
											// }}
											/>
										</span>
									</>
								)}
							</RadioGroup>
						</div>
					</span>
				)}
				{/* <span className='budget-info-tile span-2'>
					<div className='budget-info-label'>Associate To?</div>
					<div className='budget-info-data-box'>
						{gridIcon}
						<RadioGroup row
							name='associatedTo'
							className='associated-to'
							value={formData.associatedTo}
							onChange={(e: any) => handleDropdownChange(e.target.value, 'associatedTo')}
						>
							<FormControlLabel value={1} control={<Radio />} label='System' />
							<FormControlLabel value={0} control={<Radio />} label='Location' />
						</RadioGroup>
					</div>
				</span>
				<span className='budget-info-tile span-2'>
					<div className='budget-info-label'>Location</div>
					<div className='budget-info-data-box'>
						<Location
							fullWidth
							multiple={true}
							options={[]}
							value={location}
							onChange={(e, newValue) => {handleLocationChange(newValue);}}
							getOptionLabel={(option: any) => option?.text || ''}
						/>
					</div>
				</span> */}
				<span className="budget-info-tile">
					<div className="budget-info-label">
						Cost Type <span className="required_color">*</span>
					</div>
					<div className="budget-info-data-box">
						<SmartDropDown
							options={costTypeOpts?.length > 0 ? costTypeOpts : []}
							required={true}
							LeftIcon={gridIcon}
							isSearchField
							isFullWidth
							outSideOfGrid={false}
							selectedValue={formData.costType}
							menuProps={classes.menuPaper}
							sx={{fontSize: "18px"}}
							handleChange={(value: string | undefined | string[]) => {
								handleDropdownChange(value ? value[0] : "", "costType");
							}}
						/>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Curve</div>
					<div className="budget-info-data-box">
						<SmartDropDown
							LeftIcon={<div className="budget-info-icon budget-Curve"></div>}
							options={curveList}
							outSideOfGrid={false}
							isSearchField={false}
							isFullWidth
							selectedValue={formData.curve}
							menuProps={classes.menuPaper}
							handleChange={(value: any) =>
								handleDropdownChange(value, "curve")
							}
						/>
					</div>
				</span>
				<span className="budget-info-tile vendor-field">
					<div className="budget-info-label">Vendor</div>
					<div className="budget-info-data-box">
						{formData.bidPackage?.status == "Awarded" ? (
							<>
								<span className="common-icon-info-icon common-icon-Budgetcalculator"></span>
								{formData?.Vendors?.map((data: any, i: any) => {
									return (
										<IQTooltip
											title={
												"Vendor has been awarded the Bid and the Vendor cannot be updated"
											}
											placement={"bottom"}
											arrow={true}
										>
											<span key={i}>
												{i > 0 && ",  "}
												{data.name}
											</span>
										</IQTooltip>
									);
								})}
							</>
						) : (
							<VendorList
								value={formData.Vendors}
								handleVendorChange={(values: any, params: any) =>
									handleDropdownChange(values, "Vendors")
								}
								outSideOfGrid={true}
								icon={gridIcon}
								showFilter={true}
							/>
						)}
					</div>
				</span>
				<span className="budget-info-tile date-field">
					<div className="budget-info-label">Estimated Start Date</div>
					<div className="budget-info-data-box">
						<span className="budget-info-data">
							<DatePickerComponent
								containerClassName="iq-customdate-cont"
								defaultValue={convertDateToDisplayFormat(
									formData.estimatedStart
								)}
								onChange={(val: any) =>
									handleDropdownChange(val, "estimatedStart")
								}
								maxDate={
									formData.estimatedEnd !== ""
										? new Date(formData.estimatedEnd)
										: new Date("12/31/9999")
								}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className="custom-input rmdp-input"
									/>
								}
							/>
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Projected Schedule Start</div>
					<div className="budget-info-data-box">
						<span className="budget-info-icon budget-Date-1"></span>
						<span className="budget-info-data">
							{formData.projectedScheduleStart
								? convertDateToDisplayFormat(formData.projectedScheduleStart)
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Actual Schedule Start</div>
					<div className="budget-info-data-box">
						<span className="budget-info-icon budget-Date-1"></span>
						<span className="budget-info-data">
							{formData.actualScheduleStart
								? convertDateToDisplayFormat(formData.actualScheduleStart)
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile date-field">
					<div className="budget-info-label">Estimated End Date</div>
					<div className="budget-info-data-box">
						<span className="budget-info-data">
							<DatePickerComponent
								containerClassName="iq-customdate-cont"
								defaultValue={convertDateToDisplayFormat(formData.estimatedEnd)}
								onChange={(val: any) =>
									handleDropdownChange(val, "estimatedEnd")
								}
								minDate={new Date(formData.estimatedStart)}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className="custom-input rmdp-input"
									/>
								}
							/>
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Projected Schedule End</div>
					<div className="budget-info-data-box">
						<span className="budget-info-icon budget-Date-1"></span>
						<span className="budget-info-data">
							{formData.projectedScheduleEnd
								? convertDateToDisplayFormat(formData.projectedScheduleEnd)
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Actual Schedule End</div>
					<div className="budget-info-data-box">
						<span className="budget-info-icon budget-Date-1"></span>
						<span className="budget-info-data">
							{formData.actualScheduleEnd
								? convertDateToDisplayFormat(formData.actualScheduleEnd)
								: "-"}
						</span>
					</div>
				</span>

				<span className="budget-info-tile">
					<div className="budget-info-label">Unit Of Measure</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{formData.unitOfMeasure || "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Unit Quantity</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{formData?.unitQuantity?.toLocaleString("en-US") || "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Unit Cost</div>
					<div className="budget-info-data-box">
						{gridIcon}
						<span className="budget-info-data">
							{formData.unitCost !== null &&
								formData.unitCost !== undefined &&
								amountFormatWithSymbol(formData.unitCost)}
						</span>
					</div>
				</span>
				<div className="budget-info-subheader">Provider Source</div>				
				<span>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="row-radio-buttons-group"
						value={formData?.providerSource == 1 ? 'self' : 'trade' }
						onChange={(e) => { handleDropdownChange(e.target.value == 'self' ? 1 : 0, "providerSource") }}
					>
						<FormControlLabel value="self" control={<Radio />} label="Self Perform" 
							disabled={formData?.bidPackage || formData?.vendorContract || formData?.clientContract }
						/>
						<FormControlLabel value="trade" control={<Radio />} label="Trade Partner" 
							disabled={formData?.bidPackage || formData?.vendorContract || formData?.clientContract }
						/>
					</RadioGroup>
				</span>
				<div className="budget-info-subheader">Bid Details</div>
				<span className="budget-info-tile">
					<div className="budget-info-label">Bid Package</div>
					<div className="budget-info-data-box">
						<span className="common-icon-bid-lookup"></span>
						<span
							className="budget-info-data hot-link"
							onClick={() => {
								window.open(useHotLink(`bid-manager/home?id=${formData?.bidPackage?.id}`), "_blank");
							}}
						>
							{formData.bidPackage?.name || "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Bid Award Date</div>
					<div className="budget-info-data-box">
						<span className="common-icon-DateCalendar"></span>
						<span className="budget-info-data">
							{formData.bidPackage?.awardedOn
								? formatDate(formData.bidPackage?.awardedOn, {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Bid Status</div>
					<div className="budget-info-data-box">
						<span className="budget-info-data">
							{formData.bidPackage?.status ? (
								<Button
									className="status-pill"
									startIcon={
										<span
											className={
												StatusIcons[
												getBidStatusIdFromText(formData?.bidPackage?.status)
												]
											}
										/>
									}
									style={{
										backgroundColor: `#${StatusColors[
											getBidStatusIdFromText(formData.bidPackage?.status)
										]
											}`,
										color: tinycolor(
											StatusColors[
											getBidStatusIdFromText(formData.bidPackage?.status)
											]
										).isDark()
											? "white"
											: "black",
									}}
								>
									{getBidStatus(
										getBidStatusIdFromText(formData?.bidPackage?.status)
									)}
								</Button>
							) : (
								"-"
							)}
						</span>
					</div>
				</span>

				<div className="budget-info-subheader">Vendor Contract Details</div>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract</div>
					<div className="budget-info-data-box">
						<span className="common-icon-post-contract"></span>
						<span
							className="budget-info-data hot-link"
							onClick={() =>
								window.open(useHotLink(`vendor-contracts/home?id=${formData?.vendorContract?.id}`), "_blank")
							}
						>
							{formData?.vendorContract?.name || "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract Date</div>
					<div className="budget-info-data-box">
						<span className="common-icon-DateCalendar"></span>
						<span className="budget-info-data">
							{formData?.vendorContract?.startDate &&
								formData?.vendorContract?.endDate
								? `${formatDate(formData?.vendorContract?.startDate, {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})} - ${formatDate(formData?.vendorContract?.endDate, {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})}`
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract Status</div>
					<div className="budget-info-data-box">
						<span className="budget-info-data">
							{formData?.vendorContract?.status ? (
								<Button
									className="status-pill"
									startIcon={
										<span
											className={
												vendorContractsStatusIcons[
												formData?.vendorContract?.status
												]
											}
											style={{color: "white"}}
										/>
									}
									style={{
										backgroundColor:
											vendorContractsStatusColors[
											formData?.vendorContract?.status
											],
										color: tinycolor(
											vendorContractsStatusColors[
											formData?.vendorContract?.status
											]
										).isDark()
											? "white"
											: "black",
									}}
								>
									{vendorContractsStatus[formData?.vendorContract?.status]}
								</Button>
							) : (
								"-"
							)}
						</span>
					</div>
				</span>

				<div className="budget-info-subheader">Client Contract Details</div>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract</div>
					<div className="budget-info-data-box">
						<span className="common-icon-post-contract"></span>
						<span
							className="budget-info-data hot-link"
							onClick={() =>
								window.open(useHotLink(`client-contracts/home?id=${formData?.clientContract?.id}`), "_blank")
							}
						>
							{formData?.clientContract?.name || "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract Date</div>
					<div className="budget-info-data-box">
						<span className="common-icon-DateCalendar"></span>
						<span className="budget-info-data">
							{formData?.clientContract?.startDate &&
								formData?.clientContract?.endDate
								? `${formatDate(formData?.clientContract?.startDate, {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})} - ${formatDate(formData?.clientContract?.endDate, {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								})}`
								: "-"}
						</span>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Contract Status</div>
					<div className="budget-info-data-box">
						<span className="budget-info-data">
							{formData?.clientContract?.status ? (
								<Button
									className="status-pill"
									startIcon={
										<span
											className={
												vendorContractsStatusIcons[
												formData?.clientContract?.status
												]
											}
											style={{color: "white"}}
										/>
									}
									style={{
										backgroundColor:
											vendorContractsStatusColors[
											formData?.clientContract?.status
											],
										color: tinycolor(
											vendorContractsStatusColors[
											formData?.clientContract?.status
											]
										).isDark()
											? "white"
											: "black",
									}}
								>
									{vendorContractsStatus[formData?.clientContract?.status]}
								</Button>
							) : (
								"-"
							)}
						</span>
					</div>
				</span>
				<div className="budget-info-subheader">
					Location Breakdown Structure (LBS)
				</div>
				<span className="budget-info-tile">
					<div className="budget-info-label">Location Type</div>
					<div className="budget-info-data-box">
						<SmartDropDown
							options={
								levels?.map((level: any) => {
									return {label: level.name, value: level.levelId};
								}) || []
							}
							required={false}
							LeftIcon={
								<div className="budget-info-icon common-icon-Location-filled"></div>
							}
							isSearchField
							isFullWidth
							outSideOfGrid={false}
							selectedValue={levelValue}
							menuProps={classes.menuPaper}
							sx={{fontSize: "18px"}}
							handleChange={(value: string | undefined | string[]) => {
								setSelectedLevel(value);
							}}
						/>
					</div>
				</span>
				<span className="budget-info-tile">
					<div className="budget-info-label">Default Location</div>
					<div className="budget-info-data-box">
						<Location
							fullWidth
							hideLevel={true}
							multiple={true}
							options={locations}
							value={location}
							onChange={(e, newValue) => {
								handleLocationChange(newValue);
							}}
							getOptionLabel={(option: any) => option?.text || ""}
						/>
					</div>
				</span>

				{/* <span className='budget-info-tile span-2'>
					<div className='budget-info-label' style={{fontWeight:'bold',fontSize:'16px',color:'Black'}}>System BreakDown Structure (SBS)</div>
					<div className='budget-info-data-box'>
						<SmartDropDown
							options={[]}
							required={true}
							LeftIcon={<div className='budget-info-icon common-icon-Location-filled'></div>}
							isSearchField
							isFullWidth
							outSideOfGrid={false}
							selectedValue={''}
							menuProps={classes.menuPaper}
							sx={{ fontSize: '18px' }}
							handleChange={(value: string | undefined | string[]) => {
								// handleDropdownChange(value ? value[0] : '', 'costType');
							}}
						/>
					</div>
				</span>
				<span className='budget-info-tile'>
					<div className='budget-info-label'>Phase</div>
					<div className='budget-info-data-box'>
						<SmartDropDown
							options={ []}
							required={true}
							LeftIcon={<div className='budget-info-icon common-icon-Location-filled'></div>}
							isSearchField
							isFullWidth
							outSideOfGrid={false}
							selectedValue={''}
							menuProps={classes.menuPaper}
							sx={{ fontSize: '18px' }}
							handleChange={(value: string | undefined | string[]) => {
								// handleDropdownChange(value ? value[0] : '', 'costType');
							}}
						/>
					</div>
				</span> */}

				<div className="budget-info-subheader">
					Work Breakdown Structure (WBS)
				</div>
				<span className="budget-info-tile  span-2">
					<div className="budget-info-label">Work Breakdown Structure(WBS)</div>
					<div className="budget-info-data-box">
						<SmartDropDown
							Placeholder={"Select"}
							isSearchPlaceHolder={"Search"}
							options={wbsOptions?.length > 0 ? wbsOptions : []}
							required={true}
							//isMultiple={true}
							//showCheckboxes={true}
							LeftIcon={
								<div className="budget-info-icon common-icon-Location-filled"></div>
							}
							isSearchField
							isFullWidth
							outSideOfGrid={false}
							selectedValue={wbsSelectedData(formData?.rollupTaskIds)}
							menuProps={classes.wbsMenuPaper}
							sx={{fontSize: "18px"}}
							handleChange={(value: string | undefined | string[]) => {
								handleDropdownChange(value, "rollupTaskIds");
							}}
							showDropDownHeaderTitle={true}
							dropDownHeaderTitle={""}
							showHeaderCloseIcon={true}
							showCustomHeader={true}
							showColumnHeader={false}
							columnName={"None"}
							disableOptionsList={rollupDisabelData ? rollupDisabelData : []}
							showToolTipForDisabledOption={true}
							showDescription={false}
							customHeaderContent={<WbsCustomHeader />}
							dynamicClose={dynamicClose}
						// handleSearchProp={(filteredOptions: any, searchText: any) => {
						// 	wbsHandleSearch(filteredOptions, searchText)
						// }}
						/>
					</div>
				</span>
			</div>

			{tabSelectedValue == "budget-details" ? (
				<Fab
					sx={{
						position: "absolute",
						bottom: "6em",
						right: "3em",
						color: "#fff",
						backgroundColor: "#0a8727",
						"&:hover": {
							background: "#0a8727",
						},
					}}
					aria-label="Add"
				>
					<Box
						component="img"
						alt="Save"
						src={SaveButtonWhite}
						className="image"
						width={25}
						height={25}
						onClick={() => {
							submitUpdate();
						}}
					/>
					{/* <Save  /> */}
				</Fab>
			) : null}

			{alert?.show && (
				<SUIAlert
					open={alert?.show}
					onClose={() => {
						setAlert({...alert, show: false, type: ''});
					}}
					contentText={
						<div>
							<span>{alert?.msg}</span>
							<br />
							{ alert?.type == 'Warning' && <div style={{textAlign: "right", marginTop: "10px"}}>
								<Button
									className="cancel-cls"
									style={{
										backgroundColor: "#666",
										color: "#fff",
										padding: "12px",
										height: "37px",
										borderRadius: "2px",
										marginRight: "0px",
										boxShadow:
											"0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
										display: "initial",
									}}
									onClick={(e: any) => setAlert({...alert, show: false, type: ''})}
								>
									OK
								</Button>
							</div> }
						</div>
					}
					DailogClose={true}
					title={alert?.type}
					onAction={(e: any, type: string) => handleProviderSourceChange(type)}					
					showActions={alert?.type == 'Warning' ? false : true}
				/>
			)}
		</div>
	);
};

export default memo(BudgetDetails);
