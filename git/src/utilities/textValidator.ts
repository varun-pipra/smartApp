import { CommonUtils } from "./commonutills";


export class TextValidator {
	static errorText: any = '';

	static validate(validations: any, value: any) {

		if (null != validations && validations) {
			let k: any
			TextValidator.errorText = null

			// for ([k] of  Object.entries(validations)) {
			switch (validations) {
				case 'notNull':
					TextValidator.notNullValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;
				case 'onlyAlphabets':
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'alphaNumeric':
					TextValidator.alphaNumericValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'email':
					TextValidator.emailValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'mobile':
					TextValidator.mobileValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'website':
					TextValidator.websiteValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'fax':
					TextValidator.faxValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'upperCase':
					TextValidator.upperCaseValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'lowerCase':
					TextValidator.lowerCaseValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;
				case 'notNull':
					TextValidator.notNullValidation(value);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;

				case 'length':
					TextValidator.lengthValidation(value, validations[k]);
					if (TextValidator.errorText != null) {
						return TextValidator.errorText;
					}
					break;



				default:
					break;

			}
			// }
			return TextValidator.errorText;
		}
		return null;
	}


	static notNullValidation(value: any) {
		if (value && value instanceof Object) {
			(value
				&& Object.keys(value).length === 0 && value.constructor === Object)
				? TextValidator.errorText = null : TextValidator.errorText = 'This field is mandatory'
		} else {
			CommonUtils.isNotEmpty(value) ? TextValidator.errorText = null : TextValidator.errorText = 'This field is mandatory';
		}

	}

	static alphaNumericValidation(value: any) {
		if (CommonUtils.isNotEmpty(value)) {
			if (value.length < 3) {
				return TextValidator.errorText = 'This field must have minimum of ' + 3 + ' characters';
			} else if (value.length > 20) {
				return TextValidator.errorText = 'This field must have maximum of ' + 20 + ' characters';
			}
			RegExp('^[a-zA-Z0-9]+$').test(value) ? TextValidator.errorText = null : TextValidator.errorText = 'Entered value is not alpha numeric';
		}
	}

	static emailValidation(value: any) {
		if (CommonUtils.isNotEmpty(value)) {
			// var mailformat=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var mailformat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			value.match(mailformat)
				? TextValidator.errorText = null
				: TextValidator.errorText = 'Not a valid email';
		}
	}

	static mobileValidation(value: any) {
		if (CommonUtils.isNotEmpty(value)) {
			RegExp('(^(1s?)?((d{3})|d{3})[s-]?d{3}[s-]?d{4}$)').test(value) ? TextValidator.errorText = null
				: TextValidator.errorText = 'Not a valid phonenumber'

			// RegExp('/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/').test(value) ? TextValidator.errorText = null
			// : TextValidator.errorText = 'Not a valid phonenumber';

			// RegExp('/^[6-9]\d{9}$/gi').test(value)? TextValidator.errorText = null
			// : TextValidator.errorText = 'Not a valid phonenumber';
		}
	}

	static websiteValidation(value: any) {
		if (CommonUtils.isNotEmpty(value)) {
			RegExp('^((http:\/\/)|(https:\/\/)|(www.))[a-zA-Z_0-9-]{3,}(\.(:?[a-zA-Z0-9]{2,}))*(\.(:?[a-zA-Z0-9]{2,}))$').test(value)
				? TextValidator.errorText = null
				: TextValidator.errorText = 'Not a valid website';
		}
	}

	static faxValidation(value: string) { }

	static upperCaseValidation(value: string) {
		// var pattern = new RegExp('[A-Z]+(\s[A-Z]+)?$');
		// pattern.test(value) ? TextValidator.errorText = null : TextValidator.errorText = 'Only uppercase alphabets are allowed';
		if (CommonUtils.isNotEmpty(value)) {
			let valueInUpperCase: string = value.toUpperCase();
			value === valueInUpperCase ? TextValidator.errorText = null : TextValidator.errorText = 'Only uppercase alphabets are allowed';
		}

	}

	static lowerCaseValidation(value: string) {
		if (CommonUtils.isNotEmpty(value)) {
			let valueInLowerCase: string = value.toLowerCase();
			value == valueInLowerCase ? TextValidator.errorText = null : TextValidator.errorText = 'Only lowercase alphabets are allowed';
		}

		// RegExp('^[a-z]+(\s[a-z]+)?$').test(value) ? TextValidator.errorText = null : TextValidator.errorText = 'Only lowercase alphabets are allowed';
	}

	static lengthValidation(value: any, map: any) {
		if (CommonUtils.isNotEmpty(value)) {
			for (var k in map.keys) {
				switch (k) {
					case 'min':
						if (value.length < parseInt(map[k])) {
							TextValidator.errorText = 'This field must have minimum of ' + map[k] + ' characters';
							break;
						}
						break;

					case 'max':
						if (value.length > parseInt(map[k])) {
							TextValidator.errorText = 'This field can have maximum of ' + map[k] + ' characters';
							break;
						}
						break;

					default:
						break;
				}
				if (TextValidator.errorText != null) {
					break;
				}
			}
		}
	}
}