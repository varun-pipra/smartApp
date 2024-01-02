import Box from "@mui/material/Box";
import React from "react";
import Filter from "sui-components/Filter/Filter";
// TODO: SVG
import StatusIcon from "resources/images/bidManager/StatusIcon.svg";
import StatusIconGray from "resources/images/bidManager/StatusIconGray.svg";

const CustomHeader = (props: any) => {
  const {showSorting = false, handleSorting = () => {}, defaultFilters, ...rest} = props;
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [sort, setSort] = React.useState(false);
  const [filterValues, setFilterValues] = React.useState<any>({
    ids: [],
    names: [],
  });
  const [postion, setPosition] = React.useState({
    clientX: "",
    clientY: "",
  });
  React.useEffect(() => {
    props?.clearFilters && setFilterValues({ ids: [], names: [] });
  }, [props?.clearFilters]);

  const handleClick = (event: any) => {
    const { clientX, clientY } = event;
    setPosition({
      clientX: clientX,
      clientY: clientY,
    });
    setFilterOpen(true);
    if(props?.onFilterOpened) {
        props?.onFilterOpened();
    }
  };
  React.useEffect(() => {
		if(defaultFilters) {
			setFilterValues(defaultFilters);
		}
	},[defaultFilters]);
  return (
    <>
      <div>
        <span className="ag-header-cell-text"
        onClick = {() => { setSort(!sort); handleSorting(sort ? 'asc' : 'desc')}}
        >{props.columnName}</span>
        <Box
          component="img"
          src={filterValues?.names?.length ? StatusIcon : StatusIconGray}
          style={{
            height: "15px",
            width: "15px",
            marginLeft: "10px",
            marginBottom: "-3px",
          }}
          onClick={handleClick}
        />
      </div>
      {filterOpen && (
        <Filter
          clearFilters={props?.clearFilters}
          filteredIds={filterValues}
          popupPostion={postion}
          options={props?.options}
          showFilter={true}
          filterChanged={(values: any) => {
            if (props.filterUpdated) props.filterUpdated(values);
            setFilterValues(values);
          }}
          onFilterClosed={(val: boolean) => {
            if(props?.statusFilterClose) props.statusFilterClose(val);
            setFilterOpen(val)
          }}
        />
      )}
    </>
  );
};
export default CustomHeader;
