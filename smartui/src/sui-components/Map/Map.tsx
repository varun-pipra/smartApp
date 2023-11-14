import React, { useMemo, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerF, InfoWindowF } from '@react-google-maps/api';

interface latlng {
	lat: number;
	lng: number;
}
interface MapProps {
	latlng?: latlng;
	customMarkerUrl?: any;
	placename?: string;
	canShowCurrentLocation?: boolean;
}

const MarkerComponent = (props: any) => {
	const [activeMarker, setActiveMarker] = useState(false);

	return (
		<MarkerF
			position={props.MarkerPosition}
			onClick={() => setActiveMarker(true)}
			icon={{
				url: props.MarkerUrl,
			}}
		>
			{activeMarker && <InfoWindowF position={props.MarkerPosition} onCloseClick={() => setActiveMarker(false)}>
				<div>{props.MarkerName}</div>
			</InfoWindowF>}

		</MarkerF>
	)
}

const Map = ({ latlng, customMarkerUrl, placename = '', canShowCurrentLocation = false }: MapProps) => {

	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })

	useEffect(() => {
		if (latlng?.lat && latlng?.lng) {
			setMapCenter(latlng)
		} else {
			if (canShowCurrentLocation && navigator?.geolocation?.getCurrentPosition) {
				navigator.geolocation.getCurrentPosition((position) => {
					setMapCenter({lat: position?.coords?.latitude, lng: position?.coords?.longitude});
				  });
			}
			
		}
	}, [latlng])

	const containerStyle = { width: '100%', height: '100%' };


	return (
		<LoadScript googleMapsApiKey="AIzaSyDvnBiSvF5dhxDTBRO4i4xjBeXA-9BgiVQ">
			{mapCenter?.lat && mapCenter?.lng && <GoogleMap
				mapContainerStyle={containerStyle}
				center={mapCenter}
				zoom={10}
				options={
					{
						mapTypeControl: false,
						mapTypeId: "terrain", //terrain,hybrid,
						fullscreenControl: false,
						zoomControl: false,
						//disableDefaultUI: false,
						draggable: true,
						streetViewControl: false,
						minZoom: 8,
						maxZoom: 15,
					}
				}
			>
				{customMarkerUrl ?
					<MarkerComponent MarkerPosition={mapCenter} MarkerUrl={customMarkerUrl} MarkerName={placename} />
					: <MarkerComponent MarkerPosition={mapCenter} MarkerName={placename} />}
			</GoogleMap>
			}
		</LoadScript >
	);
};

export default Map;