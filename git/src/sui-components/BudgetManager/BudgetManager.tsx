import { useAppSelector } from "app/hooks";
import IQButton from "components/iqbutton/IQButton";
import React, { useEffect, useRef, useState } from "react";
import { useMemo, useCallback } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import IQSearch from "components/iqsearchfield/IQSearchField";
import './BudgetManager.scss';
import { ColDef } from "ag-grid-community";
import { billableInCCObj, getAmountAlignment, providerSourceObj } from "utilities/commonutills";
import SUIAlert from "sui-components/Alert/Alert";
import _ from "lodash";
import IQBaseWindow from 'components/iqbasewindow/IQBaseWindow';
import IQTooltip from "components/iqtooltip/IQTooltip";
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

interface BudgetManagerROProps {
	data: any;
	onAdd: (rows: any) => void;
	onClose?: any;
	getBudgetValue?: any;
	defaultRecords?: any;
	allowMarkupFee?: boolean;
	disableRowsKey?: string;
	alertText?: React.ReactNode;
	alertTitle?: string;
	moduleName?:string;
};

const BudgetManagerRO = (props: BudgetManagerROProps) => {
	const [isFullView, setIsFullView] = React.useState(false);
	const [selectedRows, setSelectedRows] = React.useState<any>([]);
	const [totalBudgetValue, setTotalBudgetValue] = React.useState<number>(0);
	const [selectedIds, setSelectedIds] = React.useState<any>([]);
	const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
	const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [rowData, setRowData] = React.useState<any>(props?.data);
	const [tableRef, setTableRef] = React.useState<any>();
	const [alert, setAlert] = React.useState<any>({ show: false, node: '' });
	const [filters, setFilters] = React.useState<any>({});
	const mySearch = useRef(false);

	const [locations, setLocations] = useState<any>([]);
	const selectedRowsData = (rows: any) => {
		tableRef?.current?.api.forEachNode((node: any) => {
			node.setSelected(rows?.includes(node?.data?.id));
		});
	};
	React.useEffect(() => {
		const pathName = location.pathname;
		if (pathName.includes('home')) {
			setIsFullView(true);
		}
	}, [location]);

	React.useEffect(() => {
		setRowData(props?.data);
	}, [props?.data]);

	React.useEffect(() => {
		if (rowData.length > 0 && selectedRows.length > 0) {
			const idArray = selectedRows.map((item: any) => item.id);
			selectedRowsData(idArray);
		}
		
	}, [rowData]);

	useEffect(()=> {
		if (props?.data?.length > 0) {
			let locationRecords:any = [];
			props.data.forEach((rec: any)=> {
				if (rec?.locations?.length >0) {
					rec.locations.forEach((item: any) => {
						if (locationRecords.findIndex((obj: any) => obj.id === item.id) === -1) {
							locationRecords.push(item);
						}
					});
				}
			});
			setLocations(locationRecords);
		}
	}, [props?.data])

	React.useEffect(() => {
		let totalBudget: number = 0;
		const ids = selectedRows?.map((row: any) => {
			totalBudget = Number(totalBudget) + Number(row?.revisedBudget);
			return { id: row?.id };
		});
		setSelectedIds(ids);
		setTotalBudgetValue(totalBudget);
	}, [selectedRows]);

	const handleWindowMaximize = (event: any, value: boolean) => {
		// dispatch(setAppWindowMaximize(value));
	};

	useEffect(() => {
		if (tableRef?.current?.api) {
			selectedRowsData(props?.defaultRecords);
		}
	}, [tableRef]);


	const columnDefs: any = [
		// {
		// 	headerName: "Budget Line Item",
		// 	field: "costCode",
		//     pinned: "left",
		//     headerCheckboxSelection: true,
		//     checkboxSelection: true,
		//     sort: "asc",
		//     width: 300,
		// 	cellRenderer: 'agGroupCellRenderer',
		// 	valueGetter: (params: any) => params.data?.costCode,
		// 	cellRendererParams: {
		// 		suppressDoubleClickExpand: true,
		// 		innerRenderer: (params: any) => {
		// 			return <>
		// 				{ params.data?.costCode !== 'Grand Total' && <span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF' }}>{`${params.data?.name} - ${params.data?.costCode} - ${params.data?.division} - ${params.data?.costType}`} </span>}
		// 			</>
		// 		}
		// 	}
		// },
		{
			headerName: "Budget Line Item",
			field: "division",
			pinned: "left",
			rowGroup: true,
			hide: true,
			sort: "asc",
			cellRendererParams: {
				innerRenderer: (params: any) => {
					return <>
						{(true || params?.data?.source === 1) && <IQTooltip
							title={''}
							placement={'bottom'}
							arrow={true}
						>
							<span className='common-icon-c-mark' style={{ color: '#78dbc3', position: 'absolute', left: '7%', marginTop: '12px', cursor: 'pointer' }} />
						</IQTooltip>}
						<span className='common-icon-c-mark' style={{ color: '#78dbc3', position: 'absolute', left: '7%', marginTop: '12px', cursor: 'pointer' }} />
						{params.data?.costCode !== 'Grand Total' && <span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF' }}>{`${params.data?.name} - ${params.data?.costCode} - ${params.data?.division} - ${params.data?.costType}`} </span>}
					</>;
				}
			}
		},
		{
			headerName: "Budget ID/WBS",
			field: "name",
		},
		{
			headerName: "Description",
			field: "description",
		},
		{
			headerName: "Division",
			field: "division",
			width: 250,
		},
		{
			headerName: "Cost Type",
			field: "costType",
		},
		{
			headerName: "Revised Budget",
			field: "revisedBudget",
			aggFunc: 'sum',
			//valueGetter: (params: any) => params.data?.revisedBudget ? `${currencySymbol} ${params.data?.revisedBudget?.toLocaleString("en-US")}` : "",
			cellRenderer: (params: any) => {
				if (params?.value && (params?.node?.footer || params?.node?.level > 0 || !params?.node?.expanded)) {
					return amountFormatWithSymbol(params?.value);
				}
			},
		},
		// {
		// 	headerName: "Mark-up Fee",
		// 	field: "markupFee",
		// 	valueGetter: (params: any) => {
		// 		if(props?.allowMarkupFee) return params?.data?.markupFeeType == 0 ? params?.data?.markupFeeAmount ?? 'N/A' : params?.data?.markupFeePercentage ? `${((params?.data?.markupFeePercentage/100)*(params?.data?.originalAmount))?.toLocaleString("en-US")} (${params?.data?.markupFeePercentage}%)` : 'N/A';
		// 		else return 'N/A'
		// 	},
		// 	type: 'rightAligned',
		// 	hide:  !props?.allowMarkupFee,
		// 	cellRenderer: (params: any) => {
		// 		if(params?.value && (
		// 			params?.node?.footer ||
		// 			params?.node?.level > 0 ||
		// 			!params?.node?.expanded)
		// 		) {
		// 			return params?.value !== 'N/A' ? currencySymbol + ' ' + params?.value.toLocaleString('en-US') : params?.value;
		// 		}
		// 	}
		// },
		{
			headerName: "Mark-up Fee",
			field: "markupFee",
			aggFunc: 'sum',
			valueGetter: (params: any) => {
				if (props?.allowMarkupFee) {
					const percentageCal = (params?.data?.markupFeePercentage / 100) * (params?.data?.originalAmount);
					return params?.data?.markupFeeType == 0 ? params?.data?.markupFeeAmount ?? 'N/A'
						: params?.data?.markupFeePercentage ? percentageCal
							: 'N/A';
				}
				else {
					return 'N/A'
				}
			},
			type: 'rightAligned',
			hide: !props?.allowMarkupFee,
			cellRenderer: (params: any) => {
				if (params?.value && params?.node?.footer) {
					return params?.value == 'N/A' ? ' ' : amountFormatWithSymbol(params?.value)
				}
				else if (params?.node?.level == 1 && params?.value && params?.data?.markupFeePercentage) {
					return params?.value == 'N/A' ? 'N/A' : amountFormatWithSymbol(params?.value) + `(${params?.data?.markupFeePercentage}%)`
				}
				else if (params?.node?.level == 1 && params?.value && params?.data?.markupFeePercentage == null) {
					return params?.value == 'N/A' ? 'N/A' : amountFormatWithSymbol(params?.value)
				}
			}
		},
		{
			headerName: "Unit Of Measure",
			field: "unitOfMeasure",
		},
		{
			headerName: "Unit Quantity",
			field: "unitQuantity",
			cellRenderer: (params: any) => {
				return (
					<span>{params?.data?.unitQuantity?.toLocaleString("en-US")}</span>
				);
			}
		},
		{
			headerName: "Unit Cost",
			field: "unitCost",
			valueGetter: (params: any) => params.data?.unitCost ? `${currencySymbol} ${params.data?.unitCost?.toLocaleString("en-US")}` : "",

		},
		{
			headerName: "Provider Source",
			field: "providerSource",
			valueGetter: (params: any) => providerSourceObj?.[params.data?.providerSource],			
		},
		{
			headerName: 'Billable In Client Contract',
			field: 'isBillable',
			valueGetter: (params: any) => billableInCCObj?.[params.data?.isBillable],			
		},
		{
			headerName: 'Location',
			field: 'locations',
			suppressMenu: true,
			minWidth: 220,
			keyCreator: (params: any) => {
				const {value} = params;
				return (Array.isArray(value) && value?.length > 0) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : 'NA';
			},
			cellRenderer: (params: any) => {
				const {value} = params;
				return Array.isArray(value) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : '';
			}
		},
	];
	const autoGroupColumnDef = useMemo<ColDef>(() => {
		return {
			headerName: "Budget Line Item",
			field: "division",
			// valueGetter: (params: any) => params.data ? customCellRendererClass(params) : "",
			valueGetter: (params: any) => customValueGetter(params),
			pinned: "left",
			sort: "asc",
			width: 550,
			resizable: true,
			suppressRowClickSelection: true,
			showDisabledCheckboxes: true,
			cellRenderer: "agGroupCellRenderer",
			cellRendererParams: {
				suppressCount: false,
				checkbox: true,
				innerRenderer: (params: any) => customCellRendererClass(params),
			},
		};

	}, []);

	const isRowSelectable = useMemo(() => {
		return (params: any) => {
			return params.data && ((props?.defaultRecords?.includes(params.data?.id) || params.data?.[props?.disableRowsKey ?? 'clientContract'] == null) && (props?.moduleName == 'ClientContracts' ? params?.data?.isBillable : true));
		};
	}, []);

	const customValueGetter = (params: any) => {
		// console.log("customValueGetter", params?.data)
		if (!params.data) {
			return params.value;
		}
		return params?.data?.name + ' - ' + params.data?.costCode + ' : ' + params.data?.costType;
	};
	const customCellRendererClass = (params: any) => {
		if (!params.data) {
			const isFooter = params?.node?.footer;
			const isRootLevel = params?.node?.level === -1;
			if (isFooter) {
				if (isRootLevel) {
					return "Grand Total";
				}
				return `Sub Total - ${params?.value}`;
			} else {
				return `${params?.value}`;
			}
		}
		return <>
			{
				params?.data?.source === 1 && <IQTooltip
					title={''}
					placement={'bottom'}
					arrow={true}
				>
					<span className='common-icon-c-mark' style={{ color: '#78dbc3', position: 'absolute', left: '7%', marginTop: '12px', cursor: 'pointer' }} />
				</IQTooltip>
			}
			<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{params?.data?.name + ' - ' + params.data.costCode + ' : ' + params.data.costType}</span>
		</>;
		// return <span className="ag-costcodegroup" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{params?.data?.name + ' - ' + params.data.costCode + ' : ' + params.data.costType}</span>;
	};

	const handleOnSearchChange = (text: any) => {
		if (text != '') {
			const filteredData = props?.data.filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(text);
			});
			mySearch.current = true;
			setRowData(filteredData);
		}
		else {
			setRowData(props?.data);
			setTimeout(() => {
				tableRef?.current?.api.forEachNode((node: any) => {
					selectedRows?.forEach((data: any) => {
						if (data?.id === node?.data?.id) {
							node.setSelected(true);
						}
					});
				});
			}, 2000);
		}
	};

	const rowSelected = (event: any) => {
		const isSelected = event?.node?.selected;
		if (isSelected) {
			if (event?.node?.level != 0) {
				setSelectedRows(event.api.getSelectedRows());
			}
		}
		else {
			if (event?.node?.level == 1) {
				setSelectedRows((prev: any) => prev?.filter((row: any) => row.id !== event?.data?.id));
				if (mySearch.current) { return; }
				setAlert({ show: true, node: event?.node });
			}
		}
	};

	const onSelectionChanged = () => {
		mySearch.current = false;
	};

	const handleDeSelect = (type: any) => {
		if (type == 'yes') {
			setAlert({ show: false, node: '' });
		} else {
			alert?.node?.setSelected(true);
			setAlert({ show: false, node: '' });
		}
	};

	const handleSelectedRows = () => {
		// console.log("dataaaa", selectedRows)
		if (props?.onAdd) props?.onAdd(selectedIds);
		if (props?.getBudgetValue) props?.getBudgetValue(totalBudgetValue);
		if (props?.onClose) props?.onClose(false);
	};

	const filterHandler = (filters: any) => {
    console.log("filterHandler", filters);
    mySearch.current = true;
    if (_.isEmpty(filters)) setFilters({});
    else setFilters(filters);
    if (filters) {
      let filteredRecs: any = props?.data;
      if (
        filters.contractStatus?.length > 0 &&
        !filters.contractStatus?.includes("all")
      ) {
        if (filters.contractStatus.includes("contracted")) {
          filteredRecs = filteredRecs?.filter((obj: any) => {
            if (
              obj?.[props?.disableRowsKey ?? "clientContract"] != null &&
              !props?.defaultRecords?.includes(obj.id)
            )
              return obj;
          });
        } else {
          filteredRecs = filteredRecs?.filter((obj: any) => {
            if (
              props?.defaultRecords?.includes(obj.id) ||
              obj?.[props?.disableRowsKey ?? "clientContract"] == null
            )
              return obj;
          });
        }
      }
      if (
        filters.providerSource?.length > 0 &&
        !filters.providerSource?.includes("all")
      ) {
        filteredRecs = filteredRecs?.filter((obj: any) => {
          return filters.providerSource.includes(
            obj.providerSource?.toString()
          );
        });
      } if (
        filters.isBillable?.length > 0 &&
        !filters.isBillable?.includes("all")
      ) {
        filteredRecs = filteredRecs?.filter((obj: any) => {
          return filters.isBillable.includes(
            obj.isBillable?.toString()
          );
        });
      }
	  if (filters.location?.length > 0 && !filters.location?.includes("all")) {
		filteredRecs = filteredRecs?.filter((obj: any) => {
			const locationIds = obj.locations?.map((location: any) => location.id?.toString());
			return _.intersection(filters.location, locationIds).length > 0;
		  });
	  }
      setRowData(filteredRecs);
    } else setRowData(props?.data);
  };

	const isAddDisabled = () => {
		console.log("isAddDisabled", selectedRows, props?.defaultRecords)
		if(!selectedRows?.length && !props?.defaultRecords?.length) return true
		if(JSON.stringify(selectedRows?.map((row:any)=>row?.id)) == JSON.stringify(props?.defaultRecords)) return true
		else false;	
		console.log("elseee",JSON.stringify(selectedRows?.map((row:any)=>row?.id)), JSON.stringify(props?.defaultRecords) )
	}

	const renderGrid = useCallback(() => {
		return (<div style={containerStyle} className="budget-grid-cls">
			<div style={gridStyle} className="ag-theme-alpine">
				{
					<div style={containerStyle} className="budget-grid-cls budget-line-disable-cls">
						<div style={gridStyle} className="ag-theme-alpine">
							{
								<SUIGrid
									getReference={(value: any) => { setTableRef(value); }}
									headers={columnDefs}
									data={rowData}
									grouped={true}
									rowSelection={'multiple'}
									suppressRowClickSelection={true}
									autoGroupColumnDef={autoGroupColumnDef}
									getRowId={(params: any) => params?.data?.id}
									rowSelected={(e: any) => { rowSelected(e); }}
									groupSelectsChildren={true}
									isRowSelectable={isRowSelectable}
									onSelectionChanged={() => { onSelectionChanged(); }}
									rowClassRules={{
										"budget-manager-row-disabled-cls": (params: any) => {
											return ((params?.data?.[props?.disableRowsKey ?? 'clientContract'] != null && !props?.defaultRecords?.includes(params?.data?.id)) || (props?.moduleName == 'ClientContracts' && params?.data?.isBillable == false));
										},
										"budget-manager-row-active-cls": (params: any) => {
											return params?.data?.[props?.disableRowsKey ?? 'clientContract'] == null && (props?.moduleName == 'ClientContracts' ?  params?.data?.isBillable : true);
										},
									}}
								></SUIGrid>
							}
						</div>
					</div >
				}
			</div>
		</div >);
	}, [rowData]);

	const filtersData: any = [
		{
			text: 'Contract Status',
			value: 'contractStatus',
			key: 'contractStatus',
			children: {
				type: "checkbox",
				items: [
					{text: "Contracted", id: 'contracted', value: 'contracted', key: 'contracted'},
					{text: "Not Contracted", id: 'notContracted', value: 'notContracted', key: 'notContracted'},
				],
			},
		},
		{
			text: 'Provider Source',
			value: 'providerSource',
			key: 'providerSource',
			children: {
				type: "checkbox",
				items: [
					{text: "Self Perform", id: '1', value: '1', key: '1'},
					{text: "Trade Partner", id: '2', value: '0', key: '0'},
				],
			},
		},
		{
			text: "Billable In Client Contract",
			value: 'isBillable',
			key: 'isBillable',
			children: {
				type: "checkbox",
				items: [
					{ text: "Billable", id: '1', value: 'true', key: '1' },
					{ text: "Non-Billable", id: '2', value: 'false', key: '0' },
				]
			},
		},
		{
			text: "Location",
			value: 'location',
			key: 'location',
			children: {
				type: "checkbox",
				items: []
			},
		},
	];
	const [filterOptions, setFilterOptions] = useState<any>(filtersData);

	useEffect(()=> {
		const filtersOptionsCopy = [...filterOptions];
		let locationItem: any = filtersOptionsCopy.find((rec: any) => rec?.value === "location");
		const locationOptions: any = (locations || []).map((opt: any) => {
			return {
				text: opt.name,
				id: opt.id?.toString(),
				value: opt.id?.toString(),
				key: opt.id
			};
		});
		locationItem.children.items = locationOptions;
		setFilterOptions(filtersOptionsCopy);
	}, [locations])

	return (
		<IQBaseWindow
			open={true}
			className='bid-manager-window vendor-contracts-window add-budget-lineitem-cls custom-style'
			title='Add Budget Line Item'
			isFullView={isFullView}
			withInModule={true}
			disableEscapeKeyDown={true}
			PaperProps={{
				sx: { height: '90%', width: '95%' },
			}}
			onMaximize={handleWindowMaximize}
			moduleColor='#00e5b0'
			zIndex={100}
			tools={{
				closable: true,
				resizable: true,
				customTools: <></>
			}}
			onClose={(event, reason) => {
				if (reason && reason == 'closeButtonClick') {
					if (props?.onClose) props?.onClose(false);
				}
			}}
			actions={
				<>
					<div className='total-left-cls'>
						<span className='total-cls'><span className='length-cls'>Total No. of Selected Budget Line Items</span> <b>{selectedIds?.length}</b></span>
						<span className='total-cls'><span className='length-cls'>Total Budget Value of Selected Item</span> <b>{`${currencySymbol} ${getAmountAlignment(totalBudgetValue)}`}</b></span>
					</div>
					<IQButton
						disabled={props?.moduleName == 'VendorContracts' ? isAddDisabled(): selectedRows?.length > 0 ? false : true}
						className='btn-add-line-items'
						onClick={() => handleSelectedRows()}
					>
						{props?.moduleName == 'VendorContracts' ? "ADD / MANAGE SELECTED ITEMS" : "ADD SELECTED BUDGET LINE ITEMS"}
					</IQButton>
				</>
			}
		>
			<div key="toolbar-search" className="budget-search" style={{ alignItems: 'center' }}>
				<IQSearch
					placeholder={'Search'}
					showGroups={false}
					filters={filterOptions}
					onSearchChange={(text: string) => handleOnSearchChange(text)}
					filterHeader=''
					// onSettingsChange={handleSettings}
					// onViewFilterChange={handleViewFilter}
					// onSearchChange={searchHandler}
					onFilterChange={(filters:any) => filterHandler(filters)}
					//filterAllowSubMenu={false}
					addKeysToFilters={true}
				/>
			</div>
			{renderGrid()}
			{
				alert?.show && <SUIAlert
					open={alert?.show}
					onClose={() => {
						setAlert({ show: false, node: '' });
					}}
					DailogClose={true}
					contentText={
						props?.alertText ?? <span>Are you sure you want to remove the selected Budget Line Item(s)</span>
					}
					title={props?.alertTitle ?? 'Confirmation'}
					onAction={(e: any, type: string) => handleDeSelect(type)}
				/>
			}
		</IQBaseWindow >
	);
};

const getFilterMenuOptions = () => {
	return [
		{
			text: 'All',
			value: 'all',
			key: 'all',
			isWithoutSubMenu: true,
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: 'Contracted',
			value: 'contracted',
			key: 'contracted',
			isWithoutSubMenu: true,
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: 'Not Contracted',
			value: 'notContracted',
			key: 'notContracted',
			isWithoutSubMenu: true,
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: 'Provider Source',
			value: 'providerSource',
			key: 'providerSource',
			children: {
				type: "checkbox",
				items: [
					{text: "Self Perform", id: '1', value: '1', key: '1'},
					{text: "Trade Partner", id: '2', value: '0', key: '0'},
				],
			},
		},
		{
			text: "Location",
			value: 'location',
			key: 'location',
			children: {
				type: "checkbox",
				items: []
			},
		},
	];
};

export default BudgetManagerRO;