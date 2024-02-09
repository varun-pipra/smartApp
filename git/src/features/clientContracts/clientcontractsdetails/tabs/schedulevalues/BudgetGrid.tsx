import { ColDef } from "ag-grid-community";
import { useAppSelector } from "app/hooks";
import IQTooltip from "components/iqtooltip/IQTooltip";
import React from "react";
import { useMemo } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import { billableInCCObj, providerSourceObj } from "utilities/commonutills";

export const BudgetGrid = (props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
	const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
	const [selectedRows, setSelectedRows] = React.useState<any>([]);

	React.useEffect(() => {
		props?.onRowSelected && props?.onRowSelected(selectedRows);
	}, [selectedRows]);


	const columnDefs: any = [
		{
			headerName: "Cost Code Group",
			field: "division",
			pinned: "left",
			rowGroup: true,
			hide: true,
			sort: "asc"
		},
		{
			headerName: "Budget ID/WBS",
			field: "name"
		},
		{
			headerName: "Division",
			field: "division",
			width: 250
		},
		{
			headerName: "Cost Type",
			field: "costType"
		},
		{
			headerName: "Revised Budget",
			field: "budgetAmount",
			hide: !props?.isUserGC,
			aggFunc: 'sum',
			minWidth: 150,
			valueGetter: (params: any) => params.data?.budgetAmount,
			cellRenderer: (params: any) => {
				if (params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Provider Source',
			field: 'providerSource',
			valueGetter: (params: any) => providerSourceObj?.[params.data?.providerSource],			
		},
		{
			headerName: 'Billable In Client Contract',
			field: 'billableInCC',
			valueGetter: (params: any) => billableInCCObj?.[params.data?.billableInCC],			
		},
		{
			headerName: "Mark-up Fee",
			field: "markupFee",
			aggFunc: 'sum',
			// valueGetter: (params: any) => {
			// 	if(props?.isUserGC) return params?.data?.markupFeeAmount ? params?.data?.markupFeeAmount : params?.data?.markupFeePercentage ? `${(params?.data?.markupFeePercentage/100)*(params?.data?.budgetAmount)} (${params?.data?.markupFeePercentage}%)` : 'N/A'
			// 	else return 'N/A'
			// },
			valueGetter: (params: any) => {
				if (props?.isUserGC) {
					const percentageCal = (params?.data?.markupFeePercentage / 100) * (params?.data?.budgetAmount);
					return params?.data?.markupFeeAmount ? params?.data?.markupFeeAmount ?? 'N/A'
						: params?.data?.markupFeePercentage ? percentageCal
							: 'N/A';
				}
				else {
					return 'N/A'
				}
			},
			type: 'rightAligned',
			hide: !props?.isUserGC,
			// cellRenderer: (params: any) => {
			// 	if(params?.value && (
			// 		params?.node?.footer ||
			// 		params?.node?.level > 0 ||
			// 		!params?.node?.expanded)
			// 	) {					
			// 		return !params?.data?.markupFeePercentage && params?.value != 'N/A' ?  amountFormatWithSymbol(params?.value) : params?.value;
			// 	}
			// }	
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
			field: "unitOfMeasure"
		},
		{
			headerName: "Unit Quantity",
			field: "quantity",
			cellRenderer: (params: any) => {
				return !params?.node?.group && <span>{params?.data?.quantity?.toLocaleString("en-US")}</span>;
			}
		},
		{
			headerName: "Unit Cost",
			field: "unitCost",
			//aggFunc: 'sum',
			valueGetter: (params: any) => params.data?.unitCost,
			cellRenderer: (params: any) => {
				if (params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		}
	];

	const autoGroupColumnDef = useMemo<ColDef>(() => {
		return {
			headerName: "Cost Code Group",
			field: "division",
			valueGetter: (params: any) => !params?.data ? params?.value : params?.data?.name + ' - ' + params.data?.costCode + ' : ' + params.data?.costType,
			pinned: "left",
			sort: "asc",
			width: 450,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: "agGroupCellRenderer",
			cellRendererParams: {
				suppressCount: false,
				checkbox: !props?.checkbox ? props?.checkbox : true,
				innerRenderer: (params: any) => {
					return !params?.data ? params?.value
						: <>
							{params?.data?.hasChangeOrder && <IQTooltip
								title={''}
								placement={'bottom'}
								arrow={true}
							>
								<span className='common-icon-c-mark' style={{ color: '#26d8b1', position: 'absolute', left: '7%', marginTop: '12px', cursor: 'pointer' }} />
							</IQTooltip>}
							<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{params?.data?.name + ' - ' + params.data?.costCode ? params.data?.costCode : "" + ' : ' + params.data?.costType ? params.data?.costType : ""} </span>
						</>;
				}
			},
		};

	}, []);

	const rowSelected = (event: any) => {
		setSelectedRows(event.api.getSelectedRows());
	};

	return (
		<div style={containerStyle} className="budget-grid-cls">
			<div style={gridStyle} className="ag-theme-alpine">
				<SUIGrid
					headers={columnDefs}
					data={props?.data}
					grouped={true}
					rowSelection={'multiple'}
					pinnedBottomRowConfig={{
						displayFields: {
							division: 'Total',
							// description: 'This shows the summary data'
						},
						aggregateFields: ['budgetAmount', 'markupFee']
					}}
					suppressRowClickSelection={true}
					autoGroupColumnDef={autoGroupColumnDef}
					groupIncludeTotalFooter={true}
					groupIncludeFooter={false}
					rowSelected={(e: any) => rowSelected(e)}
					getRowId={(params: any) => params?.data?.id}
				></SUIGrid>
			</div>
		</div >
	);
};