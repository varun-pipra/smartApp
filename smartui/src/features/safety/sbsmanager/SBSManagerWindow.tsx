import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Box, Button, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';
import {
	InfoOutlined, Refresh, DoNotDisturb, ContentPasteGoOutlined,
	PrintOutlined, GridOn, AssessmentOutlined, TableRows
} from '@mui/icons-material';

// import './SBSManagerWindow.scss';

import { appInfoData } from 'data/appInfo';
import convertDateToDisplayFormat, { triggerEvent, stringToUSDateTime } from 'utilities/commonFunctions';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { postMessage, isLocalhost, currency } from 'app/utils';
import { getServer, setServer, setFullView, setCurrencySymbol, setAppWindowMaximize, setCostUnitList } from 'app/common/appInfoSlice';
import './SBSManagerWindow.scss';
import SBSManagerForm from './sbsManagerContent/sbsManagerForm/SBSManagerForm';
import { SBSToolbarLeftButtons, SBSToolbarRightButtons } from './sbsManagerContent/toolbar/SBSManagerToolbar';
import { getTrades } from './enums';
import moment from 'moment';
var tinycolor = require('tinycolor2');

const SBSManagerWindow = (props: any) => {
  const columns = [
		{
			headerName: 'Category',
			field: 'category',
      suppressMenu: true,
      pinned: "left",
      checkboxSelection: true,
      headerCheckboxSelection:true,
      keyCreator: (params: any) => params.data?.category?.name|| "None",
      valueGetter: (params: any) => `${params?.data?.category?.name}`,
      minWidth: 300,

		}, {
			headerName: 'Phase',
			field: 'phase',
      pinned: "left",
      suppressMenu: true,
      // checkboxSelection: true,
      keyCreator: (params: any) => params.data?.phase?.name || "None",
      minWidth: 200,
      cellRenderer: (params: any) => {
            const phase = params.data?.phase?.name;
            const buttonStyle = {
              backgroundColor: params.data?.phase?.color ?? "red",
              color: "#fff",
              alignItems: "center",
            };
    
            return (
              <>
                <Button style={buttonStyle} className="phase-btn">
                  <span className="common-icon-phase"></span>
                  {phase}
                </Button>
              </>
            );
          },
        },
	   {
			headerName: 'Trade',
			field: 'trade',
      suppressMenu: true,
      keyCreator: (params: any) => params?.data?.trades && getTrades(params?.data?.trades)|| "None",
      valueGetter: (params: any) => params?.data?.trades && getTrades(params?.data?.trades),
      minWidth: 300,
		}, {
			headerName: 'Est. Start Date',
			field: 'startDate',
      suppressMenu: true,
      minWidth: 200,
      valueGetter:(params:any) => moment(params?.data?.startDate).format('DD/MM/YYYY')
		}, {
			headerName: 'Est. End Date',
			field: 'endDate',
      suppressMenu: true,
      minWidth: 200,
      valueGetter:(params:any) => moment(params?.data?.endDate).format('DD/MM/YYYY')

		}
	];
	const dispatch = useAppDispatch();
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [colDefs,setColDefs] = React.useState(columns);
  
  
	const iframeID = 'sbsManagerIFrame';
	const appType = 'SBSManager';

	useEffect(() => {
		if (localhost) {
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
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

	

  const onGroupingChange = useCallback((groupValue: any) => {
    if (groupValue !== "") {
      let updatedColumns: any = [...colDefs].map((rec: any) => {
        if (groupValue) return { ...rec, rowGroup: rec.field === groupValue };
        else return { ...rec, rowGroup: false, sort: null };
      });
      setColDefs(updatedColumns);
    }
  }, []);

  const groupRowRendererParams = useMemo(() => {
    return {
      checkbox: true,
      suppressCount: false,
      suppressGroupRowsSticky: true,
    };
  }, []);

	return (
    <div className="sbs-manager-cls">
      <GridWindow
        open={true}
        title="System Breakdown Structure (SBS) Manager"
        // iconCls='common-icon-vendor-pay-applications'
        appType={appType}
        appInfo={appInfoData}
        iFrameId={iframeID}
        zIndex={100}
        onClose={handleClose}
        // isFullView={true}
        presenceProps={{
          presenceId: "sbs-manager-presence",
          showLiveSupport: true,
          showLiveLink: true,
          showStreams: true,
          showComments: true,
          showChat: false,
          hideProfile: false,
        }}
        tools={{
          closable: true,
          resizable: true,
          openInNewTab: true,
        }}
        PaperProps={{
          sx: {
            width: "95%",
            height: "90%",
          },
        }}
        content={{
          headContent: {
            regularContent: <SBSManagerForm />,
          },
          // detailView: VendorPayApplicationsLID,
          gridContainer: {
            toolbar: {
              leftItems: <SBSToolbarLeftButtons />,
              rightItems: <SBSToolbarRightButtons />,
              searchComponent: {
                show: true,
                type: "regular",
                groupOptions: [
                  { text: "Category", value: "category" },
                  { text: "Trade", value: "trade" },
                  { text: "Phase", value: "phase" },
                ],
                filterOptions: [
                  {
                    text: "Category",
                    value: "category",
                    key: "category",
                    children: { type: "checkbox", items: [] },
                  },
                  {
                    text: "Trade",
                    value: "trade",
                    key: "trade",
                    children: { type: "checkbox", items: [] },
                  },
                  {
                    text: "Phase",
                    value: "phase",
                    key: "phase",
                    children: { type: "checkbox", items: [] },
                  },
                ],
                onGroupChange: onGroupingChange,
                // onFilterChange: onFilterChange,
                defaultGroups: "category",
              },
            },
            grid: {
              headers: colDefs,
              data:[
                {
                    "id": 1,
                    "uniqueid": "13512d23-8697-49b0-902f-ec539e348307",
                    "displayId": "SBS0001",
                    "name": "SS4",
                    "startDate": "2023-12-03T00:00:00",
                    "endDate": "2023-12-05T00:00:00",
                    "description": "ss4",
                    "category": {
                        "id": 12,
                        "name": "electrical"
                    },
                    "phase": {
                        "id": 14,
                        "name": "preConstruction",
                        "color": "#3ddda3",
                        "uniqueId": null
                    },
                    "trades": [{
                      objectId: 1,
                      status: 1,
                      isPrimary: !1,
                      companyId: null,
                      uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                      name: "Capentry",
                      description: "Capentry",
                      color: "#1D2899",
                      isDrawingDiscipline: !0,
                      isImportedFromOrg: !1
                  },{
                    objectId: 1,
                    status: 1,
                    isPrimary: !1,
                    companyId: null,
                    uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                    name: "All Trades",
                    description: "Capentry",
                    color: "#1D2899",
                    isDrawingDiscipline: !0,
                    isImportedFromOrg: !1
                },{
                  objectId: 1,
                  status: 1,
                  isPrimary: !1,
                  companyId: null,
                  uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                  name: "Civil",
                  description: "Capentry",
                  color: "#1D2899",
                  isDrawingDiscipline: !0,
                  isImportedFromOrg: !1
              }],
                    "configureSupplementalInfo": false,
                    "status": 0
                },
                {
                    "id": 4,
                    "uniqueid": "2a9a3de8-6a2e-4f65-a856-3326f1c4bbde",
                    "displayId": "SBS0004",
                    "name": "SS2",
                    "startDate": "2023-12-03T00:00:00",
                    "endDate": "2023-12-05T00:00:00",
                    "description": "ss2",
                    "category": {
                        "id": 11,
                        "name": "stucatural"
                    },
                    "phase": {
                        "id": 12,
                        "name": "in Construction",
                        "color": "#823e93",
                        "uniqueId": null
                    },
                    "trades": [{
                      objectId: 1,
                      status: 1,
                      isPrimary: !1,
                      companyId: null,
                      uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                      name: "Capentry",
                      description: "Capentry",
                      color: "#1D2899",
                      isDrawingDiscipline: !0,
                      isImportedFromOrg: !1
                  },{
                    objectId: 1,
                    status: 1,
                    isPrimary: !1,
                    companyId: null,
                    uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                    name: "All Trades",
                    description: "Capentry",
                    color: "#1D2899",
                    isDrawingDiscipline: !0,
                    isImportedFromOrg: !1
                },{
                  objectId: 1,
                  status: 1,
                  isPrimary: !1,
                  companyId: null,
                  uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
                  name: "Civil",
                  description: "Capentry",
                  color: "#1D2899",
                  isDrawingDiscipline: !0,
                  isImportedFromOrg: !1
              }],
                    "configureSupplementalInfo": false,
                    "status": 0
                },
                {
                    "id": 5,
                    "uniqueid": "2d376e6d-ac69-479b-9c47-f0b22159ca98",
                    "displayId": "SBS0005",
                    "name": "SS3",
                    "startDate": "2023-12-03T00:00:00",
                    "endDate": "2023-12-05T00:00:00",
                    "description": "ss3",
                    "category": {
                        "id": 12,
                        "name": "utillites"
                    },
                    "phase": {
                        "id": 14,
                        "name": "post Construction",
                        "color": "#eb788c",
                        "uniqueId": null
                    },
                    "trades": [],
                    "configureSupplementalInfo": false,
                    "status": 0
                },
                {
                    "id": 6,
                    "uniqueid": "8583bf33-6861-44cb-93b7-3f66d874b99e",
                    "displayId": "SBS0006",
                    "name": "SS4",
                    "startDate": "2023-12-03T00:00:00",
                    "endDate": "2023-12-05T00:00:00",
                    "description": "ss4",
                    "category": {
                        "id": 12,
                        "name": "stucatural"
                    },
                    "phase": {
                        "id": 14,
                        "name": "operations",
                        "color": "#443ca7",
                        "uniqueId": null
                    },
                    "trades": [],
                    "configureSupplementalInfo": false,
                    "status": 0
                }
            ],
              getRowId: (params: any) => params.data.id,
              groupIncludeTotalFooter: false,
              groupIncludeFooter: false,
              groupSelectsChildren: true,
              rowSelection: "multiple",
              groupDefaultExpanded: 1,
              grouped: true,
              groupRowRendererParams: groupRowRendererParams,
              groupDisplayType: "groupRows",
              // onRowDoubleClicked:onRowDoubleClick,
              // rowSelected: (e: any) => rowSelected(e),
              nowRowsMsg:
                "<div>Add new SBS item by clicking the + Add button above</div>",
            },
          },
        }}
      />
    </div>
  );
};

export default SBSManagerWindow;