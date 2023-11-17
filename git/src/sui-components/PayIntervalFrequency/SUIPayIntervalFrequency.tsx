import React, { Fragment, useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import SmartDropDown from "components/smartDropdown";
import { makeStyles, createStyles } from "@mui/styles";

import "./SUIPayIntervalFrequency.scss";
import convertDateToDisplayFormat from "utilities/commonFunctions";

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		datesMenuPaper: {
			maxWidth: "60px !important",
			width: "60px !important",
			maxHeight: "250px !important",
		},
		monthlyDropDownMenuPaper: {
			maxWidth: "80px !important",
			width: "80px !important",
		},
		weekOfMenuPaper: {
			maxWidth: "100px !important",
			width: "100px !important",
		},
		dayMenuPaper: {
			maxWidth: "110px !important",
			width: "110px !important",
		},
	})
);

const SUIPayIntervalFrequency = (props: any) => {
	const data = [
		{ title: "Real Time", isActive: true, id: "RealTime" },
		{ title: "Weekly", isActive: false, id: "Weekly" },
		{ title: "Monthly", isActive: false, id: "Monthly" },
	];


	const days = [
		{ title: "S", id: "Sunday" },
		{ title: "M", id: "Monday" },
		{ title: "T", id: "Tuesday" },
		{ title: "W", id: "Wednesday" },
		{ title: "T", id: "Thursday" },
		{ title: "F", id: "Friday" },
		{ title: "S", id: "Saturday" },
	];

	console.log("PayWhenPaid", props)

	const [listItems, setListItems] = useState<any>(data);
	const [sendOnChange, setSendOnChange] = useState<boolean>(false);
	const [intervalType, setIntervalType] = React.useState('Weekly');
	const [selectedDay, setSelectedDay] = React.useState(props?.defaultData?.weeklyPaymentDay);

	const [selectedMonthlyType, setSelectedMonthlyType] = React.useState<any>(props?.defaultData?.monthlyPaymentType);
	const [selectedWeek, setSelectedWeek] = React.useState(props?.defaultData?.monthlyPaymentWeek);
	const [datesArr, setDatesArr] = React.useState<any>([]);
	const [selectedMonthlyDate, setSelectedMonthlyDate] = React.useState<any>(props?.defaultData?.monthlyPaymentDay);
	const [selectedDayOfTheWeek, setSelectedDayOfTheWeek] = React.useState<any>(props?.defaultData?.monthlyPaymentWeekDay);
	const [endsOnDateForWeekly, setEndsOnDateForWeekly] = React.useState<any>(props?.defaultData?.monthlyPaymentEndsOn ? props?.defaultData?.monthlyPaymentEndsOn : props?.defaultData?.weeklyPaymentEndsOn ? props?.defaultData?.weeklyPaymentEndsOn : props?.endDate);
	const classes = useStyles();

	const handleChange = (event: any) => {
		setSelectedMonthlyType("")
		setSelectedWeek("")
		setSelectedMonthlyDate("");
		setSelectedDayOfTheWeek("");
		setSelectedDay("")
		setSendOnChange(true);
		console.log("eventeventevent", event, event.target.value)
		setIntervalType(event.target.value);
	};

	const weeklyToggleChange = (event: any) => {
		setSelectedDay(event.target.value);
		setSendOnChange(true)
	};

	useEffect(() => {
		let dates = [];
		for (let i = 1; i <= 31; i++) {
			dates.push({ label: i.toString(), value: i.toString() });
		}
		setDatesArr(dates);
	}, []);

	useEffect(() => {
		if (listItems && listItems.length > 0) {

			if (props?.defaultData?.payIntervalFrequency !== undefined || props?.defaultData?.payIntervalFrequency !== 'undefined') {
				console.log("payIntervalFrequency", props?.defaultData?.payIntervalFrequency)
				setIntervalType(props?.defaultData?.payIntervalFrequency);
			}
			setSelectedDay(props?.defaultData?.weeklyPaymentDay);
			setSelectedMonthlyType(props?.defaultData?.monthlyPaymentType);
			setSelectedWeek(props?.defaultData?.monthlyPaymentWeek);
			setSelectedMonthlyDate(props?.defaultData?.monthlyPaymentDay);
			setSelectedDayOfTheWeek(props?.defaultData?.monthlyPaymentWeekDay);
			props?.defaultData?.payIntervalFrequency == 'Weekly' ? setEndsOnDateForWeekly(props?.defaultData?.weeklyPaymentEndsOn) : setEndsOnDateForWeekly(props?.defaultData?.monthlyPaymentEndsOn);
		}
	}, [props?.defaultData]);

	//   useEffect(() => {console.log("intervalType", intervalType); 
	//   props?.defaultData?.payIntervalFrequency && setIntervalType(props?.defaultData?.payIntervalFrequency);  
	//  }, [props?.defaultData?.payIntervalFrequency])


	useEffect(() => {
		if (sendOnChange) {
			if (intervalType == 'Weekly') {
				console.log("weekly", selectedDay)				
				if (selectedDay && selectedDay != "" && (endsOnDateForWeekly && endsOnDateForWeekly != '') || props?.endDate) {
					props?.onChange({
						"payIntervalFrequency": "Weekly",
						"weeklyPaymentEndsOn": endsOnDateForWeekly ? endsOnDateForWeekly : props?.endDate,
						"weeklyPaymentDay": selectedDay,
					})
				}
			}
			if (intervalType == 'RealTime') { 
				props?.onChange({
					"payIntervalFrequency": "RealTime",
				})
			}
			else {
				const commonKeys = {
					"payIntervalFrequency": "Monthly",
					"monthlyPaymentEndsOn": endsOnDateForWeekly ? endsOnDateForWeekly : props?.endDate,
				}
				if (selectedMonthlyType == 'Day') {
					if (selectedWeek != "" && selectedDayOfTheWeek != "") props?.onChange({
						"monthlyPaymentType": "Day",
						"monthlyPaymentWeek": selectedWeek,
						"monthlyPaymentWeekDay": selectedDayOfTheWeek,
						...commonKeys
					})
				}
				else {
					if (selectedMonthlyDate && selectedMonthlyDate != '') props?.onChange({
						"monthlyPaymentType": "Date",
						"monthlyPaymentDay": selectedMonthlyDate?.[0],
						...commonKeys
					})

				}
			}
		}
	}, [selectedDay, selectedMonthlyType, intervalType, endsOnDateForWeekly, selectedWeek, selectedDayOfTheWeek, selectedMonthlyDate])

	const WeeklyToggleComponent = () => {
		return (
			<ToggleButtonGroup
				color="primary"
				value={selectedDay}
				exclusive
				onChange={weeklyToggleChange}
			>
				{(days || []).map((day: any) => {
					return (
						<ToggleButton key={day.id} value={day.id} disabled={props?.readOnly} >
							{day.title}
						</ToggleButton>
					);
				})}
			</ToggleButtonGroup>
		);
	};

	const MonthlyComponent = () => {
		return (
			<div className="sui-pay-interval-frequency_monthly-wrapper">
				<div style={{ width: "80px", minWidth: "80px" }}>
					<SmartDropDown
						LeftIcon={<div className="budget-info-icon budget-Curve"></div>}
						options={[
							{ label: "Day", value: "Day" },
							{ label: "Date", value: "Date" },
						]}
						outSideOfGrid={true}
						isReadOnly={props?.readOnly}
						isSearchField={false}
						isFullWidth
						selectedValue={selectedMonthlyType}
						menuProps={classes.monthlyDropDownMenuPaper}
						ignoreSorting={true}
						handleChange={(selectedVal: any) => {
							setSelectedMonthlyType(selectedVal?.[0]);
							setSendOnChange(true);
						}}
					/>
				</div>
				{selectedMonthlyType === "Day" && (
					<>
						<div style={{ width: "100px", minWidth: "100px" }}>
							<SmartDropDown
								LeftIcon={<div className="budget-info-icon budget-Curve"></div>}
								options={[
									{ label: "First", value: "First" },
									{ label: "Second", value: "Second" },
									{ label: "Third", value: "Third" },
									{ label: "Fourth", value: "Fourth" },
								]}
								outSideOfGrid={true}
								isSearchField={false}
								isFullWidth
								isReadOnly={props?.readOnly}
								selectedValue={selectedWeek}
								menuProps={classes.weekOfMenuPaper}
								ignoreSorting={true}
								handleChange={(selectedVal: any) => {
									setSelectedWeek(selectedVal?.[0]);
									setSendOnChange(true);
								}}
							/>
						</div>
						<div style={{ width: "110px", minWidth: "110px" }}>
							<SmartDropDown
								LeftIcon={<div className="budget-info-icon budget-Curve"></div>}
								options={[
									{ label: "Monday", value: "Monday" },
									{ label: "Tuesday", value: "Tuesday" },
									{ label: "Wednesday", value: "Wednesday" },
									{ label: "Thursday", value: "Thursday" },
									{ label: "Friday", value: "Friday" },
									{ label: "Saturday", value: "Saturday" },
									{ label: "Sunday", value: "Sunday" },
								]}
								outSideOfGrid={true}
								isSearchField={false}
								isFullWidth
								isReadOnly={props?.readOnly}
								// disable={props?.readOnly}                            
								menuProps={classes.dayMenuPaper}
								selectedValue={selectedDayOfTheWeek}
								ignoreSorting={true}
								handleChange={(selectedVal: any) => {
									setSelectedDayOfTheWeek(selectedVal?.[0]);
									setSendOnChange(true)
								}}
							/>
						</div>
					</>
				)}
				{selectedMonthlyType === "Date" && (
					<div style={{ width: "60px" }}>
						<SmartDropDown
							// readOnly={props?.readOnly}            
							LeftIcon={<div className="budget-info-icon budget-Curve"></div>}
							options={datesArr}
							outSideOfGrid={true}
							isSearchField={false}
							ignoreSorting={true}
							isReadOnly={props?.readOnly}
							menuProps={classes.datesMenuPaper}
							selectedValue={selectedMonthlyDate}
							handleChange={(selectedVal: any) => {
								setSelectedMonthlyDate(selectedVal);
								setSendOnChange(true)
							}}
						/>
					</div>
				)}
				{selectedMonthlyType && (
					<div className="ends-on-cls">
						<span>of every month and Ends On</span>
						<DatePickerComponent
							readOnly={props?.readOnly}
							// disabled={props?.readOnly}            
							containerClassName={"iq-customdate-cont"}
							defaultValue={convertDateToDisplayFormat(endsOnDateForWeekly ? endsOnDateForWeekly : props?.endDate)}
							minDate={new Date()}
							onChange={(date: any) => {
								setEndsOnDateForWeekly(date);
								setSendOnChange(true)
							}}
							render={
								<InputIcon
									placeholder={"MM/DD/YYYY"}
									className={"custom-input rmdp-input"}
									style={{ background: "#f7f7f7" }}
								/>
							}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<ul className="sui-pay-interval-frequency">
			<RadioGroup
				name="sui-pay-interval-group"
				value={intervalType !== undefined || intervalType !== 'undefined' ? intervalType : ''}
				onChange={handleChange}
			>
				{(listItems || []).map((rec: any) => {
					return (
						<div className="sui-pay-interval-frequency_item">
							<FormControlLabel
								value={rec.id}
								control={<Radio />}
								label={rec.title}
								disabled={props?.readOnly}
							/>
							{intervalType === "Weekly" && rec.id === "Weekly" && (
								<div className="sui-pay-interval-frequency_weekly-wrapper">
									Select <WeeklyToggleComponent></WeeklyToggleComponent>
									<div className="ends-on-cls">
										<span>Ends on</span>
										<DatePickerComponent
											containerClassName={"iq-customdate-cont"}
											readOnly={props?.readOnly}
											defaultValue={convertDateToDisplayFormat(endsOnDateForWeekly ? endsOnDateForWeekly : props?.endDate)}
											minDate={new Date()}
											onChange={(date: any) => {
												setEndsOnDateForWeekly(date)
												setSendOnChange(true)
											}}
											render={
												<InputIcon
													placeholder={"MM/DD/YYYY"}
													className={"custom-input rmdp-input"}
													style={{ background: "#f7f7f7" }}
												/>
											}
										/>
									</div>
								</div>
							)}
							{intervalType === "Monthly" && rec.id === "Monthly" && (
								<div className="sui-pay-interval-frequency_monthly">
									Select <MonthlyComponent></MonthlyComponent>
								</div>
							)}
						</div>
					);
				})}
			</RadioGroup>
		</ul>
	);
};
export default SUIPayIntervalFrequency;
