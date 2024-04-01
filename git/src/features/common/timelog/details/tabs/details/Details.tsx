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
import { postMessage } from "app/utils";
import SUIClock from 'sui-components/Clock/Clock';
import { getTime ,addTimeToDate} from 'utilities/datetime/DateTimeUtils';
import { getSource, getTimeLogDateRange, getTimeLogStatus} from 'utilities/timeLog/enums';
import {setDetailsPayloadSave,setSaveButtonEnable} from '../../../stores/TimeLogSlice';
import _, { valuesIn } from "lodash";
import { fetchAppsPermission} from '../../../stores/TimeLogAPI'
import moment from "moment";


const details = (props: any) => {
	const dispatch = useAppDispatch();

	const [details, setDetails] = useState<any>({})
	const { selectedTimeLogDetails,DetailspayloadSave,smartItemOptionSelected ,timelogAppsList} = useAppSelector(state => state.timeLogRequest);
	const { sbsGridData, appsList,phaseDropDownOptions } = useAppSelector((state) => state.sbsManager);
	const { levels = [], locations = [] } = useAppSelector(state => state.location);
	var tinycolor = require('tinycolor2');
	const [timeaddedoptions, setTimeAddedOptions] = useState<any>([]);
	const [sbsOptions, setSbsOptions] = useState<any>([]);
	const [defaultlocation, setdefaultlocation] = useState<any>([]);
	const [locationType, setLocationType] = useState<any>();
	const [locationValue, setLocationValue] = useState<any>('');
	const [timeadded, setTimeAdded] = useState<any>('');
	let statusbasedDisable = ['0','2']; // reported, Accepted
	const [startTimeErrorMessage ,setStartTimeErrorMessage] = useState<any>({disable:false,msg:''});
	const [endTimeErrorMessage ,setEndTimeErrorMessage] = useState<any>({disable:false,msg:''});

	useMemo(() => {
		const addLinksOptionsCopy = AppList(timelogAppsList);
		setTimeAddedOptions(addLinksOptionsCopy);
	}, [timelogAppsList]);

	useEffect(() => {
		const options = sbsGridData?.map((item: any) => {
			return { id : item?.uniqueid, label: item?.name, value: item?.uniqueid }
		})
		setSbsOptions([...options]);
	}, [sbsGridData]);

	useEffect(() => {
		const data = {
			...selectedTimeLogDetails,
			userimage: selectedTimeLogDetails?.user && selectedTimeLogDetails?.user?.icon,
			stage: selectedTimeLogDetails?.smartItem?.stage ?  selectedTimeLogDetails?.smartItem?.stage  : 'N/A',
		}
		setDetails(data)
		selectedTimeLogDetails?.location != null ?  
			setdefaultlocation(selectedTimeLogDetails?.location?.map((el: any) => {
				return { id: el.locationId, text: el.name };
			}) || [])
		: null;
	}, [selectedTimeLogDetails])



	useEffect(() => {
		if (locationType) {
			dispatch(fetchLocationData(locationType));
		}
	}, [locationType]);

	const checkTimeValidation = (startTime:any,endTime:any) => {
    const startTimeDate = new Date(startTime);
		const endTimeDate = new Date(endTime);
    if ((endTimeDate < startTimeDate) || (startTimeDate > endTimeDate)) {
				dispatch(setSaveButtonEnable(true));
				setStartTimeErrorMessage({disable:true,msg:'Start time cannot be Greater than End Time'});
				setEndTimeErrorMessage({disable:true,msg:'End time cannot be Lesser than Start Time'})
		}
		else{
			dispatch(setSaveButtonEnable(false));
			setStartTimeErrorMessage({disable:false,msg:''});
			setEndTimeErrorMessage({disable:false,msg:''});
		}
	}

	
	const handleFieldChange = (value: any, name: any) => {
        let data;
        let payload :any ;
        let APIpayload :any
		
        const startDate_data = name == 'startDate' ? value : details.startDate;
        const startTime_data = name == 'startTime' ? value : getTime(details.startTime); 
        const enddate_data = name == 'endDate' ? value : details.endDate;
        const endTime_data = name == 'endTime' ? value : getTime(details.endTime);

        if(name == 'startTime' || name == 'startDate'){
						const startTime = addTimeToDate(startDate_data,startTime_data);
						APIpayload = {['startTime']: moment(startTime).format("MM/DD/yyyy h:mm A")};
						payload = {['startTime']:startTime}
						data = { ...details, ['startDate']: startTime,...payload};
        }
        else if(name == 'endTime' || name == 'endDate'){
            const endTime = addTimeToDate(enddate_data,endTime_data);
            APIpayload = {['endTime']: moment(endTime).format("MM/DD/yyyy h:mm A")}
            payload = {['endTime']: endTime}

            data = { ...details,...payload,['endDate']: endTime};
				}
        else if(name == 'sbs'){
						const payload = value.map((data:any)=>{ return { id : data.value , name:data.label}})
            APIpayload = {['sbs'] : payload}
            data = { ...details ,[name] : value}
        }
        else if(name == 'sbsPhase'){
            APIpayload = {['sbsPhaseId'] : value?.uniqueId}
            data = { ...details, [name] : {id:value?.uniqueId ,name:value?.name}}
        }
        else{
             payload = {[name] : value}
             APIpayload = payload
            data = { ...details, ...payload };
				}
				checkTimeValidation(data.startTime,data.endTime);
        setDetails(data);
        dispatch(setDetailsPayloadSave({...DetailspayloadSave,...APIpayload}))
  }
	
	useEffect(() => {
		const levelVal =
			locationType ??
			(selectedTimeLogDetails.location && selectedTimeLogDetails.location.length > 0
				? (selectedTimeLogDetails.location[0].levelId || selectedTimeLogDetails.location[0].id)
				: levels.length > 0
					? levels[levels.length - 1]?.levelId
					: undefined);
			setLocationValue(levelVal);
	}, [selectedTimeLogDetails?.location, levels, locationType]);

	const handleLocationChange = (newValues: any) => {
		console.log('newValues',newValues)
		const locations: any = [];
		newValues?.map((obj: any) => {
			!locations?.map((a: any) => a?.id)?.includes(obj?.id) && locations.push(obj);
		});
		if (locations?.length > 0 ) {
				setdefaultlocation(locations);
				const payload = locations.map((value:any)=>{ return { id : value.uniqueId , name:value.text}})
				dispatch(setDetailsPayloadSave({...DetailspayloadSave,['location'] : payload}))
		}
	};

	useMemo(() => {
		if(!_.isEmpty(smartItemOptionSelected) ){
			const duplicate = [{...smartItemOptionSelected}]
			const addLinksOptions = AppList([...timelogAppsList,...duplicate]);
			setTimeAddedOptions(addLinksOptions);
			setTimeAdded(smartItemOptionSelected?.name);
			dispatch(setDetailsPayloadSave({...DetailspayloadSave,['smartItemId'] : smartItemOptionSelected?.id}))
		}
		else{
			const addLinksOptionsCopy = AppList([...timelogAppsList]);
			setTimeAddedOptions(addLinksOptionsCopy);
			setTimeAdded('');
		}
	}, [smartItemOptionSelected]); 

	const handleMenu = async(e: any) => {
		if(e?.isNew == true){
			const data = await fetchAppsPermission(e?.id);
			if(data.success == true && data.values == true){
					AppList_PostMessage(e);
			}
			else{
				console.log('not authorozed');
				///you are not authorized to create an item
			}
		}
		else{
			AppList_PostMessage(e);
		} 
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
						<div className='timelog-info-data-box time-log-summary'>
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
								maxDate={details?.endDate !== '' ? new Date(details?.endDate) : new Date('12/31/9999')}
							/>
						</div>
					</span>

					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>End Date</div>
						<div className='timelog-info-data-box time-log-summary'>
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
								minDate={new Date(details?.startDate)}
							/>
						</div>
					</span>

					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Start Time</div>
						<div className='timelog-info-data-box time-log-summary'>
							<SUIClock
								onTimeSelection={(value: any) => {									
									handleFieldChange(getTime(value), "startTime");
								}}
								disabled={(statusbasedDisable.includes(details?.status?.toString()))}
								defaultTime={getTime(details?.startTime) || ""}
								pickerDefaultTime={getTime(details?.startTime)}
								placeholder={"HH:MM"}
								// actions={[]}
								ampmInClock={true}
								error={startTimeErrorMessage.disable}
								errorText={startTimeErrorMessage.msg}
							></SUIClock>

						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>End Time</div>
						<div className='timelog-info-data-box time-log-summary'>
							<SUIClock
								onTimeSelection={(value: any) => {
									handleFieldChange(getTime(value), "endTime");
								}}             
								disabled={(statusbasedDisable.includes(details.status?.toString()))}
								defaultTime={getTime(details?.endTime) || ""}
								pickerDefaultTime={getTime(details?.endTime)}
								placeholder={"HH:MM"}
								// actions={[]}
								ampmInClock={true}
								error={endTimeErrorMessage.disable}
								errorText={endTimeErrorMessage.msg}
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
									disabled={details?.status == 2 ? true :false}
								/>
								:
								<div className='timeaddedto' onClick={()=>{postMessage({ event: 'openitem', body: { smartItemId: details?.smartItem?.id } });}}>
									<img className='img' src={details?.smartItem?.smartAppIcon ? details?.smartItem?.smartAppIcon : ''} />
									<span className='timeadded'>{details?.smartItem?.name}</span>
								</div>
							}
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Stage</div>
						<div className='timelog-info-data-box'>
							<span className='client-contract-info-data stage'>
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
								options={sbsOptions ? sbsOptions : []}
								outSideOfGrid={true}
								isSearchField={false}
								isFullWidth
								Placeholder={'Select'}
								selectedValue={details?.sbs?.map((item:any) => {return item?.id})}
								isMultiple={true}
								handleChange={(value: any) => {
									const filtered = sbsOptions.filter((item:any) => value.some((id:any) => id === item.id));
									handleFieldChange(filtered, 'sbs');
								}}
								disabled={details?.status == 2 ? true :false}
							/>
						</div>
					</span>
					<span className='timelog-info-tile'>
						<div className='timelog-info-label'>Phase</div>
						<div className='timelog-info-data-box'>
									
							<SmartDropDown
								LeftIcon={<div className="common-icon-phase"></div>}
								options={phaseDropDownOptions ? phaseDropDownOptions : []}
								outSideOfGrid={true}
								isSearchField={true}
								isFullWidth
								Placeholder={"Select"}
								selectedValue={[details?.sbsPhase?.name]}
								handleChange={(value: any) => {
										const selRec: any = phaseDropDownOptions.find(
											(rec: any) => rec.value === value[0]
										);
										handleFieldChange(selRec, "sbsPhase");
								}}
								ignoreSorting={true}
								showIconInOptionsAtRight={true}
								disabled={details?.status == 2 ? true :false}
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
										return { label: level?.name, value: level?.levelId };
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
									console.log('value',value)
									setLocationType(value);
								}}
								disabled={details?.status == 2 ? true :false}
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
								disabled={details?.status == 2 ? true :false}
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