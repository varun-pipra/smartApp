import react from 'react';

import { InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LanguageIcon from '@mui/icons-material/Language';
import HardwareIcon from '@mui/icons-material/Hardware';
import ContactPageIcon from '@mui/icons-material/ContactPage';


export const buildIconsForTextBox = (icontype: any) => {   
      switch (icontype) {
        case 'email':
          return (
            <div>
              <InputAdornment position="start">
                <EmailIcon style={{fontSize: '20px',color:'orange', marginTop:'-30px'}}></EmailIcon>
              </InputAdornment>
            </div>
          );

        case 'number':
        case 'cell':
          return (
            <div>
              <InputAdornment position="start">
                <LocalPhoneIcon style={{fontSize: '20px',color:'orange', marginTop:'-10px'}}></LocalPhoneIcon>
              </InputAdornment>
            </div>
          );

        case 'website':
          return (
            <div>
              <InputAdornment position="start">
                <LanguageIcon style={{fontSize: '20px',color:'orange', marginTop:'-10px'}}></LanguageIcon>
              </InputAdornment>
            </div>
          );

          break;

        case 'fax':
          return (
            <div>
              <InputAdornment position="start">
                <LanguageIcon style={{fontSize: '20px',color:'orange', marginTop:'-10px'}}></LanguageIcon>
              </InputAdornment>
            </div>
          );
          break;

          case 'repair':
          return (
            <div>
              <InputAdornment position="start">
                <HardwareIcon style={{fontSize: '20px',color:'orange', marginTop:'-10px'}}></HardwareIcon>
              </InputAdornment>
            </div>
          );
          break;
          case 'text':
          return (
            <div>
              <InputAdornment position="start">
                <ContactPageIcon style={{fontSize: '20px',color:'orange', marginTop:'-20px'}}></ContactPageIcon>
              </InputAdornment>
            </div>
          );
          break;
          default:


    }
  }