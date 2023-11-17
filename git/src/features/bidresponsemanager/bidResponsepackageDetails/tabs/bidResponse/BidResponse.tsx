import './BidResponse.scss';

import {getCostUnitList, getServer} from 'app/common/appInfoSlice';
import {
	fileDownload,
	useAppDispatch, useAppSelector, useDriveFileBrowser, useFilePreview, useLocalFileUpload
} from 'app/hooks';
import {UpdateBidResponse} from 'features/bidresponsemanager/stores/BidResponseAPI';
import {
	fetchBidResponseDetailsData, setSelectedRecord
} from 'features/bidresponsemanager/stores/BidResponseManagerSlice';
import {
	fetchBidResponsedata, getSupportDocuments, setSubmitResponseClick, setSubmitWait
} from 'features/bidresponsemanager/stores/BidResponseSlice';
import {uploadReferenceFile} from 'features/bidresponsemanager/stores/FilesAPI';
import {setUploadQueue} from 'features/bidresponsemanager/stores/FilesSlice';
import {fetchBidResponseGridData} from 'features/bidresponsemanager/stores/gridSlice';
import OriginalBudget from 'features/budgetmanager/orginalBudget/OrginalBudget';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import SUILineItem from 'sui-components/LineItem/LineItem';
import SUINote from 'sui-components/Note/Note';
import {amountFormatWithSymbol, amountFormatWithOutSymbol} from 'app/common/userLoginUtils';

import {
	Alert, Grid, InputLabel, TextField
} from '@mui/material';

interface BidResponseProps {
	readOnly?: boolean;
	iFrameId?: any;
	appType?: any;
};

const BidResponse = memo((props: BidResponseProps) => {
	const dispatch = useAppDispatch();
	const emptyBudgetRow = [{
		id: '',
		name: '',
		bidValue: '',
		unitCost: '',
		quantity: '',
		unitOfMeasure: '',
		quoteUnitCost: '',
	}];
	const appInfo = useAppSelector(getServer);
	const {submitBidResponseClick, responseRecord} = useAppSelector((state) => state.bidResponse);

	const containerStyle = useMemo(() => ({width: '100%', height: '300px'}), []);

	const [bidResponseNoteData, setBidResponseNoteData] = useState<any>({
		bidCoverLetter: ' ',
		bidInclusions: ' ',
		bidExclusions: '',
	});

	const costUnitOpts = () => {
		return useAppSelector(getCostUnitList);
	};
	const [mainData, setMainData] = useState<any>();
	const [bidResponseRowData, setbidResponseRowData] = React.useState<any>(emptyBudgetRow);
	const [selectedLineItem, setSelectedLineItem] = useState<any>({
		id: '',
		name: '',
		bidValue: '',
		cost: '',
		quantity: '',
		unitOfMeasure: ''
	});
	const [newRecord, setNewRecord] = useState<any>(emptyBudgetRow[0]);
	const [tableFinalData, setTableFinalData] = useState<any>([]);
	const {selectedRecord} = useAppSelector((state) => state.bidResponseManager);
	const supportiveFiles = useAppSelector(getSupportDocuments);
	const newRecRef = useRef<any>({});

	useEffect(() => {
		if(selectedRecord?.bidderUID) {
			dispatch(fetchBidResponsedata({appInfo: appInfo, bidderId: selectedRecord?.bidderUID}))
				.then((response: any) => {
					setMainData(response.payload);
				});
		}
	}, [selectedRecord?.bidderUID]);

	useEffect(() => {
		setTimeout(() => {dispatch(setSubmitResponseClick(false));}, 5000);
	}, [submitBidResponseClick]);

	useEffect(() => {
		setMainData(responseRecord);
	}, [responseRecord]);

	useEffect(() => {
		if(mainData) {
			const array: any = mainData?.budgetItems && mainData?.budgetItems.length > 0 ? [...mainData?.budgetItems] : [];
			if(props.readOnly) {
				setbidResponseRowData([...array]);
			} else {
				setbidResponseRowData([...emptyBudgetRow, ...array]);
			}

			setTableFinalData([...array]);
			setBidResponseNoteData({
				bidCoverLetter: mainData?.bidCoverLetter,
				bidInclusions: mainData?.bidInclusions,
				bidExclusions: mainData?.bidExclusions
			});
			setColumnDefs(headers);
		}
	}, [mainData]);

	const workItemOnChange = (event: any, params: any, colKey: any) => {
		const enteredValue = event.target.value;
		newRecRef.current[colKey] = enteredValue;
		params.node.setData(newRecRef.current);
	};

	const workItemOnBlur = (event: any, params: any, colKey: any) => {
		event.stopPropagation();
		const enteredValue = event.target.value;
		newRecRef.current[colKey] = enteredValue;
		const cEvent = new CustomEvent('updateSOVRec', {detail: newRecRef});
		document.dispatchEvent(cEvent);
	};

	const calculateSubmitonadd = (data: any, params: any, colKey: any) => {
		const record = {
			bidValue: data?.amount,
			cost: data?.cost,
			quantity: data?.quantity,
			unitOfMeasure: data?.unitOfMeasure
		};
		setSelectedLineItem({...selectedLineItem, ...record});
		newRecRef.current[colKey] = data?.amount;
		newRecRef.current['cost'] = data?.cost;
		newRecRef.current['quantity'] = data?.quantity;
		newRecRef.current['unitOfMeasure'] = data?.unitOfMeasure;
		if(newRecRef?.current?.bidValue) {
			newRecRef.current['enableAddBtn'] = true;
		} else {
			newRecRef.current['enableAddBtn'] = false;
		}
		params.node.setData(newRecRef.current);
		const cEvent = new CustomEvent('updateSOVRec', {detail: newRecRef});
		document.dispatchEvent(cEvent);
	};

	const bidValueonFocusonAdd = (event: any, params: any, colKey: any) => {
		const record = {
			bidValue: event?.amount,
			cost: event?.cost ? event?.cost : '',
			quantity: event?.quantity ? event?.quantity : '',
			unitOfMeasure: event?.unitOfMeasure ? event?.unitOfMeasure : ''
		};
		setSelectedLineItem({...selectedLineItem, ...record});
		newRecRef.current[colKey] = event?.amount;
		if(newRecRef?.current?.bidValue) {
			newRecRef.current['enableAddBtn'] = true;
		} else {
			newRecRef.current['enableAddBtn'] = false;
		}
		params.node.setData(newRecRef.current);
		const cEvent = new CustomEvent('updateSOVRec', {detail: newRecRef});
		document.dispatchEvent(cEvent);
	};

	const calculateSubmit = (data: any, griddata: any) => {
		const array = [{
			id: griddata.id,
			bidValue: data.amount ? data.amount : 0,
			name: griddata.name,
			unitOfMeasure: data.unitOfMeasure ? data.unitOfMeasure : '',
			unitCost: data.cost ? data.cost : null,
			unitQuantity: data.quantity ? data.quantity : null
		}];
		const payload = {
			budgetItems: array
		};
		update(payload, mainData?.bidderUID);
	};

	const bidValueonFocus = (event: any, griddata: any) => {
		const array = [{
			id: griddata.id,
			bidValue: event.amount ? event.amount : 0,
			name: griddata.name,
		}];
		update({budgetItems: array}, mainData?.bidderUID);
	};

	const handleNoteOnChange = (name: any, data: any) => {
		// dispatch(setSubmitWait(true));
		console.log('handleNodechange------>');
		const Notedata = {...bidResponseNoteData, [name]: data};
		setBidResponseNoteData(Notedata);
		update({...Notedata}, mainData?.bidderUID);
	};

	const openDrive = (folderType: string) => {
		useDriveFileBrowser({iframeId: props.iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: props.appType, folderType: folderType});
	};

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(props.iFrameId, appInfo, props.appType, files, index);
	};

	const saveSupportiveFiles = (formattedList: any) => {
		uploadReferenceFile(appInfo, {referenceFiles: formattedList}, mainData?.bidderUID)
			.then(() => {
				dispatch(setUploadQueue([]));
				dispatch(fetchBidResponseDetailsData({appInfo: appInfo, responseId: selectedRecord?.id})).then((bidResponse: any) => {
					dispatch(setSelectedRecord({...selectedRecord}));
				});
				dispatch(fetchBidResponsedata({appInfo: appInfo, bidderId: selectedRecord?.bidderUID})).then((response) => {
					setMainData(response?.payload);
				});
			});
	};

	const deleteImage = (item: any) => {
		saveSupportiveFiles({remove: constructList([item])});
	};

	const localFileUpload = (data: any) => {
		useLocalFileUpload(appInfo, data).then((res) => {
			saveSupportiveFiles({add: res});
		});
	};

	const constructList = (list: Array<any>) => {
		const modifiedList = list?.map((item: any) => {
			return {
				id: item.id,
				name: item.name,
				fileType: 1
			};
		});

		return modifiedList;
	};

	// useEffect(() => {
	// 	if (fileQueue && fileQueue.length > 0) {
	// 		saveSupportiveFiles({ add: constructList(fileQueue) });
	// 	}
	// }, [fileQueue]);

	const getunitcost = (bidvalue: any, unitquantity: any, unitCost: any) => {
		let result = 0;
		if(unitCost) {result = unitCost;}
		else {
			if(bidvalue && unitquantity) {
				result = bidvalue / unitquantity;
			}
		}
		return result;
	};

	const headers = [
		{
			headerName: 'Work Items',
			field: 'name',
			minWidth: 650,
			cellRenderer: (params: any) => {
				return params.node?.level == 0 && params.node.rowIndex === 0 && !props.readOnly ? (
					<TextField
						onChange={(event: any) => {workItemOnChange(event, params, 'name');}}
						onBlur={(event: any) => {workItemOnBlur(event, params, 'name');}}
						variant='standard' sx={{marginTop: '5px', width: '100%'}}
						value={newRecRef.current?.name}
					/>
				) : params?.data?.name == 'Grand Total' ? (
					`${params.data?.name}`
				) : (
					`${params.data?.name ? params.data?.name : ''} 
					${params.data?.costCode ? ' - ' + params.data?.costCode : ''} 
					${params.data?.costType ? ' - ' + params.data?.costType : ''}`

				);
			},
		},
		{
			headerName: 'Bid Value',
			field: 'bidValue',
			minWidth: 50,
			headerComponent: (params: any) => {
				return (
					<>
						<span className='bidValue_cell'>{params ? params.displayName : ''} <b className='astric'>*</b></span>
					</>
				);
			},
			// type: 'rightAligned',
			cellRenderer: (params: any) => {
				return params.node?.level == 0 && params.node.rowIndex === 0 && !props.readOnly ? (
					<OriginalBudget
						label={''}
						isRequired={false}
						defaultValue={amountFormatWithOutSymbol(selectedLineItem?.bidValue)}
						iconColor={''}
						data={{
							unitOfMeasure: selectedLineItem?.unitOfMeasure,
							quantity: selectedLineItem?.quantity,
							cost: selectedLineItem?.cost
						}}
						unitList={costUnitOpts()}
						readOnly={props.readOnly}
						disabled={props.readOnly}
						onSubmit={(value) => calculateSubmitonadd(value, params, 'bidValue')}
						onBlur={(value) => bidValueonFocusonAdd(value, params, 'bidValue')}
						cleartheValue={false}
					/>
				) : (params?.data?.name == 'Grand Total' ? (
					`${amountFormatWithSymbol(params.data?.bidValue)}`
				) : (
					<OriginalBudget

						label={''}
						isRequired={false}
						defaultValue={amountFormatWithOutSymbol(params.data?.bidValue)}
						iconColor={''}
						unitList={costUnitOpts()}
						readOnly={props.readOnly}
						disabled={props.readOnly}
						onSubmit={(value) => calculateSubmit(value, params?.data)}
						onBlur={(value) => bidValueonFocus(value, params?.data)}
						data={{
							unitOfMeasure: params?.data?.unitOfMeasure,
							quantity: params?.data?.unitQuantity,
							cost: params?.data?.quoteUnitCost ? params?.data?.quoteUnitCost : getunitcost(params?.data?.bidValue, params?.data?.unitQuantity, params?.data?.quoteUnitCost),
						}}
						textFieldReadonly={{
							unitofMeasure: params?.data?.unitOfMeasure ? true : false,
							quantity: params?.data?.unitQuantity ? true : false,
							cost: false
						}}
						cleartheValue={false}
					/>
				));
			}
		}
	];

	const [columnDefs, setColumnDefs] = React.useState(headers);

	const onBudgetItemAdd = (obj: any, updatedRecords: any) => {
		if(obj) {
			setSelectedLineItem(emptyBudgetRow[0]);
		}
		const payloadarray = [{
			id: '',
			name: obj.name,
			bidValue: obj.bidValue,
			unitOfMeasure: obj.unitOfMeasure ? obj.unitOfMeasure : '',
			unitCost: obj.cost ? obj.cost : '',
			unitQuantity: obj.quantity ? obj.quantity : ''
		}];
		const payload = {
			budgetItems: payloadarray
		};
		update(payload, mainData?.bidderUID);
		newRecRef.current = {
			name: '',
			bidValue: '',
			enableAddbtn: false
		};
		const cEvent = new CustomEvent('updateSOVRec', {detail: newRecRef});
		document.dispatchEvent(cEvent);
	};

	const onRemoveBudgetItem = (id: any) => {
		// console.log('onBudgetItemRemoved');
	};

	const update = (payload: any, bidderUID: any) => {
		UpdateBidResponse(appInfo, bidderUID, payload).then((response: any) => {
			dispatch(setSubmitWait(false));
			dispatch(fetchBidResponseGridData(appInfo))
				.then((response) => {
					response.payload?.map((row: any) => {
						if(row.id == selectedRecord.id) {
							dispatch(setSelectedRecord({...selectedRecord, responseStatus: row?.responseStatus}));
						}
					});
				});
			dispatch(fetchBidResponsedata({appInfo: appInfo, bidderId: selectedRecord?.bidderUID}))
				.then((response) => {
					setMainData(response?.payload);
				});
		});
	};

	const download = (imgData: any, fileType: any) => {
		const objectIds = imgData?.map((item: any) => item.objectId);
		const filename = selectedRecord?.name + ' - ' + fileType;
		fileDownload(objectIds, filename);
	};
	return (
		<div className='bidResponse'>
			<Grid container direction={'row'} spacing={3}>
				<Grid item sm={11.6}>
					<span className='header-text'>Bid Response</span>
					{!props.readOnly && <p>Please fill in and add a value to each of the work items, if any new Work Items are missing that needs to be added at the top.</p>}
				</Grid>

				<Grid item sm={11.9} mb={2}>
					<InputLabel style={{paddingBottom: '6px'}}> <b className='inputlabel1'>Bid Package Details</b></InputLabel>
					<div style={containerStyle} className='budget-grid-cls'>
						<SUILineItem
							headers={columnDefs}
							data={bidResponseRowData}
							pinnedBottomRowConfig={{
								displayFields: {
									name: 'Grand Total',
								},
								aggregateFields: ['bidValue'],
							}}
							adddisable={true}
							onAdd={(value: any, updatedRecords: any) =>
								onBudgetItemAdd(value, updatedRecords)
							}
							onRemove={(value: any) => onRemoveBudgetItem(value)}
							newRecord={newRecord}
							actionheaderprop={{
								minWidth: 20,
								maxWidth: 40,
							}}
							readOnly={props.readOnly}
						/>
					</div>
				</Grid>
			</Grid>
			<Grid container direction={'row'} spacing={3}>
				<Grid item sm={11.9} ml={-0.3}>
					<InputLabel className='inputlabel' style={{marginBottom: '5px'}}>
						<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
						Bid Cover Letter
					</InputLabel>
					<>
						{props.readOnly || (bidResponseNoteData?.bidCoverLetter && props.readOnly) ?
							<div
								dangerouslySetInnerHTML={{
									__html: bidResponseNoteData?.bidCoverLetter,
								}}
							></div>
							:
							<SUINote
								notes={bidResponseNoteData?.bidCoverLetter}
								//disabled={props.readOnly}
								onNotesChange={(value: any) => {handleNoteOnChange('bidCoverLetter', value);}}
							/>
						}
					</>
				</Grid>
				<Grid item sm={11.9} ml={-0.3}>
					<InputLabel className='inputlabel' style={{marginBottom: '5px'}}>
						<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
						Bid Inclusions
					</InputLabel>
					<>
						{props.readOnly || (bidResponseNoteData?.bidInclusions && props.readOnly) ?
							<div
								dangerouslySetInnerHTML={{
									__html: bidResponseNoteData?.bidInclusions,
								}}
							></div>
							:
							<SUINote
								notes={bidResponseNoteData?.bidInclusions}
								//disabled={props.readOnly}
								onNotesChange={(value: any) => {handleNoteOnChange('bidInclusions', value);}}
							/>
						}
					</>

				</Grid>
				<Grid item sm={11.9} ml={-0.3}>
					<InputLabel className='inputlabel' style={{marginBottom: '5px'}}>
						<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
						Bid Exclusions
					</InputLabel>
					<>
						{props.readOnly || (bidResponseNoteData?.bidExclusions && props.readOnly) ?
							<div
								dangerouslySetInnerHTML={{
									__html: bidResponseNoteData?.bidExclusions,
								}}
							></div>
							:
							<SUINote
								notes={bidResponseNoteData?.bidExclusions}
								//disabled={props.readOnly}
								onNotesChange={(value: any) => {handleNoteOnChange('bidExclusions', value);}}
							/>
						}
					</>

				</Grid>
			</Grid>
			<Grid container spacing={2} mt={2}>
				<Grid item sm={11.9}>
					<DocUploader
						width={'1070px'}
						height={'200px'}
						folderType='File'
						docLabel={'Supportive Documents'}
						imgData={supportiveFiles?.length > 0 ? supportiveFiles : []}
						readOnly={props.readOnly}
						onImageClick={openPreview}
						onImageDelete={deleteImage}
						onProjectFile={(folderType: any) => {openDrive(folderType);}}
						localFileClick={(data: any) => {localFileUpload(data);}}
						showDownloadButton={true}
						fileDownload={(data: any) => {download(data, 'Files');}}
					></DocUploader>
				</Grid>
			</Grid>
			{
				submitBidResponseClick && <Alert severity='success' className='floating-toast-cls' onClose={() => {dispatch(setSubmitResponseClick(false));}}>
					<span className='toast-text-cls big-text'>Your Bid Response is submitted</span>
					<span className='toast-text-cls small-text'>{`Your Bid Response ID ${selectedRecord?.id}.`}</span>
				</Alert>
			}
		</div>);
});

export default BidResponse;