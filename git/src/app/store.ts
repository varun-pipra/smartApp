import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appInfoSlice from './common/appInfoSlice';
import catalogReducer from 'features/toolsandequipment/operations/catalogSlice';
import inventoryReducer from 'features/toolsandequipment/operations/inventorySlice';
import inventoryCategoryReducer from 'features/toolsandequipment/operations/inventoryCategorySlice';
import inventorySubCategoryReducer from 'features/toolsandequipment/operations/inventorySubcategorySlice';
import inventoryManufacturerReducer from 'features/toolsandequipment/operations/inventoryManufacturerSlice';
import inventoryModelnumberReducer from 'features/toolsandequipment/operations/inventoryModelnumberSlices';
import stackedbarchartReducer from 'features/toolsandequipment/operations/chartSlice';
import donutchartReducer from 'features/toolsandequipment/operations/donutChartSlice';
import groupedBarchartReducer from 'features/toolsandequipment/operations/groupedBarChartSlice';
import tableColumnSliceReducer from 'features/budgetmanager/operations/tableColumnsSlice';
import costcodeOptionsSlice from 'features/budgetmanager/operations/costcodeSlice';
import costtypeOptionsSlice from 'features/budgetmanager/operations/costtypeSlice';
import curveSlice from 'features/budgetmanager/operations/curveSlice';
import uintSlice from 'features/budgetmanager/operations/unitSlice';
import gridDataSlice from 'features/budgetmanager/operations/gridSlice';
import transactionsSlice from 'features/budgetmanager/operations/transactionsSlice';
import rightPanelSlice from 'features/budgetmanager/operations/rightPanelSlice';
import vendorSlice from 'features/budgetmanager/operations/vendorInfoSlice';
import settingsSlice from 'features/budgetmanager/operations/settingsSlice';
import forecastSlice from 'features/budgetmanager/operations/forecastSlice';
import viewBuilderSlice from 'sui-components/ViewBuilder/Operations/viewBuilderSlice';

import bidManagerSlice from 'features/bidmanager/stores/BidManagerSlice';
import bidManagerGridSlice from 'features/bidmanager/stores/gridSlice';
import biddersSlice from 'features/bidmanager/stores/BiddersSlice';
import bidFileSlice from 'features/bidmanager/stores/FilesSlice';
import bidResponseFileSlice from 'features/bidresponsemanager/stores/FilesSlice';
import bidQueriesSlice from 'features/bidmanager/stores/BidQueriesSlice';
import bidResponseManagerGridSlice from 'features/bidresponsemanager/stores/gridSlice';
import awardBidSlice from 'features/bidmanager/stores/awardBidSlice';
import bidResponseSlice from 'features/bidresponsemanager/stores/BidResponseSlice';

import bidResponseManagerSlice from 'features/bidresponsemanager/stores/BidResponseManagerSlice';
import vendorContractsSlice from 'features/vendorcontracts/stores/VendorContractsSlice';
import clientContractsSlice from 'features/clientContracts/stores/ClientContractsSlice';
import vendorPayAppsSlice from 'features/vendorpayapplications/stores/VendorPayAppSlice';
import clientPayAppsSlice from 'features/clientpayapplications/stores/ClientPayAppsSlice';
import CCGridSlice from 'features/clientContracts/stores/gridSlice';
import vendorContractsGridSlice from 'features/vendorcontracts/stores/gridSlice';
import scheduleOfValuesSlice from 'features/vendorcontracts/stores/ScheduleOfValuesSlice';
import VCChangeEventsSlice from 'features/vendorcontracts/stores/VCChangeEventsSlice';
import safetyRequirementsGridSlice from 'features/safety/safetyrequirements/stores/gridSlice';
import ptGridDataSlice from 'features/projectsettings/projectteam/operations/ptGridSlice';
import projectTeamDataSlice from 'features/projectsettings/projectteam/operations/ptDataSlice';
import vendorContractsForecastSlice from 'features/vendorcontracts/stores/ForecastsSlice';
import VendorTransactionsTabSlice from 'features/vendorcontracts/stores/tabs/transactions/TransactionTabSlice';
import ClientTransactionsTabSlice from 'features/clientContracts/stores/tabs/transactions/TransactionTabSlice';
import vendorFilesTabSlice from 'features/vendorcontracts/stores/tabs/contractfiles/VCContractFilesTabSlice';
import clientFilesTabSlice from 'features/clientContracts/stores/tabs/contractfiles/CCContractFilesTabSlice';
import clientContractsForecastSlice from 'features/clientContracts/stores/ForecastsSlice';
import cCSovSlice from "features/clientContracts/stores/CCSovSlice";

import supplementalContractsReducer from 'features/supplementalcontracts/stores/SupplementalContractsSlice';
import cCBillingScheduleSlice from 'features/clientContracts/stores/BillingScheduleSlice';
import VPAGridSlice from 'features/vendorpayapplications/stores/gridSlice';
import VCPaymentLedgerSlice from 'features/vendorcontracts/stores/PaymentLedgerSlice';
import CPAGridSlice from 'features/clientpayapplications/stores/GridSlice';
import PAPSSlice from 'features/vendorpayapplications/stores/payment/PayAppPaymentSentSlice';
import PAPRSlice from 'features/vendorpayapplications/stores/payment/PayAppPaymentReceivedSlice';
import CCPaymentLedgerSlice from 'features/clientContracts/stores/PaymentLedgerSlice';
import CERSlice from 'features/finance/changeeventrequests/stores/ChangeEventSlice';
import LocationStore from 'features/common/locationfield/LocationStore';
import SpecificationManagerSlice from 'features/field/specificationmanager/stores/SpecificationManagerSlice';
import smartSubmitalSlice from 'features/field/smartsubmittals/stores/SmartSubmitalSlice';
import SMFileSlice from 'features/field/specificationmanager/stores/FilesSlice';
import ccChangeEventSlice from 'features/clientContracts/stores/CCChangeEventsSlice';
import SmartSubmitalLeftToolbarSlice from 'features/field/smartsubmittals/smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarSlice';

import SBSManagerSlice from 'features/safety/sbsmanager/operations/sbsManagerSlice';
import BlockchainSlice from './common/blockchain/BlockchainSlice';

import TimeLogSlice from 'features/common/timelog/stores/TimeLogSlice';
import BudgetRoomSlice from 'features/finance/budgetroom/stores/BudgetRoomSlice';
import EstimateRoomSlice from 'features/finance/estimatemanager/stores/EstimateRoomSlice'
export const store = configureStore({
	reducer: {
		appInfo: appInfoSlice,
		blockchain: BlockchainSlice,
		location: LocationStore,
		catalog: catalogReducer,
		inventory: inventoryReducer,
		inventoryCategory: inventoryCategoryReducer,
		inventorySubCategory: inventorySubCategoryReducer,
		inventoryManufacturer: inventoryManufacturerReducer,
		inventoryModelnumber: inventoryModelnumberReducer,
		stackedbarchart: stackedbarchartReducer,
		donutchart: donutchartReducer,
		groupedBarchart: groupedBarchartReducer,
		tableColumns: tableColumnSliceReducer,
		costcodeOptions: costcodeOptionsSlice,
		costtypeOptions: costtypeOptionsSlice,
		curve: curveSlice,
		unit: uintSlice,
		gridData: gridDataSlice,
		rightPanel: rightPanelSlice,
		transactionsData: transactionsSlice,
		vendorData: vendorSlice,
		settings: settingsSlice,
		forecast: forecastSlice,
		viewBuilder: viewBuilderSlice,
		bidManager: bidManagerSlice,
		bidManagerGrid: bidManagerGridSlice,
		bidders: biddersSlice,
		bidFile: bidFileSlice,
		SMFile: SMFileSlice,
		bidResponseFile: bidResponseFileSlice,
		bidQueries: bidQueriesSlice,
		awardBid: awardBidSlice,
		bidResponseManager: bidResponseManagerSlice,
		bidResponseManagerGrid: bidResponseManagerGridSlice,
		bidResponse: bidResponseSlice,
		vendorContracts: vendorContractsSlice,
		vendorContractsGrid: vendorContractsGridSlice,
		VCScheduleOfValues: scheduleOfValuesSlice,
		vCPaymentLedger: VCPaymentLedgerSlice,
		clientContracts: clientContractsSlice,
		vendorPayApps: vendorPayAppsSlice,
		VPAGrid: VPAGridSlice,
		clientPayApps: clientPayAppsSlice,
		cCGrid: CCGridSlice,
		cCSov: cCSovSlice,
		cCBillingSchedule: cCBillingScheduleSlice,
		cCForecasts: clientContractsForecastSlice,
		changeEvents: VCChangeEventsSlice,
		safetyRequirementsGrid: safetyRequirementsGridSlice,
		ptGridData: ptGridDataSlice,
		projectTeamData: projectTeamDataSlice,
		vendorContractsForecasts: vendorContractsForecastSlice,
		vendorTransactionsTabData: VendorTransactionsTabSlice,
		vendorContractFilesTabData: vendorFilesTabSlice,
		supplementalContracts: supplementalContractsReducer,
		clientTransactionsTabData: ClientTransactionsTabSlice,
		clientContractFilesTabData: clientFilesTabSlice,
		clientPayAppsGrid: CPAGridSlice,
		vpaPaymentSent: PAPSSlice,
		vpaPaymentReceived: PAPRSlice,
		cCPaymentLedger: CCPaymentLedgerSlice,
		ccChangeEvents: ccChangeEventSlice,
		changeEventRequest: CERSlice,
		specificationManager: SpecificationManagerSlice,
		smartSubmittals: smartSubmitalSlice,
		smartSubmitalsLeftToolbar: SmartSubmitalLeftToolbarSlice,
		sbsManager: SBSManagerSlice,
		timeLogRequest: TimeLogSlice,
		budgetRoom: BudgetRoomSlice,
		estimateRoom:EstimateRoomSlice
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
