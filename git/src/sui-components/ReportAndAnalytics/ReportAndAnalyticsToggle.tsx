import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AssessmentOutlined, GridOn } from '@mui/icons-material';
import { postMessage } from "app/utils";
import './ReportAndAnalyticsToggle.scss';

export const ReportAndAnalyticsToggle = (props: any) => {
    const [value, setValue] = useState('');
    const [closeReportAndAnalytics, setCloseReportAndAnalytics] = useState(false);
    
    useEffect(() => {
		if(closeReportAndAnalytics == true){
            setValue("");
        }
	}, [closeReportAndAnalytics]);
    useEffect(() => {
        window.addEventListener('message',
            (event: any) => {
                let data = event.data;
                data = typeof (data) == 'string' ? JSON.parse(data) : data;
                data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
                if(data) {
                    switch(data.event || data.evt) {
                        case "close-reportandanalytics":
                            setCloseReportAndAnalytics(true);
                            setTimeout(() => {
                                setCloseReportAndAnalytics(false);
                            }, 1000);
                            break;
                    }
                }
            },
            false
        );
	}, []);

    const handleReportAndAnalytics = (event: any, value: string) => {
		if (value !== null) {
            postMessage({
                event: 'openreportandanalytics', body: {
                    type: value == 'Reports'? 1: 2,
                    targetLocation: {
                        x: event.pageX,
                        y: event.pageY
                    }
                }
            });
            setValue(value);
			// dispatch(setShowReport(value));
		}
	};
    return (
        <ToggleButtonGroup
            exclusive
            size='small'
            value={value}
            onChange={handleReportAndAnalytics}
            aria-label='Reaport and Analytics'
            className="report-analytics-cls"
        >
            <ToggleButton value={'Reports'} className="ra-btn-cls first" aria-label='Reports'>
            <span className="common-icon-doc" title="Reports"></span>
            </ToggleButton>
            <ToggleButton value={'Analytics'} className="ra-btn-cls last" aria-label='Analytics'>
            <span className="common-icon-chart" title="Analytics"></span>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}