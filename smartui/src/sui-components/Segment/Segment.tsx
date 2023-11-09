import "./Segment.scss";
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InfoIcon from "@mui/icons-material/Info";
import InputLabel from "@mui/material/InputLabel";

interface SUISegmentProps {
	segmentOptions?: any;
	defaultSegment?: any;
	getSelectedSegment?: any;
	segmentlabel?: any;
	labelIcon?: any;
}

const SUISegment = (props: SUISegmentProps) => {
	const { segmentOptions, defaultSegment, getSelectedSegment, segmentlabel, labelIcon } =
		props;
	const [selectedSegement, setSelectedSegement] =
		React.useState(defaultSegment);

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		segment: string
	) => {
		setSelectedSegement(segment);
		getSelectedSegment(segment);
	};

	return (
		<div className="segment-container">
			<InputLabel style={{ textAlign: "left" }} className="inputlabel">
				{segmentlabel} {labelIcon ? <InfoIcon style={{ height: "15px" }} /> : ''}
			</InputLabel>
			<ToggleButtonGroup
				color="primary"
				value={selectedSegement}
				exclusive
				onChange={handleChange}
				aria-label="Platform"
				className="toggle-grp-btn"
			>
				{segmentOptions.map((segmentValue: any) => (
					<ToggleButton
						key={segmentValue}
						className="toggle-btn"
						value={segmentValue}
					>
						{segmentValue}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</div>
	);
};

export default SUISegment;
