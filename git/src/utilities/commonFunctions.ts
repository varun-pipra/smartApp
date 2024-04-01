import _ from "lodash";

export function formatPhoneNumber(phoneNumber: any) {


	// if (phoneNumber && phoneNumber != '' && phoneNumber != 'undefined') {
	// 	phoneNumber = phoneNumber.toString().replace(/\D/g, '');
	// 	var phoneGroups = [];
	// 	var remainingDigits = phoneNumber.length;
	// 	while (remainingDigits > 0) {
	// 		var digitsInGroup = Math.min(remainingDigits, 3);
	// 		var startIndex = remainingDigits - digitsInGroup;
	// 		phoneGroups.push(phoneNumber.substr(startIndex, digitsInGroup));
	// 		remainingDigits -= digitsInGroup;
	// 	}

	// 	phoneNumber = phoneGroups.reverse().join('-');
	// }
	// else {
	// 	phoneNumber = null;
	// }

	// number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
	if (phoneNumber && phoneNumber != '' && phoneNumber != 'undefined') {
		const clear = ('' + phoneNumber).replace(/\D/g, '');
		if (clear.length == 11) { //11 digit
			phoneNumber = '+' + clear.replace(/(\d{1})(\d{3})(\d{3})(\d+)/, '$1-$2-$3-$4');
		}
		else if (clear.length == 10) { // 10 digit
			phoneNumber = clear.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
		}
		// else if (clear.length >= 8 && clear.length < 10) { // eigth digit
		// 	phoneNumber = '+' + clear.replace(/(\d{1})(\d{3})(\d+)/, '$1-$2-$3');
		// }
		// else if (clear.length >= 11 && clear.length < 14) {
		// 	phoneNumber = '+' + clear.replace(/(\d{1})(\d{3})(\d{3})(\d{3})(\d+)/, '$1-$2-$3-$4-$5');
		// }
	}
	return phoneNumber
}

function getMonthName(monthNumber: any) {
	const date = new Date();
	date.setMonth(monthNumber - 1);
	return date.toLocaleString('en-US', { month: 'short' });
}

export default function convertDateToDisplayFormat(date: Date) {
	var formattedDate;
	if (date) {
		var currentDate: Date = new Date(date);
		var month: any = currentDate.getMonth() + 1;
		if (month < 10) month = "0" + month;
		var dateOfMonth: any = currentDate.getDate();
		if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
		var year = currentDate.getFullYear();
		formattedDate = month + "/" + dateOfMonth + "/" + year;
	}
	else {
		formattedDate = null;
	}

	return formattedDate;
};

export function convertDateToDisplayFormat2(date: Date) {
	var formattedDate;
	if (date) {
		var currentDate: Date = new Date(date);
		var month: any = currentDate.getMonth() + 1;
		if (month < 10) month = "0" + month;
		var dateOfMonth: any = currentDate.getDate();
		if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
		var year = currentDate.getFullYear();
		formattedDate = getMonthName(month) + " " + dateOfMonth + "," + year;
	}
	else {
		formattedDate = null;
	}

	return formattedDate;
};

export function convertTimeToDisplayFormat(date?: any) {
	let time = date
	if (time != '') {
		var currentDate: Date;
		var formattedDate;
		if (time?.includes('Z')) {
			var currentDate = new Date(time);
		}
		else {
			time = time?.replace(/ /g, "T") + 'Z'; // converting time format
			var currentDate = new Date(time);
		}
		var hours = currentDate.getHours();
		var minutes = currentDate.getMinutes();
		var seconds = currentDate.getSeconds();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		var minutess = minutes < 10 ? '0' + minutes : minutes;
		let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

		//var formattedDate = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
		formattedDate = hours + ":" + minutess + ':' + formattedSeconds + ' ' + ampm;
		// console.log("formattedDateformattedDate", formattedDate)
		return formattedDate;
	}
};

export function getTime(date?: any) {
	if (date) {
		let time = date;
		time = time?.split("T")[1];
		const timesArray: any = time?.split(':'); // converting time format	

		var hours = timesArray[0];
		var minutes = timesArray[1];
		// var seconds = currentDate.getSeconds();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		var minutess = minutes;
		var formattedDate = hours + ":" + minutess + ' ' + ampm;
		// console.log("formattedDate", formattedDate);
		return formattedDate;
	} return '';
};

export function getISOTime(date: any, time: any) {
	// console.log("timeee", date, time)
	if (date) {
		if (time) {
			const dateTime = date.includes('T') ? date?.split('T')[0] : (date?.split('/')[2] + '-' + date?.split('/')[0] + '-' + date?.split('/')[1]);
			let t = time?.split(':');
			const amp = t[1]?.split(' ')[1]
			const hours = amp == 'PM' ? t[0] == 12 ? '12' : (12 + Number(t[0])) : t[0] == 12 ? '00' : t[0]?.length > 1 ? t[0] : '0' + t[0]
			// console.log("dateTime + 'T' + hours + t[1] + '00Z'", dateTime + 'T' + hours + t[1] + '00Z')
			return dateTime + 'T' + hours + ':' + t[1]?.split(' ')[0] + ':00Z'
		}
		return date;

	}
	return null;
}

export function removeHtmlFromString(text: any) {
	var htmlString = text;
	const keepLineBreaks = true;
	if (!_.isEmpty(htmlString)) {
		htmlString = htmlString.toString().trim();
		if (keepLineBreaks) {
			var str = htmlString;
			textString = str.replace(/<(?!\sbr\s\/?)[^>]+>/gi, "\n");
			textString = textString.replace(/<\/?[^>]+(>|$)/g, "\n");
			var parser = new DOMParser;
			var dom = parser.parseFromString('<!doctype html><body>' + textString, 'text/html');
			textString = (dom && dom.body) ? dom.body.textContent : "";
			return textString;
		} else {
			if (Number.isNaN(Number(htmlString))) {
				var mydiv: any = document.createElement("div");
				mydiv.innerHTML = htmlString;
				var textString: any = "";

				if (document.all) {
					textString = mydiv.innerText;
				}
				else {
					textString = mydiv.textContent;
				}
				mydiv = null;
				return textString;
			}
			else {
				return htmlString.trim();
			}
		}
	}
	else
		return '';

};

export const stringToUSDateTime = (date: any) => {
	return `${convertDateToDisplayFormat(date)} ${convertTimeToDisplayFormat(date)}`;
};

export const convertISOToDispalyFormat = (date: any) => {
	return `${convertDateToDisplayFormat(date)} ${getTime(date)}`;
};

export const stringToUSDateTime2 = (date: any) => {
	return `${convertDateToDisplayFormat2(date)} ${convertTimeToDisplayFormat(date)}`;
};

export const getCurveText = (value: number) => {
	const curveOpts: any = {
		0: "Back Loaded",
		1: "Front Loaded",
		2: "Linear",
		3: "Bell"
	};
	return curveOpts[value];
};

export const getTransactionTypeText = (value: number) => {
	const types: any = {
		0: 'App Item',
		1: 'Direct Cost',
		2: 'Modification',
		3: 'Refund',
		4: 'Transfer In',
		5: 'Transfer Out'
	};
	return value != null ? types[value] : '';
};

export const getViewType = (value: number) => {
	const types: any = {
		0: 'Public',
		1: 'Private',
		2: 'Standard',
	};
	return types[value];
};

export const triggerEvent = (eventName: any, data: any) => {
	document.dispatchEvent(new CustomEvent(eventName, {
		detail: data
	}));
};


export const getFormattedBudgetLineItems = (options: any) => {
	const groupNames: any = [];
	let data = options.map((option: any, index: any) => {
		const values: any = []
		options.forEach((option1: any) => {
			if (option?.group === option1?.group) {
				const value = {
					value: option1?.id,
					label: option1?.costCode + '-' + option1?.costType,
					colVal: option1?.revisedBudget,
					description: option1?.description
				}
				values.push(value);
			}
		})
		if (!groupNames.includes(option?.group)) {
			groupNames.push(option?.group)
			return {
				id: index,
				value: option?.id,
				label: option?.group,
				options: values.sort(compare)
			}
		} return;
	})
	data = data.filter(function (element: any) {
		return element !== undefined;
	});
	return data.sort(compare);
}

export const compare = (a: any, b: any) => {
	if (a.label < b.label) {
		return -1;
	}
	if (a.label > b.label) {
		return 1;
	}
	return 0;
}

export const setLoadMask = (flag: any, gridCls: any) => {
	const loader = document.querySelector(`.${gridCls} .dynamic-loading-container`);
	if (flag) {
		loader && loader.classList.add('showloadmask');
	} else {
		loader && loader.classList.remove('showloadmask');
	}
	setTimeout(() => {
		loader && loader.classList.remove('showloadmask');
	}, 90000);
}

export const modifyMarkupData = (data: any) => {
  const modifyedData = data.map((markup: any) => {
	return {
        "coordinates": {
            x1: markup.left,
			y1: markup.top,
			x2: markup.left + markup.width,
			y2: markup.top + markup.height,
			
        },
        "stroke": "#379000",
		locked: true 
    };
  });
  console.log(modifyedData, "getTextOccurences data");
  return modifyedData;
};

export function minmaxDate(date: any, type: any) {
	if (type == 'minDate') {
		return date.reduce((acc: any, date: any) => {

			return acc && new Date(acc) < new Date(date) ? acc : date;
		}, '');

	}
	else {
		return date.reduce((acc: any, date: any) => {
			return acc && new Date(acc) > new Date(date) ? acc : date;
		}, '');
	}
};

export const settingsHelper = (defaultData:any) =>{		
	let resultData:any;
		if(defaultData?.length) {
			let modifiedData:any = [];
			([...defaultData] || [])?.map((item: any) => {
				modifiedData.push({
					...item,
					icon: item.img,
					id: item.value,
					text: item.label,
					value: item.label
				})
			});
			resultData = [{label: 'Built In', text: 'Built In', id: 1, value: 'Built In'}, 
								{label : 'Apps', text: 'Apps', id: 2, value: 'Apps', children: modifiedData}
							];
		}
		return resultData;
}
