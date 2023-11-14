import { Button, ButtonDesign, List, StandardListItem, ListSeparators } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/expense-report.js";

import React from 'react';
import Stack from '@mui/material/Stack';
import CreateBudgetTransfer from 'components/createBudgetTransfer';
const BudgetTransferPanel = () => {
	const [openBudgetTransfer, setOpenBudgetTransfer] = React.useState<boolean>(false);
	const handleOnClose = () => {
		setOpenBudgetTransfer(false)
	}
	return (<>
		<div style={{ marginLeft: '5px' }}>

			<Button style={{ marginLeft: '15px', border: "1px solid #0590cd", color: "#0590cd", fontWeight: 'bold' }} id='budget-transfer' icon='expense-report' onClick={() => { setOpenBudgetTransfer(true) }}>Create Budget Transfer</Button>
			<List
				headerText="Budget Reports"
				separators={ListSeparators.None}
			>
				<StandardListItem>
					Budget Modifications
				</StandardListItem>
				<StandardListItem>
					Budget Summary Report
				</StandardListItem>
				<StandardListItem>
					Budget Daily Report
				</StandardListItem>
			</List>
			<br />
			<List
				headerText="Custom Reports"
				separators={ListSeparators.None}
			>
				{/* <StandardListItem>
                    Budget Modifications
                </StandardListItem> */}

			</List>
		</div>
		{openBudgetTransfer ? <CreateBudgetTransfer open={true} handleClose={handleOnClose} /> : <></>}

	</>)

}

export default BudgetTransferPanel;