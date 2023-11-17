import './CustomTooltip.scss';

const CustomTooltip = (props: any) => {
	const valueToDisplay = props && props.value ? props.value : "";
	return (
		<p className="aggrid-custom-tooltip">
			<span>{valueToDisplay}</span>
		</p>

	);
};

export default CustomTooltip;
