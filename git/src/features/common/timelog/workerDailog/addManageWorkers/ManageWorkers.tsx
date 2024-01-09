import IQButton from "components/iqbutton/IQButton";
import React, { memo, useRef } from "react";
import { useMemo } from "react";
import './ManageWorkers.scss';
import _ from "lodash";
import IQBaseWindow from 'components/iqbasewindow/IQBaseWindow';
import WorkerTimeLog from '../WorkerTimeLog/WorkerTimeLog';

const ManageWorkers =(props:any)=>{
    
    interface ChangeEventFormProps {
        name?: string;
        description?: string;
        clientContract?: any;
        budgetItems?: Array<any>;
        fundingSource?: any;
        duration?: any;
    };

    const defaultValues: ChangeEventFormProps = useMemo(() => {
		return {
			name: '',
			description: '',
			clientContract: '',
			budgetItems: [],
			fundingSource: '',
			duration: '0 Hrs 00 Mins'
		};
	}, []);

    const Title = memo((obj:any) => {
        let data = obj?.workerData
        return (
            <div className='worker-title-section'>
                <div className='worker-image-section'>
                    <img src={data.image} className='worker-image' />
                </div>
                <div className='worker-name-section'>
                    <div className='worker-name'>{data.name}</div>
                    <div className='worker-hours'>{data.hours} Hrs {data.minutes} Mins</div>
                </div>
            </div>
        )
    })
    
	const [changeEvent, setChangeEvent] = React.useState<ChangeEventFormProps>(defaultValues);

    return (
        <IQBaseWindow
			open={true}
			className='bid-manager-window vendor-contracts-window custom-style'
			title='Workers'
			// isFullView={isFullView}
			disableEscapeKeyDown={true}
			PaperProps={{
				sx: { height: '80%', width: '65%' },
			}}
			// onMaximize={handleWindowMaximize}
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
					<IQButton
						disabled={false}
                        // color=""
						// onClick={() => handleSelectedRows()}
					>
						SAVE
					</IQButton>
				</>
			}
		>
                <div style={{overflow:'auto'}}>
                    <div className="Add-manage-workers-titel">
                        <div>
                            <div>
                                SUMMARY
                            </div>
                            <div className="add-manage-workers-member-or-hrs">
                                16
                            </div>
                            <div>
                                Total Workers
                            </div>
                        </div>
                        <div>
                            <div className="add-manage-workers-member-or-hrs">
                                1280 Hrs 00 mins
                            </div>
                            <div>
                                Total Hours
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex',justifyContent: 'center' , height: "100px" , alignItems:'center',boxShadow: '0 0 3px #a4b3c5'}}>
                        <IQButton
                            disabled={false}
                            className='btn-add-manage-worker'
                            
                            // onClick={() => handleSelectedRows()}

                        >
                            ADD/MANAGE WORKERS
                        </IQButton>
                    </div>
                    {
                        props?.workerData.length > 0 &&
                        props?.workerData.map((e:any) => {
                              return  <div className="worker-info">
                                    <div>
                                        <Title workerData={e}/>
                                    </div>
                            
                                    <WorkerTimeLog name='time' onDurationChange={(duration: any)=> setChangeEvent({...changeEvent, duration: duration})}/>
                                </div>
                            })
                    }
                    
                    
                </div>
		</IQBaseWindow >
    )
}

export default ManageWorkers;
