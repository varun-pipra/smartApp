import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

const GridInfiniteScroll = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "640px" }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [columnDefs, setColumnDefs] = useState([
    // this row shows the row index, doesn't use any data from the row
    {
      headerName: 'ID',
      maxWidth: 100,
      // it is important to have node.id here, so that when the id changes (which happens
      // when the row is loaded) then the cell is refreshed.
      valueGetter: 'node._id',
      cellRenderer: (props: any) => {
        if (props.value !== undefined) {
          return props.value;
        } else {
          return (
            <img src="https://www.ag-grid.com/example-assets/loading.gif" />
          );
        }
      },
    },
    { field: 'name', minWidth: 150 },
    { field: 'trips' }
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: true,
      minWidth: 100,
    };
  }, []);
  const onGridReady = useCallback((params: any) => {
    params.api.setDatasource(datasource);
  }, []);
  const datasource = {
    getRows(params: any) {
      console.log(JSON.stringify(params, null, 1));
      fetch(`${`https://api.instantwebtools.net/v1/passenger?page=${params.startRow}&size=${params.endRow}`}`)
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.successCallback(response.data, response.totalPassengers);
        })
        .catch(error => {
          console.error(error);
          params.failCallback();
        });
    }
  };
  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
         // rowBuffer={50}
          rowSelection={'multiple'}
          rowModelType={'infinite'}
          cacheBlockSize={50}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={2}
          infiniteInitialRowCount={1000}
          maxBlocksInCache={10}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};
export default GridInfiniteScroll;