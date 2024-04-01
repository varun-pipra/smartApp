
import { Box } from "@mui/material";


export const ViewBuilderOptions = [
	{
		text: 'New View',
		value: 'new',
		icon: <span className='common-icon-Newgridview'></span>
	}, {
		text: 'Save',
		value: 'save',
		icon: <span className='common-icon-Save'></span>,
		disabled: false,
	},
	{
		text: 'Save As',
		value: 'saveAs',
		icon: <span className='common-icon-Saveas'></span>
	},
	{
		text: 'Edit',
		value: 'edit',
		icon: <span className='common-icon-edit'></span>
	},
	{
		text: 'Delete',
		value: 'delete',
		icon: <span className='common-icon-delete'></span>,
		disabled:false,
	},
];

export const headerData = [
	{
		headerName: 'Column Name',
		rowDrag: true,
		suppressMovable: true,
		rowDragText: (params: any) => { return params.data.headerName },
		menuTabs: [],
		// cellStyle: (params: any) => {
		// 	if (params.data.field === "division") {
		// 		return { display: "none" };
		// 	}
		// 	return null;
		// },
		cellRenderer: (params: any) => {
			return <div>{params.data.headerName}</div>
		}
	},
	{
		headerName: 'Show/Hide Column',
		menuTabs: [],
		suppressMovable: true,
		headerComponent: (params: any) => {
			return (
				<div className="custom-header">
					<span className='hideshow'>{params ? params.displayName : ''}</span>
					{/* {modeStatus == false && <IconMenu
						options={getViewFilters()}
						onChange={handleFilter}
						menuProps={{
							open: true,
							placement: 'bottom-start',
							sx: {
								width: 'fit-content',
								lineheight: '1.5',
								fontSize: '18px !important',
								'& .css-1jxx3va-MuiTypography-root': {
									fontSize: '0.96rem !important',
									color: '#333 !important'
								}
							}
						}}
						buttonProps={{
							className: 'preview-button',
							startIcon: <span className='common-icon-down-arrow' style={{ color: '#5b5b5b' }} />,
							// <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)' }} />,
							disableRipple: true
						}}
					/>} */}
				</div>
			);
		},
		cellStyle: (params: any) => {
			if (!params.value) {
				return { border: "none" };
			}
			return null;
		},
		cellRenderer: (params: any) => {
			if (params.data.field === "costCode" || params.data.field === "costType" || params.data.field === "originalAmount" || params.data.field === "division") {
				return null;
			} else {
				return (<div></div>
					// <IQToggle
					// 	defaultChecked={!params.data.hide}
					// 	switchLabels={['ON', 'OFF']}
					// 	onChange={(e, value) => { handleToggleChange(value, params.data) }}
					// 	edge={'end'}
					// />
				)
			}

		}
	}
];

export const clearObjectValues = (data:any,newdataa:any) => {
	const newData = { ...data };
	for (let key in newData) {
		newData[key] = [];
	}
	return {...newData,...newdataa}
};