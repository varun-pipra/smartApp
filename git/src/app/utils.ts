export const postMessage = (message: any) => {
	window.parent.postMessage(JSON.stringify(message), '*');
};

export const getRandomNumber = () => Math.floor(Math.random() * 9000 + 1000);

export const isLocalhost = (window?.location?.hostname === 'localhost' || window?.location?.hostname?.indexOf('192.168') >= 0);

export const localServer = 'http://localhost:4000/';

export const currency: any = {
	'USD': '$', // US Dollar
	'EUR': '€', // Euro
	'CRC': '₡', // Costa Rican Colón
	'GBP': '£', // British Pound Sterling
	'ILS': '₪', // Israeli New Sheqel
	'INR': '₹', // Indian Rupee
	'JPY': '¥', // Japanese Yen
	'KRW': '₩', // South Korean Won
	'NGN': '₦', // Nigerian Naira
	'PHP': '₱', // Philippine Peso
	'PLN': 'zł', // Polish Zloty
	'PYG': '₲', // Paraguayan Guarani
	'THB': '฿', // Thai Baht
	'UAH': '₴', // Ukrainian Hryvnia
	'VND': '₫', // Vietnamese Dong
};
export const currencyCode: any = {
	'USD': 'en-US', // US Dollar
	'EUR': 'en-DE', // Euro
	'INR': 'en-IN', // Indian Rupee
	'GBP': 'en-GB', // British Pound Sterling
	'CRC': 'es-CR', // Costa Rican Colón
	'ILS': 'he-IL', // Israeli New Sheqel
	'JPY': 'ja-JP', // Japanese Yen
};

export const currencyDescription:any = {
		'USD': 'Dollars', // US Dollar
		'EUR': 'Euros', // Euro
		'INR': 'Rupees', // Indian Rupee
		'GBP': 'Pounds', // British Pound Sterling
		'CRC': 'Colon', // Costa Rican Colón
		'ILS': 'Shekel', // Israeli New Sheqel
		'JPY': 'Yen', // Japanese Yen
}
export const setCookie = (name: any, value: any) => {
	document.cookie = name + "=" + value;
}

export const getCookie = (cname: any) => {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
export const getSafetyCredIFrame = () => {
	const allFrames = document.getElementsByTagName('iframe');
	let safetyCredFrame;
	for (const key in allFrames) {
		if (allFrames[key].className && allFrames[key].className.indexOf('safety-cred') >= 0) {
			safetyCredFrame = allFrames[key];
		}
	}
	return safetyCredFrame;
}