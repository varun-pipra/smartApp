import React, { useMemo, useState } from "react";
import custommarker from 'resources/images/new-icons/svg/map-marker-gray.svg';
import Map from 'sui-components/Map/Map';

const MapExample = (props: any) => {

	const center = {
		lat: 13.843037,
		lng: 75.670494,
	};

	return (
		<div style={{ width: '50%', height: "50vh" }}>
			<Map latlng={center} placename={'Bhadravathi'} />
		</div>
	);
};

export default MapExample;