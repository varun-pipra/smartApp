import { MessageBox, Button, ButtonDesign  } from '@ui5/webcomponents-react';
import SmartDialog from 'components/smartdialog/SmartDialog';
import { Stack } from '@mui/material';
import React from 'react';
interface ConfirmationDialogProps {
  message?: string;
  onClose?: (value:boolean) => void;
}
const AlertDialog = (props:ConfirmationDialogProps) => {
   
    const handleClose = (val:any) => {
      if(props.onClose) props.onClose(val);
    }
    return(<SmartDialog
      open={true}
      PaperProps={{
          sx: { height: '15%', width: '15%', minWidth: '25%', minHeight: '32%' },
      }}
      custom={{
          closable: true,
          title: 'Confirmation',
          // tools: optionalTools
      }}
      onClose={() => handleClose(false)}
  >
      <div style={{margin: '15px'}}>
          <p>The existing budget line items will have to be updated to the new values </p>
          <p>Are you sure want to continue?</p>  
          <Stack direction='row' spacing={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => handleClose(false)} style={{backgroundColor: '#666666', color:'white'}}>CANCEL</Button>
          <Button design={ButtonDesign.Emphasized} onClick={() => handleClose(true)}>YES</Button>          
          </Stack>    
      </div>
  </SmartDialog>)
}

export default AlertDialog;