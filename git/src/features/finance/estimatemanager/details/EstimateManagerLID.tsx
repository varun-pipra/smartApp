import { TextField } from "@mui/material";
import { getServer } from "app/common/appInfoSlice";
import { useAppSelector } from "app/hooks";
import { memo, useEffect, useMemo, useState } from "react";
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import EstimateBudgetDetails from './tabs/estimatedetails/EstimateDetails';

const EstimateManagerLID = ({ data, ...props }: any) => {
    const { currencySymbol } = useAppSelector((state) => state.appInfo);
        const { connectors } = useAppSelector((state) => state.gridData);
        const appInfo = useAppSelector(getServer);
        const [stateObject, setStateObject] = useState<any>({})
    const HeaderContent = memo((props: any) => {
        return <div className='kpi-section'>
            <div className='kpi-vertical-container'>
                <div className='lid-details-container'>
                    {/* <span className='budgetid-label grey-font'>Change Order ID:</span>
                    <span className='grey-fontt'>{changeRequestDetails?.code || ''}</span> */}
                    <span className='budgetid-label grey-font'>Change Order ID:</span>		
                        <span className='changevent-content'>
                         
                    </span>
                    <span className='budgetid-label grey-font'>Status:</span>
                    <span className='last-modified-label grey-font'>Last Modified:</span>
                </div>
            
            </div>
        </div>;
    });
    const HeaderContentUpdate = useMemo(() => {
        return HeaderContent;
    }, []);

    const tabConfig = [
        {
            tabId: 'estimate-etails',
            label: 'Estimate Details',
            showCount: false,
            iconCls: 'common-icon-budget-manager',
            content: <EstimateBudgetDetails />
        } ,{
            tabId: 'links',
            label: 'Links',
            showCount: false,
            // count: linksGridData?.length,
            iconCls: 'common-icon-Links',
            disabled: false,
            // content: <Links />
        }
    ];
    const lidProps = {
		title: <TextField className='textField' variant='outlined' size='small' margin='normal' style={{ width: '40%' }} />,
		defaultTabId: 'change-Event-Details',
		tabPadValue: 10,
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContentUpdate />,
			// collapsibleContent: <CollapseContent />
		},
		tabs: tabConfig,
		// footer: {
		// 	rightNode: <>
		// 		{(isChangeEventGC() && requestQuoteFromVendorBtn?.show)
		// 			&& <IQButton
		// 				className='ce-buttons'
		// 				color='blue'
		// 				disabled={requestQuoteFromVendorBtn?.disable}
		// 				onClick={() => { submitClickEvent('requestquote'); }}
		// 			>
		// 				REQUEST QUOTE FROM VENDOR
		// 			</IQButton>
		// 		}
		// 		{(isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance')
		// 			&& <IQButton
		// 				className='ce-buttons reject'
		// 				color='lightGrey'
		// 				disabled={false}
		// 				onClick={() => submitClickEvent('reject')}
		// 			>
		// 				REJECT
		// 			</IQButton>}
		// 		{((isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance') || ((isChangeEventGC() && ['Revise', 'Rejected'].includes(changeRequestDetails?.status))))
		// 			&& <IQButton
		// 				className={changeRequestDetails?.status == 'Rejected' || changeRequestDetails?.status == 'Revise' ? 'ce-buttons revise-resubmit-contained' : 'ce-buttons revise-resubmit'}
		// 				color='blue'
		// 				disabled={changeRequestDetails?.status == 'Rejected' && changeRequestDetails?.fundingSource === 'ChangeOrder' ? true : false}
		// 				//variant={changeRequestDetails?.status == 'Rejected' || changeRequestDetails?.status == 'Revise' ? 'contained' : 'outlined'}
		// 				onClick={() => submitClickEvent('revise')}
		// 			>
		// 				REVISE & RESUBMIT
		// 			</IQButton>
		// 		}
		// 		{
		// 			(isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance')
		// 			&& <IQButton
		// 				className='ce-buttons authorize'
		// 				color='blue'
		// 				disabled={false}
		// 				onClick={() => { submitClickEvent('authorize'); }}
		// 			>
		// 				AUTHORIZE
		// 			</IQButton>
		// 		}
		// 		{
		// 			(isChangeEventGC() && !requestQuoteFromVendorBtn?.show && ['Draft', 'QuoteReceived'].includes(changeRequestDetails?.status))
		// 			&& <IQButton
		// 				className='ce-buttons'
		// 				color='blue'
		// 				disabled={submitChangeEventBtn?.disable}
		// 				onClick={() => { submitClickEvent('submitChangeEvent'); }}
		// 			>
		// 				SUBMIT CHANGE EVENT
		// 			</IQButton>
		// 		}
		// 		{
		// 			(isChangeEventSC() && changeRequestDetails?.status === 'AwaitingQuote')
		// 			&& <IQButton
		// 				className='ce-buttons'
		// 				color='blue'
		// 				disabled={!checkSubmitEnable(changeRequestDetails)}
		// 				onClick={() => { handleQuoteSubmit(); }}
		// 			>
		// 				SUBMIT
		// 			</IQButton>
		// 		}
		// 	</>,
		// 	leftNode: <>
		// 		{
		// 			clientResponse?.show && <ContractorResponse
		// 				text={responseTextObj?.[clientResponse?.type]}
		// 				contractorName={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.by?.displayName}
		// 				respondedOn={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.on}
		// 				responseType={clientResponse?.type}
		// 				reason={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.reason}
		// 				sign={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.signature}
		// 				thumbNailImg={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.by?.image?.downloadUrl}
		// 			/>
		// 		}
		// 	</>,
		// 	toast: <>
		// 		{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
		// 		{toastMessage2.displayToast && <SUIToast2
		// 			message1={toastMessage2.message1}
		// 			message2={toastMessage2.message2}
		// 			showclose={true}
		// 		/>}
		// 	</>
		// },
		appInfo: appInfo,
		iFrameId: "changeEventRequestIframe",
		appType: "ChangeEventRequests",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'ChangeEventRequests-LineItem-presence',
			showLiveSupport: true,
			showPrint: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
		},
		// data: changeRequestDetails,
	};
    return(<>
    <IQGridLID {...lidProps} {...props} />
    </>)
}
export default EstimateManagerLID