import React from 'react';
import {Button} from '@mui/material';
import './SAPButton.scss'

const SapButton = (props:any) =>{
  return(
    <Button
					variant="outlined"
					startIcon={<span className='common-icon-share-new' />}
					className="sap-button"
					onClick={() => {props?.onClick && props?.onClick()}}
				>
					<span className='postto'>Post to</span>
					<img
						// className="sapicon"
						src={props?.imgSrc}
						alt="connector Image"
					/>
				</Button>
  )
}
export default SapButton;