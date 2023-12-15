import React, {Suspense} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@ui5/webcomponents-react";
import './css/webfont/common-webfont/style.css';
//import './css/webfont/common/style.css';
import './css/fonts/Roboto-Regular.ttf';
import {
	createTheme,
	ThemeProvider as MaterialThemeProvider,
} from "@mui/material";
import "./index.scss";
import "./i18n.js";

const container = document.getElementById("root")!;
const root = createRoot(container);

const theme = createTheme({
	// palette: {
	// 	primary: orange,
	// },
	typography: {
		"fontFamily": `Roboto-Regular`,
	}
});

root.render(
	<React.StrictMode>
		<Suspense fallback={<></>}>
			<Provider store={store}>
				<BrowserRouter basename={'/EnterpriseDesktop/React'}>
					<ThemeProvider>
						<MaterialThemeProvider theme={theme}>
							<App />
						</MaterialThemeProvider>
					</ThemeProvider>
				</BrowserRouter>
			</Provider>
		</Suspense>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
