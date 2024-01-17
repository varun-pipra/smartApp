import {FormControlLabel, Radio, RadioGroup, Stack} from "@mui/material";
import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import {gridData} from "data/Budgetmanger/griddata";
import {memo} from "react";

import './BudgetImporter.scss';
import IQFileUploadField from "components/iqfileuploadfield/IQFileUploadField";
import IQButton from "components/iqbutton/IQButton";

const BudgetImporter = (props: any) => {
	return <IQBaseWindow
		open={true}
		title='Budget Importer'
		className="bm-importer"
		tools={{
			closable: true
		}}
		PaperProps={{
			sx: {
				width: '50em',
				height: '60%'
			}
		}}
		actions={
			<IQButton color="orange" disabled>
				START IMPORT
			</IQButton>
		}
		{...props}
	>
		<Stack className="bm-type">
			<div>How do you like to start your Budget Import?</div>
			<RadioGroup
				name="import-type"
				value={'new'}
			>
				<FormControlLabel
					value="new"
					control={<Radio />}
					label="New"
					disabled={props?.readOnly}
				/>
				<FormControlLabel
					value="replace"
					control={<Radio />}
					label="Replace"
				/>
				<FormControlLabel
					value="append"
					control={<Radio />}
					label="Append"
				/>
				<FormControlLabel
					value="merge"
					control={<Radio />}
					label="Merge"
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
					Note: Once the template is ready, use that to begin your import process.<br /><br />
					<IQButton
						className="download-template-btn"
						color="orange"
						variant="outlined">
						DOWNLOAD TEMPLATE
					</IQButton>
				</span>
			</div>
		</Stack>
	</IQBaseWindow>;
};

export default memo(BudgetImporter);