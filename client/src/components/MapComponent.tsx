import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '600px',
};

const center = {
    //latitude sa lugar
    lat: 7.731782,
    //longtitude sa lugar
    lng: 125.099118,
};

const MapComponent: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    return isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
            <Marker position={center} />
        </GoogleMap>
    ) : (
        <p>Loading Map...</p>
    );
};

export default MapComponent;