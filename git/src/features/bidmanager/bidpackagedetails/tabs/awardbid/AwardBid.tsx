import './AwardBid.scss';

import { getCurrencySymbol, getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector, useFilePreview, useHotLink } from 'app/hooks';
import AwardBidCompareBarChart from 'charts/barcharts/AwardBidCompareBarChart';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import { awardBid } from 'features/bidmanager/stores/awardBidAPI';
import {
	fetchAwardBidDetailsData, setActiveAwardBidFilters, setAwardBidClick, setAwardBidSelectedRecord, setViewType
} from 'features/bidmanager/stores/awardBidSlice';
import { fetchBidPackageDetails } from 'features/bidmanager/stores/BidManagerSlice';
import { fetchGridData } from 'features/bidmanager/stores/gridSlice';
import { createVendorContracts } from 'features/vendorcontracts/stores/gridAPI';
import React, { useEffect, useRef } from 'react';
import ReferenceFiles from 'resources/images/bidManager/ReferenceFiles.svg';
import SubmittedBy from 'resources/images/bidManager/SubmittedBy.svg';
import SubmittedOn from 'resources/images/bidManager/SubmittedOn.svg';
import SUIAlert from 'sui-components/Alert/Alert';
import SUICard from 'sui-components/Card/Card';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { fileDownload } from 'app/hooks';
import { GridOn } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import {
	Alert, Box, Button, Card, Grid, InputLabel, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { getAmountAlignment } from 'utilities/commonutills';

const AwardBid = () => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currency = useAppSelector(getCurrencySymbol);
	const { selectedRecord } = useAppSelector((state) => state.bidManager);
	const { BiddersGridData } = useAppSelector((state) => state.bidders);
	const { expandedRows, activeAwardBidFilters, viewType } = useAppSelector((state) => state.awardBid);
	const { awardBidSelectedRecord, awardBidClick, awardBidDetailData, openUpdateBudgetDialog, files } = useAppSelector((state) => state.awardBid);
	const containerStyle = React.useMemo(() => ({ width: '100%', height: '300px' }), []);
	const [data, setData] = React.useState<any>(BiddersGridData);
	const [selectedItem, setSelectedItem] = React.useState<any>(null);
	const [showConfirmationDlg, setShowConfirmationDlg] = React.useState<boolean>(false);
	const [showAwardToastMsg, setShowAwardToastMsg] = React.useState<boolean>(false);
	const [awardBidType, setAwardBidType] = React.useState<any>('');
	const [tableViewType, setTableViewType] = React.useState<any>('grid');
	const [selectedCardsData, setSelectedCardsData] = React.useState<any>([]);
	const leftContentRef = useRef<any>('');
	const [showChartView, setShowChartView] = React.useState<boolean>(false);
	const [contract, setContract] = React.useState<any>(null);

	React.useEffect(() => {
		console.log("tableViewType", tableViewType, viewType)
		if (viewType != tableViewType) setTableViewType(viewType)
	}, [viewType])

	const filterOptions = [
		{
			text: "Submission Status",
			value: "submissionStatus",
			key: "submissionStatus",
			iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Not Applicable', id: '0', key: '0', value: '0', },
					{ text: 'Not Submitted', id: '1', key: '1', value: '1', },
					{ text: 'Pending', id: '2', key: '2', value: '2', },
					{ text: 'Submitted', id: '3', key: '3', value: '3', },
				],
			},
		},
		{
			text: "Intend To Bid",
			value: "intendToBid",
			key: "intendToBid",
			iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Undecided', id: '0', key: '0', value: '0', },
					{ text: 'No', id: '1', key: '1', value: '1', },
					{ text: 'Yes', id: '2', key: '2', value: '2', },
					{ text: 'Expired', id: '3', key: '3', value: '3', },
				],
			},
		},
		{
			text: "Diverse Supplier",
			value: "isDiverseSupplier",
			key: "isDiverseSupplier",
			iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Yes', id: 'true', key: 'true', value: 'true', },
					{ text: 'No', id: 'false', key: 'false', value: 'false', },
				],
			},
		},
		{
			text: "Compliance Status",
			value: "complianceStatus",
			key: "complianceStatus",
			iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Compliant', id: 'Compliant', key: 'Compliant', value: 'Compliant', },
					{ text: 'Not Verified', id: 'Not Verified', key: 'Not Verified', value: 'Not Verified', },
					{ text: 'N/A', id: 'N/A', key: 'N/A', value: 'N/A' },
				],
			},
		},
	];

	const [filters, setFilters] = React.useState<any>(filterOptions);

	useEffect(() => {
		const gridDataCopy = [...BiddersGridData];
		let filteredData = gridDataCopy;
		if (activeAwardBidFilters?.submissionStatus?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return activeAwardBidFilters?.submissionStatus?.includes(rec?.submissionStatus?.toString());
			});
		}
		if (activeAwardBidFilters?.intendToBid?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeAwardBidFilters?.intendToBid?.includes(rec?.intendToBid?.toString());
			});
		}
		if (activeAwardBidFilters?.isDiverseSupplier?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeAwardBidFilters?.isDiverseSupplier?.includes(rec?.company?.isDiverseSupplier?.toString());
			});
		}
		if (activeAwardBidFilters?.complianceStatus?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeAwardBidFilters?.complianceStatus?.includes(rec?.company?.complianceStatus);
			});
		}
		setData(filteredData);
	}, [activeAwardBidFilters, BiddersGridData]);


	useEffect(() => {
		if (leftContentRef?.current) {
			leftContentRef.current.querySelectorAll('.Mui-selected').forEach((element: any) => {
				element.classList.remove('Mui-selected');
			});
			leftContentRef.current.querySelectorAll('.card-selected-cls').forEach((element: any) => {
				element.classList.remove('card-selected-cls');
			});
		}
		setSelectedCardsData([]);
		setSelectedItem(null);
		setShowChartView(false);

	}, [tableViewType]);

	useEffect(() => { setTimeout(() => { setShowAwardToastMsg(false); }, 5000); }, [showAwardToastMsg]);

	const handleClickItem = (data: any, e: any) => {
		if (tableViewType === 'grid') {
			setSelectedItem(data);
			dispatch(setAwardBidSelectedRecord([data]));
			dispatch(fetchAwardBidDetailsData({ appInfo: appInfo, packageId: selectedRecord?.id, bidderUniqueId: data?.id, }));
		} else {
			const isAlreadySelected = e.currentTarget.className.includes('card-selected-cls');
			e.currentTarget.classList.remove('Mui-selected');
			if (!isAlreadySelected) {
				e.currentTarget.classList.add('card-selected-cls');
				setSelectedCardsData([...selectedCardsData, data]);
			} else {
				if (data?.id) {
					const index = selectedCardsData.findIndex((rec: any) => rec.id === data.id);
					if (index > -1) {
						let selectedCards = [...selectedCardsData];
						selectedCards.splice(index, 1);
						setSelectedCardsData(selectedCards);
					}
				}
				e.currentTarget.classList.remove('card-selected-cls');
			}
		}
	};

	React.useEffect(() => {
		dispatch(setAwardBidSelectedRecord([]));
		setData(BiddersGridData);
	}, [selectedRecord, BiddersGridData]);

	const handleToggleChange = (e: any, newAlignment: any) => {
		setTableViewType(newAlignment);
		dispatch(setViewType(newAlignment))
		dispatch(setAwardBidSelectedRecord([]));
	};

	const openPreview = (files: any, index: number) => {
		useFilePreview('bidManagerIframe', appInfo, 'BidManager', files, index);
	};

	const download = (imgData: any, fileType: any) => {
		const objectIds = imgData?.map((item: any) => item.objectId);
		const filename = selectedRecord?.name + ' - ' + fileType;;
		fileDownload(objectIds, filename);
	};

	return (
		<div className='award-bid'>
			<div className='award-bid-header'>
				<div className='award-bid-count'>
					<InputLabel>
						<b className='inputlabel1'>{`Bidders (${data.length})`}</b>
					</InputLabel>
				</div>
				<div className='toggle-button'>
					<ToggleButtonGroup
						exclusive
						value={tableViewType}
						size='small'
						onChange={handleToggleChange}
						aria-label='Inventory tab view buttons'
					>
						<ToggleButton value={'grid'} aria-label='Budget details tab'>
							<GridOn />
						</ToggleButton>
						<ToggleButton value={'chart'} aria-label='Analytics tab'>
							<AssessmentOutlinedIcon />
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>

			<div className='award-bid-main'>
				<div className='left-content' ref={leftContentRef}>
					<IQSearch
						sx={{ height: '2em', marginBottom: '10px' }}
						showGroups={false}
						filters={filters}
						onFilterChange={(filters: any) => dispatch(setActiveAwardBidFilters(filters))}
						// onSearchChange={searchHandler}
					/>
					<div style={{ overflow: 'auto', height: '910px', cursor: 'pointer' }}>
						{data.map((obj: any, index: number) => (
							<>
								<SUICard
									awarded={
										selectedRecord?.status == 5 && obj?.awarded
											? true
											: obj.id === selectedItem?.id
												? selectedItem?.awarded
												: false
									}
									tileNumber={index + 1}
									selectIndex={selectedItem?.id}
									width={'100%'}
									height={'fit-content'}
									cardData={obj}
									onClick={(data: any, e: any) => handleClickItem(data, e)}
								/>
							</>
						))}
					</div>
				</div>
				{tableViewType === 'grid' && (
					<div className='right-content'>
						<Card className='rigth-content-card'>
							{!selectedItem ? (
								<p className='right-cont-msg'>
									Select Bidders to see the Bid Response
								</p>
							) : Object.keys(awardBidDetailData)?.length ? (
								<div className='right-cont-section'>
									<Grid container direction='row' spacing={1}>
										<Grid item sm={7} className='labelName'>
											<Box
												component='img'
												src={awardBidDetailData?.company?.thumbnailUrl}
												style={{
													height: '45px',
													width: '45px',
													borderRadius: '50%',
												}}
											/>
											<div style={{ marginLeft: '8px' }}>
												<h4 style={{ marginTop: '4px', marginBottom: '0px' }}>
													{awardBidDetailData?.company?.name}
												</h4>
												<InputLabel className='inputLabel' style={{ color: '#999', }}>
													{'Prime Contractor'}
												</InputLabel>
											</div>
										</Grid>
										<Grid item sm={5} className='submitted-cls'>
											{awardBidDetailData?.respondedOn &&
												<InputLabel className='inputlabel'>
													<Box
														component='img'
														src={SubmittedOn}
														style={{
															height: '20px',
															width: '20px',
															marginRight: '4px',
															marginBottom: '-3px',
														}}
													/>
													<span className='light-color'>
														Submitted on{' '}
														<b>{formatDate(awardBidDetailData?.respondedOn)}</b>
													</span>
												</InputLabel>
											}
											{awardBidDetailData.submissionStatus == 3 ?
												<InputLabel className='inputlabel'>

													<Box
														component='img'
														src={SubmittedBy}
														style={{
															height: '20px',
															width: '20px',
															marginRight: '4px',
															marginBottom: '-2px',
														}}
													/>
													{/* {`Submitted by ${selectedItem.submittedBy}` */}
													<span className='light-color'>
														Submitted by
														{awardBidDetailData?.respondedByThumbnail ?
															<Box
																component='img'
																src={awardBidDetailData?.respondedByThumbnail}
																style={{
																	height: '20px',
																	width: '20px',
																	marginRight: '4px',
																	margin: '0px 4px -4px 6px',
																	borderRadius: '50%',
																}}
															/>
															:
															<Box
																component='span'
																style={{
																	height: '20px',
																	width: '20px',
																	marginRight: '4px',
																	margin: '0px 4px -4px 6px',
																	borderRadius: '50%',
																}}
															/>
														}
														<b>{awardBidDetailData?.respondedBy ? awardBidDetailData?.respondedBy : ''}</b>
													</span>
												</InputLabel>
												: ''}
										</Grid>
									</Grid>
									{/* <InputLabel className='bid-response'><b className='inputlabel1'>Bid Response</b></InputLabel> */}
									<div className='bid-package-details'>
										<InputLabel>
											<b className='inputlabel1'>Bid Package Details</b>
										</InputLabel>
										<Button
											sx={{ color: 'black', border: '1px solid blue' }}
											variant='outlined'
											id='attachments-btn'
											startIcon={
												<Box
													component='img'
													src={ReferenceFiles}
													style={{ height: '30px', width: '30px' }}
												/>
											}
										>Attachments{files ? '(' + files?.length + ')' : '(' + 0 + ')'}</Button>
									</div>
									<div className='right-content-table'>
										<SUIGrid
											headers={[
												{
													headerName: 'Work Items',
													field: 'name',
													menuTabs: [],
													minWidth: 320,
													valueGetter: (params: any) =>
														params.data
															? `${params.data?.name ? params.data?.name : ''
															} ${params.data.costCode
																? ' - ' + params.data.costCode
																: ''
															} ${params.data.costType
																? ' - ' + params.data.costType
																: ''
															}`
															: '',
												},
												{
													headerName: 'Budget Value',
													field: 'budgetValue',
													menuTabs: [],
													minWidth: 125,
													type: 'rightAligned',
													valueGetter: (params: any) =>
														params.data?.budgetValue
															? `${currency} ${params.data?.budgetValue?.toLocaleString(
																'en-US'
															)}`
															: '',
												},
												{
													headerName: 'Bid Value',
													field: 'bidValue',
													menuTabs: [],
													minWidth: 100,
													type: 'rightAligned',
													valueGetter: (params: any) =>
														params.data?.bidValue
															? `${currency} ${params.data?.bidValue?.toLocaleString(
																'en-US'
															)}`
															: '',
													cellRenderer: (params: any) => {
														if (params.value) {
															if (params?.node?.rowPinned == 'bottom')
																return (
																	<div
																		style={{
																			color:
																				Number(
																					params.data?.bidValue
																						?.toString()
																						?.replaceAll(',', '')
																				) >
																					Number(
																						params.data?.budgetValue
																							?.toString()
																							?.replaceAll(',', '')
																					)
																					? 'red'
																					: 'green',
																		}}
																	>
																		{currency}{' '}
																		{params.data?.bidValue?.toLocaleString(
																			'en-US'
																		)}
																	</div>
																);
															else
																return `${currency} ${params.data?.bidValue?.toLocaleString(
																	'en-US'
																)}`;
														}
													},
												},
												{
													headerName: 'Budget Unit Cost',
													field: 'unitCost',
													menuTabs: [],
													type: 'rightAligned',
													minWidth: 150,
													valueGetter: (params: any) =>
														params.data?.unitCost
															? `${currency} ${params.data?.unitCost?.toLocaleString(
																'en-US'
															)}`
															: '',
												},
												{
													headerName: 'Bid Unit Cost',
													field: 'quoteUnitCost',
													menuTabs: [],
													type: 'rightAligned',
													minWidth: 150,
													valueGetter: (params: any) =>
														params.data?.quoteUnitCost
															? `${currency} ${params.data?.quoteUnitCost?.toLocaleString(
																'en-US'
															)}`
															: '',
												},
												{
													headerName: 'Budget UOM',
													menuTabs: [],
													field: 'unitOfMeasure',
													minWidth: 120,
													cellRenderer: (params: any) => <span>{params?.data?.unitQuantity && getAmountAlignment(params?.data?.unitQuantity)} {params?.data?.unitOfMeasure && params?.data?.unitOfMeasure}</span>
												},
												{
													headerName: 'Bid UOM',
													menuTabs: [],
													field: 'quoteUnitOfMeasure',
													minWidth: 100,
													cellRenderer: (params: any) => <span>{params?.data?.quoteQuantity && getAmountAlignment(params?.data?.quoteQuantity)} {params?.data?.quoteUnitOfMeasure && params?.data?.quoteUnitOfMeasure}</span>
												},


											]}
											data={awardBidDetailData?.budgetItems}
											groupIncludeTotalFooter={false}
											pinnedBottomRowConfig={{
												aggregateFields: ['bidValue', 'budgetValue'],
												displayFields: {
													name: 'Grand Total',
												},
											}}
										// nowRowsMsg={'<div>Create new Bid by Clicking the + button above</div>'}
										/>
									</div>
									<div className='bid-cover'>
										<InputLabel className='inputlabel1'>
											<span className='common-icon-adminNote'></span>
											Bid Cover Letter
										</InputLabel>
										<p
											className='inputlabel'
											dangerouslySetInnerHTML={{
												__html: awardBidDetailData?.bidCoverLetter,
											}}
										></p>
									</div>
									<div className='bid-cover'>
										<InputLabel className='inputlabel1'>
											<span className='common-icon-adminNote'></span>
											Bid Inclusions
										</InputLabel>
										<p
											className='inputlabel'
											dangerouslySetInnerHTML={{
												__html: awardBidDetailData?.bidInclusions,
											}}
										></p>
									</div>
									<div className='bid-cover'>
										<InputLabel className='inputlabel1'>
											<span className='common-icon-adminNote'></span>
											Bid Exclusions
										</InputLabel>
										<p
											className='inputlabel'
											dangerouslySetInnerHTML={{
												__html: awardBidDetailData?.bidExclusions,
											}}
										></p>
									</div>
									<div className='bid-cover'>
										<DocUploader
											width={'500px'}
											height={'200px'}
											folderType='File'
											docLabel={'Supportive Documents'}
											onImageClick={openPreview}
											imgData={files}
											readOnly={true}
											showDownloadButton={true}
											fileDownload={(data: any) => { download(data, 'Files'); }}
										></DocUploader>
									</div>
								</div>
							) : (
								''
							)}
						</Card>
					</div>
				)}
				{tableViewType === 'chart' && (
					<div className='right-content'>
						<Card className='rigth-content-card'>
							{showChartView && selectedCardsData?.length >= 2 ? (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<AwardBidCompareBarChart
										chartData={selectedCardsData}
									></AwardBidCompareBarChart>
								</div>
							) : (
								<div className='chart-right-content-msg-wrapper'>
									<div>
										<AssessmentIcon fontSize='large'></AssessmentIcon>
										<p>Select more than one bidders to compare</p>
										{selectedCardsData?.length <= 1 && (
											<Button variant='outlined' disabled>
												Compare
											</Button>
										)}
										{selectedCardsData?.length >= 2 && (
											<Button
												variant='outlined'
												onClick={() => setShowChartView(true)}
											>
												Compare
											</Button>
										)}
									</div>
								</div>
							)}
						</Card>
					</div>
				)}
			</div>
			{
				<SUIAlert
					onClose={() => {
						// setShowConfirmationDlg(false);
						// cosnole.log()
						dispatch(setAwardBidClick(false));
					}}
					open={awardBidClick}
					contentText={
						<>
							<span>
								You are awarding the bid to '
								{<b>{selectedItem?.company?.name}</b>}' for the amount of{' '}
								{
									<b>{`${currency} ${selectedItem?.totalBidValue?.toLocaleString(
										'en-US'
									)}`}</b>
								}
								. Please note this action can't be reversed.
							</span>
							<div className='process-txt'>Do you want to proceed?</div>
							<div className='award-bid-buttons'>
								<Button
									sx={{ color: 'orange' }}
									variant='outlined'
									id='attachments-btn'
									className='contract-later'
									onClick={() => {
										setAwardBidType('contract-later');
										dispatch(setAwardBidClick(false));
										setSelectedItem({ ...selectedItem, awarded: true });
										awardBid(appInfo, selectedRecord?.id, selectedItem?.id).then(() => {
											setShowAwardToastMsg(true);
											dispatch(fetchGridData(appInfo));
											dispatch(fetchBidPackageDetails({ appInfo: appInfo, packageId: selectedRecord?.id }));
											dispatch(fetchAwardBidDetailsData({ appInfo: appInfo, packageId: selectedRecord?.id, bidderUniqueId: selectedItem?.id, }));
										});
									}}
								>
									AWARD BID & CREATE CONTRACT LATER
								</Button>
								<Button
									sx={{ color: 'white', backgroundColor: 'orange' }}
									variant='outlined'
									id='attachments-btn'
									className='contract-now'
									onClick={() => {
										setAwardBidType('contract-now');
										dispatch(setAwardBidClick(false));
										setSelectedItem({ ...selectedItem, awarded: true });
										awardBid(appInfo, selectedRecord?.id, selectedItem?.id).then(() => {
											setShowAwardToastMsg(true);
											dispatch(fetchGridData(appInfo));
											dispatch(fetchBidPackageDetails({ appInfo: appInfo, packageId: selectedRecord?.id }));
											dispatch(fetchAwardBidDetailsData({ appInfo: appInfo, packageId: selectedRecord?.id, bidderUniqueId: selectedItem?.id, }));
											createVendorContracts(appInfo, {
												title: selectedRecord?.name,
												vendor: { id: selectedItem?.company?.id },
												bidPackage: { id: selectedRecord?.id }
											}).then((response: any) => { console.log("vendor response", response); setContract(response); });
										});
									}}
								>
									AWARD BID & CREATE CONTRACT NOW
								</Button>
							</div>
						</>
					}
					title={'Confirmation'}
					showActions={false}
					DailogClose={true}
					onAction={(e: any, type: string) => {
						type == 'close' && dispatch(setAwardBidClick(false));
					}}
				/>
			}
			{showAwardToastMsg && (
				<Alert
					severity='success'
					className='floating-toast-cls'
					onClose={() => {
						setShowAwardToastMsg(false);
					}}
				>
					<span className='toast-text-cls'>
						<b>1</b> Your Bid has been Awarded Successfully.
					</span>
					{awardBidType == 'contract-now' && (
						<span className='toast-text-cls'>
							<b>2</b> A Contract {
								<span onClick={() => window.open(useHotLink(`vendor-contracts/home?id=${contract?.id}`), '_blank')}>
									{selectedRecord?.name}
								</span>} has been successfully created in draft state.
						</span>
					)}
				</Alert>
			)}
		</div>
	);
};

export default AwardBid;

const getGroupMenuOptions = () => {
	return [
		// {
		// 	text: 'Transactions Type',
		// 	value: 'transactionType',
		// }
	];
};

const getFilterMenuOptions = () => {
	return [
		// {
		// 	text: 'Scope',
		// 	key: 'stageName',
		// 	value: 'all',
		// },
		// {
		// 	text: 'Diverce Supplier',
		// 	key: 'stageName',
		// 	value: 'Posted',
		// },
		// {
		// 	text: 'Compliance Status',
		// 	key: 'stageName',
		// 	value: 'Pending',
		// }
	];
};
