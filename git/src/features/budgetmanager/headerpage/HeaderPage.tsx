import React, { useEffect } from "react";

import { GridView } from "@mui/icons-material";
import { InputLabel } from "@mui/material";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import SmartDropDown from "components/smartDropdown";
import DatePickerComponent from "components/datepicker/DatePicker";
import { Stack, Grid as MuiGrid } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { isLocalhost } from 'app/utils';
import { getHostAppInfo, setLineItemDescription, setToastMessage } from '../operations/tableColumnsSlice';
import { addBudgetLineItem,fetchWorkPlannerCategories  } from '../operations/gridAPI';
import { fetchGridData } from '../operations/gridSlice';
import { getServer, getCostTypeList, getCostUnitList, getCostCodeDivisionList, setCostUnitList } from 'app/common/appInfoSlice';
import InputIcon from "react-multi-date-picker/components/input_icon";
import { triggerEvent } from 'utilities/commonFunctions';
import { makeStyles, createStyles } from '@mui/styles';

import {
	Button, Label, Input, Title, Grid
} from "@ui5/webcomponents-react";
import OriginalBudget from "../orginalBudget/OrginalBudget";
import './HeaderPage.scss'
import { validate } from './Validation';
import globalStyles, { primaryIconSize } from "../BudgetManagerGlobalStyles";
import CostCodeSelect from "sui-components/CostCodeSelect/costCodeSelect";
import { menusData, optionsdata } from "examples/Costcodeselectexample/costCodeSelectExample";
import { CostCodeFilterData, DivisionCostCodeDropdownData } from "data/MultiLevelFilterData";
import { settingcostcodetypeData } from "data/SettingsCosttypeData";
import { postMessage } from "../../../app/utils";
import { LaborSheetModel } from "../lineitemdetails/tabs/details/laborSheet/LaborSheet";
interface HeaderPageProps {
	onLineItemAdded?: (value: any) => void;
}
const defaultData = {
	costCode: '',
	costType: '',
	startDate: '',
	endDate: '',
	curve: null,
	originalBudgetAmount: {
		unitOfMeasure: '',
		quantity: '',
		cost: '',
		amount: ''
	}
}
export const curveList = [
	{ label: "Back Loaded", value: 0, id:0 },
	{ label: "Front Loaded", value: 1, id: 1 },
	{ label: "Linear", value: 2, id: 2 },
	// { label: "Bell", value: 3, id: 3 },
];

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			//maxHeight: 300,
			//maxWidth: '160px !important',
			//minWidth: 'fit-content !important',
		}
	})
);
const HeaderPage = (props: HeaderPageProps) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const { gridData } = useAppSelector((state) => state.gridData);
	const { settingsData, costCodeDropdownData, divisionCostCodeFilterData, CostCodeAndTypeData } = useAppSelector(state => state.settings);
	const { isBudgetLocked, lineItemDescription } = useAppSelector(state => state.tableColumns);
	const costCodeDivisionOpts = useAppSelector(getCostCodeDivisionList);
	const costTypeOpts = useAppSelector(getCostTypeList);
	const costUnitOpts = useAppSelector(getCostUnitList);
	const [headerPageData, setHeaderPageData] = React.useState<any>(defaultData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);
	const [clearOriginalBudgetFields, setClearOriginalBudgetFields] = React.useState<boolean>(false);
	const appInfo = useAppSelector(getServer);
	const [localhost] = React.useState(isLocalhost);
	const [defaultFilters, setDefaultFilters] = React.useState<any>([])
	const [originalBudgetCatalogReadOnly, setOriginalBudgetCatalogReadOnly] = React.useState<any>({unitofMeasure: false,quantity: false,cost: false});
	const [originalBudgetCatalogData, setOriginalBudgetCatalogData] = React.useState<any>({unitOfMeasure: '',quantity: '',cost: ''});
	const [showWorkersDialog, setShowWorkersDialog] = React.useState<any>(false);
	const [laborSheetData, setLaborSheetData] = React.useState<any>([])
	React.useEffect(() => {
		if(appInfo) {
			fetchWorkPlannerCategories(appInfo).then((res: any) => {
				setLaborSheetData(res);
      		}).catch((error: any) => {
        		console.log("error", error);
      		});
		}
	},[appInfo]);
	React.useEffect(() => {
		let costTypeTimeList: any = [];
		let costTypeQuantityList: any = [];
		setTimeout(() => {
			props.onLineItemAdded && props.onLineItemAdded({ displayToast: false, message: '' });
		}, 3000);
		setDisableAddButoon(validate(headerPageData));
		if (settingsData.allowMultipleLineItems === false &&
			checkCostCodeAndCostTypeCombinationExistedInGridData(headerPageData.division,
				headerPageData.costCode, headerPageData.costType).includes(true)
		) setDisableAddButoon(true);

		const listManagerData = localhost ? settingcostcodetypeData?.values : CostCodeAndTypeData?.values;

		if (listManagerData?.length > 0) {
			listManagerData?.map((type: any) => {
				if (type?.name == 'Unit of Measure - Quantity') costTypeQuantityList = [...type?.listValues];
				if (type?.name == 'Unit of Measure - Time') costTypeTimeList = [...type?.listValues];
			});
		}
		['L - Labor', 'SVC - Professional Services'].includes(headerPageData?.costType) ? dispatch(setCostUnitList(costTypeTimeList)) : dispatch(setCostUnitList(costTypeQuantityList))

	}, [headerPageData]);

	const checkCostCodeAndCostTypeCombinationExistedInGridData = (division: string, code: string, type: string) => {
		return gridData.map((row: any, index: number) => {
			return row.division === division && row.costCode === code && row.costType === type ? true : false
		})
	}

	const handleOnChange = (value: any, name: string) => {
		console.log("changess", value, name)
		setClearOriginalBudgetFields(false);
		if (['costCode', 'costType'].includes(name)) {
			const costCodeTuple = value.split('|');
			const alreadyExistedCostCode = checkCostCodeAndCostTypeCombinationExistedInGridData(
				name === 'costCode' ? costCodeTuple[0] : headerPageData.division,
				name === 'costCode' ? costCodeTuple[1] : headerPageData.costCode,
				name === 'costType' ? value : headerPageData.costType);


			if (settingsData.allowMultipleLineItems === true && alreadyExistedCostCode.includes(true))
				props.onLineItemAdded && props.onLineItemAdded({ displayToast: true, message: 'Budget Line Item with the selected Cost Code and Cost Type already exists.' })
			//dispatch(setToastMessage({ displayToast: true, message: 'Budget Line Item with the selected Cost Code and Cost Type already exists.' }))

			if (settingsData.allowMultipleLineItems === false && alreadyExistedCostCode.includes(true))
				props.onLineItemAdded && props.onLineItemAdded({ displayToast: true, message: 'Budget Line Item with the selected Cost Code already exists. New Entry with the same Cost Code not allowed.' })
			//dispatch(setToastMessage({ displayToast: true, message: 'Budget Line Item with the selected Cost Code already exists. New Entry with the same Cost Code not allowed.' }))

			name === 'costCode' ? setHeaderPageData({ ...headerPageData, 'division': costCodeTuple[0], 'costCode': costCodeTuple[1] })
				: setHeaderPageData({ ...headerPageData, [name]: value });

		}
		else {
			setHeaderPageData({ ...headerPageData, [name]: value });
		}
	}

	const handleAdd = () => {
		// const costCodeTuple = headerPageData?.costCode?.split('|');
		console.log('headerPageData', headerPageData)		
		setClearOriginalBudgetFields(true);
		const data = {
			division: headerPageData?.division,
			costCode: headerPageData?.costCode,
			costType: headerPageData?.costType,
			estimatedStart: headerPageData?.startDate && headerPageData?.startDate !== "" ? new Date(headerPageData?.startDate)?.toISOString() : "",
			estimatedEnd: headerPageData?.endDate && headerPageData?.endDate !== "" ? new Date(headerPageData?.endDate)?.toISOString() : "",
			curve: headerPageData.curve,
			originalAmount: headerPageData?.originalBudgetAmount.amount,
			unitOfMeasure: headerPageData?.originalBudgetAmount.unitOfMeasure,
			unitQuantity: headerPageData?.originalBudgetAmount.quantity,
			unitCost: headerPageData?.originalBudgetAmount.cost,
			status: 0,
			description: lineItemDescription ? lineItemDescription : '',
			equipmentManufacturer: originalBudgetCatalogData?.equipmentManufacturer,
			equipmentManufacturerId: originalBudgetCatalogData?.equipmentManufacturerId,
			equipmentModel: originalBudgetCatalogData?.equipmentModel,
			equipmentCatalogId: originalBudgetCatalogData?.equipmentCatalogId,

		}
		console.log('dataAfterAdd', data)
		const dataAfterAdd = {
			...defaultData,
			costCode: headerPageData?.costCode,
			division: headerPageData?.division,
			startDate: headerPageData?.startDate,
			endDate: headerPageData?.endDate,
		};

		addBudgetLineItem(appInfo, data, (response: any) => {
			// dispatch(fetchGridData(appInfo));
			setDisableAddButoon(true);
			setHeaderPageData(dataAfterAdd);
			//if (props.onLineItemAdded) props.onLineItemAdded({ displayToast: true, message: 'Budget Line Item added successfully' });
			dispatch(setToastMessage({ displayToast: true, message: 'Budget Line Item added successfully' }))
		});
		dispatch(setLineItemDescription(''));
	};
	const handleCatalogSubmit = () => {
		// if (isLocalhost) {
		// 	let catalogData = {
		// 		unitOfMeasure: 'lf',
		// 		quantity: 10,
		// 		cost: 50
		// 	};
		// 	setOriginalBudgetCatalogData(catalogData);
		// 	setOriginalBudgetCatalogReadOnly({
		// 		unitofMeasure: true,
		// 		quantity: false,
		// 		cost: true
		// 	});
		// } else {
			['E - Equipment', 'M - Materials', 'M - Material']?.includes(headerPageData?.costType) && postMessage({
				event: 'opencatalog',
				body: {
					data: {
						skuType: "SingleCatalog",
						singleQuantity: true
					}
				}
			});
			console.log("headerPageData", headerPageData?.costType)
			headerPageData?.costType == 'L - Labor' && setShowWorkersDialog(true);
		// }
	};
	const handleLaborSheet = (data:any) => {
		setShowWorkersDialog(false);
		setOriginalBudgetCatalogData({...originalBudgetCatalogData, ['cost'] : data?.defaultHourlyRate});
	};
	useEffect(() => {
    	window.addEventListener("message",(event: any) => {
			let data = event.data;
			data = typeof data == "string" ? JSON.parse(data) : data;
			data = data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
			if (data) {
			switch (data.event || data.evt) {
				case "save-catalog":
				if (data.data) {
					let catObj = JSON.parse(data.data)?.[0] || {};
					let catalogData = {
						unitOfMeasure: '',
						quantity: catObj.quantity,
						cost: catObj.price,
						equipmentManufacturer: catObj?.type == 1 ? catObj?.distributorName : catObj?.manufacturer?.name,
						equipmentManufacturerId: catObj?.type == 1 ? catObj?.distributorId : catObj?.manufacturer?.id,
						equipmentModel: catObj?.sku,
						equipmentCatalogId: catObj?.id
					};
					setOriginalBudgetCatalogData(catalogData);
					// setOriginalBudgetCatalogReadOnly({
					// 	unitofMeasure: true,
					// 	quantity: true,
					// 	cost: true
					// })
				}
				break;
			}}
		},false);
  	}, []);
	return (
		<MuiGrid container spacing={2} className="headerContent" >
			<MuiGrid item xl={3} lg={3} md={3} sm={6} xs={6}>
				{/* <CostCodeDropdown
					outSideOfGrid={true}
					label="Division/Cost Code"
					options={costCodeDivisionOpts?.length > 0 ? costCodeDivisionOpts : []}
					required={true}
					selectedValue={headerPageData.division && headerPageData.costCode ? headerPageData.division + '|' + headerPageData.costCode : ''}
					startIcon={
						<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
						// <GridViewIcon fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor />
					}
					checkedColor={'#0590cd'}
					onChange={(value) => handleOnChange(value, 'costCode')}
					showFilter={true}
					sx={{
						".MuiSelect-icon": {
							display: "none",
						}
					}}
					displayEmpty={true}
					Placeholder={'Select'}
				/> */}
				<CostCodeSelect
					label="Division/Cost Code"
					options={costCodeDropdownData?.length > 0 ? costCodeDropdownData : []}
					onChange={(value:any) => handleOnChange(value, 'costCode')}
					required={true}
					startIcon={<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>}
					checkedColor={'#0590cd'}
					showFilter={false}
					selectedValue={headerPageData.division && headerPageData.costCode ? headerPageData.division + '|' + headerPageData.costCode : ''}
					Placeholder={'Select'}
					outSideOfGrid={true}
					showFilterInSearch={true}
					filteroptions={divisionCostCodeFilterData.length > 0 ? divisionCostCodeFilterData : []}
					onFiltersUpdate={(filters:any) => setDefaultFilters(filters)}
					defaultFilters={defaultFilters}
					disabled={isBudgetLocked}
				/>

			</MuiGrid>
			<MuiGrid item xl={2} lg={2} md={2} sm={6} xs={6}>
				<SmartDropDown
					LeftIcon={
						<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
						// <GridView fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />
					}
					options={costTypeOpts?.length > 0 ? costTypeOpts : []}
					dropDownLabel="Cost Type"
					isSearchField
					required
					outSideOfGrid={true}
					selectedValue={headerPageData.costType}
					isFullWidth
					handleChange={(value: any) => handleOnChange(value[0], 'costType')}
					menuProps={classes.menuPaper}
					displayEmpty={true}
					Placeholder={'Select'}
					ignoreSorting={true}
					disabled={isBudgetLocked}
				/>
			</MuiGrid>
			<MuiGrid item xl={1.5} lg={1.5} md={1.5} sm={6} xs={6} sx={{ color: '#333333!important' }} className='datepicker-Section'>
				<InputLabel className="inputlabel">Est. Start Date</InputLabel>
				{/* <span className='budget-Date-1'></span> */}
				<DatePickerComponent
					defaultValue={headerPageData.startDate}
					onChange={(val: any) => handleOnChange(val, 'startDate')}
					maxDate={headerPageData.endDate !== '' ? new Date(headerPageData.endDate) : new Date('12/31/9999')}
					containerClassName={"iq-customdate-cont"}
					render={
						<InputIcon
							placeholder={"MM/DD/YYYY"}
							className={"custom-input rmdp-input"}
							style={{ background: '#f7f7f7' }}
						/>
					}
					disabled={isBudgetLocked}
				/>
			</MuiGrid>
			<MuiGrid item xl={1.5} lg={1.5} md={1.5} sm={6} xs={6} sx={{ color: '#333333!important' }} className='datepicker-Section'>
				<InputLabel className="inputlabel">Est. End Date</InputLabel>
				{/* <span className='budget-Date-1'></span> */}
				<DatePickerComponent
					defaultValue={headerPageData.endDate}
					onChange={(val: any) => handleOnChange(val, 'endDate')}
					minDate={new Date(headerPageData.startDate)}
					containerClassName={"iq-customdate-cont"}
					render={
						<InputIcon
							placeholder={"MM/DD/YYYY"}
							className={"custom-input rmdp-input"}
							style={{ background: '#f7f7f7' }}
						/>
					}
					disabled={isBudgetLocked}
				/>
			</MuiGrid>
			<MuiGrid item xl={1.5} lg={1.5} md={1.5} sm={6} xs={6}>
				<SmartDropDown
					// LeftIcon={<CalculateIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />}
					LeftIcon={<div className='common-icon-Curve' style={{ fontSize: '1.4rem' }}></div>}
					options={curveList}
					dropDownLabel="Curve"
					isSearchField={false}
					outSideOfGrid={true}
					isFullWidth
					selectedValue={headerPageData.curve !== null ? headerPageData.curve : ''}
					handleChange={(value: any) => handleOnChange(value, 'curve')}
					menuProps={classes.menuPaper}
					displayEmpty={true}
					Placeholder={'Select'}
					ignoreSorting={true}
					disabled={isBudgetLocked}
				/>
			</MuiGrid>
			<MuiGrid item xl={1.5} lg={1.5} md={1.5} sm={6} xs={6} sx={{ color: '#333333!important' }}>
				<OriginalBudget
					defaultValue={headerPageData?.originalBudgetAmount?.amount?.toLocaleString('en-US')}
					iconColor={globalStyles.primaryColor}
					clearBudgetFields={clearOriginalBudgetFields}
					unitList={costUnitOpts}
					onSubmit={(value) => handleOnChange(value, 'originalBudgetAmount')}
					onBlur={(value) => handleOnChange(value, 'originalBudgetAmount')}
					readOnly={false}
					disabled={isBudgetLocked}
					showCatalogBtn={['E - Equipment', 'M - Materials', 'M - Material']?.includes(headerPageData?.costType)}
					showLaborBtn={headerPageData?.costType === 'L - Labor'}				
					handleCatalogSubmit={() => handleCatalogSubmit()}
					data={originalBudgetCatalogData}
					textFieldReadonly={originalBudgetCatalogReadOnly}
				/>

			</MuiGrid>
			<MuiGrid item xl={1} lg={1} md={1} sm={6} xs={6} style={{ textAlign: "right", margin: "9px 0px 0px 0px" }}>
				<Button
					className='add-button'
					design="Transparent"
					disabled={isBudgetLocked ? true : disableAddButton ? true : false}
					onClick={handleAdd}
					style={{ background: globalStyles.primaryColor, color: "white" }}
				>
					+ Add
				</Button>
			</MuiGrid>
			{showWorkersDialog && <LaborSheetModel data={laborSheetData} handleSubmit={(values:any) => handleLaborSheet(values)} onClose={() => setShowWorkersDialog(false)}/>}
		</MuiGrid >

	)
}

export default HeaderPage;