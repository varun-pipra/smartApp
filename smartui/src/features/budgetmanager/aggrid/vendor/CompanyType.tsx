import React, { useState } from "react";
import Box from "@mui/material/Box";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import FormGroup from "@mui/material/FormGroup/FormGroup";
import FormLabel from "@mui/material/FormLabel/FormLabel";

type ComponentTypeProps = {
  open: boolean;
  placement?: PopperPlacementType;
  anchor?: HTMLDivElement | null;
  handleFilterVendors?: (searchText: any) => void;
  items: any;
};

const ComponentTypeData = [
  {
    name: "Prime Contractors",
    id: 1,
    checked: true,
    value: 2,
  },
  {
    name: "Sub Contractors",
    id: 2,
    checked: true,
    value: 1,
  },
  {
    name: "Suppliers",
    id: 3,
    checked: true,
    value: 0,
  },
];

const ComponentType: React.FC<ComponentTypeProps> = ({
  open,
  placement,
  anchor,
  handleFilterVendors,
  items,
}) => {
  const checkboxValues: any[] = [];
  items.forEach((element: any) => {
    checkboxValues.push(element.checked);
  });
  const [checkedState, setCheckedState] = useState(checkboxValues);
  const [allCheckedState, setAllCheckedState] = useState(true);

  const isCheckboxChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    position: any
  ) => {
    const {
      target: { value, checked },
    } = event;
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    let parsedValue = JSON.parse(value);
    if (checked) {
      items.map((item: any) => {
        if (item.id === parsedValue.id) item.checked = true;
      });
    } else {
      items.map((item: any) => {
        if (item.id === parsedValue.id) item.checked = false;
      });
    }
    let count = 0
    items.map((item: any) => {
      if (item.checked){
        count++;
      };
    });
    if(count !== ComponentTypeData.length){
      setAllCheckedState(false);
    }else{
      setAllCheckedState(true);
    }
    if (handleFilterVendors) {
      handleFilterVendors(items);
    }
  };

  const handleAllCheckedBox = () => {
    setAllCheckedState(!allCheckedState);
    if (allCheckedState) {
      setCheckedState(new Array(items.length).fill(false));
      if (handleFilterVendors) {
        handleFilterVendors([]);
      }
    } else {
      setCheckedState(new Array(items.length).fill(true));
      if (handleFilterVendors) {
        handleFilterVendors(ComponentTypeData);
      }
    }
  };

  const handleClearAll = () => {
    setAllCheckedState(false);
    setCheckedState(new Array(items.length).fill(false));
  };

  return (
    <>
      <Box>
        <Popper
          open={open}
          anchorEl={anchor}
          placement={placement}
          transition
          sx={{ zIndex: 1300, minWidth: 190 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <FormGroup className="componetType_form_group">
                  <FormLabel className="clear_all" onClick={handleClearAll}>
                    Clear
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={"All"}
                        checked={allCheckedState}
                        onChange={handleAllCheckedBox}
                      />
                    }
                    label={"All"}
                  />
                  {items.map((item: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={item.name}
                        control={
                          <Checkbox
                            value={JSON.stringify(item)}
                            checked={checkedState[index]}
                            onChange={(e) => isCheckboxChecked(e, index)}
                          />
                        }
                        label={item.name}
                      />
                    );
                  })}
                </FormGroup>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default ComponentType;
