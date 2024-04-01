import { Button, IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { getChangeEventList, setChangeEventsListRefreshed } from "features/finance/changeeventrequests/stores/ChangeEventSlice";
import PublishBudget from "../publishBudget/PublishBudget";
import { useState } from "react";

const LeftSideToolBarButtons = (props:any) => {
	const [open , setOpen] = useState(false);
	const onPublishBudgetClose =()=>{
			setOpen(false);
	}
    return(<>
    <IQTooltip title='Refresh' placement='bottom'>
			<IconButton
				aria-label='Refresh Budget Room List'
				// onClick={() => { 
				// 	dispatch(getChangeEventList()); 
				// 	dispatch(setChangeEventsListRefreshed(true))
				// }}
			>
				<span className='common-icon-refresh'></span>
			</IconButton>
		</IQTooltip>
		{/* <IQTooltip title='Export CSV' placement='bottom'>
			<IconButton>
				<span className='common-icon-Export'/>
			</IconButton>
		</IQTooltip> */}
		<IQTooltip title='Print' placement='bottom'>
			<IconButton disabled
			//  onClick={(e: any) => { PrintOnclick(e) }}
            >
				<span className='common-icon-print' />
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Bid response Line Item'
				disabled
				// onClick={() => deleteChangeEvent()}
			>
				<span className='common-icon-delete'></span>
			</IconButton>
		</IQTooltip>
		<Button
					variant="outlined"
					startIcon={<span className="common-icon-budget-manager"></span>}
					className="sap-button"
					onClick={()=>setOpen(true)}
				>
					<span className='postto'>Publish to Budget</span>
				
				</Button>
				{	open&&
					<PublishBudget setOpen={open} onPublishBudgetClose={onPublishBudgetClose}/>
				}
				
		</>)
}

export default LeftSideToolBarButtons;
