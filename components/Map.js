import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const Map = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.4,
    longitudeDelta: 0.04,
  });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      await getUserPosition();
    })();
  }, []);

  const addMarker = (e) => {
    const { coordinate } = e.nativeEvent;
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        coordinate,
      },
    ]);
  };

  const removeMarker = (markerIndex) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker, index) => index !== markerIndex)
    );
  };

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status !== "granted") {
        console.log("Location denied!");
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MapView
      style={styles.map}
      region={location}
      onLongPress={(e) => addMarker(e)}
    >
      { markers &&
      markers?.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          onPress={() => removeMarker(index)}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});

export default Map;
