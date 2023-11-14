import React from "react";
import './TableColumnCard.scss';
import { Button, Label, Table, TableColumn } from "@ui5/webcomponents-react";
import {
	Accordion,
	AccordionDetails as MuiAccordionDetails,
	AccordionSummary as MuiAccordionSummary,
	AccordionSummaryProps,
	Box,
	IconButton,
	Typography,
} from "@mui/material";
import { Add, Close, DeleteOutline, ExpandMore, } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import ToggleField from "components/togglefield/ToggleField";


const displayWidth: string = "12rem";
const actionWidth: string = "10rem";

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary {...props} />
))(({ theme }) => ({
	borderBottom: "solid 1px rgba(0, 0, 0, .125)",
	flexDirection: "row-reverse",
	gap: "0.5rem",
	minHeight: "auto !important",
	"& .MuiAccordionSummary-content": {
		alignItems: "center",
		gap: "1rem",
		margin: "15px 0 !important",
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: 0,
}));


type TableColumnCardProps = {
	label: string;
	isCustom?: boolean;
	columns: any[];
	handleAddnew(value: any): void;
	handleDelete(index: any): void
};


const TableColumnCard = ({ label, columns, isCustom = false, handleAddnew, handleDelete }: TableColumnCardProps) => {

	const [columnsData, setColumnsData] = React.useState<any>(columns);
	React.useEffect(() => {
		setColumnsData(columns)
	}, [columns])

	const handleInputChange = (name: string, value: boolean, index: number) => {
		const columnsDataClone = [...columnsData]
		columnsDataClone[index].enabled = value;
		setColumnsData([...columnsDataClone])
	}
	return (
		<Accordion defaultExpanded sx={{ boxShadow: "none" }} className='manageTable-Section'>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontWeight={"bold"}>{label}</Typography>
				{isCustom ? (
					<Button icon="add" onClick={(e) => { handleAddnew(e) }} className='addNew-button'>
						Add New
					</Button>
				) : null}
			</AccordionSummary>
			<AccordionDetails>
				{columnsData.length
					? columnsData.map((column: any, index: number) => (
						<Box borderBottom={"solid 1px #d3d3d3"} pl={6} key={"index " + index}>
							<table style={{ width: "100%" }} className='manageTable'>
								<tbody>
									<tr>
										<td style={{ color: isCustom ? '#0590cd' : '' }}>{column.name}</td>
										<td style={{ padding: "0.5rem", width: displayWidth }}>
											{column.enableToggle ? (
												<ToggleField
													checked={column.enabled}
													switchLabels={['ON', 'OFF']}
													onChange={(e, value) => { handleInputChange('enabled', value, index) }}
												/>
											) : (
												<Box pt={2}>&nbsp;</Box>
											)}
										</td>
										<td style={{ padding: "0.5rem", width: actionWidth }}>
											{isCustom ? (
												<DeleteOutline sx={{ color: "rgb(106, 109, 112)", cursor: 'pointer' }} onClick={() => { handleDelete(index) }} />
											) : null}
										</td>
									</tr>
								</tbody>
							</table>
						</Box>
					))
					: null}
			</AccordionDetails>
		</Accordion>
	);
};




export default TableColumnCard;