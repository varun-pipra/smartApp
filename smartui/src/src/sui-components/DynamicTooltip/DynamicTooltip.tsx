import * as React from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const DynamicTooltip = ({
	className,
	placement = "bottom",
	arrow = true,
	title = "",
	...props
}: any) => {

	const AutoWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: "none",
		},
	});

	return (
		<AutoWidthTooltip
			enterDelay={500}
			{...props}
			title={title}
			arrow={arrow}
			placement={placement}
		></AutoWidthTooltip>
	);
};

export default DynamicTooltip;
