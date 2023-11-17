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
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
const SBSCategoryRightPanel = (props:any) => {
  const {handleSelectedCategory,handleSbsCategoryChange, ...rest} = props;
  const classes = useStyles();
  const [selectedCategory, setSelectedCategory] = React.useState('System Breakdown Structure Categories');
  const CategoriesOptions = [{
    id: 1,
    name: "System Breakdown Structure Categories",
    label: "System Breakdown Structure Categories",
    value: "System Breakdown Structure Categories"
  },
  {
    id: 2,
    name: "User Defined System Breakdown List 1",
    label:"User Defined System Breakdown List 1",
    value: "User Defined System Breakdown List 1",
  },
  {
    id: 3,
    name: "User Defined System Breakdown List 2",
    label:"User Defined System Breakdown List 2",
    value: "User Defined System Breakdown List 2",
  }]
  const onCategoryItemClick = (type:string) => {
      handleSelectedCategory(type);
  };
  const handleCategoryOnChange = (val:string) => {
    handleSbsCategoryChange(val);
    setSelectedCategory(val);
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
								<span className="common-icon-sketch"></span>
							</ListItemIcon>
              <ListItemText
                primary="Categories for System Breakdown Structure"
                className="generalsettingtext"
              />
            </ListItem>
            <ListItem className="generalSettings-listitem">
            <SmartDropDown
            options={CategoriesOptions || []}
            outSideOfGrid={true}
            isSearchField={true}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={[selectedCategory]}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => handleCategoryOnChange(value?.[0])}
          />
          </ListItem>
            <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('managerSbs')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-sketch"></span>
							</ListItemIcon>
              <ListItemText
                primary="Manage SBS Phases"
                className="generalsettingtext"
              />
            </ListItem>
            <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('supplemental')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-sketch"></span>
							</ListItemIcon>
              <ListItemText
                primary="Associate Supplemental App"
                className="generalsettingtext"
              />
            </ListItem>
            <ListItem className="generalSettings-listitem" onClick={() => onCategoryItemClick('dynamicHeatMap')}>
            <ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
								<span className="common-icon-sketch"></span>
							</ListItemIcon>
              <ListItemText
                primary="Set Dynamic Dates for Heatmap"
                className="generalsettingtext"
              />
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </Box>
  );
};
export default SBSCategoryRightPanel;
