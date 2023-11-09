import React from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, InputLabel } from '@mui/material';
import Card from '@mui/material/Card';
import { Grid, Stack, Box } from '@mui/material';
import Icon from '@mui/material/Icon';

import { InventoryPageValidation } from './InventoryPageValidation';
import InventorySection, { InventoryObjectProps } from './inventorySection/InventorySection';
import SmartCounter from 'components/smartcounter/SmartCounter';
import Toast from 'components/toast/Toast';
import SmartDialog from 'components/smartdialog/SmartDialog';
import logo from '../../../resources/images/DrillingMachine.png';
import './InventoryPage.scss';

const title = <>Tools and Equipment - Inventory</>;

export interface InventoryHeaderObj {
	modelName: string;
	modelNumber: string;
	noOfItems: number;
	applySelectedDataToAllItems: boolean;
}

interface InventoryPageProps {
	inventoryHeaderData: InventoryHeaderObj;
	onInventoryObjectsUpdate?: (inventoryValuesArray: InventoryObjectProps[]) => void;
	open: boolean;
	onClose: () => void
}

export default function InventoryPage(props: InventoryPageProps) {
	const [numberOfItems, setNumberOfItems] = React.useState<number>(0)
	const [inventoryobject, setInventoryobject] = React.useState<InventoryObjectProps[]>([])
	const [checked, setChecked] = React.useState<boolean>(false)
	const [disableAddButton, setDisableAddButton] = React.useState(true);
	const [displayToast, setDisplayToast] = React.useState<boolean>(false);

	React.useEffect(() => {
		getNumberOfItems(props.inventoryHeaderData?.noOfItems)
		setChecked(props.inventoryHeaderData?.applySelectedDataToAllItems)
	}, [props.inventoryHeaderData])

	function updateInventoryObjectsBasedOnFirst(checkedStatus: any) {
		const inventoryObjClone: InventoryObjectProps[] = inventoryobject.map((obj, index) => {
			if (index > 0) {
				return {
					...obj,
					status: checkedStatus ? inventoryobject[0]['status'] : '',
					procurementType: checkedStatus ? inventoryobject[0]['procurementType'] : ''
				}
			} return obj;
		})
		setInventoryobject(inventoryObjClone);
	}

	React.useEffect(() => {
		setDisableAddButton(InventoryPageValidation(inventoryobject));
	}, [inventoryobject])

	function getNumberOfItems(value: number) {
		if (numberOfItems < value && value > 0) {
			const newInventoryArray = []
			for (let i = 0; i < (value - numberOfItems); i++) {
				let id = numberOfItems + i + 1
				const newInventoryObject = {
					'id': id,
					'toolName': props.inventoryHeaderData?.modelName + '-' + id,
					'rtlsTagNo': '',
					'status': checked && inventoryobject[0] ? inventoryobject[0]['status'] : '',
					'procurementType': checked && inventoryobject[0] ? inventoryobject[0]['procurementType'] : '',
					'uniqueId': '',
				}
				newInventoryArray.push(newInventoryObject)
			}
			setInventoryobject([...inventoryobject, ...newInventoryArray]);

		}
		else {
			for (let i = 0; i < (numberOfItems - value); i++) {
				value >= 0 ? inventoryobject.splice(numberOfItems - i - 1, 1) : '';
			}

			setDisableAddButton(InventoryPageValidation(inventoryobject));
		}
		setNumberOfItems(value);

	}

	const handleOnChange = (updatedobj: InventoryObjectProps) => {
		inventoryobject.map((obj, index) => {
			if (updatedobj.id == obj.id) {
				inventoryobject[index] = updatedobj;
				updatedobj.id === 1 ? updateInventoryObjectsBasedOnFirst(checked) : '';
			}
		})

		setDisableAddButton(InventoryPageValidation(inventoryobject));
	}

	const handleCheckbox = (checkedStatus: boolean) => {
		setChecked(checkedStatus)
		updateInventoryObjectsBasedOnFirst(checkedStatus)
	}
	const handleAdd = () => {
		setDisplayToast(true)
		if (props.onInventoryObjectsUpdate) props.onInventoryObjectsUpdate(inventoryobject)

	}

	return (
		<>
			<SmartDialog
				open={props.open}
				PaperProps={{
					sx: { height: "90%", width: "80%" },
				}}
				custom={{
					closable: true,
					title: title,
				}}
				onClose={props.onClose}
			>
				<Grid container className="inventorypage-container">
					<Grid item sm={1.3} mr={1}>
						<Card variant='outlined' className="inventory-imgcard">
							<Box className="qr-code-img" component="img" alt="QR Code" src={logo} />
						</Card>
					</Grid>
					<Grid item sm={10.6}>
						<Card variant='outlined' className="inventory-contentcard">
							<Grid container spacing={2}>

								<Grid item sm={8}>
									<InputLabel >{'Model Name'}</InputLabel>
									<Stack direction="row">
										<Icon color={'warning'} sx={{ margin: '0px 10px 0px 0px' }}>{'home'}</Icon>
										<InputLabel className="modelname">{props.inventoryHeaderData?.modelName}</InputLabel>
									</Stack>
								</Grid>

								<Grid item sm={4}>
									<InputLabel>{'Model Number'}</InputLabel>
									<Stack direction="row">
										<Icon color={'warning'} sx={{ margin: '0px 10px 0px 0px' }}>{'home'}</Icon>
										<InputLabel className="modelnumber">{props.inventoryHeaderData?.modelNumber}</InputLabel>
									</Stack>
								</Grid>

								<Grid item sm={8}>
									<SmartCounter inputChange={getNumberOfItems} textColor={'#ed6c02'} label={'How many of these items would you like to add?'} defaultValue={numberOfItems} color={'default'}></SmartCounter>
								</Grid>

								<Grid item sm={4}>
									<FormControlLabel
										value="start"
										control={<Checkbox checked={checked} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleCheckbox(checked)} />}
										label={'Apply Selected data to all items'}
										labelPlacement="start"
									/>
								</Grid>

							</Grid>
						</Card>

					</Grid>
				</Grid>

				<Stack className='Inventory-section'>
					{inventoryobject.map((data: any, index) => (
						<InventorySection id={data.id} key={'inventory-section' + index} onChange={(updatedobj: InventoryObjectProps) => handleOnChange(updatedobj)} inventoryobject={data} />
					))}
				</Stack>

				<Stack className='Inventory-button-section'>
					<Box display="flex" justifyContent="end" alignItems="end" >
						<Button color={'warning'} size={'large'} variant={'contained'} onClick={handleAdd} disabled={disableAddButton}>ADD</Button>
					</Box>
				</Stack>
				{displayToast ?
					<Toast message={numberOfItems + ' tools are added to inventory'} showclose={true} /> : <></>
				}
			</SmartDialog>
		</>)

}
