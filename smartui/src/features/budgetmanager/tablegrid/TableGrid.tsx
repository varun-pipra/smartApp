import * as React from "react";
import SmartGrid, { SmartGridProps } from "components/smartgrid/SmartGrid";

import "./TableGrid.scss";

const TableGrid = (props: SmartGridProps) => {
	return <SmartGrid{...props} className="budgetmanger-grid" />;
};

export default TableGrid;
