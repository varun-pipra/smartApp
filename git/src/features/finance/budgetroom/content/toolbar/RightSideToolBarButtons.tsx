import { TableRows } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { ReportAndAnalyticsToggle } from "sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle";

const RightSideToolBarButtons = (props:any) => {
    return(
        <div key='spacer' className='toolbar-item-wrapper toolbar-group-button-wrapper' >
			{<ReportAndAnalyticsToggle/>}
			{/* {!isChangeEventSC() && connectors?.length ? <SapButton imgSrc={connectors?.[0]?.primaryIconUrl} onClick={() => handlePostTo()}/> : <></>} */}
			<IQTooltip title='Settings' placement={'bottom'}>
				<IconButton
					className='settings-button'
					aria-label='Change Events Settings'
					// onClick={() => dispatch(setShowSettingsPanel(true))}					
				>
					<TableRows />
				</IconButton>
			</IQTooltip>
		</div>
    )
}

export default RightSideToolBarButtons;