import { CommonUtils } from "./commonutills";

export class NumberValidator {
	static errorText: any;

	static validate(validations: any, value: number) {
		if (CommonUtils.isNotEmpty(validations) && Object.keys(validations).length !== 0) {
			NumberValidator.errorText = null;
			for (var k in validations) {
				switch (k) {
					case 'notNull':
						if (validations[k] == true) {
							NumberValidator.notNullValidation(value);
							if (NumberValidator.errorText != null) {
								return NumberValidator.errorText;
							}
						}
						break;
				}
			}
		}
		return null;
	}

	static notNullValidation(value: number) {
		CommonUtils.isNotEmpty(value)
			? (NumberValidator.errorText = null)
			: (NumberValidator.errorText = 'This field is mandatory');
	}
}