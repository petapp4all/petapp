import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import { useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoicGV0YXBwNGFsbCIsImEiOiJjbTk3M2ppMWcwMHF3MmxxdDJuZm55aTlwIn0.T8aof4n1b8YpYZPWtnHExg"
);

const NearbyStation = () => {
  const [location, setLocation] = useState([0, 0]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const avatarColors = [
    "#007AFF",
    "#FF9500",
    "#34C759",
    "#AF52DE",
    "#FF3B30",
    "#5AC8FA",
    "#5856D6",
  ];

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };
  const prevCoordsRef = useRef([0, 0]);

  useEffect(() => {
    let isMounted = true;

    const getDistanceInMeters = ([lng1, lat1], [lng2, lat2]) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371000; // meters
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const handleLocationUpdate = async (loc) => {
      if (!loc?.coords || !isMounted) return;

      const { longitude, latitude } = loc.coords;
      const newCoords = [longitude, latitude];
      const prevCoords = prevCoordsRef.current;

      const distance = getDistanceInMeters(prevCoords, newCoords);

      if (distance >= 50) {
        // Only update if moved more than 50 meters
        prevCoordsRef.current = newCoords;
        setLocation(newCoords);
        fetchStations(newCoords);
      }
    };

    const startLocationUpdates = async () => {
      try {
        let hasPermission = true;

        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasPermission) {
          MapboxGL.locationManager.start();
          MapboxGL.locationManager.addListener(handleLocationUpdate);
        } else {
          Alert.alert("Permission Denied", "Location permission is required.");
        }
      } catch (err) {
        console.error("Location error:", err);
      }
    };

    startLocationUpdates();

    return () => {
      isMounted = false;
      MapboxGL.locationManager.stop();
      MapboxGL.locationManager.removeListener(handleLocationUpdate);
    };
  }, []);

  const getAddress = async (lng, lat) => {
    const token =
      "pk.eyJ1IjoicGV0YXBwNGFsbCIsImEiOiJjbTk3M2ppMWcwMHF3MmxxdDJuZm55aTlwIn0.T8aof4n1b8YpYZPWtnHExg";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;

    try {
      const res = await axios.get(url);
      return res.data.features[0]?.place_name || "Unknown Location";
    } catch (err) {
      console.error("Geocoding error:", err);
      return "Unknown Location";
    }
  };

  const fetchStations = async ([lng, lat]) => {
    setLoading(true);
    const radius = 20000;
    const query = `
      [out:json];
      node["amenity"="fuel"](around:${radius},${lat},${lng});
      out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const response = await axios.get(url);
      let stationList = await Promise.all(
        response.data.elements.map(async (el) => {
          const address = await getAddress(el.lon, el.lat);
          return {
            id: el.id,
            coordinates: [el.lon, el.lat],
            name: el.tags?.name || "Petrol Station",
            address,
          };
        })
      );

      // Sort stations by distance to current location
      stationList.sort((a, b) => {
        const distA = getDistance(a.coordinates, [lng, lat]);
        const distB = getDistance(b.coordinates, [lng, lat]);

        return distA - distB;
      });
      setStations(stationList);
    } catch (err) {
      console.error("Station fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDistance = ([lng, lat], [userLng, userLat]) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = toRad(lat - userLat);
    const dLng = toRad(lng - userLng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const renderListItem = ({ item }) => {
    const distance = getDistance(item.coordinates, location);

    const handlePress = () => {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates[1]},${item.coordinates[0]}`
      );
    };

    return (
      <TouchableOpacity style={styles.item} onPress={handlePress}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: getAvatarColor(item.name) },
          ]}
        >
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
        <View style={styles.navigateBtn}>
          <Text style={{ fontSize: 18 }}>➤</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Location Disabled",
          "Please turn on your device's GPS/location services and try again."
        );
      }, 15000);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              Checking for nearby stations...
            </Text>
          </View>
        ) : (
          <FlatList
            data={stations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListItem}
            contentContainerStyle={{ padding: 10 }}
          />
        )}

        {/* Refresh button only when not loading and no stations found */}
        {!loading && stations.length === 0 && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setLoading(true);
              MapboxGL.locationManager.getLastKnownLocation().then((loc) => {
                if (loc?.coords) {
                  const { longitude, latitude } = loc.coords;
                  const newCoords = [longitude, latitude];
                  setLocation(newCoords);
                  fetchStations(newCoords);
                } else {
                  Alert.alert("Error", "Location not available. Try again.");
                  setLoading(false);
                }
              });
            }}
          >
            <MaterialIcons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  address: {
    fontSize: 12,
    color: "#666",
  },
  distance: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  navigateBtn: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  refreshButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 4,
    zIndex: 999,
  },
});

export default NearbyStation;
