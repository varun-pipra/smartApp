import { Box, IconButton } from '@mui/material';
import * as React from 'react';
import './ContractDocuments.scss';
import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
//import Deletedisabled from 'resources/images/bidManager/Delete.svg';
import SUIGrid from 'sui-components/Grid/Grid';

export interface ContractDocumentsProps {
	contractDocHeaders?: any;
	contractDocData?: any;
	addContractDocs?: any;
	deleteContractDocs?: any;
	selectedContracts?: any;
	contractBtnLbl?: any;
	contractHeader?: string;
	readOnly?: boolean;
	showDownloadButton?: boolean;
	fileDownload?: any;
};

const SUIContractDocuments = (props: ContractDocumentsProps) => {
	const {
		contractDocHeaders,
		contractDocData,
		addContractDocs,
		deleteContractDocs,
		selectedContracts,
		contractBtnLbl,
		contractHeader,
		readOnly = false,
		showDownloadButton = false,
		fileDownload
	} = props;
	const [columnDefs, setColumnDefs] = React.useState(contractDocHeaders);
	const [disableDeleteBtn, setDisableDeleteBtn] = React.useState<boolean>(true);
	const [selected, setSelected] = React.useState([]);
	const [data, setData] = React.useState([]);
	const [disableDownloadBtn, setDisableDownloadBtn] = React.useState<boolean>(true);
	let selectedRows: any = [];

	React.useEffect(() => {
		contractDocHeaders?.forEach((header: any) => {
			if (header?.headerCheckboxSelection && readOnly) {
				header.headerCheckboxSelection = false;
			}
			if (header?.checkboxSelection && readOnly) {
				header.checkboxSelection = false;
			}
		});
		setColumnDefs(contractDocHeaders);
	}, []);

	React.useEffect(() => {
		if (contractDocData) {
			setData(contractDocData)
			setDisableDownloadBtn(contractDocData?.length > 0 ? false : true);
		}
	}, [contractDocData]);

	const rowSelected = (sltdRow: any) => {
		const selectedRowData = sltdRow.api.getSelectedRows();
		selectedRowData.length > 0 ? setDisableDeleteBtn(false) : setDisableDeleteBtn(true);
		selectedContracts && selectedContracts(selectedRowData);
		setSelected(selectedRowData);
	};
	const onSelectedFilesDownload = () => {
		fileDownload(data);
	};
	return (
		<div className='contract-doc-cont'>
			<div className='vendor-contract-sub-header-text'>
				<span className='lable'>{contractHeader}</span>
				{data?.length > 0 && showDownloadButton && <IQTooltip title="Download" placement="bottom">
					<IconButton
						className="download-btn"
						disabled={disableDownloadBtn}
						onClick={() => { onSelectedFilesDownload(); }}
					>
						<span className="common-icon-version-download"></span>
					</IconButton>
				</IQTooltip>}
			</div>

			{!readOnly &&
				<div className='button-section'>
					<IQButton
						color='blue'
						className='add-standard-btn'
						sx={{ height: '2.5em' }}
						onClick={addContractDocs}
						disabled={readOnly}
					>
						{contractBtnLbl}
					</IQButton>
					<IQTooltip title='Delete' placement='bottom'>
						<IconButton
							className='delete-btn'
							disabled={disableDeleteBtn}
							onClick={(e: any) => {
								const typedFileList = selected.map((file: any) => ({ id: file.id, type: 'Standard' }));
								deleteContractDocs(typedFileList);
								setSelected([]);
							}}
						>
							<span className='common-icon-delete'></span>
						</IconButton>
					</IQTooltip>
				</div>
			}
			<div className='standard-doc-cont'>
				<SUIGrid
					headers={columnDefs}
					data={data}
					rowSelected={rowSelected}
					rowMessageHeading={' '}
					rowMessageIcon={'common-icon-standard-contract'}
					nowRowsMsg={'<div>Click on + to add Standard Contract Documents'}
				/>
			</div>
		</div>
	);
};

export default SUIContractDocuments;