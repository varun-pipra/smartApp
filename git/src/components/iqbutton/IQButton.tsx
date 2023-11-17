import {Button, ButtonProps} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import './IQButton.scss';

const theme = createTheme({
	shape: {borderRadius: 2},
	typography: {
		fontFamily: 'Roboto-Regular',
		fontSize: 14
	},
	palette: {
		action: {
			disabled: '#fff',
			disabledBackground: 'rgb(102, 102, 102, 0.5)'
		},
		blue: {
			main: '#059cdf',
			dark: '#29a5ff',
			contrastText: '#fff'
		},
		orange: {
			main: '#ed7532',
			dark: '#fd7d36',
			contrastText: '#fff'
		},
		green: {
			main: '#0a8727',
			dark: '#0a8727',
			contrastText: '#fff'
		},
		lightGrey: {
			main: '#808080',
			dark: '#808080',
			contrastText: '#fff'
		}
	}
});

declare module '@mui/material/styles' {
	interface Palette {
		blue: Palette[ 'primary' ];
		orange: Palette[ 'primary' ];
		green: Palette[ 'primary' ];
		lightGrey: Palette[ 'primary' ];
	}

	// allow configuration using `createTheme`
	interface PaletteOptions {
		blue?: PaletteOptions[ 'primary' ];
		orange?: PaletteOptions[ 'primary' ];
		green?: PaletteOptions[ 'primary' ];
		lightGrey?: PaletteOptions[ 'primary' ];
	}
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		blue: true;
		orange: true;
		green: true;
		lightGrey: true;
	}
};

const IQButton = ({children, className, ...others}: ButtonProps) => {
	return <ThemeProvider theme={theme}>
		<Button
			className={`iq-button ${className || ''}`}
			variant='contained'
			{...others}
		>
			{children}
		</Button>
	</ThemeProvider >;
};

export default IQButton;