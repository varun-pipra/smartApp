import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Box, Button, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';
import {
	InfoOutlined, Refresh, DoNotDisturb, ContentPasteGoOutlined,
	PrintOutlined, GridOn, AssessmentOutlined, TableRows
} from '@mui/icons-material';

import './SafetyRequirementsWindow.scss';

import { appInfoData } from 'data/appInfo';
import convertDateToDisplayFormat, { triggerEvent, stringToUSDateTime } from 'utilities/commonFunctions';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { postMessage, isLocalhost, currency } from 'app/utils';
import { getServer, setServer, setFullView, setCurrencySymbol, setAppWindowMaximize, setCostUnitList } from 'app/common/appInfoSlice';
import { getSafetyRequirementsList } from './stores/gridSlice';
import ToolbarRightButtons from './safetyrequirapplicationscontent/toolbarbuttons/RightToolbarButtons';
import ToolbarLeftButtons from './safetyrequirapplicationscontent/toolbarbuttons/LeftToolbarButtons';
import SafetyRequirementsForm from './safetyrequirementscontent/safetyrequirementsform/SafetyRequirementsForm';

var tinycolor = require('tinycolor2');

const SafetyRequirementsWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);

	const iframeID = 'safetyRequirementsIFrame';
	const appType = 'SafetyRequirements';
	const { gridData } = useAppSelector((state) => state.safetyRequirementsGrid);
	const [rowData, setRowData] = React.useState<any>([])


	useEffect(() => {
		console.log('gridData', gridData)
		setRowData([...gridData]);

	}, [gridData]);

	useEffect(() => {
		if (localhost) {
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
			dispatch(getSafetyRequirementsList(appData))
		} else {
			if (!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if (data) {
						switch (data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'updateparticipants':

								triggerEvent('updateparticipants', { data: data.data, appType: data.appType });
								break;
							case 'updatecommentbadge':
								triggerEvent('updatecommentbadge', { data: data.data, appType: data.appType });
								break;
						}
					}
				};
				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: iframeID, roomId: appInfo && appInfo.presenceRoomId, appType: appType }
				});
			}
		}
	}, [localhost, appData]);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: iframeID, roomId: appInfo && appInfo.presenceRoomId, appType: appType }
		});
	};

	const columns = [
		{
			headerName: 'Hazard Name',
			//field: 'hazardName',
			cellRenderer: (params: any) => {
				return <>{params?.data?.name}</>
			},
		},
		{
			headerName: 'Status',
			field: 'status',
		}, {
			headerName: 'Hazard Category',
			field: 'hazardCategory'
		}, {
			headerName: 'Trade',
			field: 'trade'
		}, {
			headerName: 'Skills',
			field: 'skills',
			cellRenderer: (params: any) => {
				return <>{params?.data?.skill?.name}</>
			},
		}, {
			headerName: 'SBS',
			field: 'systemBreakdownStructure'
		}, {
			headerName: 'References',
			field: 'references'
		}
	];

	return (<div className='safety-requirements-cls'><GridWindow
		open={true}
		title='Safety Requirements'
		// iconCls='common-icon-vendor-pay-applications'
		appType={appType}
		appInfo={appInfoData}
		iFrameId={iframeID}
		zIndex={100}
		onClose={handleClose}
		// isFullView={true}
		presenceProps={{
			presenceId: 'safety-requirements-presence',
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		}}
		righPanelPresenceProps={{
			presenceId: "safety-requirements-presence",
			showLiveSupport: true,
			showStreams: true,
			showPrint: true,
		}}
		tools={{
			closable: true,
			resizable: true,
			openInNewTab: true
		}}
		PaperProps={{
			sx: {
				width: '95%',
				height: '90%'
			}
		}}
		content={{
			headContent: { regularContent: <SafetyRequirementsForm /> },
			// detailView: VendorPayApplicationsLID,
			gridContainer: {
				toolbar: {
					leftItems: <ToolbarLeftButtons />,
					rightItems: <ToolbarRightButtons />,
					searchComponent: {
						show: true,
						type: 'regular'
					}
				},
				grid: {
					headers: columns,
					data: rowData,
					getRowId: (params: any) => params.data.id,
					grouped: true,
					groupIncludeTotalFooter: false,
					// onRowDoubleClicked:onRowDoubleClick,
					// rowSelected: (e: any) => rowSelected(e),
					nowRowsMsg: '<div>Add new Safety Requirement by Clicking the + Add button above</div>'
				}
			}
		}}
	/>
	</div>);
};

export default SafetyRequirementsWindow;