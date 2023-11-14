import React, { useEffect, useMemo, useRef } from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import SafetyViolationForm from "./SafetyViolationForm";
import IQButton from "components/iqbutton/IQButton";
const SUISafetyViolationTooltip = (props: any) => {
	const { userData, onCloseForm,activeTab, ...others } = props;
	const [openTooltip, setOpenTooltip] = React.useState(false);
	const iconRef = useRef<any>();
	const handleOpen = () => {
		setOpenTooltip(true);
	};
	const handleClose = (formData?: any) => {
		setOpenTooltip(false);
		if (formData?.category !== "" &&
			formData?.type !== "" &&
			formData?.date !== "") {
			onCloseForm();
		};
	};
	const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))
		({
			[`& .${tooltipClasses.tooltip}`]: {
				maxWidth: '700px',
				minHeight: '260px',
				backgroundColor: '#fff',
				padding: '0px',
				color: '#fff',
				boxShadow: '0px 1px 4px 0px #dadada',
				':before': {
					color: '#fff'
				}
			},
		});
	useEffect(() => {
			if(activeTab !== 'safetyViolation' && openTooltip) {
				handleClose();
			}
	},[activeTab])
	const onOutsideClick = (e: any) => {
		const { target } = e;
		if (
			!iconRef.current.contains(target)
		) {
			//setOpenTooltip(false);
		} else {
			setOpenTooltip(true);
		}
	};

	useEffect(() => {
		window.addEventListener("click", onOutsideClick);

		return () => {
			window.removeEventListener("click", onOutsideClick);
		};
	}, []);

	const VilationForm = useMemo(() => {
    	return <SafetyViolationForm userData={userData} onClose={handleClose} />;
  	}, [userData]);

	return (
		<CustomWidthTooltip
			sx={{
				marginTop: "-20px !important",
				".MuiTooltip-arrow:: before": {
					color: '#fff',
					boxShadow: '0px 1px 4px 0px #dadada'
				}
			}}
			arrow
			title={VilationForm}
			PopperProps={{
				disablePortal: true,
			}}
			open={openTooltip}
			disableFocusListener
			disableHoverListener
			disableTouchListener
			onClose={handleClose}
			onOpen={handleOpen}
			placement="bottom-start"
		>
			<IconButton size="small" aria-label="Info" className="info-tooltip-cls" color="primary" ref={iconRef}
			// sx={{
			// 	'.MuiButtonBase-root': {
			// 		'&:hover': {
			// 			backgroundColor: '#fff'
			// 		}
			// 	}
			// }}
			>
				<IQButton
					sx={{ height: "2.5em" }}
					color="blue"
					className="add-standard-btn"
					disabled={false}
					ref={iconRef}
				>
					+ Add Safety Violation
				</IQButton>
			</IconButton>
		</CustomWidthTooltip>
	);
};
SUISafetyViolationTooltip.defaultProps = {
	tooltipData: [],
};
export default SUISafetyViolationTooltip;
