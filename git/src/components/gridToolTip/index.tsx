import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Tabs, Tab, Popper, Button } from '@mui/material';

import './styles.scss';
import { Assessment, AttachFile, CalendarMonth, Close, CorporateFare, Info, Security } from '@mui/icons-material';
import TabPanel from './tabPanel';

export interface IToolbar {
	icon: any,
	component: any
}

export interface IGridTooltipProps {
	// This prop accepts any children with wraps the component to render the tooltip.
	children: any,

	// This prop accepts icon and component to render in the bottom toolbar.
	toolbar: Array<IToolbar>
}

export default function GridToolTip(props: IGridTooltipProps) {
	const { toolbar } = props;

	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<div>
			<Button
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup="true"
				onClick={handlePopoverOpen}
			>
				Grid Tooltip
			</Button>
			<Popover
				id="mouse-over-popover"
				// sx={{
				// 	pointerEvents: 'none',
				// }}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
			// disableRestoreFocus
			>
				<div className="tooltip-wrapper">
					<div className="header">
						<div className="title">
							header
						</div>
						<IconButton onClick={handlePopoverClose}>
							<Close />
						</IconButton>
					</div>
					<div className="content">
						{toolbar.map((tool, index) => {
							return <TabPanel value={value} index={index}>
								{tool.component}
							</TabPanel>
						})}
					</div>
					<div className="footer">
						<Tabs TabIndicatorProps={{ style: { backgroundColor: '#ed7532', height: '4px', top: 0 } }} value={value} onChange={handleChange} aria-label="icon tabs example">
							{toolbar.map((tool, index) => {
								return <Tab key={index} icon={tool.icon} aria-label="phone" />
							})}
						</Tabs>
					</div>
				</div>
			</Popover>
		</div>
	);
}
