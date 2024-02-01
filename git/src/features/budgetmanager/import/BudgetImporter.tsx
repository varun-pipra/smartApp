import {FormControlLabel, Radio, RadioGroup, Stack} from "@mui/material";
import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import {gridData} from "data/Budgetmanger/griddata";
import {memo} from "react";

import './BudgetImporter.scss';
import IQFileUploadField from "components/iqfileuploadfield/IQFileUploadField";
import IQButton from "components/iqbutton/IQButton";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getTemplateForBudget } from "../operations/tableColumnsSlice";
import { getServer } from "app/common/appInfoSlice";
import React from "react";

const BudgetImporter = (props: any) => {
	const dispatch = useAppDispatch();	
	const appInfo = useAppSelector(getServer);
	const ref = React.useRef<HTMLAnchorElement | null>(null);	

	const onDownloadTemplate = () => {
		dispatch(getTemplateForBudget(appInfo))?.then((data:any) => {
			console.log("downloadTemplateUrl", data)
			const url = URL.createObjectURL(new Blob([data]));
			ref.current?.click();
			URL.revokeObjectURL(url);
		});
	}
	return <IQBaseWindow
		open={true}
		title='Budget Importer'
		className="bm-importer"
		minHeight='300px'
		tools={{
			closable: true
		}}
		actions={
			<IQButton color="orange">
				START IMPORT
			</IQButton>
		}
		{...props}
	>
		<Stack className="bm-type">
			<div className="question-cls">How do you like to start your Budget Import?</div>
			<RadioGroup
				name="import-type"
				value={'new'}
			>
				{props?.noOfBudgetItems == 0 && <FormControlLabel
					value="new"
					control={<Radio />}
					label="New"
				/>}
				<FormControlLabel
					value="replace"
					control={<Radio />}
					label="Replace"
					disabled={!props?.noOfBudgetItems}					
				/>
				<FormControlLabel
					value="append"
					control={<Radio />}
					label="Append"
					disabled={!props?.noOfBudgetItems}					
				/>
				<FormControlLabel
					value="merge"
					control={<Radio />}
					label="Merge"
					disabled={!props?.noOfBudgetItems}					
				/>
			</RadioGroup>
		</Stack>
		<Stack>
			<IQFileUploadField
				label='Select File to Import'
				placeholder='Note: Supported file .xlsx or .xls'
				onFileChange={() => {}}
			/>
		</Stack>
		<Stack className="info-box">
			<div className="info-container">
				<span className='info-icon common-icon-info-white'></span>
				<span className='info-text'>We recommend you to first download the standard budget template and use this template to build your data file.<br />
					Note: Once the template is ready, use that to begin your import process.<br />
					<IQButton
						className="download-template-btn"
						color="orange"
						variant="outlined"
						onClick={() => onDownloadTemplate()}
					>
						DOWNLOAD TEMPLATE
					</IQButton>
				</span>
			</div>
		</Stack>
	</IQBaseWindow>;
};

export default memo(BudgetImporter);