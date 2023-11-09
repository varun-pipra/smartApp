import { Button, InputAdornment, Grid, InputLabel, MenuItem, Popover, TextField, Typography, Box } from "@mui/material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { setDescriptionModal, setLineItemDescription, showRightPannel } from "../operations/tableColumnsSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import globalStyles, { primaryIconSize } from "../BudgetManagerGlobalStyles";
import React from "react";
import './AddDescription.scss'
import IQTooltip from "components/iqtooltip/IQTooltip";
import { updateBudgetLineItem } from "../operations/gridAPI";
import { getServer } from "app/common/appInfoSlice";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { fetchGridData } from "../operations/gridSlice";
import EditIcon from "resources/images/common/Edit.svg"
import { makeStyles, createStyles } from '@mui/styles';
export interface AddDescriptionProps {
	value?: string;
	showicon?: boolean;
}
export const AddDescription = ({ value, showicon = true }: AddDescriptionProps) => {
	const dispatch = useAppDispatch();
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	const { showDescriptionModal, lineItemDescription } = useAppSelector(state => state.tableColumns);
	const { selectedRow } = useAppSelector(state => state.rightPanel);
	const [showEdit, setShowEdit] = React.useState<boolean>(false);
	const [focus, setFocus] = React.useState<boolean>(false);
	const [hover, setHover] = React.useState<boolean>(false);
	const appInfo = useAppSelector(getServer);
	const rightPannel = useAppSelector(showRightPannel);

	const useStyles = makeStyles({
		customTextField: {
			"& input::placeholder": {
				fontSize: "20px"
			}
		}
	});

	const handleChange = (e: any) => {
		dispatch(setLineItemDescription(e.target.value));
	}

	const onBlurDescription = () => {
		if (rightPannel && !focus) {
			const payload = {
				division: selectedRow?.division,
				costCode: selectedRow?.costCode,
				costType: selectedRow?.costType,
				estimatedStart: convertDateToDisplayFormat(selectedRow?.estimatedStart),
				estimatedEnd: convertDateToDisplayFormat(selectedRow?.estimatedEnd),
				curve: selectedRow.curve,
				originalAmount: selectedRow?.originalAmount,
				unitOfMeasure: selectedRow?.unitOfMeasure,
				unitQuantity: selectedRow?.unitQuantity,
				unitCost: selectedRow?.unitCost,
				status: 0,
				description: lineItemDescription,
				locationIds: selectedRow?.locations?.map((item: any) => item.id) || [],
				addMarkupFee: selectedRow?.addMarkupFee,
				markupFeeType: selectedRow?.markupFeeType,
				markupFeeAmount: !selectedRow?.addMarkupFee ? null : selectedRow?.markupFeeAmount,
				markupFeePercentage: !selectedRow?.addMarkupFee ? null : selectedRow?.markupFeePercentage,
				equipmentModel: selectedRow?.equipmentModel,
				equipmentManufacturer: selectedRow?.equipmentManufacturer,
				equipmentManufacturerId: selectedRow?.equipmentManufacturerId,
				equipmentCatalogId: selectedRow?.equipmentCatalogId
			}

			updateBudgetLineItem(appInfo, selectedRow.id, payload, (response: any) => {
				dispatch(fetchGridData(appInfo));
			});
		}
	}

	return (
		<div className='main-container'>
			{/* <Grid item sm={3.5}> */}
			<IQTooltip title={lineItemDescription} arrow open={lineItemDescription?.length > 40 && hover ? true : false}>
				<TextField
					id="description"
					variant='standard'
					fullWidth
					focused={focus}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => { setFocus(false); setHover(false) }}
					onClick={() => lineItemDescription === '' ? setFocus(true) : null}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								{showicon &&
									// rightPannel ? null :
									<div className='common-icon-adminNote' style={{ fontSize: '1.5rem' }}></div>
									// <DescriptionOutlinedIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />
								}
							</InputAdornment>

						),
						endAdornment: (
							<InputAdornment position="end">
								<ModeEditIcon fontSize={primaryIconSize} style={{ color: '#8080808f' }} onClick={() => setFocus(true)} />
								{/* <div className='budget-pencil'></div> */}
								{/* <Box component='img' alt='Edit' src={EditIcon} width={25} height={25}  /> */}
							</InputAdornment>

						)
					}}
					sx={{
						"& .MuiInputBase-input": {
							overflow: "hidden",
							textOverflow: "ellipsis"
						},

					}}
					placeholder='Enter Description'
					name='description'
					value={value}
					onChange={(e: any) => handleChange(e)}
					onBlur={onBlurDescription}
					style={{ width: rightPannel ? '25em' : '96.8%', marginTop: '-4px' }}
					className='description'
				/>
			</IQTooltip>
		</div>
	);
}
