export const getCertificateStatus = (value: any) => {
	const types: any = {
		0: 'N/A',
		1: 'Not Verified',
		2: 'Verified',
		3: 'Verified Awaiting Update',
		4: '',
		5: 'Pending',
		6: 'About to Expire',
		7: 'Expired'
	};
	return types[value];
};
export const getCertificateStatusCls = (value: any) => {
	const types: any = {
		0: 'na',
		1: 'not-verified',
		2: 'verified',
		3: 'verifiedawatingupdate',
		4: '',
		5: 'pending',
		6: 'about-toexpire',
		7: 'expired'
	};
	return types[value];
};

export const SafetyStatusOptions = [
	{ id: 0, name: 'Not Submitted', icon: 'common-icon-SafetyPermit', color: "FF0000", iconType: 'class' },
	{ id: 6, name: 'Partially Registered', icon: 'common-icon-SafetyPermit', color: "F9D108", iconType: 'class' },
	{ id: 1, name: 'Awaiting Verification', icon: 'common-icon-SafetyPermit', color: "FFA500", iconType: 'class' },
	{ id: 2, name: 'Verified - FULL SERVICE', icon: 'common-icon-Verification-projectteam', color: "008000", iconType: 'class' },
	{ id: 3, name: 'Verified - IN PROBATION', icon: 'common-icon-SafetyPermit', color: "808080", iconType: 'class' },
	{ id: 5, name: 'Probation - Awaiting Full Service', icon: 'common-icon-SafetyPermit', color: "royalblue", iconType: 'class' },
	{ id: 4, name: 'Renewal Required', icon: 'common-icon-SafetyPermit', color: "DC143C", iconType: 'class' },
	{ id: 7, name: 'Removed-Violation Repeat Offender', icon: 'common-icon-SafetyPermit', color: "333333", iconType: 'class' },
	{ id: 8, name: 'Probation - Violation Repeat Offender', icon: 'common-icon-SafetyPermit', color: "B307CD", iconType: 'class' },
];

export const getSafteyStatus = (value: any) => {
	const types: any = {
		0: 'Not Submitted',
		1: 'Awaiting Verification',
		2: 'Verified - FULL SERVICE',
		3: 'Verified - IN PROBATION',
		4: 'Renewal Required',
		5: 'Probation - Awaiting Full Service',
		6: 'Partially Registered',
		7: 'Removed - Violation Repeat Offender',
		8: 'Probation - Violation Repeat Offender',
	};
	return types[value];
};
export const getSafteyStatusCls = (value: any) => {
	const cls: any = {
		0: 'not-submitted',
		1: 'awaiting-verification',
		2: 'verified-fullservice',
		3: 'verified-inprobation',
		4: 'renewalrequired',
		5: 'probation-awaitingfullservice',
		6: 'partiallyregistered',
		7: 'removed-violation repeat offender',
		8: 'probation-violation repeat offender'
	};
	return cls[value];
};
export const getSafteyStatusColor = (value: any) => {
	const types: any = {
		0: 'red',
		1: 'orange',
		2: 'green',
		3: 'grey',
		4: 'crimson',
		5: 'royalblue',
		6: '#F9D108',
		7: '#333333',
		8: '#B307CD',
	};
	return types[value];
};
export const getSafteyStatusRightBackground = (value: any) => {
	const types: any = {
		0: '#ff00001a',
		1: '#ffa5001a',
		2: '#0080001a',
		3: '#8080801a',
		4: '#ed143d1a',
		5: '#4169e11a',
		6: '#f9d1081a',
		7: '#33333366',
		8: '#b307cd1a',
	};
	return types[value];
};
export const getPolicyStatusColor = (value: any) => {
	const types: any = {
		0: 'grey',
		1: 'red',
		2: 'green',
	};
	return types[value];
}
export const getPolicyStatusRightBackground = (value: any) => {
	const types: any = {
		0: '#8080801a',
		1: '#ff00001a',
		2: '#0080001a',
	};
	return types[value];
}
export const getCertsStatusColor = (value: any) => {
	const types: any = {
		0: 'grey',
		1: 'darkred',
		2: 'green',
		3: '',
		4: '',
		5: '#f9d108',
		6: 'orange',
		7: 'red',
	};
	return types[value];
}
export const getCertsStatusRightBackground = (value: any) => {
	const types: any = {
		0: '#8080801a',
		1: '#8b00001a',
		2: '#0080001a',
		3: '',
		4: '',
		5: '#f9d1081a',
		6: '#ffa5001a',
		7: '#ff00001a',
	};
	return types[value];
}
export const getPolicyStatus = (value: any) => {
	const types: any = {
		0: 'N/A',
		1: 'Pending',
		2: 'Worker Acknowledged',
	};
	return types[value];
}
export const getPolicyStatusCls = (value: any) => {
	const types: any = {
		0: 'na',
		1: 'pending',
		2: 'worker-acknowledged',

	};
	return types[value];
}
/* export const getRoles = (value: any, rolesData: any) => {
	if (rolesData?.length > 0 && value?.length > 0) {
		const roles: any = rolesData.filter((obj: any) => { if (value.indexOf(obj.id) > -1) return obj.value }).map((obj: any) => obj.value);
		const rolesSet: any = [];
		roles?.map((o: any) => {
			if (rolesSet.indexOf(o) === -1) {
				rolesSet.push(o)
			}
		});
		return rolesSet.join(', ');
	}
	return '';
}; */
export const getRoles = (value: any) => {
	if (value?.length > 0) {
		const roles: any = value.map((obj: any) => { return obj.name });
		return roles.join(', ');
	}
	return '';
};

export const canEditProjectTeamRec = (rec: any, gblConfig: any, isSingle: any) => {
	let isAllowed = false,
		hasInactive = false;

	if (gblConfig) {
		if (!gblConfig?.isUserManager && !gblConfig?.isSafetyManager && !gblConfig?.isCompanyManager && !gblConfig?.isProjectTeamManager) {
			isAllowed = false;
		} else if (gblConfig?.isProjectAdmin || gblConfig?.isSafetyManager || gblConfig?.isProjectTeamManager) {
			isAllowed = true;
		} else if (gblConfig?.isCompanyManager) {
			isAllowed = gblConfig?.currentUserCompany?.id == rec?.company?.objectId;
		}
		/* if (gblConfig?.project?.createdBy?.globalId == rec?.globalId) {
			// Project Owner
			isAllowed = false;
		} */
	} else {
		isAllowed = true;
	}
	if (!(rec?.status === "Active") && rec?.safetyStatus !== 7) {
		hasInactive = true;
	}
	return (isSingle && isAllowed && !hasInactive)
};