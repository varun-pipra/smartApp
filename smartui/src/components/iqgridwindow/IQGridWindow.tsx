import {AgGridReact} from 'ag-grid-react';
import {ReactNode, memo, isValidElement, useEffect, useRef, useState} from 'react';

import './IQGridWindow.scss';

import {hideLoadMask, useAppSelector} from 'app/hooks';
import BaseWindow from 'components/iqbasewindow/IQBaseWindow';
import {IQBaseWindowProps} from 'components/iqbasewindow/IQBaseWindowTypes';
import BaseWindowBody, {IQBaseWindowBodyProps} from 'components/iqbasewindow/iqbasewindowbody/IQBaseWindowBody';
import IQGridWrapper from 'components/iqbasewindow/iqgridwrapper/IQGridWrapper';
import IQGridToolbar from 'components/iqbasewindow/iqgridwrapper/iqgridtoolbar/IQGridToolbar';
import DynamicPage from 'components/ui5/dynamicpage/DynamicPage';
import SUIGrid from 'sui-components/Grid/Grid-copy';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import {getCurrentDetailInfoSelectionIndex} from 'app/common/appInfoSlice';

type IQGridWindowProps = IQBaseWindowProps & {
	content?: IQBaseWindowBodyProps;
	titleMessage?: ReactNode;
	companyInfo?: boolean;
	lidCondition?: any;
	manualLIDOpen?: boolean;
	onDetailClose?: any;
	defaultTabId?: any;
	iframeEventData?: any;
	setIframeEventData?: any;
	gridRef?: any;
	handleMainWindowTab?: any;
	detailGridNavigation?: boolean;
};

const IQGridWindow = ({className, content = {}, companyInfo = false, lidCondition, manualLIDOpen, onDetailClose,
	titleMessage, presenceProps, gridRef = useRef<AgGridReact>(), handleMainWindowTab = () => {}, detailGridNavigation = false, ...props}: IQGridWindowProps) => {
	const [openLID, setOpenLID] = useState(false);
	const [details, setDetails] = useState(undefined);
	const [navFlag, setNavFlag] = useState(0);
	const [mainWindowTab, setMainWindowTab] = useState(undefined);
	const [tabDetailView, setTabDetailView] = useState(undefined);
	const [gridNavigationCount, setGridNavigationCount] = useState({
		startPage: 0,
		endPage: 0
	});
	const detailInfoSelectionIndex = useAppSelector(getCurrentDetailInfoSelectionIndex);
	const {gridContainer = {}, detailView, type = 'default', tabs, ...otherContent} = content;
	const {toolbar, grid} = gridContainer;
	const LineItemWindow = type === 'default' ? detailView : tabDetailView;

	useEffect(() => {
		hideLoadMask();
		if(type === 'tabs') {
			handleMainWindowTabChange(tabs && tabs.length > 0 ? tabs[0].tabId : undefined);
		}
	}, []);

	useEffect(() => {
		if(manualLIDOpen === true) {
			setOpenLID(true);
		} else {
			setOpenLID(false);
			setDetails(undefined);
		}
	}, [manualLIDOpen]);

	useEffect(() => {
		const grid = gridRef?.current;
		if(detailGridNavigation && (grid ?? false)) {
			handleNavigation();
		} else if(grid ?? false) {
			const node = grid?.api?.getSelectedNodes()[0];
			const rowIndex = node?.rowIndex || 0;
			const totalCount = grid?.api?.getDisplayedRowCount() || 0;

			if(rowIndex === 0) setNavFlag(-1);
			else if(rowIndex === (totalCount - 1)) setNavFlag(1);
			else setNavFlag(0);
		}
	}, [details, manualLIDOpen]);

	useEffect(() => {
		const grid = gridRef?.current;
		if(detailInfoSelectionIndex && (grid ?? false)) {
			handleNavigation();
		}
	}, [detailInfoSelectionIndex]);

	const handleGridRowDoubleClick = (row: any) => {
		const result = lidCondition ? lidCondition(row.data) : '';
		if(!lidCondition || result === true) {
			setOpenLID(true);
			setDetails(row.data);
		}
	};

	const handleCloseLID = () => {
		setOpenLID(false);
		onDetailClose && onDetailClose();
		setDetails(undefined);
	};

	const handleNavigation = (direction?: string) => {
		if(detailGridNavigation) {
			const grid = gridRef?.current;
			const splitDetailId = detailInfoSelectionIndex?.split(" ");
			const detailGrid = grid?.api?.detailGridInfoMap?.[splitDetailId?.[0]];
			const node = detailGrid.api.getSelectedNodes()[0];
			const rowIndex = node?.rowIndex || 0;
			const totalCount = detailGrid?.api?.getDisplayedRowCount() || 0;
			setGridNavigationCount({
				startPage: rowIndex + 1,
				endPage: totalCount
			});
			let currentRecord;
			if(direction === '-') {
				currentRecord = detailGrid?.api?.getDisplayedRowAtIndex(rowIndex - 1);
				if((rowIndex - 1) === 0) setNavFlag(-1);
				else setNavFlag(0);
			} else if(direction === '+') {
				currentRecord = detailGrid?.api?.getDisplayedRowAtIndex(rowIndex + 1);
				if((rowIndex + 1) === (totalCount - 1)) setNavFlag(1);
				else setNavFlag(0);
			} else if(direction === undefined) {
				currentRecord = detailGrid?.api?.getDisplayedRowAtIndex(rowIndex);
				if(rowIndex === 0) setNavFlag(-1);
				else if(rowIndex === (totalCount - 1)) setNavFlag(1);
				else setNavFlag(0);
			};
			if(currentRecord) {
				currentRecord.setSelected(true, true);
				setDetails(currentRecord.data);
			}
		} else {
			const grid = gridRef?.current;
			const node = grid?.api?.getSelectedNodes()[0];
			const rowIndex = node?.rowIndex || 0;
			const totalCount = grid?.api?.getDisplayedRowCount() || 0;
			let currentRecord;

			if(direction === '-') {
				currentRecord = grid?.api?.getDisplayedRowAtIndex(rowIndex - 1);
				if((rowIndex - 1) === 0) setNavFlag(-1);
				else setNavFlag(0);
			} else if(direction === '+') {
				currentRecord = grid?.api?.getDisplayedRowAtIndex(rowIndex + 1);
				if((rowIndex + 1) === (totalCount - 1)) setNavFlag(1);
				else setNavFlag(0);
			}

			if(currentRecord) {
				currentRecord.setSelected(true, true);
				setDetails(currentRecord.data);
			}
		}
	};

	const getTabContents = (tabList: any) => {
		const transformedTabs = tabList?.map((container: any) => {
			const {content, ...otherProps} = container;

			return {
				...otherProps, ...{
					content: (isValidElement(content) ? content : <IQGridWrapper>
						<IQGridToolbar {...content?.toolbar} />
						<SUIGrid
							gridRef={gridRef}
							animateRows={true}
							onRowDoubleClicked={handleGridRowDoubleClick}
							{...content?.grid}
							isMainGrid={true}
						/>
						{openLID ? <LineItemWindow
							data={details}
							onClose={handleCloseLID}
							onNavigation={handleNavigation}
							navigationDisableFlag={navFlag}
							appType={props?.appType}
							iFrameId={props?.iFrameId}
							defaultTabId={props?.defaultTabId}
							iframeEventData={props?.iframeEventData}
							setIframeEventData={props?.setIframeEventData}
							presenceProps={{
								showStreams: true,
								presenceId: (presenceProps?.presenceId && presenceProps?.presenceId + '-lid') || ''
							}}
							navigationPages={gridNavigationCount}
						/> : ''}
					</IQGridWrapper>)
				}
			};
		});

		return transformedTabs;
	};

	const handleMainWindowTabChange = (tabId: any) => {
		handleMainWindowTab(tabId);
		if(mainWindowTab !== tabId) {
			setMainWindowTab(tabId);
			const currentTab = tabs?.find((item: any) => item?.tabId === tabId);
			setTabDetailView(currentTab?.content?.detailView);
		}
	};

	return <BaseWindow
		className={`iq-gridwindow${className ? ` ${className}` : ''}`}
		centerPiece={titleMessage}
		titleInfo={companyInfo ? {
			text: props.appInfo?.currentUserInfo?.company,
			imgSrc: props.appInfo?.currentUserInfo?.profile
		} : null}
		presenceProps={presenceProps}
		{...props}
	>
		{type === 'default' ? <BaseWindowBody
			gridRef={gridRef}
			handleGridRowDoubleClick={handleGridRowDoubleClick}
		>
			<DynamicPage
				showPinned={false}
				className='iqbase-window-body main-window'
				bodyContent={
					<IQGridWrapper>
						<IQGridToolbar {...toolbar} />
						<SUIGrid
							gridRef={gridRef}
							animateRows={true}
							onRowDoubleClicked={handleGridRowDoubleClick}
							{...grid}
							openLID={openLID}
							isMainGrid={true}
							selectedRecord={details}
						/>
					</IQGridWrapper>
				}
				{...otherContent}
			/>
			{openLID ? <LineItemWindow
				data={details}
				onClose={handleCloseLID}
				onNavigation={handleNavigation}
				navigationDisableFlag={navFlag}
				appType={props?.appType}
				iFrameId={props?.iFrameId}
				defaultTabId={props?.defaultTabId}
				iframeEventData={props?.iframeEventData}
				setIframeEventData={props?.setIframeEventData}
				presenceProps={{
					showStreams: true,
					presenceId: (presenceProps?.presenceId && presenceProps?.presenceId + '-lid') || ''
				}}
			/> : ''}
		</BaseWindowBody> : <IQObjectPage
			continuous={false}
			tabs={getTabContents(tabs) || []}
			onTabChange={handleMainWindowTabChange}
		/>}
	</BaseWindow>;
};

export default memo(IQGridWindow);