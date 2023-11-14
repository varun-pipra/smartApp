import React from 'react';
import './Bids.scss';
import { Button, Icon, Grid, Label, Title } from '@ui5/webcomponents-react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
const BidsDetails = () => {
	return (
		<>
			<Grid className="Bid_Section">
				<div data-layout-span="XL12 L12 M12 S12" className='bidButton_Section'>
					<Button icon='add' className='createbid_button'>Create Bid</Button>
				</div>
				<div data-layout-span="XL12 L12 M12 S12" className='upload_Section'>
					<UploadFileIcon className='icon' />
					<Title className='title'>No items available</Title>
					<Label className='label'>Click on Create Bid <br /> To create your first Bid</Label>
				</div>
			</Grid>

		</>
	)
}
export default BidsDetails;