import React from 'react';
import { Button, InputLabel } from "@mui/material";
import {memo, useMemo, useEffect, useState, useRef, useCallback} from 'react';
import DatePickerComponent from 'components/datepicker/DatePicker';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import './DateRange.scss';
const CustomDateRangeFilterComp = memo((props:any) => {
	const {dates, handleClearDatesFilter, handleApplyDatesFilter,fromLabel = "From", toLabel = "To", ...rest} = props;
	const [customDates, setCustomDates] = React.useState({
		startDate: "",
		endDate: ""
	});
	const handleClear = () => {
		setCustomDates({
			startDate: "",
			endDate: ""
		});
		handleClearDatesFilter();
	};
	const handleApply = () => {
		handleApplyDatesFilter(customDates);
	};
	return (
		
				<div className="iq-date-range-comp">
					<div className="iq-dates-container-cls">
						<div>
							<InputLabel className='inputlabel'>{fromLabel}</InputLabel>
								<DatePickerComponent
									showOtherDays={true}
									zIndex={9999}
									defaultValue={customDates?.startDate}
									containerClassName={"iq-customdate-cont"}
									maxDate={new Date()}
									onChange={(val: any) => setCustomDates({ ...customDates, ['startDate']: val })}
									render={
										<InputIcon
											placeholder={"MM/DD/YYYY"}
											className={"custom-input rmdp-input"}
											style={{ background: "#f7f7f7" }}
										/>
									}
								/>
						</div>
						<div>
							<InputLabel className='inputlabel'>{toLabel}</InputLabel>
								<DatePickerComponent
									showOtherDays={true}
									zIndex={9999}
									defaultValue={customDates?.endDate}
									containerClassName={"iq-customdate-cont"}
									maxDate={new Date()}
									onChange={(val: any) => setCustomDates({ ...customDates, ['endDate']: val })}
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
					<div className="iq-date-range-footer-cls">
						<Button variant="outlined" className="cancel-btn" onClick={() => handleClear()}>CANCEL</Button>
						<Button variant="outlined" className="apply-btn" onClick={() => handleApply()}>APPLY</Button>
					</div>
				</div>
	);
});

export default CustomDateRangeFilterComp;