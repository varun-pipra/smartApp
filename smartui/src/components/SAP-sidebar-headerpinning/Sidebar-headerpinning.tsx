import * as React from 'react';
import './Sidebar-headerpinning.scss';
import { DynamicPage, DynamicPageHeader, DynamicPageTitle, FlexBox, Button, Label, Input, Title, Grid, Avatar } from '@ui5/webcomponents-react';
import { Box } from '@mui/material';

export interface OptionProps {
	image: string;
	date: string;
	orginalBudget: number;
	currentBudget: number;
	remainingBalance: number;
}
export interface headerprops {
	headerdata: OptionProps;
}
const SidebarHeaderPinning = (props: headerprops) => {

	return (
		<div className='sidbar-headerPinning'>
			<DynamicPage
				headerTitle={<></>}
				headerContent={
					<DynamicPageHeader style={{ padding: '20px 100px 20px 50px' }} className=''>
						<Grid className="" style={{}}>
							<div data-layout-span="XL6 L6 M6 S6" className='leftSection'>
								<FlexBox>
									<Box className="user-image" component="img" alt="QR Code" src={props.headerdata.image} />
									<FlexBox wrap="Wrap" direction="Column" alignItems="Start" className='user-details'>
										<Label className='lastModified'>Last Modified:</Label>
										<Title level="H6" className='dateTime'>{props.headerdata.date}</Title>
									</FlexBox>
								</FlexBox>
							</div>
							<div data-layout-span="XL6 L6 M6 S6" className='rightSection'>
								<FlexBox wrap="Wrap" direction="Column" className='budget-amount-container'>
									<FlexBox className='budgetSection' alignItems="End"> <Title className="budgetTag" level="H5">Original Budget:  </Title><Label className='amountLabel'>$ {props.headerdata.orginalBudget}</Label></FlexBox>
									<FlexBox className='budgetSection'> <Title className="budgetTag" level="H5">Current Budget:  </Title><Label className='amountLabel'>$ {props.headerdata.currentBudget}</Label></FlexBox>
									<FlexBox className='budgetSection'> <Title className="balanceTag" level="H5">Remaining Balance:  </Title><Label className='balanceLabel'>$ {props.headerdata.remainingBalance}</Label></FlexBox>
								</FlexBox>
							</div>
						</Grid>
					</DynamicPageHeader>
				}

				onToggleHeaderContent={function noRefCheck() { }}
				style={{
					maxHeight: '700px',
					background: 'white'
				}}
			>
				Add content here
			</DynamicPage>
		</div>
	)
};

export default SidebarHeaderPinning;