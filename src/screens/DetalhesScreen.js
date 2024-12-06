import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function DetalhesScreen({ route }) {
    const { idPonto } = route.params;
    const [local, setLocal] = useState(null);
    const [pontosturistico, setPontosTuristico] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão de localização', 'Permissão para acessar a localização foi negada.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocal({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            Alert.alert('Erro', 'Não foi possível obter sua localização.');
        }
    };

    const fetchPontosTuristicos = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Erro', 'Você precisa estar autenticado para acessar esta página.');
            navigation.navigate('Login');
            return;
        }

        try {
            const response = await axios.get(`https://turistamap-backend.onrender.com/api/pontosturisticos/${idPonto}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPontosTuristico(response.data);
        } catch (error) {
            console.error('Erro ao carregar ponto turístico:', error);
            Alert.alert('Erro', 'Não foi possível carregar as informações do ponto turístico.');
            navigation.navigate('Login');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await getCurrentLocation();
            await fetchPontosTuristicos();
        };
        loadData();
    }, [idPonto]);

    if (isLoading || !pontosturistico) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{pontosturistico.nome}</Text>
            <Text style={styles.description}>{pontosturistico.descricao}</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pontosturistico.latitude,
                    longitude: pontosturistico.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: pontosturistico.latitude,
                        longitude: pontosturistico.longitude,
                    }}
                    title={pontosturistico.nome}
                    description={pontosturistico.descricao}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    map: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
