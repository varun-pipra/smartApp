import { Button, Checkbox, FormControlLabel, InputAdornment, InputLabel, Radio, TextField } from "@mui/material";
import "./PublishBudget.scss"
import SUIDialog from "sui-components/Dialog/Dialog";
// import SUINotificationBar from "sui-components/NotificationBar/NotificationBar";
import SMSpecBookDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import { useEffect, useState } from "react";
import SmartDropDown from "components/smartDropdown";
import { useAppSelector } from "app/hooks";

const PublishBudget =(props:any)=>{
    const {setOpen , onPublishBudgetClose , ...res} = props
    const [checkBoxValue , setCheckBoxValue] = useState('')
    const [budgetName, setBudgetName] = useState('')
	const { phaseDropDownOptions } = useAppSelector((state) => state.sbsManager);

    useEffect(()=>{
        console.log(checkBoxValue)
    },[checkBoxValue])
    const publishBudgetContent =()=>{
        return (
            <>
                <div>
                   <p>How do you want to Publish the selected Estimate to the Budget?</p> 
                </div>
                <div className="budget-redio-options" >
                    <div  className={`budget-redio-option ${checkBoxValue === 'AddToExistingBudget' ? 'active-radio-contaner' : 'inactive-radio-container'}` }>
                        <FormControlLabel
                        // value={'UpdateExisting'}
                        // control={<Radio />}
                        label='Add to Existing Budget'
                        labelPlacement="start"
                        control={
                            <Radio
                                checked={checkBoxValue === 'AddToExistingBudget'}
                                onChange={(value:any) => setCheckBoxValue('AddToExistingBudget')}
                                value="a"
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'A' }}
/>
                        }
                        sx={{
                            marginLeft: '0px !important',
                            marginRight: '0px !important',
                            display: 'flex !important',
                            justifyContent: 'space-between',
                            '& .MuiTypography-root': {
                                paddingLeft: '0px !important',
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </div>
                <div style={{marginLeft: "30px"}} className={`budget-redio-option  ${checkBoxValue === 'createNewBudget' ? 'active-radio-contaner' : 'inactive-radio-container' }`}>
                    <FormControlLabel
                        value={'UpdateExisting'}
                        control={ 
                            <Radio
                            checked={checkBoxValue === 'createNewBudget'}
                                onChange={(value:any) => setCheckBoxValue('createNewBudget')}
                                value="a"
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'A' }}
                            />}
                        label='Create New Budget'
                        labelPlacement="start"
                        sx={{
                            marginLeft: '0px !important',
                            marginRight: '0px !important',
                            display: 'flex !important',
                            justifyContent: 'space-between',
                            '& .MuiTypography-root': {
                                paddingLeft: '0px !important',
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </div>
                
                </div>
                <div className="budget-droup-down-field-contaner">
					
					<div>
						{ checkBoxValue === "AddToExistingBudget" ? (
                            <>
                            <div >Budget</div>
							<span
							>
                            <SmartDropDown
                                    LeftIcon={<div className="common-icon-phase"></div>}
                                    options={phaseDropDownOptions || []}
                                    outSideOfGrid={true}
                                    isSearchField={true}
                                    isFullWidth
                                    Placeholder={"Select"}
                                    // selectedValue={formData?.sbsPhaseName}
                                    // menuProps={classes.menuPaper}
                                    // handleChange={(value: any) => {
                                    // const selRec: any = phaseDropDownOptions.find(
                                    // 	(rec: any) => rec.value === value[0]
                                    // );
                                    // handleDropdownChange(selRec, "sbsPhaseId");
                                    // }}
                                    ignoreSorting={true}
                                    showIconInOptionsAtRight={true}
                                    // handleAddCategory={(val:any) => handlePhaseAdd('phase', val)}
                                    // isCustomSearchField={showAddIcon}
                                    // dynamicClose={dynamicClose}
                                    // handleSearchProp={(items:any, key:any) => handleSearchProp(items, key)}
                                />
                                 </span>
                                 </>
                        ):<div className='bid-name-field'>
                             <div >Budget Name</div>
                        <TextField
                            id='name'
                            fullWidth
                            placeholder={'Enter Name of the Budget'}
                            name='name'
                            variant='standard'
                            value={budgetName}
                            onChange={(e: any) => setBudgetName(e.target?.value)}
                        />
                    </div>
                    }
                       
				    </div>
                </div>
            </>
        )
    }

    const onActionClick =(action:any)=>{
        onPublishBudgetClose()
    }

    const customBtns =()=>{
        return(
            <>
            <Button className="cancel-cls" onClick={onPublishBudgetClose}>CANCEL</Button>
            <Button className="yes-cls" variant="contained" autoFocus disabled={checkBoxValue === 'createNewBudget' && budgetName.length < 1}>
                PUBLISH 
            </Button>
            </>
        )  
    }

    return(
        <SMSpecBookDailog
        open={setOpen}
        contentText={publishBudgetContent()}
        title={""}
        showActions={false}
        dialogClose={true}
        helpIcon={false}
        iconTitleContent={
            <div style={{display: "flex", alignItems: "center"}}>
                <div>Publish to Budget</div>
            </div>
        }
        onAction={(type:any, action:any) => {
            onActionClick(action)
        }}
        customButtons={true}
        customButtonsContent={customBtns()}
    />
    )

}

export default PublishBudget;