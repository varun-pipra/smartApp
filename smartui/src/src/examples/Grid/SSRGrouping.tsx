'use strict';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  RowModelType,
} from 'ag-grid-community';
// import { IOlympicData } from './interfaces';
import { FakeServer } from "./FakeServer";

// declare var FakeServer: any;

const getServerSideDatasource: (server: any) => IServerSideDatasource = (
  server: any
) => {
  return {
    getRows: (params) => {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      console.log('[Data] - ', response);
      // adding delay to simulate real server call
      setTimeout(function () {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

const SSRGrouping = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '500px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'groupBy', headerName: "Group By", 
    // rowGroup: true,
     hide: true },
    // {
    //   colId: 'company',
    //   valueGetter: 'data.company.name',
    //   // rowGroup: true,
    //   // hide: true,
    //   headerName: "Company",
    // },
    { field: 'firstName', minWidth: 100 },
    { field: 'lastName', minWidth: 100 },
    { field: 'email', minWidth: 100 },
    // { field: 'gold', aggFunc: 'sum' },
    // { field: 'silver', aggFunc: 'sum' },
    // { field: 'bronze', aggFunc: 'sum' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
    };
  }, []);
  // const autoGroupColumnDef = useMemo<ColDef>(() => {
  //   return {
  //     flex: 1,
  //     minWidth: 280,
  //     field: 'athlete',
  //   };
  // }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('http://localhost:4000/projectteam/SSRData.json')
    .then((resp) => resp.json())
    .then((data:any) => {
        // setup the fake server with entire dataset
        console.log();
        var fakeServer = FakeServer(data['data']);        
        // create datasource with a reference to the fake server
        var datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setServerSideDatasource(datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={'serverSide'}
          // serverSideStoreType ={'partial'}
          serverSideInfiniteScroll={true}
          suppressAggFuncInHeader={true}
          cacheBlockSize={5}
          animateRows={true}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default SSRGrouping;
