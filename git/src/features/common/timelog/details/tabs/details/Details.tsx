import React, { useState, memo, useEffect, useMemo } from 'react';
import './Details.scss';
import { useAppDispatch, useAppSelector, useHotLink } from 'app/hooks';
import DatePickerComponent from 'components/datepicker/DatePicker';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import TimeLogPicker from 'sui-components/TimeLogPicker/TimeLogPicker';
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { InputAdornment, InputLabel, TextField, TextFieldProps, Button } from '@mui/material';
import SmartDropDown from 'components/smartDropdown';
import Location from 'features/common/locationfield/LocationField';
import { fetchLocationData } from 'features/common/locationfield/LocationStore';
import { AppList, AppList_PostMessage, getPickerDefaultTime ,getDuration} from '../../../utils';
import SUIClock from 'sui-components/Clock/Clock';
import { getTime } from 'utilities/datetime/DateTimeUtils';
import { getSource, getTimeLogDateRange, getTimeLogStatus} from 'utilities/timeLog/enums';
import {setDetailsPayloadSave} from '../../../stores/TimeLogSlice';
import _ from "lodash";
import moment from "moment";


const details = (props: any) => {
	const dispatch = useAppDispatch();
	const image = "data:image/jpeg;base64,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";
	const thumbnail = "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqthumbnail/a1ec16cd64194fb8a28a3c58e4f9d8de";

	const [details, setDetails] = useState<any>({})
	const { selectedTimeLogDetails,DetailspayloadSave } = useAppSelector(state => state.timeLogRequest);
	const { sbsGridData, appsList } = useAppSelector((state) => state.sbsManager);
	const { levels = [], locations = [] } = useAppSelector(state => state.location);
	var tinycolor = require('tinycolor2');
	const [timeaddedoptions, setTimeAddedOptions] = useState<any>([]);
	const [sbsOptions, setSbsOptions] = useState<any>([]);
	const [defaultlocation, setdefaultlocation] = useState<any>([]);
	const [locationType, setLocationType] = useState<any>();
	const [locationValue, setlocationValue] = useState<any>('');
	const [timeadded, setTimeAdded] = useState<any>('');
	let statusbasedDisable = ['0','2'];
	useMemo(() => {
		const addLinksOptionsCopy = AppList(appsList);
		setTimeAddedOptions(addLinksOptionsCopy);
	}, [appsList]);

	useEffect(() => {
		const options = sbsGridData?.map((item: any) => {
			return { ...item, label: item?.name, value: item?.id }
		})
		setSbsOptions([...options]);
	}, [sbsGridData]);

	useEffect(() => {
		const data = {
			...selectedTimeLogDetails,
			userimage: image,
			stage: selectedTimeLogDetails?.smartItem?.stage ?  selectedTimeLogDetails?.smartItem?.stage  : 'N/A',
		}
		setDetails({ ...details, ...data })
	}, [selectedTimeLogDetails])

	useEffect(() => {
		const levelVal =
			locationType ??
			(selectedTimeLogDetails.locations && selectedTimeLogDetails.locations.length > 0
				? (selectedTimeLogDetails.locations[0].levelId || selectedTimeLogDetails.locations[0].id)
				: levels.length > 0
					? levels[levels.length - 1]?.levelId
					: undefined);
		setlocationValue(levelVal);
		dispatch(setDetailsPayloadSave({...DetailspayloadSave,['locationType'] : levelVal}))
	}, [selectedTimeLogDetails?.locations, levels, locationType]);


	useEffect(() => {
		if (locationType) {
			dispatch(fetchLocationData(locationType));
		}
	}, [locationType]);

	const handleFieldChange = (value: any, name: any) => {
		const data = { ...details, [name]: value };
		setDetails(data);
		dispatch(setDetailsPayloadSave({...DetailspayloadSave,[name]: value}))
	}

	const handleLocationChange = (newValues: any) => {
		const locations: any = [];
		newValues?.map((obj: any) => {
			!locations?.map((a: any) => a?.id)?.includes(obj?.id) && locations.push(obj);
		});
		setdefaultlocation(locations);
		dispatch(setDetailsPayloadSave({...DetailspayloadSave,['defaultLocation'] : locations}))
	};

	const handleMenu = (e: any) => {
		AppList_PostMessage(e)
		setTimeAdded(e?.displayField);
		//setDetails({ ...details, 'timeadded': e?.displayField ,'thumbnail' :e?.icon})
	};

	return (
		<div className='timelog-details'>
			<div className='timelog-details-box'>
				<div className='timelog-details-header'>
					<div className='title-action'>
						<span className='common-icon-details iconmodify'></span>
						<span className='title' style={{ marginLeft: '6px' }}>Details</span>
					</div>
				</div>
				{/* Resource Details Start */}
				<div className='timelog-details-subheader'>
					<div className='title-action'>
						<span className='title'>Resource Details</span>
					</div>
				</div>
				<div className='timelog-details-content-col4'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Name</div>
						<div className='timelog-info-data-box'>
							<span className="common-icon-ContactPicker iconmodify"></span>
							<span className="timelog-icon">
								<img src={details?.userimage} style={{ height: '28px', width: '28px', borderRadius: "50%" }} />
							</span>
							<span className='eventrequest-info-data'>
								{details?.user?.firstName + ' ' +details?.user?.lastName}
							</span>
						</div>
					</span>

					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Company</div>
						<div className='timelog-info-data-box'>
							<span className="common-icon-companies iconmodify"></span>
							<span className='client-contract-info-data'>{details?.company?.name}</span>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Email</div>
						<div className='timelog-info-data-box'>
							<span className="common-icon-email-message iconmodify"></span>
							<span className='client-contract-info-data'>{details?.user?.email}</span>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Phone Number</div>
						<div className='timelog-info-data-box'>
							<span className="common-icon-telephone-gray iconmodify"></span>
							<span className='client-contract-info-data'>{details?.user?.phone}</span>
						</div>
					</span>
				</div>
				{/* Resource Details End */}


				{/* Time Log Summary Start */}
				<div className='timelog-details-subheader'>
					<div className='title-action'>
						<span className='title'>Time Log Summary Section</span>
					</div>
				</div>
				<div className='timelog-details-content-col4'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Start Date</div>
						<div className='timelog-info-data-box'>
							<DatePickerComponent
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
								defaultValue={details?.startDate ? convertDateToDisplayFormat(details?.startDate) : ''}
								onChange={(val: any) => handleFieldChange(val, 'startDate')}
								disabled={(statusbasedDisable.includes(details?.status?.toString()))}
							/>
						</div>
					</span>

					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>End Date</div>
						<div className='timelog-info-data-box'>
							<DatePickerComponent
								containerClassName={"iq-customdate-cont"}
								render={
									<InputIcon
										placeholder={"MM/DD/YYYY"}
										className={"custom-input rmdp-input"}
									/>
								}
								defaultValue={details?.endDate ? convertDateToDisplayFormat(details?.endDate) : ''}
								onChange={(val: any) => handleFieldChange(val, 'endDate')}
								disabled={(statusbasedDisable.includes(details?.status?.toString()))}
							/>
						</div>
					</span>

					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Start Time</div>
						<div className='timelog-info-data-box'>
							<SUIClock
								onTimeSelection={(value: any) => {
									handleFieldChange(getTime(value), "startTime");
								}}
								disabled={(statusbasedDisable.includes(details?.status?.toString()))}
								defaultTime={moment.utc(details?.startTime).format('h:mm A') || ""}
								pickerDefaultTime={getPickerDefaultTime(details?.startTime, true)}
								placeholder={"HH:MM"}
								// actions={[]}
								ampmInClock={true}
							></SUIClock>

						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>End Time</div>
						<div className='timelog-info-data-box'>
							<SUIClock
								onTimeSelection={(value: any) => {
									handleFieldChange(getTime(value), "endTime");
								}}
								disabled={(statusbasedDisable.includes(details.status?.toString()))}
								defaultTime={moment.utc(details.endTime).format('h:mm A') || ""}
								pickerDefaultTime={getPickerDefaultTime(details?.endTime, true)}
								placeholder={"HH:MM"}
								// actions={[]}
								ampmInClock={true}
							></SUIClock>
						</div>
					</span>
				</div>
				<div className='timelog-details-content-col4'>	
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Duration</div>
						<div className='timelog-info-data-box'>
							<span className='common-icon-monthly iconmodify'></span>
							<span className='client-contract-info-data'>{getDuration(details?.duration)}</span>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Source</div>
						<div className='timelog-info-data-box'>
							<span className='common-icon-Workactivity iconmodify'></span>
							<span className='client-contract-info-data'>{getSource(details?.source)}</span>
						</div>
					</span>
				</div>
				{/* Time Log Summary End */}



				{/* Notes , timeadded and stage Start */}
				<div className='timelog-details-content-col1'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Notes</div>
						<div className='timelog-info-data-box'>
							<DescriptionField
								name='description'
								className='description-field'
								value={details?.notes}
								disabled={(statusbasedDisable.includes(details?.status?.toString()))}
								onChange={(e: any) => { handleFieldChange(e.target.value, 'notes') }}
							/>
						</div>
					</span>
				</div>
				<div className='timelog-details-content-col2'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Time Added To <span className='sublabel'>(optional)</span></div>
						<div className='timelog-info-data-box'>
							{details?.smartItem == '' || details?.smartItem == null ?
								<SmartDropDown
									name='resource'
									LeftIcon={<span className='common-icon-smartapp iconmodify'> </span>}
									options={timeaddedoptions}
									outSideOfGrid={true}
									isSearchField={false}
									isFullWidth
									Placeholder={'Select'}
									selectedValue={timeadded}
									isMultiple={false}
									isDropdownSubMenu={true}
									handleChange={(e: any) => { handleMenu(e) }}
								/>
								:
								<div className='timeaddedto'>
									<img className='img' src={details?.smartItem?.iconUrl ? details?.smartItem?.iconUrl : ''} />
									<span className='timeadded'>{details?.smartItem?.name}</span>
								</div>
							}
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Stage</div>
						<div className='timelog-info-data-box'>
							<span className='client-contract-info-data'>
								<Button
									variant='contained'
									style={{
										backgroundColor: 'brown',
										color: tinycolor('brown').isDark() ? 'white' : 'black',
									}}
									className='phaseButton'
								>
									{details?.stage}
								</Button>
							</span>
						</div>
					</span>
				</div>
				{/* Notes , timeadded and stage End */}
				{/* SBS Start */}
				<div className='timelog-details-subheader'>
					<div className='title-action'>
						<span className='title'>System Breakdown Structure (SBS)</span>
					</div>
				</div>
				<div className='timelog-details-content-col2'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>System Breakdown Structure <span className='sublabel'>(SBS)</span></div>
						<div className='timelog-info-data-box'>
							<SmartDropDown
								name='resource'
								LeftIcon={<span className='common-icon-system-breakdown iconmodify'> </span>}
								options={sbsOptions}
								outSideOfGrid={true}
								isSearchField={false}
								isFullWidth
								Placeholder={'Select'}
								selectedValue={details?.sbs}
								isMultiple={false}
								handleChange={(value: any) => handleFieldChange(value, 'sbs')}
							/>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Phase</div>
						<div className='timelog-info-data-box'>
							<TextField
								id="sbsPhase"
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<span className='common-icon-system-breakdown iconmodify'> </span>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position='start'>
											<span className='common-icon-phase'
												style={{
													backgroundColor: "#059cdf",
													color: "#fff",
													borderRadius:'10px'
												}}
											></span>
										</InputAdornment>
									)
								}}
								placeholder='Enter Phase'
								name='name'
								variant="standard"
								value={details?.sbsPhase !== null && details?.sbsPhase?.[0]['name']}
								onChange={(e: any) => handleFieldChange(e.target?.value, 'sbsPhase')}
								disabled={true}
							//onBlur={(e: any) => handleOnBlur('name')}
							/>
						</div>
					</span>
				</div>
				{/* SBS End */}
				{/* LBS Start */}
				<div className='timelog-details-subheader'>
					<div className='title-action'>
						<span className='title'>Location Breakdown Structure (LBS)</span>
					</div>
				</div>
				<div className='timelog-details-content-col2'>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Location Type</div>
						<div className='timelog-info-data-box'>
							<SmartDropDown
								options={
									levels?.map((level: any) => {
										return { label: level.name, value: level.levelId };
									}) || []
								}
								required={false}
								LeftIcon={
									<div className="common-icon-Location-filled iconmodify"></div>
								}
								isSearchField
								isFullWidth
								outSideOfGrid={false}
								selectedValue={locationValue}
								sx={{ fontSize: "18px" }}
								handleChange={(value: string | undefined | string[]) => {
									setLocationType(value);
								}}
							/>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Default Location</div>
						<div className='timelog-info-data-box'>
							<Location
								fullWidth
								hideLevel={true}
								multiple={true}
								options={locations}
								value={defaultlocation}
								onChange={(e, newValue) => { handleLocationChange(newValue) }}
								getOptionLabel={(option: any) => option?.text || ""}
							/>
						</div>
					</span>
				</div>
				{/* SBS End */}
			</div>
		</div>
	)
}
export default details;

const DescriptionField = memo((props: TextFieldProps) => {
	return <TextField
		fullWidth
		variant='standard'
		placeholder='Enter Description'
		sx={{
			'& .MuiInputBase-input': {
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}
		}}
		InputProps={{
			startAdornment: <InputAdornment position='start'>
				<div className='common-icon-adminNote' style={{ fontSize: '26px' }}></div>
			</InputAdornment>,
		}}
		{...props}
	/>;
});