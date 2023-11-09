import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import dataJson from "./List.json";
const ServerSideGrouping = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "640px" }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const gridRef = React.useRef<any>(null);
  const [columnDefs, setColumnDefs] = useState([
    { 
      field: 'groupBy',
       minWidth: 150,
    //valueGetter: 'data.groupBy.name',
    colId: 'groupBy',
    enableRowGroup: true,rowGroup: true, hide:true },
    { field: 'trips' }
  ]);
  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 280,
      headerName:"First Name",
     // field : 'groupBy',

    //   cellRendererParams: {
    //     suppressCount: true,
    //     checkbox: true,
    // }
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: true,
      minWidth: 100,
    };
  }, []);
  const onGridReady = useCallback((params: any) => {
    params.api.setServerSideDatasource(datasource);
     params.api.expandAll();
  }, []);
  function getUniqueListBy(arr:any, key:any) {
    return Array.from(new Map(arr.map((item:any) => [item[key], item])).values());
  };
  const datasource = {
    getRows(params: any) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      const {startRow, endRow} = params.request;
      // fetch(`${`https://api.instantwebtools.net/v1/passenger?page=${startRow}&size=${endRow}`}`)
      //   .then(httpResponse => httpResponse.json())
      //   .then(response => {
        // var resultsWithComplexObjects = dataJson.data.map(function (row:any) {
        //   row.groupBy = {
        //     name: row.groupBy,
        //     code: row.groupBy.substring(0, 3).toUpperCase(),
        //   };
        //   return row;
        // });
        // console.table(resultsWithComplexObjects)
          const arr2 = getUniqueListBy(dataJson.data, 'groupBy');
          console.table(arr2);
          params.successCallback(arr2, arr2.length);
        // })
        // .catch(error => {
        //   console.error(error);
        //   params.failCallback();
        // });
    }
  };
  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          autoGroupColumnDef={autoGroupColumnDef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType={'serverSide'}
          animateRows={true}
          onGridReady={onGridReady}
          serverSideInitialRowCount={50}
          serverSideInfiniteScroll={true}
          cacheBlockSize={50}
          serverSideStoreType="partial"
          maxBlocksInCache={10}
          groupDisplayType = 'singleColumn'
        ></AgGridReact>
      </div>
    </div>
  );
};
export default ServerSideGrouping;