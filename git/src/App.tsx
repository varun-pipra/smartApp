import {Suspense} from 'react';
import {LicenseInfo} from '@mui/x-data-grid-premium';
import {LicenseManager} from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './App.scss';
import AppRoutes from 'routes';
import BlockchainAuthModal from 'sui-components/BlockchainAuthModal/BlockchainAuthModel';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENCE_KEY || '');
LicenseManager.setLicenseKey(process.env.REACT_APP_AGGRID_LICENCE_KEY || '');

const App = () => {
	return (
		<div className='App ag-theme-alpine'>
			<Suspense>
				<AppRoutes />
			</Suspense>
			<BlockchainAuthModal />
		</div>
	);
};

export default App;