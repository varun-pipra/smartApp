import './BidDetails.scss';

import { getCostUnitList, getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQToggle from 'components/iqtoggle/IQToggle';
import Toast from 'components/toast/Toast';
import { BudgetLineItemData } from 'data/bids/bidList';
import {
	fetchBudgetLineItems, getSelectedRecord
} from 'features/bidmanager/stores/BidManagerSlice';
import { patchBidPackage } from 'features/bidmanager/stores/gridAPI';
import { fetchGridData, setToastMessage } from 'features/bidmanager/stores/gridSlice';
import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import OriginalBudget from 'features/budgetmanager/orginalBudget/OrginalBudget';
import React, { useEffect, useMemo, useState } from 'react';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import BiddingCCEmails from 'resources/images/bidManager/BiddingCCEmails.svg';
import BiddingInstructions from 'resources/images/bidManager/BiddingInstructions.svg';
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';
import SUICalculator from 'sui-components/Calculator/Calculator';
import SUIClock from 'sui-components/Clock/Clock';
import DateTimeComponent from 'sui-components/DateTime/datetime';
import SUIEmailSelector from 'sui-components/Email/Email';
import SUILineItem from 'sui-components/LineItem/LineItem';
import SUINote from 'sui-components/Note/Note';
import TimePickerComponent from 'sui-components/TimePicker/TimePicker';
import convertDateToDisplayFormat, {
	convertTimeToDisplayFormat, getFormattedBudgetLineItems, getISOTime
} from 'utilities/commonFunctions';
import { addTimeToDate, getDate, getTime } from 'utilities/datetime/DateTimeUtils';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import {
	Box, Card, Chip, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MultiComboBox, MultiComboBoxItem } from '@ui5/webcomponents-react';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import Tooltip from "@mui/material/Tooltip";

const BidDetails = (props: any) => {
	const dispatch = useAppDispatch();
	const emptyBudgetRow = [{ name: '', revisedBudget: '' }]
	const appInfo = useAppSelector(getServer);
	const { BudgetLineItems, selectedRecord } = useAppSelector((state) => state.bidManager);
	const { showToastMessage } = useAppSelector((state) => state.bidManagerGrid);
	const bidLineItem = useAppSelector(getSelectedRecord);
	const [budgetLineItems, setBudgetLineItems] = React.useState<any>(getFormattedBudgetLineItems(BudgetLineItems))
	const containerStyle = useMemo(() => ({ width: "100%", height: "300px" }), []);
	const [selectedLineItem, setSelectedLineItem] = useState<any>({});
	const [bidDetailsFormData, setBidDetailsFormData] = useState<any>({ ...selectedRecord })
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [budgetLineItemsRowData, setBudgetLineItemsRowData] = React.useState<any>(emptyBudgetRow)
	const [newRecord, setNewRecord] = useState<any>({});
	const [enableAddbtn, setEnableAddbtn] = useState(false);
	const { teammembersByProjectData } = useAppSelector((state) => state.bidManager);

	const [openCalculator, setOpenCalculator] = React.useState<HTMLButtonElement | null>(null);

	const [calculatorData, setCalculatorData] = React.useState({
		unitOfMeasure: '',
		unitQuantity: '',
		unitCost: '',
	})

	const costUnitOpts = () => useAppSelector(getCostUnitList);

	React.useEffect(() => {
		if (BudgetLineItems.length) {
			const data = getFormattedBudgetLineItems(BudgetLineItems);
			setBudgetLineItems(data);
		}
	}, [BudgetLineItems]);

	React.useEffect(() => {
		setBidDetailsFormData({
			...selectedRecord,
			startTime: selectedRecord?.startDate ? getTime(selectedRecord?.startDate) : null,
			endTime: selectedRecord?.endDate ? getTime(selectedRecord?.endDate) : null,
			queryDeadLineTime: selectedRecord?.queryDeadLine ? getTime(selectedRecord?.queryDeadLine) : null,
			siteWalkthroughTime: selectedRecord?.siteWalkthrough ? getTime(selectedRecord?.siteWalkthrough) : null
		});
		setBudgetLineItemsRowData(selectedRecord?.budgetItems?.length ? [...emptyBudgetRow, ...selectedRecord?.budgetItems] : emptyBudgetRow);
	}, [selectedRecord]);

	const onLineItemSelectionChange = (val: any) => {
		if (Array.isArray(val) && val?.length > 0) {
			BudgetLineItems.forEach((obj: any) => {
				if (obj?.id == val[0]) {
					setNewRecord(obj);
				}
			});
			for (let optionList of budgetLineItems || []) {
				const selectedRec = optionList.options.find((childOption: any) => childOption.value === val[0]);
				if (selectedRec) {
					setEnableAddbtn(true);
					setSelectedLineItem({
						...selectedRec,
						budgetLine: selectedRec?.label,
						estimate: selectedRec?.colVal,
						value: selectedRec?.value
					});
				}
			}
		}
	};

	useEffect(() => {
		setColumnDefs(headers);
	}, [selectedLineItem, selectedRecord]);

	const headers = [
		{
			headerName: "Budget Line Item",
			field: "name",
			minWidth: 540,
			cellRenderer: (params: any) => {
				return params.node?.level == 0 && params.node.rowIndex === 0 ? (
          <SUIBudgetLineItemSelect
            lineItemlabel=""
            options={budgetLineItems}
            selectedValue={selectedLineItem?.value}
            multiSelect={false}
            showDescription={true}
            handleInputChange={(val: any) => onLineItemSelectionChange(val)}
          ></SUIBudgetLineItemSelect>
        ) : (
          <>
            {params.data.description ? (
              <Tooltip
                title={params.data.description}
                arrow={true}
                placement={"bottom"}
              >
                <span>
                  `${params.data?.name} $
                  {params.data?.costCode ? " - " + params.data?.costCode : ""} $
                  {params.data?.costType ? " - " + params.data?.costType : ""} `
                </span>
              </Tooltip>
            ) : (
              `${params.data?.name} ${
                params.data?.costCode ? " - " + params.data?.costCode : ""
              } ${params.data?.costType ? " - " + params.data?.costType : ""} `
            )}
          </>
        );
			},
		},
		{
			headerName: "Budget Estimate",
			field: "revisedBudget",
			minWidth: 100,
			type: "rightAligned",
			cellRenderer: (params: any) => {

				return params.node?.level == 0 && params.node.rowIndex === 0 ? (
					<div>
						<span style={{ color: '#333333' }}>{currencySymbol} &nbsp;</span>
						{params.node.rowIndex === 0 && amountFormatWithOutSymbol(selectedLineItem?.colVal)}
						{/* {params.data?.revisedBudget?.toLocaleString("en-US")} */}
					</div>
				) : params?.data?.name == 'Grand Total' ? (
					`${amountFormatWithSymbol(params.data?.revisedBudget)}`

				) : (
					<div
						onClick={(event: any) => {
							setOpenCalculator(event.currentTarget)
							setCalculatorData({
								unitOfMeasure: params?.data?.unitOfMeasure,
								unitQuantity: params?.data?.unitQuantity,
								unitCost: params?.data?.unitCost,
							})
						}}
					>
						<span style={{ color: '#333333' }}>{currencySymbol} &nbsp;</span>
						{/* {params.node.rowIndex === 0 && selectedLineItem?.colVal?.toLocaleString("en-US")} */}
						{amountFormatWithOutSymbol(params.data?.revisedBudget)}
					</div >
				);
			},

		},
	];

	const [columnDefs, setColumnDefs] = React.useState(headers);
	const bidDetailsValidation = (data: any) => {
		return data?.name == " " ? true : false
	};

	const getBudgetIds = (data: any) => {
		var ids: any = [];
		data?.forEach((obj: any, index: number) => {
			if (Object.keys(obj).includes('id')) ids = [...ids, { id: obj?.id }];
		});
		return ids;
	};

	const getEmails = (data: any) => {
		return data?.map((row: any) => {
			return { objectId: row?.objectId, email: row?.email }
		})
	};

	function preparePayload(bidDetailsFormDataClone: any) {
		return {
			budgetItems: [...getBudgetIds(bidDetailsFormDataClone?.budgetItems)],
			name: bidDetailsFormDataClone?.name,
			description: bidDetailsFormDataClone?.description,
			startDate: bidDetailsFormDataClone?.startDate ? addTimeToDate(bidDetailsFormDataClone?.startDate, bidDetailsFormDataClone?.startTime) : null,
			endDate: bidDetailsFormDataClone?.endDate ? addTimeToDate(bidDetailsFormDataClone?.endDate, bidDetailsFormDataClone?.endTime) : null,
			instructions: bidDetailsFormDataClone?.instructions,
			cCEmails: [...getEmails(bidDetailsFormDataClone?.cCEmails?.length > 0 ? bidDetailsFormDataClone?.cCEmails : [])],
			queryDeadLine: bidDetailsFormDataClone?.queryDeadLine ? addTimeToDate(bidDetailsFormDataClone?.queryDeadLine, bidDetailsFormDataClone?.queryDeadLineTime) : null,
			siteWalkthrough: bidDetailsFormDataClone?.siteWalkthrough ? addTimeToDate(bidDetailsFormDataClone?.siteWalkthrough, bidDetailsFormDataClone?.siteWalkthroughTime) : null,
			countdownEmails: Number(bidDetailsFormDataClone?.countdownEmails),
			intendToBidCountdown: Number(bidDetailsFormDataClone?.intendToBidCountdown),
			walkthroughNotes: bidDetailsFormDataClone?.walkthroughNotes,
			hasQueryDeadLine: bidDetailsFormDataClone?.hasQueryDeadLine,
			hasSiteWalkthrough: bidDetailsFormDataClone?.hasSiteWalkthrough,
		}
	};

	const handleOnChange = (name: any, value: any) => {
		let bidDetailsFormDataClone: any = {};
		if (['hasQueryDeadLine', 'hasSiteWalkthrough', 'hasIntendToBidCountdown', 'hasCountdownEmails'].includes(name)) {
			const obj = name == 'hasQueryDeadLine' ? {
				[name]: value,
				queryDeadLine: value ? bidDetailsFormData?.queryDeadLine ? bidDetailsFormData?.queryDeadLine : bidDetailsFormData?.endDate : null,
				queryDeadLineTime: value ? '12:00 AM' : null
			}
				: name == 'hasIntendToBidCountdown' ? { [name]: value, intendToBidCountdown: value ? 1 : 0 }
					: name == 'hasCountdownEmails' ? { [name]: value, countdownEmails: value ? 1 : 0 }
						: {
							[name]: value,
							siteWalkthrough: value ? bidDetailsFormData?.siteWalkthrough ? bidDetailsFormData?.siteWalkthrough : bidDetailsFormData?.endDate : null,
							siteWalkthroughTime: value ? '12:00 AM' : null
						}
			bidDetailsFormDataClone = { ...bidDetailsFormData, ...obj }
		}
		else {
			bidDetailsFormDataClone = { ...bidDetailsFormData, [name]: value };
		}
		setBidDetailsFormData(bidDetailsFormDataClone);

		if (['startDate', 'startTime', 'endDate', 'endTime', 'queryDeadLine', 'queryDeadLineTime', 'hasQueryDeadLine', 'siteWalkthrough', 'siteWalkthroughTime', 'hasSiteWalkthrough', 'instructions', 'walkthroughNotes', 'hasCountdownEmails', 'hasIntendToBidCountdown'].includes(name)) {
			const payload = preparePayload(bidDetailsFormDataClone);
			console.log('payload', payload)
			patchBidPackage(appInfo, selectedRecord?.id, payload).then(() => {
				dispatch(fetchGridData(appInfo));
			});
		}
	};

	const handleOnBlur = (name: any) => {
		const payload = preparePayload(bidDetailsFormData);
		patchBidPackage(appInfo, selectedRecord?.id, payload).then(() => {
			dispatch(fetchGridData(appInfo));
		});;
	}

	const onBudgetItemAdd = (obj: any) => {
		setSelectedLineItem(emptyBudgetRow[0]);
		setEnableAddbtn(false);
		const payload: any = preparePayload({ ...bidDetailsFormData, budgetItems: [...budgetLineItemsRowData] });
		patchBidPackage(appInfo, bidDetailsFormData?.id, payload).then((data: any) => {
			dispatch(fetchGridData(appInfo));
			dispatch(fetchBudgetLineItems(appInfo));
		});
	};

	const onRemoveBudgetItem = (id: any) => {
		const remainingbudgetItems: any = []
		bidDetailsFormData?.budgetItems.map((obj: any) => {
			if (obj?.id != id) {
				remainingbudgetItems.push(obj);
			}
		});
		const payload = preparePayload({ ...bidDetailsFormData, budgetItems: remainingbudgetItems });
		patchBidPackage(appInfo, bidDetailsFormData?.id, payload).then((data: any) => {
			dispatch(fetchGridData(appInfo));
			dispatch(fetchBudgetLineItems(appInfo));
		});
	};
	

	return (<div className='bidDetails-bidManager'>
		<Grid container direction={'row'} spacing={3}>
			<Grid item sm={11.6}>
				<p style={{ fontSize: 17, fontWeight: 'bold' }}>Bid Details</p>
			</Grid>
			<Grid item sm={11.9} mt={-2}>
				<InputLabel required className='inputlabel' sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red'
					}
				}}>Bid Package Name</InputLabel>
				<TextField
					id="bidPackage"
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Box component='img' alt='Delete' src={BidPackageName} className='image' width={22} height={22} color={'#666666'} />
							</InputAdornment>
						)
					}}
					placeholder='Enter Bid Package Name'
					name='name'
					variant="standard"
					value={bidDetailsFormData?.name}
					onChange={(e: any) => handleOnChange('name', e.target?.value)}
					onBlur={(e: any) => handleOnBlur('name')}
				/>
			</Grid>
			<Grid item sm={11.9}>
				<InputLabel className='inputlabel' style={{ marginBottom: '5px' }}>
					<DescriptionOutlinedIcon style={{ marginBottom: '-4px', marginRight: '7px' }} fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />
					Description
				</InputLabel>
				<TextField
					id="description"
					variant='outlined'
					fullWidth
					multiline
					minRows={2}
					maxRows={10}
					placeholder='Enter Description'
					name='description'
					value={bidDetailsFormData?.description}
					onChange={(e: any) => handleOnChange('description', e.target?.value)}
					onBlur={(e: any) => handleOnBlur('description')}
				/>
			</Grid>
			<Grid item sm={11.9}>
				<InputLabel style={{ display: 'flex' }}>
					<b className='inputlabel1'>Budget Line Item</b>&nbsp;<p className='inputlabel' style={{ marginTop: '0px' }}>(This estimates are reference only and will not be shared with the bidders.)</p>
				</InputLabel>
				<div style={containerStyle} className="budget-grid-cls">
					<SUILineItem
						headers={columnDefs}
						data={budgetLineItemsRowData}
						pinnedBottomRowConfig={{
							displayFields: {
								name: "Grand Total",
							},
							aggregateFields: ["revisedBudget"],
						}}
						enbleAddBtn={enableAddbtn}
						onAdd={(value: any) => onBudgetItemAdd(value)}
						onRemove={(value: any) => onRemoveBudgetItem(value)}
						newRecord={newRecord}
						actionheaderprop={{
							minWidth: 30,
							maxWidth: 80,
						}}
					/>
					<SUICalculator
						clearCalculator={true}
						unitList={useAppSelector(getCostUnitList)}
						openCalculator={openCalculator}
						closeCalculator={() => setOpenCalculator(null)}
						calculatorTitle="Bid Calculator"
						data={{
							unitOfMeasure: calculatorData.unitOfMeasure,
							quantity: calculatorData.unitQuantity,
							cost: calculatorData.unitCost
						}}
						textFieldReadonly={{
							unitofMeasure: true,
							quantity: true,
							cost: true
						}}
						hideCalculateButton={true}
					/>
				</div>
			</Grid>
			<Grid item sm={10} mt={-0.5}>
				<Grid container spacing={1}>
					<Grid item sm={5}>
						<InputLabel className='inputlabel'>Start Date</InputLabel>
						<Stack direction='row' spacing={2}>
							<DatePickerComponent
								defaultValue={bidDetailsFormData?.startDate ? getDate(bidDetailsFormData?.startDate) : ''}
								onChange={(val: any) => { handleOnChange('startDate', val ? new Date(val)?.toISOString() : val) }}
								maxDate={bidDetailsFormData?.endDate !== '' ? new Date(bidDetailsFormData?.endDate) : new Date('12/31/9999')}
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
							/>
							<SUIClock
								onTimeSelection={(value: any) => { handleOnChange("startTime", getTime(value)) }}
								disabled={false}
								defaultTime={bidDetailsFormData?.startTime == null ? '' : bidDetailsFormData?.startTime}
								placeholder={"HH:MM"}
							></SUIClock>
						</Stack>
					</Grid>
					<Grid item sm={5} ml={4}>
						<InputLabel className='inputlabel'>End Date</InputLabel>
						<Stack direction='row' spacing={2}>
							<DatePickerComponent
								defaultValue={bidDetailsFormData?.endDate ? getDate(bidDetailsFormData?.endDate) : ''}
								onChange={(val: any) => handleOnChange('endDate', val ? new Date(val)?.toISOString() : val)}
								minDate={new Date(bidDetailsFormData?.startDate)}
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
							/>
							<SUIClock
								onTimeSelection={(value: any) => { handleOnChange("endTime", getTime(value)) }}
								disabled={false}
								defaultTime={bidDetailsFormData?.endTime == null ? '' : bidDetailsFormData?.endTime}
								placeholder={"HH:MM"}
							></SUIClock>
						</Stack>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sm={11.9} ml={-0.3}>
				<InputLabel className='inputlabel' style={{ marginBottom: '5px' }}>
					<Box component='img' alt='BiddingInstructions' src={BiddingInstructions} className='image' width={25} height={25} color={'#666666'} style={{ marginBottom: '-4.2px', marginRight: '2px', marginLeft: '-3px' }} />
					Bidding Instructions
				</InputLabel>
				<SUINote
					notes={bidDetailsFormData?.instructions}
					onNotesChange={(value: any) => {
						handleOnChange("instructions", value);
					}}
				/>
			</Grid>
			<Grid item sm={11.9} ml={-0.3}>
				<SUIEmailSelector
					emailOptions={teammembersByProjectData}
					selectedEmailList={(values: any) => { handleOnChange("cCEmails", values) }}
					onBlur={(values: any) => { handleOnBlur("cCEmails") }}
					emailLabel={'Bidding CC Emails'}
					emailIcon={BiddingCCEmails}
					defaultSelectedValue={bidDetailsFormData?.cCEmails}
					width={'100%'}
				/>
			</Grid>
		</Grid>
		<InputLabel style={{ marginTop: '20px' }}>
			<b className='inputlabel1'>Pre-Bid Information</b>
		</InputLabel>
		<Grid container spacing={2} mt={2} className='pre-bid-info'>
			<Grid item sm={10}>
				<Grid container direction='row' spacing={1}>
					<Grid item sm={4}>
						<Stack direction='row'>
							<IQToggle
								checked={bidDetailsFormData?.hasQueryDeadLine}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleOnChange('hasQueryDeadLine', value) }}
								edge={'end'}
							/>
							<InputLabel className='inputlabel' style={{ marginLeft: '20px', marginTop: '2px' }}>
								Bid Query Deadline
							</InputLabel>
						</Stack>
					</Grid>
					<Grid item sm={5} mt={-4}>
						<InputLabel className='inputlabel'>Reply Before</InputLabel>
						<Stack direction='row' spacing={2}>
							<DatePickerComponent
								disabled={!bidDetailsFormData?.hasQueryDeadLine}
								defaultValue={bidDetailsFormData?.queryDeadLine ? getDate(bidDetailsFormData?.queryDeadLine) : ''}
								onChange={(val: any) => handleOnChange('queryDeadLine', val ? new Date(val)?.toISOString() : val)}
								minDate={bidDetailsFormData?.startDate == null ? '' : new Date(bidDetailsFormData?.startDate)}
								maxDate={bidDetailsFormData?.endDate == null ? '' : new Date(bidDetailsFormData?.endDate)}
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
							/>
							<SUIClock
								onTimeSelection={(value: any) => { handleOnChange("queryDeadLineTime", getTime(value)) }}
								disabled={!bidDetailsFormData?.hasQueryDeadLine}
								defaultTime={bidDetailsFormData?.queryDeadLineTime == null ? '' : bidDetailsFormData?.queryDeadLineTime}
								placeholder={"HH:MM"}
							></SUIClock>
						</Stack>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sm={10} mt={5}>
				<Grid container direction='row' spacing={1}>
					<Grid item sm={4}>
						<Stack direction='row'>
							<IQToggle
								checked={bidDetailsFormData?.hasSiteWalkthrough}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleOnChange('hasSiteWalkthrough', value) }}
								edge={'end'}
							/>
							<InputLabel className='inputlabel' style={{ marginLeft: '20px', marginTop: '2px' }}>
								Site Walkthrough
							</InputLabel>
						</Stack>
					</Grid>
					<Grid item sm={5} mt={-4}>
						<InputLabel className='inputlabel'>Scheduled at</InputLabel>
						<Stack direction='row' spacing={2}>
							<DatePickerComponent
								disabled={!bidDetailsFormData?.hasSiteWalkthrough}
								defaultValue={bidDetailsFormData?.siteWalkthrough ? getDate(bidDetailsFormData?.siteWalkthrough) : ''}
								onChange={(val: any) => handleOnChange('siteWalkthrough', val ? new Date(val)?.toISOString() : val)}
								minDate={bidDetailsFormData?.startDate == null ? '' : new Date(bidDetailsFormData?.startDate)}
								maxDate={bidDetailsFormData?.endDate == null ? '' : new Date(bidDetailsFormData?.endDate)}
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
							/>
							<SUIClock
								onTimeSelection={(value: any) => { handleOnChange("siteWalkthroughTime", getTime(value)) }}
								disabled={!bidDetailsFormData?.hasSiteWalkthrough}
								defaultTime={bidDetailsFormData?.siteWalkthroughTime == null ? '' : bidDetailsFormData?.siteWalkthroughTime}
								placeholder={"HH:MM"}
							></SUIClock>
						</Stack>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sm={10} className='walkthrough-notes-cls'>
				<Grid container direction='row'>
					<Grid item sm={4}></Grid>
					<Grid item sm={8}>
						<InputLabel className='inputlabel' style={{ marginBottom: '5px' }}>
							<Box component='img' alt='BiddingInstructions' src={BiddingInstructions} className='image' width={22} height={22} color={'#666666'} style={{ marginBottom: '-4px', marginRight: '2px' }} />
							Walkthrough Notes
						</InputLabel>
						<SUINote
							notes={bidDetailsFormData?.walkthroughNotes}
							disabled={!bidDetailsFormData?.hasSiteWalkthrough}
							onNotesChange={(value: any) => { handleOnChange("walkthroughNotes", value) }}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
		<InputLabel style={{ marginTop: '20px' }}>
			<b className='inputlabel1'>Settings</b>
		</InputLabel>
		<Grid container spacing={2} mt={2}>
			<Grid item sm={10}>
				<Grid container direction='row' spacing={1}>
					<Grid item sm={4}>
						<Stack direction='row'>
							<IQToggle
								checked={bidDetailsFormData?.hasCountdownEmails}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleOnChange('hasCountdownEmails', value) }}
								edge={'end'}
							/>
							<InputLabel className='inputlabel' style={{ marginLeft: '20px', marginTop: '2px' }}>
								Countdown Emails
							</InputLabel>
						</Stack>
					</Grid>
					<Grid item sm={5} mt={-4}>
						<InputLabel className='inputlabel'>
							No. of days before due date
						</InputLabel>
						<TextField
							disabled={!bidDetailsFormData?.hasCountdownEmails}
							id="dueData"
							type='number'
							InputProps={{
								startAdornment: (
									<CalendarMonthIcon fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor, marginRight: '10px' }} />
								)
							}}
							name='countdownEmails'
							variant="standard"
							value={bidDetailsFormData?.countdownEmails}
							onChange={(e: any) => handleOnChange("countdownEmails", e.target?.value)}
							onBlur={(e: any) => handleOnBlur('countdownEmails')}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item sm={10} mt={5}>
				<Grid container direction='row' spacing={1}>
					<Grid item sm={4}>
						<Stack direction='row'>
							<IQToggle
								checked={bidDetailsFormData?.hasIntendToBidCountdown}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleOnChange('hasIntendToBidCountdown', value) }}
								edge={'end'}
							/>
							<InputLabel className='inputlabel' style={{ marginLeft: '20px', marginTop: '2px' }}>
								Intent to Bid
							</InputLabel>
						</Stack>
					</Grid>
					<Grid item sm={5} mt={-4}>
						<InputLabel className='inputlabel'>
							No. of days after Posting Bid
						</InputLabel>
						<TextField
							disabled={!bidDetailsFormData?.hasIntendToBidCountdown}
							id="postingBid"
							type='number'
							InputProps={{
								startAdornment: (
									<CalendarMonthIcon fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor, marginRight: '10px' }} />
								)
							}}
							name='intendToBidCountdown'
							variant="standard"
							value={bidDetailsFormData?.intendToBidCountdown}
							onChange={(e: any) => handleOnChange("intendToBidCountdown", e.target?.value)}
							onBlur={(e: any) => handleOnBlur('intendToBidCountdown')}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</div>)
};

export default BidDetails;			