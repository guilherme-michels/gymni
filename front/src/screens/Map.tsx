import { ScreenHeader } from "@components/ScreenHeader";
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";

interface Popover {
  position: LatLng;
  content: string;
}

interface MarkerInfo extends LatLng {
  name: string;
  hours: string;
}

const predefinedMarkers: MarkerInfo[] = [
  {
    latitude: -29.458534,
    longitude: -51.369237,
    name: "Supinus",
    hours: "06:00 - 22:00",
  },
  {
    latitude: -29.488534,
    longitude: -51.469237,
    name: "Corpo e Alma",
    hours: "07:00 - 21:00",
  },
  {
    latitude: -29.358534,
    longitude: -51.869237,
    name: "Engenharia do Corpo",
    hours: "05:00 - 23:00",
  },
  {
    latitude: -29.458534,
    longitude: -51.969237,
    name: "Academia VIP",
    hours: "06:00 - 22:00",
  },
  {
    latitude: -29.478534,
    longitude: -51.959237,
    name: "Supinus",
    hours: "08:00 - 20:00",
  },
  {
    latitude: -29.357534,
    longitude: -51.949237,
    name: "Corpo e Alma",
    hours: "06:00 - 22:00",
  },
];

const MapScreen: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerInfo[]>(predefinedMarkers);
  const [popover, setPopover] = useState<Popover | null>(null);

  const handleMarkerPress = (marker: MarkerInfo) => {
    setPopover({
      position: { latitude: marker.latitude, longitude: marker.longitude },
      content: `${marker.name}\nHorário: ${marker.hours}`,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Encontre academias perto de você!" />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -29.458534,
          longitude: -51.969237,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      {popover && (
        <Modal transparent={true} visible={true} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.popover}>
              <Text style={styles.popoverText}>{popover.content}</Text>
              <TouchableOpacity
                onPress={() => setPopover(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popover: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  popoverText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MapScreen;
