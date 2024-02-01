import React from "react";
import {
  Box,
  List,
  Stack,
  Typography,
  ListItemText,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import SmartDropDown from "components/smartDropdown";
import "./SBSCategoryRightPanel.scss";
import { UpdateSettings } from "../operations/sbsManagerAPI";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSBSGridList, getSbsSettings } from "../operations/sbsManagerSlice";
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
const SBSCategoryRightPanel = (props:any) => {
  const dispatch = useAppDispatch();
  const {handleSelectedCategory,handleSbsCategoryChange, ...rest} = props;
  const classes = useStyles();
  const { settingsCategoryList, sbsSettings } = useAppSelector((state) => state.sbsManager);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  React.useEffect(() => {
      if(sbsSettings.categoryId ) {
        setSelectedCategory([...settingsCategoryList].find((rec:any) => rec.id === sbsSettings.categoryId)?.id ?? ""); 
      } else {
        setSelectedCategory([...settingsCategoryList].find((rec:any) => rec.name === "System Breakdown Structure Categories (SBS)")?.id ?? "");
      }
  },[sbsSettings])

  React.useEffect(() => {    
    let selectedSBSCat = settingsCategoryList.find((rec:any) => rec.id === selectedCategory);
    handleSbsCategoryChange(selectedSBSCat);
  },[selectedCategory])

  const onCategoryItemClick = (type:string) => {
      handleSelectedCategory(type);
  };
  const handleCategoryOnChange = (val:string) => {
    setSelectedCategory(val);
    let payload = {"details":{ "id": null, "categoryId": val }};
    UpdateSettings(payload)
      .then((res: any) => {
          if(res) {
            dispatch(getSBSGridList());
            dispatch(getSbsSettings());
          }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
  return (
    <Box className="Sbs-General-Popup">
      <Stack className="General-settings">
        <Stack className="generalSettings-Sections">
          <Typography
            variant="h6"
            component="h6"
            className="budgetSetting-heading"
            style={{textAlign:'left'}}
          >
            General
          </Typography>
          <List className="generalSettings-list">
            <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('sbs')}>
							<ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-SBS"></span>
							</ListItemIcon>
              <ListItemText
                primary="Categories for System Breakdown Structure"
                className="generalsettingtext"
              />
            </ListItem>
            <ListItem className="generalSettings-listitem dropdown">
            <SmartDropDown
            options={settingsCategoryList || []}
            outSideOfGrid={true}
            isSearchField={true}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={[selectedCategory]}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => handleCategoryOnChange(value)}
          />
          </ListItem>
            <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('managerSbs')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-manage-sbs-phase"></span>
							</ListItemIcon>
              <ListItemText
                primary="Manage SBS Phases"
                className="generalsettingtext"
              />
            </ListItem>
            <Typography
            variant="h6"
            component="h6"
            className="sup-conf"
            style={{textAlign:'left'}}
          >
            Supplemental info
          </Typography>
           <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('supplemental')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-supplemental-info"></span>
							</ListItemIcon>
              <ListItemText
                primary="Supplemental info Configuration"
                className="generalsettingtext"
              />
            </ListItem>
            {/* <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('dynamicHeatMap')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-dynamic-dates"></span>
							</ListItemIcon>
              <ListItemText
                primary="Set Dynamic Dates for Heatmap"
                className="generalsettingtext"
              />
            </ListItem> */}
          </List>
        </Stack>
      </Stack>
    </Box>
  );
};
export default SBSCategoryRightPanel;
