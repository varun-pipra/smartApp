import React, { useEffect, useRef } from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import "./AwardedBidderTooltip.scss";
import { styled } from "@mui/material/styles";
import { useAppSelector, useAppDispatch } from "app/hooks";
//import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//import EmojiEventsSharpIcon from "@mui/icons-material/EmojiEventsSharp";
import { ListItemAvatar, Avatar } from "@mui/material";
const SUIAwardedBidderTooltip = (props: any) => {
	const [openTooltip, setOpenTooltip] = React.useState(false);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const logoIcon =
		"https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png";
	const iconRef = useRef<any>();

	const handleOpen = () => {
		setOpenTooltip(true);
	};

	const handleClose = () => {
		setOpenTooltip(false);
	};

	const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: 500,
		},
	});

	const onOutsideClick = (e: any) => {
		const { target } = e;
		if (
			!iconRef.current.contains(target)
		) {
			setOpenTooltip(false);
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

	const tootilpTmpl = () => {
		return (
			<div className="sa-awarded-bidder-tooltip">
				<span onClick={handleClose} className="sa-awarded-bidder-tooltip_close-icon common-icon-Cancel" ></span>
				<table>
					<thead>
						<tr className="sa-awarded-bidder-tooltip_header-row">
							<th className="sa-awarded-bidder-tooltip_th sa-awarded-bidder-tooltip_award-th"></th>
							<th className="sa-awarded-bidder-tooltip_th sa-awarded-bidder-tooltip_company-th">
								Company
							</th>
							<th className="sa-awarded-bidder-tooltip_th sa-awarded-bidder-tooltip_bid-th">
								Bid Value
							</th>
						</tr>
					</thead>
					<tbody>
						{(props.tooltipData || []).map((row: any) => (
							<tr
								key={row.company}
								className={
									"sa-awarded-bidder-tooltip_row " +
									(row.isAwarded ? "active" : "")
								}
							>
								<td className="sa-awarded-bidder-tooltip_td sa-awarded-bidder-tooltip_award-td">
									{row.isAwarded ? <span className='common-icon-awarded-gray'></span> : ""}
								</td>
								<td className="sa-awarded-bidder-tooltip_td  sa-awarded-bidder-tooltip_company-wrapper">
									<div className="sa-awarded-bidder-tooltip_company-wrapper-inner">
										{/* <img className="sa-awarded-bidder-tooltip_company-logo" src={row.logo ? row.logo : logoIcon} /> */}
										{row.logo ? <Avatar
											sizes="medium"
											alt={row?.company}
											src={row.logo}
											style={{
												borderRadius: "50%",
												width: "25px",
												height: "25px",
											}}
										/> : 
										<span className='sa-awarded-bidder-tooltip_companyLetter'>{row?.company?.charAt(0)}</span> 
										}
										<span className="sa-awarded-bidder-tooltip_company-name">
											{row?.company}
										</span>
									</div>
								</td>
								<td className="sa-awarded-bidder-tooltip_td sa-awarded-bidder-tooltip_bid-td">
									{currencySymbol + " " + row.amount?.toLocaleString("en-US")}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<CustomWidthTooltip
			sx={{ marginTop: "-10px !important" }}
			arrow
			key={props.uniqeId}
			title={tootilpTmpl()}
			PopperProps={{
				disablePortal: false,
			}}
			open={openTooltip}
			disableFocusListener
			disableHoverListener
			disableTouchListener
			onClose={handleClose}
			onOpen={handleOpen}
			placement="bottom-start"
			className="sa-awarded-bidder-tooltip-root"
		>
			<IconButton size="small" aria-label="Info" className="info-tooltip-cls" key={props.uniqeId} color="primary" ref={iconRef}>
			{<span className='common-icon-info-white'></span>}
			</IconButton>
		</CustomWidthTooltip>
	);
};
SUIAwardedBidderTooltip.defaultProps = {
	tooltipData: [],
};
export default SUIAwardedBidderTooltip;
