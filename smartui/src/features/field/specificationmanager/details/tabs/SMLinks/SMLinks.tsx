import React from 'react';
import './SMLinks.scss';
import UploadMenu from 'sui-components/DocUploader/UploadMenu/UploadMenu';
import IQTooltip from "components/iqtooltip/IQTooltip";
import { IconButton, } from "@mui/material";
import IQSearch from 'components/iqsearchfield/IQSearchField';
// import LinkGrid from './LinkGrid';
const LinkGriddata = [
	{
		"id": "809e5839-98f0-4dfc-8523-f32703b5185a",
		"contractname": "0001-01-General Requirement",
		"name": 'wing 1-5 Painting',
		"type": "vendor Contract",
		"contractvalue": 74000,
		"eventamount": 9000,
		"revisedbudget": 30000,
	},
	{
		"id": "809e5839-98f0-4dfc-8523-f32703b8185b",
		"contractname": "0001-01-General Requirement",
		"name": 'south wing',
		"type": "client Contract",
		"contractvalue": 74000,
		"eventamount": 9000,
		"revisedbudget": 30000,
	},
	{
		"id": "309e5839-98f0-4dfc-8523-f32703b5185f",
		"contractname": "0002-01-General Requirement",
		"name": 'wing 1-5 Painting',
		"type": "vendor Contract",
		"contractvalue": 42000,
		"eventamount": 18000,
		"revisedbudget": 30000,
	},
	{
		"id": "309e5839-98f0-4dfc-8523-f32703b8185k",
		"contractname": "0002-01-General Requirement",
		"name": 'south wing',
		"type": "client Contract",
		"contractvalue": 42000,
		"eventamount": 18000,
		"revisedbudget": 30000,
	},

]
const SMLinks = (props: any) => {
	const [deleteButton, setDeleteButton] = React.useState<any>(true);
	const [selectedRows, setSelectedRows] = React.useState<any>([]);
	const [gridData, setGridData] = React.useState<any>([]);

	React.useEffect(() => { setGridData(LinkGriddata) }, [LinkGriddata]);

	const onItemClick = (value: any) => {
		console.log('value', value)
	}
	const deleteHandleClick = () => {
		console.log('delete', selectedRows)
	}
	const gridRowSlectionEvent = (data: any) => {
		if (data.length > 0) { setDeleteButton(false); setSelectedRows(data); }
		else { setDeleteButton(true); setSelectedRows(data); }
	}
	const handleOnSearchChange = (text: any) => {
		console.log('search', text)
	}

	return (
		<div className='ev-links'>
			<div className='eventrequest-details-box'>
				<div className='eventrequest-details-header'>
					<div className='title-action'>
						<span className='common-icon-Links iconmodify'></span>
						<span className='title' style={{ marginLeft: '6px' }}>Links</span>
					</div>
				</div>
			</div>
			<div className='link-headersection'>
				<div className='left-section'>
					<UploadMenu
						showDriveOption={true}
						showContractOption={true}
						label={'Add LInks'}
						folderType={props?.folderType}
						onItemClick={onItemClick}
						dropdownLabel={'Select Type'}
					/>
					<IQTooltip title="Delete" placement="bottom">
						<IconButton
							className="delete-btn"
							disabled={deleteButton}
							onClick={() => { deleteHandleClick() }}
						>
							<span className="common-icon-delete"></span>
						</IconButton>
					</IQTooltip>
				</div>
				<div className='right-section'>
					<IQSearch
						placeholder={'Search'}
						showGroups={false}
						onSearchChange={(text: string) => handleOnSearchChange(text)}
					/>
				</div>
			</div>
			<div className='links-grid'>
				{/* <LinkGrid
					data={gridData}
					gridRowSelection={(value: any) => { gridRowSlectionEvent(value) }}
				/> */}
			</div>
		</div>
	)
}
export default SMLinks;