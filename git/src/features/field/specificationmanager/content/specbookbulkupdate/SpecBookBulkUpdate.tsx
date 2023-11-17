import { InputLabel } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import SmartDropDown from "components/smartDropdown";
import React from "react";
import { memo } from "react";
import { setBulkUpdateBtnDisabled, setBulkUpdateFormValues } from "../../stores/SpecificationManagerSlice";
import { makeStyles, createStyles } from '@mui/styles';
// const defaultFormData = { sbsName: '', sbsPhase: '', bidPackageName: '' };
const defaultFormData = { bidPackageName: '' };
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
const SpecBookBulkContent = (props: any) => {
  const { readOnly, ...rest } = props;
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const dispatch = useAppDispatch();
  const {gridData} = useAppSelector((state) => state.bidManagerGrid);
  const { bidPackageDropdownValues } = useAppSelector((state) => state.specificationManager);
  const [bidPackageList, setBidPackageList] = React.useState([]);
  const classes = useStyles();
  React.useEffect(() => {
    if(gridData.length > 0) {
      let filterData = gridData.filter((x:any) => x.status === 3);
      if(filterData.length > 0) {
        let list:any = [];
          for(let i = 0; i < filterData.length; i++) {
                list.push({id:filterData?.[i]?.id, label: filterData?.[i]?.name, value: filterData?.[i]?.name});
          };
          let unique: any = [];
          list?.map((x: any) => unique?.filter((a: any) => a?.label === x?.label)?.length > 0 ? null : unique.push(x));
          unique.sort((a:any, b:any) => a?.label.localeCompare(b?.label, undefined,{ numeric: true }))
          setBidPackageList(unique);
      } 
    }
  },[gridData]);
  const SystemeBreakDown = [
    { id: 0, label: "General SBS part 1", value: "General SBS part 1" },
    { id: 1, label: "General SBS part 2", value: "General SBS part 2" },
  ];
  const Phase = [
    { id: 0, label: "Phase 1", value: "Phase 1" },
    { id: 1, label: "Phase 2", value: "Phase 2" },
  ];
  const GetIds = (array: any, value: any) => {
    const id = array.findIndex((x: any) => x.value === value);
    return array?.[id]?.id;
  };
  React.useEffect(() => {
    if (formData.sbsName !== '' || formData.sbsPhase !== '' || formData.bidPackageName !== '') {
      let obj = {
        ...formData,
        // "sbsId": GetIds(SystemeBreakDown, formData.sbsName),
        // "sbsPhaseId": GetIds(Phase, formData.sbsPhase),
        "bidPackageId": GetIds(bidPackageDropdownValues, formData.bidPackageName),
      };
      dispatch(setBulkUpdateBtnDisabled(false));
      dispatch(setBulkUpdateFormValues(obj));
    } else {
      dispatch(setBulkUpdateBtnDisabled(true));
      dispatch(setBulkUpdateFormValues(formData));
    };
  }, [formData])
  return (
    <>
      <div style={{ marginTop: "16px", display: "grid", gridGap: "25px" }}>
        <div>
          <InputLabel className="inputlabel">Bid Package</InputLabel>
          <div style={{ display: "flex", gap: "3px" }}>
            <SmartDropDown
              LeftIcon={
                <span
                  className="common-icon-bid-lookup"
                  style={{ color: "#ed7532", fontSize: "1.4em" }}
                >
                  {" "}
                </span>
              }
              options={bidPackageList || []}
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              isMultiple={false}
              menuProps={classes.menuPaper}
              selectedValue={formData?.bidPackageName || ''}
              handleChange={(value: any) => {
                setFormData({ ...formData, bidPackageName: value?.[0] })
              }}
            />
          </div>
        </div>
        {/* <div>
          <InputLabel className="inputlabel">
            System Breakdown Structure(SBS)
          </InputLabel>
          <div style={{ display: "flex", gap: "3px" }}>
            <SmartDropDown
              LeftIcon={
                <span
                  className="common-icon-post-contract"
                  style={{ color: "#ed7532", fontSize: "1.4em" }}
                ></span>
              }
              options={SystemeBreakDown}
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              isMultiple={false}
              selectedValue={formData?.sbsName || ''}
              handleChange={(value: any) => {
                setFormData({ ...formData, sbsName: value?.[0] })
              }}
            />
          </div>
        </div>
        <div>
          <InputLabel className="inputlabel">Phase</InputLabel>
          <div style={{ display: "flex", gap: "3px" }}>
            <SmartDropDown
              LeftIcon={
                <span
                  className="common-icon-bid-lookup"
                  style={{ color: "#ed7532", fontSize: "1.4em" }}
                >
                  {" "}
                </span>
              }
              options={Phase}
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              selectedValue={formData?.sbsPhase || ''}
              handleChange={(value: any) => {
                setFormData({ ...formData, sbsPhase: value?.[0] })
              }}
              isMultiple={false}
            />
          </div>
        </div>*/}
      </div> 
    </>
  );
};
export default memo(SpecBookBulkContent);