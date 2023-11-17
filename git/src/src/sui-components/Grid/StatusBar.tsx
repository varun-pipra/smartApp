import { forwardRef, useImperativeHandle, useState } from "react";

export default forwardRef((props: any, ref: any) => {
    const [rowDetail, setRowDetail] = useState({
        totalRows: 0,
        loadedRows: 0
    });
    
    // console.log('Status Bar props: ', props, props.api.paginationGetRowCount());

    useImperativeHandle(ref, () => {
        return {
            setRowDetail: (cfg: any) => {
                setRowDetail(cfg);
          }
        };
      });
      

    const style = {
        padding: 5,
        margin: 5
    }
    return <div style={style}><strong>Rows </strong>{rowDetail.loadedRows}<strong> of </strong>{rowDetail.totalRows}</div>;
});