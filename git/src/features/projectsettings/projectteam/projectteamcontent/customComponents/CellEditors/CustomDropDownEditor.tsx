import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import SmartDropDown from "components/smartDropdown";

const CustomDropDownEditor = forwardRef((props: any, ref: any) => {
  const [value, setValue] = useState(props.value);
  const [values, setValues] = useState(props.values);
  const refInput = useRef<any>(null);

  useEffect(() => {
    // focus on the input
    //refInput.current.focus();
    console.log('Srini inside editor', props);
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
    <SmartDropDown
      //ref={refInput}
      options={values || []}
      required={true}
      isSearchField
      isFullWidth
      outSideOfGrid={false}
      selectedValue={value}
      //onChange={(event: any) => setValue(event.target.value)}
      // menuProps={classes.menuPaper}
      sx={{ fontSize: "18px" }}
      // 	handleChange={(value: string | undefined | string[]) => {
      // 		handleDropdownChange(value ? value[0] : '', 'costType');
      // 	}
      // }
    />
    // <input
    //   type="text"
    //   ref={refInput}
    //   value={value}
    //   onChange={(event: any) => setValue(event.target.value)}
    //   style={{ width: "100%" }}
    // />
  );
});
export default CustomDropDownEditor;
