import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";

const CustomCellEditor = forwardRef((props: any, ref: any) => {
  const [value, setValue] = useState(props.value);
  const refInput = useRef<any>(null);

  useEffect(() => {
    // focus on the input
    refInput.current.focus();
  }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    //   isCancelAfterEnd() {
    //     // our editor will reject any value greater than 1000
    //     return value > 1000;
    //   },
    };
  });

  return (
    <input
      type="text"
      ref={refInput}
      value={value}
      onChange={(event: any) => setValue(event.target.value)}
      style={{ width: "100%" }}
    />
  );
});
export default CustomCellEditor;
