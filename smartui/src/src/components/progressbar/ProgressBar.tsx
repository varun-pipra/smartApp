import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 12,
	borderRadius: 2,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 2,
		backgroundColor: theme.palette.mode === 'light' ? '#10D628' : '#10D628',
	},
}));

const ProgressBar = (props: any) => {
	const { count, ...others } = props;
	return (
		<Box sx={{ flexGrow: 1 }}>
			<BorderLinearProgress variant="determinate" value={count} />
		</Box>
	);
};
export default ProgressBar;
