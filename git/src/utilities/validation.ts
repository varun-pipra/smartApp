

import { NumberValidator } from './numberValidator';
import { TextValidator } from './textValidator';
export default class SmartappValidationController {
	static _validateEmail(value: any) {
		let emailRegExp = RegExp('(^w+([.-]?w+)@w+([.-]?w+)(.w{2,3})+$)');
		return emailRegExp.test(value);
	}

	static _validatePhoneNumber(value: any) {
		let telRegExp = RegExp('(^(1s?)?((d{3})|d{3})[s-]?d{3}[s-]?d{4}$)');
		return telRegExp.test(value);
	}




	static validate(type: string, value: any, validations: any) {
		switch (type) {
			case 'text':
			case 'textArea':
			case 'email':
			case 'number':
			case 'password':
				return TextValidator.validate(validations, value);
				break;

			case 'number':
				return NumberValidator.validate(validations, value);
				break;
		}
		return null;
	}
}