import React, { useState } from "react";
import { Box, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';

import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { appInfoData } from 'data/appInfo';
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import IQButton from 'components/iqbutton/IQButton';

const GridWindowExample = (props: any) => {
	const [openLID, setOpenLID] = useState(true);

	return <GridWindow
		open={true}
		title='Bid Manager'
		appType='BidManager'
		appInfo={appInfoData}
		iFrameId='bidManagerIframe'
		zIndex={100}
		// isFullView={true}
		presenceProps={{
			presenceId: 'bidmanager-presence',
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		}}
		tools={{
			closable: true,
			resizable: true,
			openInNewTab: true
		}}
		PaperProps={{
			sx: {
				width: '95%',
				height: '90%'
			}
		}}
		content={{
			// showDetails: true,
			headContent: {
				collapsibleContent: <>
					<p style={{ fontSize: '18px', fontWeight: 'bold', padding: '0.5em 1em' }}>Create Bid Line Item</p>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5em 1em' }}>
						<span>
							<InputLabel required className='inputlabel' sx={{
								'& .MuiFormLabel-asterisk': {
									color: 'red'
								}
							}}>Bid Package Name</InputLabel>
							<TextField
								id='bidPackage'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Box component='img' alt='Delete' src={BidPackageName} className='image' width={22} height={22} color={'#666666'} />
										</InputAdornment>
									)
								}}
								name='bidPackageName'
								variant='standard'
							// value={!['', '-'].includes(formData.amount) ? Number(formData?.amount?.replace(/\,/g, ''))?.toLocaleString('en-US') : formData.amount}
							// onChange={handleOnChange}
							/>
						</span>
						<span>
							<InputLabel required className='inputlabel' sx={{
								'& .MuiFormLabel-asterisk': {
									color: 'red'
								}
							}}>Bid Package Name</InputLabel>
							<TextField
								id='bidPackage'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Box component='img' alt='Delete' src={BidPackageName} className='image' width={22} height={22} color={'#666666'} />
										</InputAdornment>
									)
								}}
								name='bidPackageName'
								variant='standard'
							// value={!['', '-'].includes(formData.amount) ? Number(formData?.amount?.replace(/\,/g, ''))?.toLocaleString('en-US') : formData.amount}
							// onChange={handleOnChange}
							/>
						</span>
						<span>
							<InputLabel required className='inputlabel' sx={{
								'& .MuiFormLabel-asterisk': {
									color: 'red'
								}
							}}>Bid Package Name</InputLabel>
							<TextField
								id='bidPackage'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Box component='img' alt='Delete' src={BidPackageName} className='image' width={22} height={22} color={'#666666'} />
										</InputAdornment>
									)
								}}
								name='bidPackageName'
								variant='standard'
							// value={!['', '-'].includes(formData.amount) ? Number(formData?.amount?.replace(/\,/g, ''))?.toLocaleString('en-US') : formData.amount}
							// onChange={handleOnChange}
							/>
						</span>
						<IQButton
							color='orange'
							sx={{ height: '2.5em' }}
						// disabled={isBudgetLocked ? true : disableAddButton ? true : false}
						// onClick={handleAdd}
						>
							+ ADD
						</IQButton>
					</div>
				</>,
				// regularContent: 'Form Area'
			},
			gridContainer: {
				grid: {
					headers: [{
						headerName: 'Contract Name'
					}, {
						headerName: 'Description'
					}, {
						headerName: 'Amount'
					}, {
						headerName: 'Date'
					}, {
						headerName: 'Retainage'
					}, {
						headerName: 'Schedule of Value'
					}, {
						headerName: 'Vendor'
					}],
					data: [],
					getRowId: (params: any) => params.data.uniqueId,
					grouped: true,
					groupIncludeTotalFooter: false,
					pinnedBottomRowConfig: {
						aggregateFields: ['amount'],
						displayFields: {
							stageName: 'Summary',
						}
					}
				}
			}
		}}
	/>;
}

export default GridWindowExample;