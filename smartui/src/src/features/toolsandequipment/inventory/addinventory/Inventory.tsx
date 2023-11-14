import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Grid, Paper, ToggleButtonGroup } from "@mui/material";
import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import BuildIcon from "@mui/icons-material/Build";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import HandymanIcon from "@mui/icons-material/Handyman";
import MuiToggleButton from "@mui/material/ToggleButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ConstructionIcon from "@mui/icons-material/Construction";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NewImg from "../../../../resources/images/DrillingMachine.png";
import img from "./Image.png";
import SmartDialog from "components/smartdialog/SmartDialog";
import "./Inventory.scss";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { fetchCategories } from "features/toolsandequipment/operations/inventoryCategorySlice";
import { fetchSubCategories } from "features/toolsandequipment/operations/inventorySubcategorySlice";
import { fetchManufacturers } from "features/toolsandequipment/operations/inventoryManufacturerSlice";
import { fetchModelnumbers } from "features/toolsandequipment/operations/inventoryModelnumberSlices";

interface IAddInventoryPopup {
  onClose: () => void;
}

const ToggleButton = styled(MuiToggleButton, {
  shouldForwardProp: (prop) => prop !== "selectedColor",
})(({}) => ({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: "#059cdf",
  },
}));

const theme = createTheme({
  palette: {
    text: {
      primary: "#00ff00",
    },
  },
});

export default function AddInventory(props: IAddInventoryPopup) {
  const { onClose } = props;
  const dispatch = useAppDispatch();
  const [alignment, setAlignment] = React.useState("left");
  const { inventorySubCategories } = useAppSelector(
    (state) => state.inventorySubCategory
  );
  const { inventoryCategories } = useAppSelector(
    (state) => state.inventoryCategory
  );
  const { inventoryManufacturers } = useAppSelector(
    (state) => state.inventoryManufacturer
  );
  const { inventoryModelnumbers } = useAppSelector(
    (state) => state.inventoryModelnumber
  );

  React.useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchManufacturers());
    dispatch(fetchModelnumbers());
  }, []);

  const handleAlignment = (event: any, newAlignment: any) => {
    setAlignment(newAlignment);
  };

  const [category, setCategory] = React.useState("");
  const [subCategory, setsubCategory] = React.useState("");
  const [manufacturer, setmanufacturer] = React.useState("");
  const [modelNumber, setmodelNumber] = React.useState("");

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleChangeSubCategory = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setsubCategory(event.target.value);
  };
  const handleChangeManufacturer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setmanufacturer(event.target.value);
  };
  const handleChangeModelNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setmodelNumber(event.target.value);
  };

  const titleEl = (
    <Typography variant="h5" component={"h2"}>
      Add Inventory
    </Typography>
  );

  const color: string = "#ee874a";

  return (
    <SmartDialog
      open={true}
      PaperProps={{
        sx: { height: "90%", width: "75%" },
      }}
      custom={{
        closable: true,
        resizable: true,
        title: titleEl,
      }}
      onClose={() => onClose()}
    >
      <Box py={2} px={4} className="add-inventory-popup">
        <Box mb={3}>
          <Typography variant="body1" component="p" fontWeight={600}>
            Select the Model to start adding your inventory
          </Typography>
        </Box>

        <Box display="flex" gap={3}>
          <Box flex={"0 1 20%"}>
            <Typography data-testid="Typography-id" mb={1}>
              Select Type <sup style={{ color: color }}>*</sup>
            </Typography>

            <Box display={"flex"} alignItems="center">
              <ThemeProvider theme={theme}>
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                >
                  <ToggleButton value="left">
                    <PrecisionManufacturingIcon />
                  </ToggleButton>
                  <ToggleButton value="center">
                    <ConstructionIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </ThemeProvider>
              <ArrowRightSharpIcon />
              <Typography>Tools</Typography>
            </Box>
            <Box>
              {!modelNumber ? (
                ""
              ) : (
                <img
                  style={{
                    height: "100px",
                    marginTop: "150px",
                    width: "250px",
                    transform: "rotate(270deg)",
                  }}
                  src={img}
                />
              )}
            </Box>
          </Box>
          <Box flex={"1"}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    className="add-inventory-input"
                    fullWidth
                    select
                    focused
                    label="Category"
                    value={category}
                    onChange={handleChangeCategory}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BuildIcon
                            data-testid="Category-icon-id"
                            sx={{ color: color, fontSize: "medium" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    {inventoryCategories.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>{" "}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    className="add-inventory-input"
                    select
                    label="Sub Category"
                    focused
                    fullWidth
                    value={subCategory}
                    placeholder="Select"
                    onChange={handleChangeSubCategory}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FitnessCenterIcon
                            data-testid="SubCategory-icon-id"
                            style={{ color: color, fontSize: "medium" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    {inventorySubCategories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>{" "}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} mt={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    className="add-inventory-input"
                    select
                    fullWidth
                    label="Manufacturer"
                    placeholder="Select"
                    value={manufacturer}
                    onChange={handleChangeManufacturer}
                    variant="standard"
                    focused
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddShoppingCartIcon
                            data-testid="Manufacturer-icon-id"
                            sx={{ color: color, fontSize: "medium" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    {inventoryManufacturers.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>{" "}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    className="add-inventory-input"
                    select
                    fullWidth
                    label="Model Number"
                    value={modelNumber}
                    onChange={handleChangeModelNumber}
                    focused
                    placeholder="Select"
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HandymanIcon
                            data-testid="ModelNumber-icon-id"
                            sx={{ color: color, fontSize: "medium" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    {inventoryModelnumbers.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>{" "}
                </Box>
              </Grid>
            </Grid>
            <Box
              display="flex"
              justifyContent={!modelNumber ? "center" : ""}
              mt={3}
            >
              {modelNumber ? (
                <SuggestedModels />
              ) : (
                <img
                  style={{
                    height: "150px",
                    marginTop: "15px",
                    width: "400px",
                  }}
                  src={img}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box mt={3} textAlign="right">
          <Button
            data-testid="button-id"
            className="btn-add-inventory"
            disabled={
              !category || !subCategory || !manufacturer || !modelNumber
            }
          >
            Add Inventory
          </Button>
        </Box>
      </Box>
    </SmartDialog>
  );
}

const suggestedModelsList: any[] = [
  {
    img: NewImg,
    title: "M18Fuel",
    model: 2912,
    sku: "ALPHNZ",
  },
  {
    img: NewImg,
    title: "M18Fuel",
    model: 2912,
    sku: "ALPHNZ",
  },
  {
    img: NewImg,
    title: "M18Fuel",
    model: 2912,
    sku: "ALPHNZ",
  },
  {
    img: NewImg,
    title: "M18Fuel",
    model: 2912,
    sku: "ALPHNZ",
  },
];

export const SuggestedModels = () => {
  return (
    <Box>
      <Typography variant="h5" component={"h3"} mb={1}>
        Select from suggested models
      </Typography>
      <Grid container spacing={3}>
        {suggestedModelsList.map((item: any, index: number) => (
          <Grid item xs={12} md={6} key={index}>
            <SuggestedModel data={item} key={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const SuggestedModel = ({ data, key }: any) => {
  return (
    <Paper elevation={3} sx={{ padding: 2 }} className="model" key={key}>
      <Box display={"flex"} gap={3}>
        <Box width={"50px"} border="solid 1px #ddd">
          <img
            style={{
              width: "50px",
            }}
            src={data.img}
          />
        </Box>
        <Box overflow={"hidden"}>
          <Typography
            variant="body1"
            component={"p"}
            fontWeight={600}
            className="model-title"
          >
            {data.title}
          </Typography>
          <Box display={"flex"} gap={4}>
            <Typography variant="body2" component={"p"}>
              Model: {data.model}
            </Typography>
            <Typography variant="body2" component={"p"}>
              SKU: {data.sku}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
