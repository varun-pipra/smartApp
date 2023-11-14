import React from 'react';
import './SafetyCred.scss';
export interface SafetyCredProps {
	url: any;
	userId: any;
	tradeName: any;
	reload: any;
	safetyTracking: any;
}
const SafetyCred = (props: SafetyCredProps) => {
	const { url, userId, tradeName, reload, safetyTracking, ...rest } = props;
	const [safetyCredurl, setSafetyCredurl] = React.useState('');

	React.useEffect(() => {
		console.log('*** Reload Safety Cred iframe', new Date(), reload, safetyCredurl);
		if (reload && safetyCredurl && safetyTracking) {
			let tempUrl = safetyCredurl;
			setSafetyCredurl(tempUrl.replace('userId', `dc=${new Date().getTime()}&userId`))
		}
	}, [reload, safetyTracking]);
	React.useEffect(() => {
		if (url && userId && safetyTracking) {
			if (url && userId && tradeName) {
				setSafetyCredurl(url.replace(new RegExp('\\{0\\}', 'gi'), userId).replace(new RegExp('\\{1\\}', 'gi'), tradeName))
			} else
				url && userId && setSafetyCredurl(url.replace(new RegExp('\\{0\\}', 'gi'), userId).replace(new RegExp('\\{1\\}', 'gi'), ''))
		};
	}, [url, userId, tradeName, safetyTracking])
	return (
		<>
			<iframe className="responsive-iframe safety-cred" src={safetyCredurl}></iframe>
		</>
	)
}
export default SafetyCred;