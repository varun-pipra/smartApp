import React, { useState, useMemo } from 'react';
import { Tabs, Tab, Box, Icon, Badge } from '@mui/material';

import BudgetDetailsBlue from 'resources/images/budgetManager/BudgetDetails.svg';
import BudgetDetailsOrange from 'resources/images/budgetManager/BudgetDetailsOrange.svg'
import BidManagerBlue from 'resources/images/bidManager/BidManager.svg';
import BidManagerOrange from 'resources/images/bidManager/BidManagerOrange.png';
import ReportsAnalyticsBlue from 'resources/images/common/ReportsAnalytics.svg';
import ReportsAnalyticsOrange from 'resources/images/common/ReportsAnalyticsOrange.svg';
import TransactionsBlue from 'resources/images/common/Transactions.png';
import TransactionsOrange from 'resources/images/common/TransactionsOrange.svg';
import StreamsBlue from 'resources/images/common/Streams.svg';
import StreamsOrange from 'resources/images/common/StreamsOrange.svg';

const NavTab = () => {
	const [value, setValue] = React.useState('budget-details');
	const tabIconStyles = useMemo(() => ({ style: { height: '2em', width: '2em' } }), []);
	const tabTitleWithBadgeStyles = useMemo(() => ({ style: { lineHeight: 1 } }), []);
	const tabBadgeStyles = useMemo(() => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		height: '1.5em',
		width: '1.5em',
		backgroundColor: '#ff9800',
		borderColor: '#ff9800',
		borderRadius: '50%'
	}), []);

	const handleTabChange = (event: React.SyntheticEvent, newValue: any) => {
		document.getElementById(newValue)?.scrollIntoView();
		setValue(newValue);
	};

	const scrollHandle = (event: any) => {
		const container = event.target,
			innerNodes = container.children,
			containerRect = container.getBoundingClientRect();

		for (let node of innerNodes) {
			const nodeRect = node.getBoundingClientRect();
			const originalTop = Math.floor(containerRect.top) - Math.floor(nodeRect.top);
			if ((originalTop > -1 && originalTop < Math.floor(nodeRect.height))) {
				setValue(node.id);
			}
		}
	};

	return <div style={{ height: '100vh', border: '1px solid black' }}>
		<Box sx={{ borderBottom: 1, borderColor: 'divider', height: '8%' }}>
			<Tabs value={value} onChange={handleTabChange} sx={{ height: '100%' }}>
				<Tab
					label={<span {...tabTitleWithBadgeStyles}>Budget Details</span>}
					value="budget-details"
					iconPosition="start"
					icon={<Icon {...tabIconStyles}><img src={BudgetDetailsBlue} /></Icon>}
				/>
				<Tab
					label={<><span {...tabTitleWithBadgeStyles}>Transactions</span>&nbsp;<span style={tabBadgeStyles}>8</span></>}
					value="transactions"
					iconPosition="start"
					icon={<Icon  {...tabIconStyles}><img src={TransactionsBlue} /></Icon>}
				/>
				<Tab
					label={<><span {...tabTitleWithBadgeStyles}>Forecast</span>&nbsp;<span style={tabBadgeStyles}>3</span></>}
					value="forecast"
					iconPosition="start"
					icon={<Icon  {...tabIconStyles}><img src={BidManagerBlue} /></Icon>}
				/>
				<Tab
					label={<span {...tabTitleWithBadgeStyles}>Reports & Analysis</span>}
					value="reports-and-analysis"
					iconPosition="start"
					icon={<Icon  {...tabIconStyles}><img src={ReportsAnalyticsBlue} /></Icon>}
				/>
			</Tabs>
		</Box>
		<Box sx={{ height: '92%', overflow: 'auto' }} onScroll={scrollHandle}>
			<div id='budget-details' style={{ height: '100%' }}>
				Budget Details
			</div>
			<div id='transactions' style={{ height: '100%' }}>
				Transactions
			</div>
			<div id='forecast' style={{ height: '100%' }}>
				Forecast
			</div>
			<div id='reports-and-analysis' style={{ height: '100%' }}>
				Reports & Analysis
			</div>
		</Box>
	</div>
};

export default NavTab;

// Underline style
// width: 4em;
//     margin: 0px 0.5em;