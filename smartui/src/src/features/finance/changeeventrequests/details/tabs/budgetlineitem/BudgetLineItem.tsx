import { Nullable } from 'app/common/types';
import { isChangeEventClient, isChangeEventGC, isChangeEventSC } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQButton from 'components/iqbutton/IQButton';
import { ChangeEvent, MouseEvent, memo, useCallback, useState, useEffect } from 'react';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import SUIAlert from 'sui-components/Alert/Alert';
import SUINote from 'sui-components/Note/Note';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import './BudgetLineItem.scss';

import {
	Box, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, RadioGroup, Stack,
	TextField
} from '@mui/material';

import IQMenuButton from 'components/iqmenu/IQMenuButton';
import OriginalBudget from 'features/budgetmanager/orginalBudget/OrginalBudget';
import { getChangeEventById, getChangeEventList, setBudgetListItems, setChangeRequestDetails } from 'features/finance/changeeventrequests/stores/ChangeEventSlice';
import Grid from 'sui-components/Grid/Grid-copy';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import { getAmountAlignment } from 'utilities/commonutills';
import { budgetStateMap, getUpdatedCEAmount } from '../../../CERUtils';
import {
	acceptBudgetById, addBudgets, ignoreQuoteById,
	removeBudgetsById, reviseBydgetById, updateBudget
} from '../../../stores/ChangeEventAPI';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

interface IVendor {
	title?: string,
	id?: string,
	vendor?: {
		name?: string;
		id?: string;
		email?: string;
		phone?: string;
		thumbnail?: string;
		contractName?: string;
		pointOfContacts?: any;
		image?: { downloadUrl?: string; };
	};
};

interface IBudgetItem {
	id: string;
	name: string;
	division: string;
	costCode: string;
	costType: string;
	type: Nullable<number | string>;
	isReadonly?: boolean;
	contractAmount?: Nullable<number>;
	estimate?: any;
	updatedContractAmount?: Nullable<number>;
	quote?: any;
	estimateSource?: Nullable<string>;
	description?: any;
	vendorContract?: IVendor;
	submitBy?: string;
	status?: any;
	eventStatus: string;
	unitOfMeasure: string;
	quantity: Nullable<number>;
	unitCost: Nullable<number>;
	server?: any;
	onRemoveItem?: Function;
	onReviseItem?: Function;
	onAcceptItem?: Function;
	onCancelQuoteRequest?: Function;
	onBudgetDetailsChange?: Function;
};

const BudgetItemList = memo(() => {
	const dispatch = useAppDispatch();
	const [alert, setAlert] = useState<any>({ show: false, message: '' });
	const { currencySymbol, server } = useAppSelector((state) => state.appInfo);
	const { budgetListItems = [], sourceBudgetListItems = [], changeRequestDetails, currentChangeEventId } = useAppSelector(state => state.changeEventRequest);
	const isReadonly = isChangeEventClient() ? true : isChangeEventSC() && changeRequestDetails?.status !== 'AwaitingQuote' ? true : !['Draft', 'Revise', 'SentBackForRevision', 'QuoteReceived', 'Rejected']?.includes(changeRequestDetails?.status);
	const summaryValue = sourceBudgetListItems?.reduce((sumValue: number, currentObject: IBudgetItem) => sumValue += (currentObject?.status == 'QuoteReceived' ? currentObject?.quote?.amount : currentObject?.estimate?.amount || 0), 0) || 0;

	const handleRemoveBudgetItem = useCallback((id: string) => {
		if (budgetListItems?.length == 1) {
			setAlert({ show: true, message: 'There should be at least one budget.' });
		}
		else removeBudgetsById(currentChangeEventId, [{ id: id }], (response: any) => dispatch(getChangeEventById(changeRequestDetails?.id)));
	}, [changeRequestDetails]);

	const handleReviseBudgetItem = useCallback((id: string) => reviseBydgetById(changeRequestDetails?.id, id, (response: any) => { dispatch(getChangeEventById(changeRequestDetails?.id)); dispatch(getChangeEventList()); }), []);
	const handleAcceptBudgetItem = useCallback((id: string) => { acceptBudgetById(changeRequestDetails?.id, id, (response: any) => { dispatch(getChangeEventById(changeRequestDetails?.id)); dispatch(getChangeEventList()); }); }, []);
	const handleCancelQuoteRequest = useCallback((id: string) => { console.log("ignoreQuoteById", currentChangeEventId, id); ignoreQuoteById(changeRequestDetails?.id, id, (response: any) => { dispatch(getChangeEventById(changeRequestDetails?.id)); dispatch(getChangeEventList()); }) }, []);

	const handleWorkItemsDropdownClose = () => {
		const existedIds = sourceBudgetListItems?.map((obj: any) => obj?.id);
		const budgetListItemIds = budgetListItems?.map((item: any) => item?.id);
		const toBeAdded = budgetListItems?.filter((obj: any) => !existedIds?.includes(obj?.id));
		const newIds = toBeAdded?.map((obj: any) => { return { id: obj.id, estimateSource: 'EstimatedChangeAmount', description: null, estimate: null }; });
		const idsNeedToRemove: any = existedIds?.filter((id: string) => !budgetListItemIds?.includes(id))?.map((val: any) => { return { id: val }; });
		console.log("sourceBudgetListItems", sourceBudgetListItems, budgetListItems, toBeAdded, newIds, idsNeedToRemove);
		newIds?.length > 0 && addBudgets(currentChangeEventId, newIds, (response: any) => { dispatch(setChangeRequestDetails(response)); });
		if (existedIds?.length == 1 && newIds?.length == 0 && idsNeedToRemove == 1) setAlert({ show: true, message: 'There should be atleast one budget' });
		else idsNeedToRemove?.length > 0 && removeBudgetsById(currentChangeEventId, idsNeedToRemove, (response: any) => { dispatch(getChangeEventById(changeRequestDetails?.id)); });
	};

	const handleBudgetDetailsChange = (payload: any, budgetItemId: string) => {
		updateBudget(currentChangeEventId, budgetItemId, payload, (response: any) => {
			dispatch(setChangeRequestDetails(response));
		});
	};

	return <Box className='cer-budget-line-items'>
		<div className='title'>
			<span className='title-icon common-icon-Smartapp'></span>Budget Line Items
		</div>
		{!isReadonly && <div className='add-workitem-btn'>
			<AddWorkItem selected={sourceBudgetListItems.map((item: any) => item.id)} onClose={handleWorkItemsDropdownClose} />
		</div>}
		<Stack direction='column' className='cer-budget-list'>
			<Stack direction='column' className='list-section'>
				{sourceBudgetListItems?.length > 0 ? sourceBudgetListItems?.map((budget: any) => <BudgetItem
					key={`budget-item-${budget.id}`}
					isReadonly={isReadonly}
					server={server}
					eventStatus={changeRequestDetails?.status}
					onRemoveItem={handleRemoveBudgetItem}
					onReviseItem={handleReviseBudgetItem}
					onAcceptItem={handleAcceptBudgetItem}
					onCancelQuoteRequest={handleCancelQuoteRequest}
					onBudgetDetailsChange={handleBudgetDetailsChange}
					{...budget}
				/>) : ''}
			</Stack>
			{!isChangeEventSC() && <div className='summary-section'>
				<span className='summary-label'>Estimated Change Event Amount</span>
				<span className='summary-value'>{amountFormatWithSymbol(summaryValue)}</span>
			</div>}
		</Stack>
		{alert?.show && <SUIAlert
			open={true}
			DailogClose={true}
			onClose={() => {
				setAlert({ show: false, message: '' });
			}}
			title='Warning'
			contentText={<span>{alert?.message}</span>}
			showActions={false}
			onAction={() => setAlert({ show: false, message: '' })}
		/>}
	</Box>;
});

export default BudgetItemList;

const BudgetItem = memo(({ eventStatus, isReadonly, onRemoveItem, onReviseItem, onAcceptItem,
	onCancelQuoteRequest, onBudgetDetailsChange, server, ...budgetItem }: IBudgetItem) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [type, setType] = useState<string>(budgetItem?.estimateSource ? budgetItem?.estimateSource : 'EstimatedChangeAmount');
	const [submitBy, setSubmitBy] = useState<string>(budgetItem?.submitBy || '');
	const [description, setDescription] = useState<any>(budgetItem?.description);
	const statusNames = ['AwaitingAcceptance', 'Draft', 'Revise'];
	// const [isEstimatedReadonly, setEstimatedReadonly] = useState<boolean>((
	// 	isChangeEventGC() && statusNames.includes(eventStatus) ||
	// 		isChangeEventGC() && (eventStatus == 'QuoteReceived' && budgetItem?.status !== 'QuoteAccepted') ? false :
	// 		isChangeEventGC() && !['Draft', 'Revise'].includes(eventStatus)) || isChangeEventClient());
	const [showAlert, setShowAlert] = useState<any>({ show: false, message: '', title: '', type: null });
	const [quoteIgnored, setQuoteIgnored] = useState<boolean>(false);
	const [estimateValue, setEstimateValue] = useState<number>(budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.amount : budgetItem?.estimate?.amount || 0);
	const [specifyQuoteValue, setSpecifyQuoteValue] = useState<number>(budgetItem?.quote?.amount || 0);
	const isEstimatedReadonly = (isChangeEventGC()
		&& ((type !== 'EstimatedChangeAmount' && eventStatus !== 'AwaitingAcceptance' && (eventStatus == 'QuoteReceived' && budgetItem?.status == 'QuoteAccepted' ? false : true)) || (type === 'EstimatedChangeAmount' && !['Draft', 'Revise', 'QuoteReceived', 'AwaitingAcceptance', 'Rejected'].includes(eventStatus))));
	const isSubmitByReadonly = isChangeEventGC() && (budgetItem?.status == 'QuoteAccepted' || !['Draft', 'Revise', 'QuoteReceived'].includes(eventStatus));
	const isSpecifyQuoteReadonly = isChangeEventSC() && budgetItem?.status !== 'AwaitingQuote';
	const areButtonsVisible = isChangeEventGC() && budgetItem?.estimateSource === 'QuoteFromVendor' && budgetItem?.status === 'QuoteReceived';
	const isCancelButtonVisible = isChangeEventGC() && budgetItem?.estimateSource === 'QuoteFromVendor' && eventStatus === 'AwaitingTradeQuote';
	const quoteStateObject = budgetStateMap[(budgetItem?.status || '')];

	useEffect(() => {
		console.log("type after cNCEL", budgetItem, type, estimateValue);
		if (budgetItem?.estimateSource && type != budgetItem?.estimateSource) setType(budgetItem?.estimateSource);
		// setEstimateValue(budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.amount : budgetItem?.estimate?.amount || 0);
	}, [budgetItem])

	const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setType(value);
		setEstimateValue(0);
		onBudgetDetailsChange && onBudgetDetailsChange({ estimateSource: value }, budgetItem?.id);
	};

	const handleSubmitByChange = (value: any) => {
		setSubmitBy(value);
		onBudgetDetailsChange && onBudgetDetailsChange({ submitBy: new Date(value) }, budgetItem?.id);
	};

	const handleDescriptionChange = (value: any) => {
		setDescription(value);
		onBudgetDetailsChange && onBudgetDetailsChange({ description: value }, budgetItem?.id);
	};

	const handleEstimateChange = (event: any, type: string) => {
		const amountString = type == 'onBlur' ? event?.amount?.replaceAll(',', '') : event?.amount;
		const payload = type == 'onBlur' ? { estimate: { amount: Number(amountString) } } : { estimate: { amount: Number(amountString), quantity: event?.quantity ? Number(event?.quantity) : null, unitCost: event?.cost ? Number(event?.cost) : null } };
		setEstimateValue(amountString ? Number(amountString) : 0);
		onBudgetDetailsChange && onBudgetDetailsChange({ ...payload }, budgetItem?.id);
	};

	const handleSpecifyQuoteChange = (event: any, type: string) => {
		const amountString = type == 'onBlur' ? event?.amount?.replaceAll(',', '') : event?.amount;
		setSpecifyQuoteValue(amountString ? Number(amountString) : 0);
		const payload = type == 'onBlur' ? { quote: { amount: Number(amountString) } } : { quote: { amount: Number(amountString), quantity: event?.quantity ? Number(event?.quantity) : null, unitCost: event?.cost ? Number(event?.cost) : null } };
		onBudgetDetailsChange && onBudgetDetailsChange(payload, budgetItem?.id);
	};

	const showIgnoreQuoteAlert = useCallback(() => {
		setShowAlert({ show: true, message: 'Are you sure you want to Ignore the quote from vendor?', title: 'Confirmation', type: 'ignore' });
	}, []);

	const handleIgnoreBudgetItem = (event: MouseEvent<HTMLButtonElement>, option: string) => {
		if (option === 'yes') {
			if (showAlert?.type == 'accept') onAcceptItem && onAcceptItem(budgetItem?.id);
			if (showAlert?.type == 'revise') onReviseItem && onReviseItem(budgetItem?.id);
			if (showAlert?.type == 'ignore') {
				onCancelQuoteRequest && onCancelQuoteRequest(budgetItem?.id);
				setType('EstimatedChangeAmount');
				setSubmitBy('');
				setEstimateValue(0);
				setQuoteIgnored(true);
			}
			setShowAlert({ show: false, message: '', title: '', type: '' });
		}
		setShowAlert({ show: false, message: '', title: '', type: '' });
	};
	const handleCancelRequest = () => { 
		if (onCancelQuoteRequest) { 
			console.log("onCancelQuoteRequest", budgetItem); 
			onCancelQuoteRequest(budgetItem.id); 
			setSubmitBy('') 
		} 
	}

	return <Stack direction='column' className='cer-budget-list-item'>
		<div className='wi-info'>
			<span className='wi-info-icon common-icon-Smartapp'></span>
			Work Item &nbsp;<span className='wi-name'>{`${budgetItem?.name} - ${budgetItem?.division} - ${budgetItem?.costCode} - ${budgetItem?.costType}`}</span>
			<span className='wi-spacer'></span>
			{budgetItem?.estimateSource === 'QuoteFromVendor' && <span
				className='wi-status-label'
				style={{ backgroundColor: quoteStateObject?.bgColor }}
			>
				<span className={`wi-status-icon ${quoteStateObject?.icon}`}></span>
				{quoteStateObject?.text}
			</span>}
			{!isReadonly && <IconButton
				className='wi-close-btn'
				aria-label='Remove Work Item'
				onClick={() => onRemoveItem && onRemoveItem(budgetItem.id)}
			>
				<span className='common-icon-Cancel'></span>
			</IconButton>}
		</div>
		{(isChangeEventGC() || isChangeEventClient()) && <div className='wi-change-order-type'>
			<RadioGroup row
				name='estimateSource'
				className='wi-type-radio'
				value={type}
				onChange={handleTypeChange}
			>
				<FormControlLabel disabled={quoteIgnored === false ? isReadonly || budgetItem.status === 'QuoteAccepted' : false} value={'EstimatedChangeAmount'} control={<Radio />} label='Provide an Estimated Change Event' />
				<FormControlLabel disabled={quoteIgnored === false ? isReadonly || budgetItem.status === 'QuoteAccepted' || budgetItem?.vendorContract == null : false} value={'QuoteFromVendor'} control={<Radio />}
					label={
						<IQTooltip title={budgetItem?.vendorContract == null ? 'This budget Item has not been associated to a Vendor Yet and is not avaiable for selection.' : ''} placement={"bottom"}>
							<label>Request Quote from Vendor</label>
						</IQTooltip>
					}
				/>
			</RadioGroup>
		</div>}
		<div className='wi-vendor-info'>
			{isChangeEventSC() && <>
				<div className='wi-vendor-detail wi-vendor-contract'>
					<div className='wi-vendor-detail-label'>
						<span className='common-icon-vendor-contracts'></span>
						Vendor Contract
					</div>
					<div className='wi-vendor-detail-value'
						onClick={() => window.open(`${server?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/vendor-contracts/home?id=${budgetItem?.vendorContract?.id}#react`, '_blank')}
					>
						{budgetItem?.vendorContract?.title}
					</div>
				</div>
				<div className='wi-vendor-detail wi-specify-quote'>
					<div className='wi-vendor-detail-label'>Specify Quote Amount</div>
					<div className='wi-vendor-detail-value'>
						{/* {isSpecifyQuoteReadonly ? `${currencySymbol} ${' '} ${budgetItem?.quote?.amount?.toLocaleString('en-US') || 0}`
							: */}
						<OriginalBudget
							label={''}
							isRequired={true}
							placeholder='Enter Amount'
							defaultValue={specifyQuoteValue !== 0 ? specifyQuoteValue?.toLocaleString('en-US') : ''}
							iconColor={''}
							data={{
								unitOfMeasure: budgetItem?.unitOfMeasure,
								quantity: budgetItem?.quote?.quantity,
								cost: budgetItem?.quote?.unitCost
							}}
							readOnly={isSpecifyQuoteReadonly}
							disabled={isSpecifyQuoteReadonly}
							hideCalculateButton={isSpecifyQuoteReadonly}
							onSubmit={(value: any) => handleSpecifyQuoteChange(value, 'onCalculate')}
							onBlur={(value: any) => handleSpecifyQuoteChange(value, 'onBlur')}
							cleartheValue={false}
							textFieldReadonly={{
								unitofMeasure: true,
								quantity: isSpecifyQuoteReadonly,
								cost: isSpecifyQuoteReadonly,
							}}
						/>
						{/* } */}
					</div>
				</div>
			</>}
			{type === 'QuoteFromVendor' && !isChangeEventSC() && <>
				<div className='wi-vendor-detail wi-vendor-name'>
					<div className='wi-vendor-detail-label'>Vendor Name</div>
					<div className='wi-vendor-detail-value'>
						<img src={budgetItem?.vendorContract?.vendor?.image?.downloadUrl} />{budgetItem?.vendorContract?.vendor?.name}
					</div>
				</div>
				<div className='wi-vendor-detail wi-vendor-poc'>
					<div className='wi-vendor-detail-label'>Vendor Point of Contact</div>
					<div className='wi-vendor-detail-value'>
						<img src={budgetItem?.vendorContract?.vendor?.pointOfContacts?.[0]?.image?.downloadUrl} />{budgetItem?.vendorContract?.vendor?.pointOfContacts?.[0]?.name}
					</div>
				</div>
				{!isChangeEventClient() && <div className='wi-vendor-detail wi-submit-by'>
					<div className='wi-vendor-detail-label'>{budgetItem?.status == 'QuoteAccepted' ? 'Accepted Quote' : (quoteIgnored === false ? eventStatus !== 'QuoteReceived' : true) ? 'Submit By' : 'Quote Amount'}</div>
					<div className='wi-vendor-detail-value quote-amount'>
						{budgetItem?.status == 'QuoteAccepted' ? `${amountFormatWithSymbol(budgetItem?.quote?.amount)}` : (quoteIgnored === false ? isSubmitByReadonly : false) ? formatDate(budgetItem?.submitBy || '', { year: 'numeric', month: '2-digit', day: '2-digit' })
							: ((quoteIgnored === false ? eventStatus !== 'QuoteReceived' : true) ? <DatePickerComponent
								containerClassName='iq-customdate-cont'
								minDate={new Date()}
								maxDate={new Date('12/31/9999')}
								defaultValue={convertDateToDisplayFormat(new Date(submitBy))}
								onChange={handleSubmitByChange}
								render={
									<InputIcon
										placeholder='MM/DD/YYYY'
										className='custom-input rmdp-input'
										style={{ background: '#f7f7f7' }}
									/>
								}
							/> : `${amountFormatWithSymbol(budgetItem?.quote?.amount)}`)}
					</div>
				</div>}
			</>}
			<div className='wi-description'>
				<InputLabel className='description-label'>
					<span className='common-icon-adminNote'></span>
					Detailed Description for Change Event Request
				</InputLabel>
				{isReadonly ? <div className='wi-description-ro'>
					<span
						dangerouslySetInnerHTML={{
							__html: budgetItem?.description,
						}}
					></span>
				</div>
					: <SUINote
						notes={description}
						onNotesChange={handleDescriptionChange}
					/>}
			</div>
			{!isChangeEventSC() && <div className='wi-amount'>
				<div className='wi-amount-label'>Contract Amount</div>
				<div className='wi-amount-value'>
					{amountFormatWithSymbol(budgetItem?.contractAmount)}
				</div>
				<div className={type == 'QuoteFromVendor' ? 'disabledLabel' : 'wi-amount-label'}>Estimated CE Amount</div>
				<div className='wi-amount-value'>
					{type == 'QuoteFromVendor' && ['Active', 'AwaitingQuote'].includes(budgetItem.status) ?
						<>
							<TextField
								placeholder='Enter Amount'
								variant='standard'
								value={''}
								inputProps={
									{
										sx: {
											'&::placeholder': {
												color: '#059cdf52',
												opacity: 4, // otherwise firefox shows a lighter color
											},
										},
										readOnly: true,
										disabled: true,
									}
								}
							/>
						</>
						// :
						// isEstimatedReadonly ? `${currencySymbol} ${getAmountAlignment(budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.amount : budgetItem?.estimate?.amount) || 0}`
						: <OriginalBudget
							label={''}
							isRequired={!isEstimatedReadonly}
							placeholder='Enter Amount'
							defaultValue={budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.amount : estimateValue !== 0 ? estimateValue?.toLocaleString('en-US') : ''}
							iconColor={''}
							data={{
								unitOfMeasure: budgetItem?.unitOfMeasure,
								quantity: budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.quantity : budgetItem?.estimate?.quantity,
								cost: budgetItem?.status == "QuoteReceived" ? budgetItem?.quote?.unitCost : budgetItem?.estimate?.unitCost
							}}
							hideCalculateButton={eventStatus === 'AwaitingAcceptance' || isChangeEventClient() || isEstimatedReadonly}
							disableUnderline={eventStatus === 'AwaitingAcceptance' || isChangeEventClient() || isEstimatedReadonly}
							readOnly={eventStatus === 'AwaitingAcceptance' || isChangeEventClient() || isEstimatedReadonly}
							disabled={false}
							onSubmit={(value: any) => handleEstimateChange(value, 'onCalculate')}
							onBlur={(value: any) => handleEstimateChange(value, 'onBlur')}
							cleartheValue={false}
							textFieldReadonly={{
								unitofMeasure: true,
								quantity: eventStatus === 'AwaitingAcceptance' || isChangeEventClient() || isEstimatedReadonly ? true : false,
								cost: eventStatus === 'AwaitingAcceptance' || isChangeEventClient() || isEstimatedReadonly ? true : false
							}}
						/>
					}
				</div>
				<div className={['AwaitingQuote', 'Revise']?.includes(budgetItem?.status) ? 'disabledLabel' : 'wi-amount-label'}>Updated CE Amount</div>
				{
					<>
						{['AwaitingQuote', 'Revise']?.includes(budgetItem?.status) ?
							<div className='wi-amount-value2'>
								{amountFormatWithSymbol(0)}
							</div>
							:
							<div className='wi-amount-value'>
								{budgetItem && amountFormatWithSymbol(getUpdatedCEAmount(budgetItem))}
							</div>
						}
					</>
				}
			</div>
			}
		</div>
		{(areButtonsVisible || isCancelButtonVisible) && <div className='wi-buttons'>
			{ 
				isCancelButtonVisible && <IQButton color='orange' variant='outlined' onClick={() => handleCancelRequest()}>CANCEL REQUEST</IQButton>
			}
			{areButtonsVisible && <>
				<IQButton color='lightGrey' onClick={() => setShowAlert({ show: true, message: 'Would you like the Vendor to Revise & Re-submit the quote?', title: 'Confirmation', type: 'revise' })}>REVISE & SEND BACK</IQButton>
				<IQButton color='orange' variant='outlined' onClick={() => showIgnoreQuoteAlert()}>IGNORE QUOTE</IQButton>
				<IQButton color='orange' onClick={() => setShowAlert({ show: true, message: 'Are you sure you want to Accept this quote from vendor?', title: 'Accept Quote', type: 'accept' })}>ACCEPT QUOTE</IQButton>
			</>}
		</div>}
		{showAlert?.show && <SUIAlert
			open={true}
			title={showAlert?.title}
			contentText={<span>{showAlert?.message}</span>}
			onAction={handleIgnoreBudgetItem}
		/>}
	</Stack>;
});

const AddWorkItem = memo(({ selected = [], onClose }: { selected?: Array<any>; onClose?: Function; }) => {
	const dispatch = useAppDispatch();
	const [close, setClose] = useState<boolean>(true);
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<Array<string>>([]);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { workItemDropdownData = [] } = useAppSelector(state => state.changeEventRequest);

	const currencyRenderer = useCallback((context: any) => {
		if (!context.node.group)
			return amountFormatWithSymbol(context.value)
	}, []);

	const handleFirstDataRendered = (event: any) => {
		try {
			event.api.forEachNode((node: any) => {
				node.setSelected(!node.group && selected.includes(node.data?.id), false);
			});
		} catch (e) { console.log(e); }
	};

	const handleSelectionChange = (grid: any) => {
		const records = grid.api.getSelectedRows();
		dispatch(setBudgetListItems(records));
	};

	const handleFilter = (value: string) => {
		let newList = [];
		if (filter.indexOf(value) > -1) {
			newList = filter.filter((division: string) => division !== value);
		} else {
			newList = filter.concat(value);
		}

		setFilter(newList.sort());
	};

	const columns = [{
		headerName: 'Work Item',
		field: 'division',
		hide: true,
		rowGroup: true,
		resizable: false,
		suppressMenu: true
	}, {
		headerName: 'Contract Amount',
		field: 'contractAmount',
		suppressMenu: true,
		resizable: false,
		type: 'rightAligned',
		minWidth: 145,
		cellRenderer: currencyRenderer
	}, {
		headerName: 'UOM',
		field: 'unitOfMeasure',
		suppressMenu: true,
		resizable: false,
		maxWidth: 85
	}, {
		headerName: 'Unit Quantity',
		field: 'quantity',
		suppressMenu: true,
		resizable: false,
		type: 'rightAligned',
		maxWidth: 120,
		cellRenderer: useCallback((context: any) => {
			if (!context.node.group)
				return `${context.value?.toLocaleString('en-US') || 0}`;
		}, [])
	}, {
		headerName: 'Unit Cost',
		field: 'unitCost',
		suppressMenu: true,
		resizable: false,
		type: 'rightAligned',
		maxWidth: 110,
		cellRenderer: currencyRenderer
	}];

	const filterSet = new Set([...workItemDropdownData.map((item: any) => item.division)]);
	const filterList = Array.from(filterSet).map((division: any) => {
		return {
			text: division,
			value: division,
			key: division
		};
	});

	const modifiedList = workItemDropdownData.filter((workItem: any) => {
		const regex = new RegExp(search, 'gi');
		return (!search || (search && (`${workItem.contractAmount}`?.match(regex) || workItem.name?.match(regex) ||
			workItem.costType?.match(regex) || workItem.costCode?.match(regex) ||
			workItem.division?.match(regex) || workItem.unitOfMeasure?.match(regex) ||
			workItem.description?.match(regex)))) && (filter.length === 0 || (filter.length > 0 && filter.indexOf(workItem.division) > -1));
	});

	return <IQMenuButton
		label='Add Work Item'
		startIcon={<span className='common-icon-Add'></span>}
		endIcon={<span className='common-icon-down-arrow'></span>}
		close={close}
		onClose={onClose}
	>
		<Stack className='cer-add-work-item'>
			<div className='title-bar'>
				<span className='title-cls'>Selected Work Items</span>
				<IconButton
					aria-label='Close'
					onClick={() => setClose(prevValue => !prevValue)}
				>
					<span className='close-icon common-icon-close'></span>
				</IconButton>
			</div>
			<div className='search-filter'>
				<TextField
					fullWidth
					autoComplete='off'
					value={search}
					onChange={(e: any) => setSearch(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position='end'>
							<IQMenuButton
								type='icon'
								className='filter-icon-btn'
								icon={<span className='common-icon-Filter'></span>}
								menuProps={{
									anchorOrigin: {
										vertical: 'bottom',
										horizontal: 'right'
									},
									transformOrigin: {
										vertical: 'top',
										horizontal: 'right'
									}
								}}
							>
								<List className='cer-add-work-filter' sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
									<ListItem className='title-item'>Filter By</ListItem>
									<ListItem disablePadding>
										<ListItemButton
											dense
											role={undefined}
											className='clear-item'
											onClick={() => setFilter([])}
										>
											Clear
										</ListItemButton>
									</ListItem>
									{filterList.map((el) => {
										const labelId = `checkbox-list-label-${el.key}`;
										return <ListItem
											key={el.value}
											disablePadding
										>
											<ListItemButton
												dense
												role={undefined}
												onClick={() => handleFilter(el.value)}
											>
												<ListItemIcon>
													<Checkbox
														edge='start'
														tabIndex={-1}
														disableRipple
														inputProps={{ 'aria-labelledby': labelId }}
														checked={filter.indexOf(el.value) !== -1}
													/>
												</ListItemIcon>
												<ListItemText id={labelId} primary={`${el.text}`} />
											</ListItemButton>
										</ListItem>;
									})}
								</List>
							</IQMenuButton>
							<span className='search-icon common-icon-search'></span>
						</InputAdornment>
					}}
				/>
			</div>
			<Grid
				headers={columns}
				data={modifiedList}
				grouped={true}
				groupDefaultExpanded={1}
				groupIncludeFooter={false}
				groupIncludeTotalFooter={false}
				getRowId={(params: any) => params.data.id}
				onSelectionChanged={handleSelectionChange}
				onFirstDataRendered={handleFirstDataRendered}
				autoGroupColumnDef={{
					headerName: 'Work Item',
					field: 'division',
					wrapText: true,
					autoHeight: true,
					minWidth: 500,
					rowGroup: true,
					resizable: false,
					cellRenderer: 'agGroupCellRenderer',
					pinnedBottomRowConfig: {
						displayFields: {}
					},
					cellRendererParams: {
						checkbox: true,
						suppressCount: false,
						innerRenderer: (context: any) => {
							if (context.node.group) {
								return context.value;
							} else {
								const { data } = context,
									{ name, division, costCode, costType, description } = data;
								return <>
									{`${name} - ${division} - ${costCode} - ${costType}`}
									<IQTooltip title={description} placement={'bottom'} sx={{ maxWidth: '35em' }}>
										<div className='description'>{description}</div>
									</IQTooltip>
								</>;
							}
						}
					}
				}}
			/>
		</Stack>
	</IQMenuButton>;
});