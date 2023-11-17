import Tooltip, {TooltipProps} from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import {memo} from 'react';

const IQTooltip = styled(({className, ...props}: TooltipProps) => (
	<Tooltip enterDelay={500} {...props} classes={{popper: className}} />
))`
  & .MuiTooltip-tooltip {
		// height: 2em;
	word-break: break-all;
	height: 'fit-content';	
	// padding: 1.5em 1.5em;
	padding: 5;
	// font-size: 0.9em;
	font-size: 12px;
	// font-weight: 600;
	display: flex;
	// flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color:#333333;
	font-family:'Roboto-Regular'
  }
  & .MuiTooltip-arrow{
	color:#333333;
  }
`;

export default IQTooltip;

export const IQGridTooltip = memo(styled(({className, ...props}: TooltipProps) => (
	<Tooltip enterDelay={500} {...props} classes={{popper: className}} />
))`& .MuiTooltip-tooltip {
	width: 40em;
	height: 'fit-content';
	max-width: unset;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 0.5em;
	background-color:#333333;
	font-family:'Roboto-Regular'
}
& .MuiTooltip-arrow{
	color:#333333;
}`);