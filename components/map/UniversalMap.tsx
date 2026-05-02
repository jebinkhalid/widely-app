import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function UniversalMap({ region, onRegionChange }: any) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      onRegionChangeComplete={onRegionChange}
      onPress={(e) => {
        const coords = e.nativeEvent.coordinate;
        onRegionChange({
          ...region,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }}
    >
      {region && (
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          draggable
          onDragEnd={(e) =>
            onRegionChange({ ...region, ...e.nativeEvent.coordinate })
          }
          title="Warehouse Location"
        />
      )}
    </MapView>
  );
}
