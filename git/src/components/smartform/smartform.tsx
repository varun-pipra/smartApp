import TextField from '@mui/material/TextField';
import react, { useState } from 'react';
import { CustomizedTextFeild } from '../smartappTextFeild/smartappTextFeild';
import { buildIconsForTextBox } from '../smartappTextFeildIcons/smartappTextFeildIcons';
import SmartappValidationController from 'utilities/validation';
import { CustomizedBoxTextFeild } from '../smartappBoxTextFeild/smartappBoxTextFeild';


export const Smartappform = () => {
	const [inputType, setInputType] = useState([{ type: 'email', name: 'Email', placeHolder: 'Please Enter Email', validators: 'email' }, { type: 'text', name: 'First Name', placeHolder: 'Enter Firstname', validators: 'alphaNumeric' }, { type: 'text', name: 'Last Name', placeHolder: 'Enter Lastname', validators: 'alphaNumeric' }, { type: 'number', name: 'Mobile Number', placeHolder: 'Enter MobileNumber', validators: 'mobile' }, { type: 'textarea', name: 'Description', placeHolder: 'Enter Description', validators: 'notNull' }])
	return (
		<>
			<div style={{ width: '100%', padding: '10px' }}>
				<form>
					<>
						{inputType.map((ele: any) => {
							return (
								<>
									{/* <CustomizedTextFeild disabled={false} variant="standard" label={ele.name} type={ele.type} validators={ele.validators} />  */}
									{<CustomizedBoxTextFeild disabled={false} variant="standard" label={ele.name} type={ele.type} validators={ele.validators} />}
								</>
							)
						})}
					</>
				</form>
			</div>
		</>
	)
} 