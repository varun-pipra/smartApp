import React, { useState } from 'react';
import TimePicker from 'sui-components/TimePicker/TimePicker';

const TimePickerExample = () => {
	return (
		<div style={{width:'200px'}}>
			<TimePicker defaultValue={''} getTimedata={(value) => {  }} />
		</div>
	)
}
export default TimePickerExample