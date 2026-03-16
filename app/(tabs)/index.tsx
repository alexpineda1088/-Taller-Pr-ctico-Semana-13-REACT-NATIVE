import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

  const [location, setLocation] = useState<any>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const getLocation = async () => {

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    setLocation(loc.coords);
  };

  const openMaps = () => {

    if (!location) return;

    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    Linking.openURL(url);

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Aplicación de Hardware</Text>
      <Text style={styles.subtitle}>
        React Native – Integración de funcionalidades nativas
      </Text>

      {/* TARJETA GPS */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>Geolocalización</Text>

        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Obtener ubicación</Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.locationBox}>

            <Text>Latitud: {location.latitude}</Text>
            <Text>Longitud: {location.longitude}</Text>
            <Text>Altitud: {location.altitude ?? "No disponible"}</Text>
            <Text>Precisión: {location.accuracy} metros</Text>
            <Text>Velocidad: {location.speed ?? "0"} m/s</Text>
            <Text>Dirección: {location.heading ?? "No disponible"}</Text>
            <Text>Fecha: {new Date().toLocaleString()}</Text>

            <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
              <Text style={styles.buttonText}>Abrir en Google Maps</Text>
            </TouchableOpacity>

          </View>
        )}

      </View>

      {/* TARJETA CAMARA */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>Cámara</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCameraVisible(!cameraVisible)}
        >
          <Text style={styles.buttonText}>
            {cameraVisible ? "Cerrar cámara" : "Abrir cámara"}
          </Text>
        </TouchableOpacity>

        {cameraVisible && (
          <View style={styles.cameraContainer}>

            {!permission?.granted ? (
              <TouchableOpacity style={styles.button} onPress={requestPermission}>
                <Text style={styles.buttonText}>Permitir acceso a cámara</Text>
              </TouchableOpacity>
            ) : (
              <CameraView style={styles.camera} />
            )}

          </View>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  mapButton: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  locationBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },

  cameraContainer: {
    marginTop: 15,
    alignItems: "center",
  },

  camera: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },

});