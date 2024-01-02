import React from 'react';
import './Stream.scss';
export interface StreamProps {
	url: any;
}
const Streams = ({ url }: StreamProps) => {
	const [streamUrl, setStreamUrl] = React.useState('');

	React.useEffect(() => {
		// var myArray = [
		// 	"https://www.smartapp.com/",
		// 	"https://smartappaccount.bamboohr.com/login.php?r=%2Fhome%2F",
		// ];
		// var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
		setStreamUrl(url)
	}, [url])
	
	return (
		<>
			<iframe className="responsive-iframe" src={streamUrl}></iframe>
		</>
	)
}
export default Streams;