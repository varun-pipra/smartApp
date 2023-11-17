import { Switch, SwitchProps } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './IQToggle.scss';

interface IQToggleProps extends SwitchProps {
	switchLabels?: [string, string];
};

const IQToggle = ({ className, sx, switchLabels, ...others }: IQToggleProps) => {
	let defaultSx = {};

	if (switchLabels && switchLabels.length === 2) {
		defaultSx = {
			'& .MuiSwitch-track': {
				'&:before': {
					content: `"${switchLabels[0]}"`
				},
				'&:after': {
					content: `"${switchLabels[1]}"`
				}
			}
		};
	}

	return <Switch
		sx={defaultSx}
		className={`iq-toggle ${className || ''}`}
		{...others}
	/>;
};

export default IQToggle;