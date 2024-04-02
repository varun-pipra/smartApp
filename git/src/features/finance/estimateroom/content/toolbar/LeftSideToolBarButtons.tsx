import React,{useState} from 'react';
import { IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import EstimateForm from './createEstimateNewForm/CreateEstimateNewForm';

const LeftSideToolBarButtons = (props:any) => {
		const [addForm ,setAddForm] = useState<boolean>(false);

		const CreateNew = (data:any) =>{
			console.log('data',data)
		}
    return(
		<>
				<IQTooltip title='Refresh' placement='bottom'>
					<IconButton aria-label='Refresh Budget Room List'>
						<span className='common-icon-refresh'></span>
					</IconButton>
				</IQTooltip>
				<IQTooltip title='Add' placement='bottom'>
					<IconButton onClick={() => {  setAddForm(true)	}}>
						<span className='common-icon-Add'/>
					</IconButton>
				</IQTooltip>
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
				{addForm && 
						<EstimateForm 
							title={'Create New Estimate'}
							onClose={()=>{setAddForm(false)}}
							onAdd={(data:any)=>{CreateNew(data)}}

						/>
				}
		</>
	)
}

export default LeftSideToolBarButtons;
