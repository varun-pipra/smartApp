import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';

// import DialogExample from 'examples/Dialog/Dialog';
// import GridExample from 'examples/Grid/GridExample';
// import SimpleGridExample from 'examples/Grid/SimpleGridExample';
// import DrawerExample from 'examples/Drawer/Drawer';
// import DetailsPanel from 'examples/DetailsPanel/DetailsPanel';

// import GridPaginationExample from 'examples/Grid/GridPaginationExample';
// import AlertExample from 'examples/Alert/AlertExample';
// import NestedGridExample from 'examples/Grid/NestedGridExample';
import SSRGrouping from 'examples/Grid/SSRGrouping';
// import SimpleGridGroupingExample from 'examples/Grid/SimpleGridGroupingExample';
// import LineItemExample from 'examples/LineItem/LineItemExample';
// import CalculatorExample from 'examples/Calculator/CalculatorExample';
// import EmailExample from 'examples/Email/EmailExample';
// import SegmentExample from 'examples/Segment/SegmentExample';
// import CompanyExample from 'examples/Company/CompanyExample';
// import ContactExample from 'examples/Contact/ContactExample';
// import ComponentsDemoExample from 'examples/ComponentsDemo/ComponentsDemoExample';
// import DocUploaderExample from 'examples/DocUploader/DocUploaderExample';
// import CompanyCardExample from 'examples/CompanyCard/CompanyCardExample';
// import GridWindowExample from 'examples/GridWindow/GridWindowExample';
import ViewBuilderExample from 'examples/Viewbuilder/ViewBuilderExample';
// import SUIBudgetLineItemSelectExample from 'examples/BudgetLineItemSelect/BudgetLineItemSelectExample';
// import SUICountDownTimerExample from 'examples/CountDownTimerExample/CountDownTimerExample';
// import SUIAwardedBidderTooltipExample from './examples/AwardedBidderTooltip/AwardedBidderTooltip';
// import FilterMenuExample from './examples/FilterMenu/FilterMenuExample';
// import NotificationBarExample from './examples/NotificationBarExample/NotificationBarExample';
// import TimePicker from 'examples/TimePickerExample/timepickerexample';
// import Costcodeselect from 'examples/Costcodeselectexample/costCodeSelectExample';
// import MapExample from 'examples/MapExample/MapExample';
// import ClockExample from 'examples/Clock/ClockExample';
// import SelectionTilesExample from 'examples/SelectionTiles/SelectionTilesExample';
// import PayIntervalFrequencyExample from 'examples/PayIntervalFrequencyExample/PayIntervalFrequencyExample';
// import ContractDetails from './features/vendorcontracts/vendorcontractsdetails/tabs/contractdetails/ContractDetails';
// import DynamicTooltipExample from 'examples/DynamicTooltip/DynamicTooltipExample';
// import BudgetManagerROExample from 'examples/BudgetManagerRO/BudgetManagerROExample';
// import ContractsSignModalExample from 'examples/ContractsSignModalExample/ContractsSignModalExample';
// import ScheduleOfValuesExample from 'examples/ScheduleOfValuesExample/ScheduleOfValuesExample';
// import { ContractorResponseExample } from 'examples/ContractorResponse/ContractorResponseExample';

// import IQTextField from 'components/formfields/textfield/IQTextField';
//  import HtmlEditorExample  from "examples/HtmlEditorExample/HtmlEditorExample";
import IQDropDown from 'components/formfields/dropdown/IQDropDown';
import DataGrid from 'examples/IQDataGrid/DataGridExample';
import TabbedWindowExample from 'examples/tabbedwindow/TabbedWindowExample';

// Common Apps
import SupplementalContracts from 'features/supplementalcontracts/SupplementalContractsWindow';

import ToolsEquipmentWindow from 'features/toolsandequipment/ToolsEquipmentWindow';

// Finance Apps
import BudgetManagerWindow from 'features/budgetmanager/BudgetManagerWindow';
import BMWMultiLevelDemo from 'features/budgetmanager/BMWMultiLevelDemo';

import BidManagerWindow from 'features/bidmanager/BidManagerWindow';
import BidResponseManagerWindow from 'features/bidresponsemanager/BidResponseManagerWindow';
import ClientContractsWindow from 'features/clientContracts/ClientContractsWindow';
import VendorContractsWindow from 'features/vendorcontracts/VendorContractsWindow';
import ClientPayApplicationsWindow from 'features/clientpayapplications/ClientPayApplicationsWindow';
import VendorPayApplicationsWindow from 'features/vendorpayapplications/VendorPayApplicationsWindow';

// Project Settings
import ProjectTeamWindow from 'features/projectsettings/projectteam/ProjectTeamWindow';
import ProjectTeamWindowSSR from 'features/projectsettings/projectteam/ProjectTeamWindowSSR';

// Safety Apps
import SafetyRequirementsWindow from 'features/safety/safetyrequirements/SafetyRequirementsWindow';
import SBSManagerWindow from 'features/safety/sbsmanager/SBSManagerWindow';
import GridInfiniteScroll from 'examples/Grid/GridInfiniteScroll';
import GridExample from 'examples/Grid/GridExample';
import ChangeEventRequestWindow from 'features/finance/changeeventrequests/ChangeEventRequestWindow';
import SpecificationManagerWindow from 'features/field/specificationmanager/SpecificationManagerWindow';
import SmartSubmittalsWindow from 'features/field/smartsubmittals/SmartSubmittalsWindow';
import SmartSubmittalTabbedWindow from 'features/field/smartsubmittals/SmartSubmittalTabbedWindow';
import PhasesColorPickerExample from 'examples/PhasesColorPicker/PhasesColorPickerExample';
import PhasesGridListExample from 'examples/phasesGrid/PhasesGridExample';
import MultiSelectTreeView from 'examples/SelectTreeComponent/Treeview';
import TimeLogWindow from 'features/common/timelog/TimeLogWindow';
import BudgetRoomWindow from 'features/finance/budgetroom/BudgetRoomWindow';
import EstimateRoomWindow from 'features/finance/estimateroom/EstimateRoomWindow';
const AppRoutes = () => {
	return <>
		<Routes>
			<Route path='tools-equipment' element={<ToolsEquipmentWindow />} >
				<Route path='home' element={<ToolsEquipmentWindow />} />
			</Route>
			<Route path='budget-manager' element={<BudgetManagerWindow />} >
				<Route path='home' element={<BudgetManagerWindow fullScreen={true} />} />
			</Route>
			<Route path='bmw-ml-demo' element={<BMWMultiLevelDemo />} />
			<Route path='bid-manager' element={<BidManagerWindow />} >
				<Route path='home' element={<BidManagerWindow />} />
			</Route>
			<Route path='bid-response-manager' element={<BidResponseManagerWindow />} >
				<Route path='home' element={<BidResponseManagerWindow />} />
			</Route>
			<Route path='vendor-contracts' element={<VendorContractsWindow />} >
				<Route path='home' element={<VendorContractsWindow />} />
			</Route>
			<Route path='client-contracts' element={<ClientContractsWindow />} >
				<Route path='home' element={<ClientContractsWindow />} />
			</Route>
			<Route path='vendor-pay-applications' element={<VendorPayApplicationsWindow />} >
				<Route path='fullView' element={<VendorPayApplicationsWindow />} />
				<Route path='home' element={<VendorPayApplicationsWindow fullScreen={true} />} />
			</Route>
			<Route path='client-pay-applications' element={<ClientPayApplicationsWindow />} >
				<Route path='fullView' element={<ClientPayApplicationsWindow />} />
				<Route path='home' element={<ClientPayApplicationsWindow fullScreen={true} />} />
			</Route>
			<Route path='change-event-requests' element={<ChangeEventRequestWindow />} >
				<Route path='fullView' element={<ChangeEventRequestWindow />} />
				<Route path='home' element={<ChangeEventRequestWindow fullScreen={true} />} />
			</Route>
			<Route path='budget-room' element={<BudgetRoomWindow />} >
				<Route path='fullView' element={<BudgetRoomWindow />} />
				<Route path='home' element={<BudgetRoomWindow fullScreen={true} />} />
			</Route>
			<Route path='estimate-room' element={<EstimateRoomWindow />} >
				<Route path='fullView' element={<EstimateRoomWindow />} />
				<Route path='home' element={<EstimateRoomWindow fullScreen={true} />} />
			</Route>
			<Route path='field'>
				<Route path='specManager' element={<SpecificationManagerWindow />} />
				<Route path='specSmartSubmittals' element={<SmartSubmittalsWindow />} />
				<Route path='smartSubmittals' element={<SmartSubmittalTabbedWindow />} />
			</Route>
			<Route path='projectSettings'>
				<Route path='projectTeam' element={<ProjectTeamWindow />} >
					<Route path='fullView' element={<ProjectTeamWindow />} />
					<Route path='teamOrientation' element={<ProjectTeamWindow />} />
				</Route>
				<Route path='projectTeam/staff' element={<ProjectTeamWindow />} >
					<Route path='fullView' element={<ProjectTeamWindow />} />
					<Route path='teamOrientation' element={<ProjectTeamWindow />} />
				</Route>
				<Route path='projectTeamSSR' element={<ProjectTeamWindowSSR />} >
					<Route path='fullView' element={<ProjectTeamWindowSSR />} />
					<Route path='teamOrientation' element={<ProjectTeamWindowSSR />} />
				</Route>
			</Route>
			<Route path='safety'>
				<Route path='safetyRequirements' element={<SafetyRequirementsWindow />} >
					<Route path='fullView' element={<SafetyRequirementsWindow />} />
				</Route>
				<Route path='sbsManager' element={<SBSManagerWindow />} >
					<Route path='fullView' element={<SBSManagerWindow />} />
					<Route path='home' element={<SBSManagerWindow fullScreen={true} />} />
				</Route>
			</Route>
			<Route path='common'>
				<Route path='supplementalContracts' element={<SupplementalContracts open={true} />} />
				<Route path='timelog' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>				
				<Route path='timelog/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				{/* <Route path='timelog/fromOrg' element={<TimeLogWindow />} /> */}
				<Route path='timelog/fromOrg' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/fromOrg/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/fromOrg/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/planner' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/planner/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/planner/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/field' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/field/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/field/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/finance' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/finance/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/finance/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/safety' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/safety/t=1' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
				<Route path='timelog/safety/t=2' element={<TimeLogWindow />} >
					<Route path='fullView' element={<TimeLogWindow />} />
					<Route path='home' element={<TimeLogWindow fullScreen={true} />} />
				</Route>
			</Route>
			<Route path='examples'>
				<Route path='infinite-scroll' element={<GridInfiniteScroll />} />
				<Route path='grid-example' element={<GridExample />} />
				<Route path='ssr-grouping' element={<SSRGrouping />} />
				<Route path='iqdropdown' element={<IQDropDown />} />
				<Route path='datagrid' element={<DataGrid />} />
				<Route path='tabbedWindow' element={<TabbedWindowExample />} />
				<Route path='phases-color-picker' element={<PhasesColorPickerExample />} />
				<Route path='phases-grid-list' element={<PhasesGridListExample />} />
				<Route path='tree-view' element={<MultiSelectTreeView />} />
			</Route>
			{/* <Route path='budget-room' element={<BudgetRoomWindow />} /> */}
			<Route path='ViewBuilderExample' element={<ViewBuilderExample />} />
			
			{/* <Route path='examples'>
				<Route path='costCodeSelect' element={<Costcodeselect />} />
				<Route path='TimePicker' element={<TimePicker />} />
				<Route path='example' element={<DialogExample />} />
				<Route path='grid-example' element={<GridExample />} />
				<Route path='simplegrid-example' element={<SimpleGridExample />} />
				<Route path='drawer-example' element={<DrawerExample />} />
				<Route path='details-example' element={<DetailsPanel />} />
				<Route path='pagination-example' element={<GridPaginationExample />} />
				<Route path='alert-example' element={<AlertExample />} />
				<Route path='nestedgrid-example' element={<NestedGridExample />} />
				<Route path='MapExample' element={<MapExample />} />
				<Route path='groupedsimplegrid-example' element={<SimpleGridGroupingExample />} />
				<Route path='lineitem-example' element={<LineItemExample />} />
				<Route path='calculator-example' element={<CalculatorExample />} />
				<Route path='email-example' element={<EmailExample />} />
				<Route path='budget-line-item-select-example' element={<SUIBudgetLineItemSelectExample />} />
				<Route path='segment-example' element={<SegmentExample />} />
				<Route path='filter-menu-example' element={<FilterMenuExample />} />
				<Route path='ViewBuilderExample' element={<ViewBuilderExample />} />
				<Route path='countdown-example' element={<SUICountDownTimerExample />} />
				<Route path='AwardedBidderTooltip-example' element={<SUIAwardedBidderTooltipExample />} />
				<Route path='NotificationBar-example' element={<NotificationBarExample />} />
				<Route path='company-example' element={<CompanyExample />} />
				<Route path='contact-example' element={<ContactExample />} />
				<Route path='companycard-example' element={<CompanyCardExample />} />
				<Route path='components-demo' element={<ComponentsDemoExample />} />
				<Route path='doc-uploader' element={<DocUploaderExample />} />
				<Route path='clock' element={<ClockExample />} />
				<Route path='base' element={<GridWindowExample />} />
				<Route path='selection-tiles' element={<SelectionTilesExample></SelectionTilesExample>}></Route>
				<Route path='pay-interval-frequrency' element={<PayIntervalFrequencyExample />}></Route>
				<Route path='contract-details' element={<ContractDetails />}></Route>
				<Route path='dynamic-tooltip' element={<DynamicTooltipExample></DynamicTooltipExample>}></Route>
				<Route path='budget-manager-ro' element={<BudgetManagerROExample />}></Route>
				<Route path='contract-sign-modal' element={<ContractsSignModalExample></ContractsSignModalExample>}></Route>
				<Route path='schedule-of-values' element={<ScheduleOfValuesExample />} />
				<Route path='contractor-response' element={<ContractorResponseExample />} />
			</Route> */}
			{/* <Route path="html-editor" element={<HtmlEditorExample />} /> */}
			<Route path='*' element={<BudgetManagerWindow />} />
		</Routes>
	</>;
};

export default AppRoutes;
