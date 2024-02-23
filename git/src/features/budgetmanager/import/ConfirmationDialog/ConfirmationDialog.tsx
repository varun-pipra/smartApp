import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import IQButton from "components/iqbutton/IQButton";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export const ConfirmationDialog = (props: any) => {
    return <IQBaseWindow
        open={true}
        title={props?.title ? props?.title : 'Confirmation'}
        className="bm-importer warning"
        withInModule={true}
		//minHeight='300px'
        tools={{
            closable: true
        }}
        actions={
            <div className="warning-footer">
                <IQButton color="lightGrey" className="grey" variant={'outlined'} onClick={(e) => props?.handleAction('no')}>
                    {props?.button1 ? props?.button1 : 'NO'}
                </IQButton>
                <IQButton color="blue" className="blue" variant={'outlined'} onClick={(e) => props?.handleAction('yes')}>
                    {props?.button2 ? props?.button2 : 'YES'}
                </IQButton>
            </div>
        }

    >
    {props?.icon ? props?.icon : <div className="warning-icon-cls"><span className="common-icon-not-import-warning"></span></div>}
    {props?.content ? props?.content : <div className="warning-confirm">Are you sure you want to continue?</div>}

    </IQBaseWindow>;
}