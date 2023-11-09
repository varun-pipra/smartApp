import React from 'react';
import './Links.scss';
import UploadMenu from 'sui-components/DocUploader/UploadMenu/UploadMenu';
import IQTooltip from "components/iqtooltip/IQTooltip";
import { IconButton, } from "@mui/material";
import IQSearch from 'components/iqsearchfield/IQSearchField';
import LinkGrid from './LinkGrid';
import { getLinks } from 'features/finance/changeeventrequests/stores/ChangeEventSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import _ from "lodash";

export const LinkGriddata = {
    "data": [
        {
			rowId: 1,
            "id": "f8d350c2-1e60-40cf-be15-df9c5720828b1",
            "code": "CE0019",
            "type": "Vendor Contract",
			"amount": null,
			hasChangeOrder: true,
            "contract": {
                "id": "74ee2ecb-f790-4be4-ad11-4192978c83ce",
                "name": "Seismic control"
            },
            "budgetItem": {
                "revisedBudget": null,
                "originalAmount": 112500.00,
                "id": "90ecd541-2f14-46ba-80e7-f1590df5495c",
                "name": "00118",
                "costType": "L - Labor",
                "costCode": "Sound, Vibration, and Seismic Control 13080",
                "division": "13 - Special Construction",
                "unitCost": 450.00,
                "description": "",
                "unitOfMeasure": "Hours"
            }
        },
        {
			rowId: 2,			
            "id": "f8d350c2-1e60-40cf-be15-df9c5720828b",
            "code": "CE0019",
            "type": "Client Contract",
            "amount": null,
            "contract": {
                "id": "84d1ff1f-4857-4564-ab01-325cdd52d14f",
                "name": "Sesimic Control Contract"
            },
            "budgetItem": {
                "revisedBudget": null,
                "originalAmount": 112500.00,
                "id": "90ecd541-2f14-46ba-80e7-f1590df5495c",
                "name": "00118",
                "costType": "L - Labor",
                "costCode": "Sound, Vibration, and Seismic Control 13080",
                "division": "13 - Special Construction",
                "unitCost": 450.00,
                "description": "",
                "unitOfMeasure": "Hours"
            }
        }
    ]
};
const links = (props: any) => {
	const dispatch = useAppDispatch();	
	const {currentChangeEventId, changeRequestDetails, linksGridData} = useAppSelector(state => state.changeEventRequest);	
	const [deleteButton, setDeleteButton] = React.useState<any>(true);
	const [selectedRows, setSelectedRows] = React.useState<any>([]);
	const [gridData, setGridData] = React.useState<any>([]);
	const [activeFilters, setActiveFilters] = React.useState<any>({})
	const [searchText, setSearchText] = React.useState<string>('')
	

	const filterOptions =  [
		{
			text: "Type",
			value: "type",
			key: "type",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{
						text: 'Vendor Contract',
						value: 'Vendor Contract',
						key: 'vendorContract',
					},
					{
						text: 'Client Contract',
						value: 'Client Contract',
						key: 'clientContract',
			
					},
				],
			},
		},];

	React.useEffect(() => { 
		console.log("linksGridData", linksGridData, changeRequestDetails)
		dispatch(getLinks(changeRequestDetails?.id));
	}, [changeRequestDetails?.id]);

	React.useEffect(() => { 
		console.log(activeFilters, "activeFilters", searchText)
		let data = linksGridData;
		if (searchText !== '') {
			const firstResult = data?.length > 0 && linksGridData?.filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(searchText.toLowerCase());
			});
			data = firstResult
			// setGridData(firstResult);
		} else data = linksGridData;
		if(Object.keys(activeFilters)?.length) {
			if (activeFilters?.type?.length > 0) {
				data = data.filter((rec: any) => {
					return activeFilters?.type?.includes(rec?.type);
				});
			}
		};		
		setGridData(data);
	}, [searchText, activeFilters]);

	React.useEffect(() => {
		setGridData(linksGridData)
	}, [linksGridData])

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
	// const handleOnSearchChange = (text: any) => {
	// 	if (text !== '') {
	// 		const firstResult = linksGridData.length > 0 && linksGridData?.filter((obj: any) => {
	// 			return JSON.stringify(obj).toLowerCase().includes(text.toLowerCase());
	// 		});
	// 		setGridData(firstResult);
	// 	} else {
	// 		setGridData(linksGridData);
	// 	}
	// }

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
					{/* <UploadMenu
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
					</IQTooltip> */}
				</div>
				<div className='right-section'>
					<IQSearch
						placeholder={'Search'}
						showGroups={false}
						filters={filterOptions}
						onSearchChange={(text: string) => setSearchText(text)}
						defaultFilters={activeFilters}
						onFilterChange={(filters: any) => {
							if (filters) {
								let filterObj = filters;
								Object.keys(filterObj).filter((item) => {
									if (filterObj[item]?.length === 0) {
										delete filterObj[item]
									};
								});
								if (!_.isEqual(activeFilters, filterObj)) {
									setActiveFilters(filters)
								};
							};
						}}
					/>
				</div>
			</div>
			<div className='links-grid'>
				<LinkGrid
					data={gridData}
					gridRowSelection={(value: any) => { gridRowSlectionEvent(value) }}
				/>
			</div>
		</div>
	)
}
export default links;