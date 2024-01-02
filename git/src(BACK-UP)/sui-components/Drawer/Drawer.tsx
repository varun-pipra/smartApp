import { Drawer } from "@mui/material";
import Draggable from 'react-draggable';
interface SUIDrawerProps {
	PaperProps?: object;
	anchor?: any;
	variant?: any;
	elevation?: any;
	open?: boolean;
	children?: any;
	sx?: any;
	className?: any;
}

const SUIDrawer = (props: SUIDrawerProps) => {
	const {
		open,
		PaperProps,
		anchor,
		variant,
		elevation,
		sx,
		className
	} = props;

	return (
		<Drawer
			PaperProps={PaperProps}
			anchor={anchor}
			variant={variant}
			elevation={elevation}
			open={open}
			sx={sx}
			className={className}
		>
			{props.children}
		</Drawer>
	);
};

SUIDrawer.defaultProps = {
	open: false,
	PaperProps: {},
	anchor: 'left',
	variant: 'permanent',
	elevation: 16,
	sx: {}
}

export default SUIDrawer;
