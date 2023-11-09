import {useState,useRef,} from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import useEffect from 'react';
import React from 'react';

export default function ScrollDialog() {
  const [courseList, setCourseList] = useState([
    {
      id: 1,
      name: "Aerial Lift Training",
      img: "img",
      icon: "icon",
      checked:true
    },
    {
      id: 2,
      name: "American Concrete Institure (ACI)",
      img: "img",
      icon: "icon",
      checked:false
    },
    {
      id: 3,
      name: "American Institute of Construction",
      img: "img",
      icon: "icon",
      checked:false
    },
    {
      id: 4,
      name: "Certified Construction Manager (CCM)",
      img: "img",
      icon: "icon",
      checked:false
    },
    {
      id: 5,
      name: "Construction Management Association of America (CCM)",
      img: "img",
      icon: "icon",
      checked:true
    },
    {
      id: 6,
      name: "Certified Safety Manager (CSM)",
      img: "img",
      icon: "icon",
      checked:false
    },
    {
      id: 7,
      name: "Green Business Certificaiton",
      img: "img",
      icon: "icon",
      checked:false
    },
    {
      id: 8,
      name: "National Council of Examiners for Engineering and Surveying (NCEES)",
      img: "img",
      icon: "icon",
      checked:true
    },
    {
      id: 9,
      name: "Outreach Training Program(OSHA)",
      img: "img",
      icon: "icon",
      checked:false
    }
  ])

  let sourceCourseList = [];
  let arrayData:any =[];

  const [filterArray,setFilterArray]=useState([...courseList])

  const [certificationArray, setCertificationarray]= React.useState<any[]>([]);

  const handleToggle = (value:any) => () => {
   
     
  };
  const [open, setOpen] = useState(true);
  const [scroll, setScroll] = useState('paper');
  const [cancel , setCancel] = useState(true);

  const handleClickOpen = (scrollType:any) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchTern = (event:any) => {
    let courseName = event.target.value;
    if (courseName !='') {
      sourceCourseList = filterArray.filter((element:any) => {
        return element.name.toLowerCase().includes(courseName.toLowerCase())
      })
      setCourseList(sourceCourseList);
    } else {
      setCourseList(filterArray);
    }

  }
  const [selectedData, setselectedData] = React.useState<any[]>([]);
  const [displayCertificate , setdisplayCertificate] = useState(false);

  const addItems = () => {
    //arrayData.push(certificationArray)
    arrayData.push(certificationArray)
    setselectedData(certificationArray);
   setdisplayCertificate(true)
  }

  const descriptionElementRef = React.useRef(null);
 React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        // descriptionElement.focus()
      }
    }
  }, [open]);

  return (
    <>

      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
           <div style={{display:'flex' , justifyContent:'space-between'}}>
           <DialogTitle id="scroll-dialog-title"> Select Certifications</DialogTitle>
          <DialogActions> <CancelIcon style={{fontSize:'16px'}}  onClick={()=> setOpen(false)}/></DialogActions>
           </div>
         
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <>
                <TextField id="outlined-search" label="Search field" type="search" style={{ width: '100%' }} onChange={searchTern} />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {courseList.map((value:any) => {
                    const labelId = `checkbox-list-label-${value.id}`;

                    return (
                      <ListItem
                        style={{borderBottom:'1px solid grey'}}
                        key={value.id}
                        secondaryAction={
                          <IconButton edge="end" aria-label="comments">
                            <InfoIcon style={{fontSize:'12px'}} />
                          </IconButton>
                        }
                        disablePadding
                      >
                        <ListItemButton role={undefined} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              
                              tabIndex={-1}
                              disableRipple
                              onChange={()=>setCertificationarray(prevArray => [...prevArray,value])}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemIcon style={{margin:0 ,padding:0}}>
                            < PictureAsPdfIcon
                             style={{fontSize:'14px'}}
                            />
                          </ListItemIcon>
                         

                          <ListItemText id={labelId} primary={value.name} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </>


            </DialogContentText>
          </DialogContent>
          <DialogActions>

            <Button onClick={addItems} style={{background:'orange' , color:'#fff'}}>Add Selected</Button>
          </DialogActions>
          <>
          { selectedData.length > 0 ? selectedData.map((ele:any) => {
              return (
                <div style={{ display: 'flex' }}>
                  <p>{ele.name}</p>
                  {/* <p>{ele.img}</p> */}
                </div>
              )
            }) : null}
          </>
        </Dialog>
      </>
    </>

  );
}