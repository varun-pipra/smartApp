import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import each from 'lodash/each';
import groupBy from 'lodash/groupBy';

export interface AppInfoState {
	server: any,
	costCodeList: any,
	costTypeList: any,
	costUnitList: any,
	costCodeDivisionList: any,
	currencySymbol: any,
	currencyCode: any,
	appWindowMaximize: boolean,
	fullView: boolean;
	enableAddBtn: boolean;
	sketchIns: any;
	sketchMarkup: any;
	sketchPageInfo: any;
	isAppMaximized: boolean;
	detailInfoSelectionIndex?: any;
	toggleBlockchainAuthModal?: boolean;
	showSettingsPanel?: boolean;
};

const initialState: AppInfoState = {
	server: null,
	costCodeList: [],
	costTypeList: [],
	costUnitList: [],
	costCodeDivisionList: [],
	currencySymbol: '',
	currencyCode: '',
	appWindowMaximize: false,
	fullView: false,
	enableAddBtn: false,
	sketchIns: {},
	sketchMarkup: null,
	sketchPageInfo: null,
	isAppMaximized: false,
	detailInfoSelectionIndex: '',
	toggleBlockchainAuthModal: false,
	showSettingsPanel: false
};

export const appInfoSlice = createSlice({
	name: 'appInfo',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setServer: (state, action: PayloadAction<any>) => {
			state.server = action.payload;
		},
		setCostCodeList: (state, action: PayloadAction<any>) => {
			state.costCodeList = action.payload;
		},
		setCostTypeList: (state, action: PayloadAction<any>) => {
			if(action.payload?.length) {
				const newOptions = action.payload.map((type: any) => {
					return {label: type.value, value: type.value};
				});
				state.costTypeList = newOptions;
			}
		},
		setCostUnitList: (state, action: PayloadAction<any>) => {
			if(action.payload?.length) {
				const newOptions = action.payload.map((unit: any) => {
					return {label: unit.value, value: unit.value};
				});
				state.costUnitList = newOptions;
			}
		},
		setCostCodeDivisionList: (state, action: PayloadAction<any>) => {
			const grouped = groupBy(action.payload, 'value');
			let groupedList: any = [];
			each(grouped, (optionList, costCode) => {
				groupedList.push({id: optionList[0].displayOrder, name: costCode, options: optionList.map(opt => {return {id: opt.id, name: opt.value};})});
			});
			state.costCodeDivisionList = groupedList;
		},
		setCurrencySymbol: (state, action: PayloadAction<any>) => {
			state.currencySymbol = action.payload;
		},
		setCurrencyCode: (state, action: PayloadAction<any>) => {
			state.currencyCode = action.payload;
		},
		setAppWindowMaximize: (state, action: PayloadAction<any>) => {
			state.appWindowMaximize = action.payload;
		},
		setFullView: (state, action: PayloadAction<any>) => {
			state.fullView = action.payload;
		},
		setEnableAddBtn: (state, action: PayloadAction<boolean>) => {
			state.enableAddBtn = action.payload;
		},
		setSketchIns: (state, action: PayloadAction<boolean>) => {
			state.sketchIns = action.payload;
		},
		setSketchMarkup: (state, action: PayloadAction<any>) => {
			state.sketchMarkup = action.payload;
		},
		setSketchPageInfo: (state, action: PayloadAction<any>) => {
			state.sketchPageInfo = action.payload;
		},
		setIsAppMaximized: (state, action: PayloadAction<any>) => {
			state.isAppMaximized = action.payload;
		},
		setDetailInfoSelectionIndex: (state, action: PayloadAction<any>) => {
			state.detailInfoSelectionIndex = action.payload;
		},
		setToggleBlockchainAuthModal: (state, action: PayloadAction<any>) => {
			state.toggleBlockchainAuthModal = action.payload;
		},
		setShowSettingsPanel: (state, action: PayloadAction<boolean>) => {
			state.showSettingsPanel = action.payload;
		}
	}
});

export const {setServer, setCostCodeList, setCostTypeList, setCostUnitList, setCostCodeDivisionList, setCurrencySymbol,
	setCurrencyCode, setAppWindowMaximize, setFullView, setEnableAddBtn, setSketchIns, setSketchMarkup, setSketchPageInfo,
	setIsAppMaximized, setDetailInfoSelectionIndex, setShowSettingsPanel, setToggleBlockchainAuthModal} = appInfoSlice.actions;

export const getServer = (state: RootState) => state.appInfo.server;
export const getCostCodeList = (state: RootState) => state.appInfo.costCodeList;
export const getCostTypeList = (state: RootState) => state.appInfo.costTypeList;
export const getCostUnitList = (state: RootState) => state.appInfo.costUnitList;
export const getCostCodeDivisionList = (state: RootState) => state.appInfo.costCodeDivisionList;
export const getCurrencySymbol = (state: RootState) => state.appInfo.currencySymbol;
export const getAppWindowMaximize = (state: RootState) => state.appInfo.appWindowMaximize;
export const getFullView = (state: RootState) => state.appInfo.fullView;
export const getSketchIns = (state: RootState) => state.appInfo.sketchIns;
export const getSketchMarkup = (state: RootState) => state.appInfo.sketchMarkup;
export const getSketchPageInfo = (state: RootState) => state.appInfo.sketchPageInfo;
export const getCurrentDetailInfoSelectionIndex = (state: RootState) => state.appInfo.detailInfoSelectionIndex;
export const getShowSettingsPanel = (state: RootState) => state.appInfo.showSettingsPanel;

export default appInfoSlice.reducer;
