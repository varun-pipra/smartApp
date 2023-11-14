import { Box, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

// Project files and internal support import
import CSV from 'resources/images/bidManager/CSV.svg';
import BidDetails from 'resources/images/bidManager/BidDetails.svg';
//import Delete from 'resources/images/bidManager/Delete.svg';
import IQTooltip from 'components/iqtooltip/IQTooltip';

// Component definition
const VendorPayAppToolbarLeftButtons = () => {
	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton aria-label='Refresh Bid response Manager List'>
			<span className="common-icon-refresh"></span>
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Export CSV' placement='bottom'>
			<IconButton>
				<span className='common-icon-Export' />
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Bid response Line Item'>
			<span className="common-icon-delete"></span>
			</IconButton>
		</IQTooltip>
		<IconButton aria-label='Submit Bid' style={{ border: '1px solid #ee7532', borderRadius: '4px', padding: '6px', color: '#ee7532' }}>
			<Box component='img' alt='Delete' src={BidDetails} className='image' width={15} height={15} style={{ marginRight: '6px' }} />
			Safety Requirements. AI
		</IconButton>
	</>;
};

export default VendorPayAppToolbarLeftButtons;