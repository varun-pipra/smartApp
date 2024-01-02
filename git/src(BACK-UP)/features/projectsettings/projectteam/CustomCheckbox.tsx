import Checkbox, { checkboxClasses } from '@mui/material/Checkbox';
import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
export function CustomCheckBox(props: any) {
	const { handleChange, disabled = false } = props;
	const { data: { isAcknowledged }, ...others } = props?.checked;
	return (
		<Checkbox
			disabled={disabled}
			onClick={(e) => handleChange(e, props)}
			defaultChecked={isAcknowledged}
			sx={{
				[`&.${checkboxClasses.checked}`]: {
					color: '#10D628'

				},
			}}
		/>
	)
};

export function CustomCircularCheckBox(props: any) {
	const { checked = false, ...others } = props;
	return (
		<Checkbox
			onClick={(event: any) => {
				event.preventDefault()
				event.stopPropagation()
			}}
			disabled={checked}
			defaultChecked={checked}
			icon={<CircleCheckedFilled
				style={{
					transform: "scale(1.2)",
				}}
			/>}
			checkedIcon={<CircleCheckedFilled
				style={{
					transform: "scale(1.2)",
				}}
				sx={{
					[`&, &.${checkboxClasses.checked}`]: {
						color: '#10D628'
					},
				}}
			/>}
		/>
	)
};
