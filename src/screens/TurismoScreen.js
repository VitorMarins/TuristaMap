import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function TurismoScreen({ navigation }) {
    const [pontosturisticos, setPontosTuristicos] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [local, setLocal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCurrentLocation();
        fetchPontosTuristicos();
    }, []);

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão de localização negada', 'Não será possível criar pontos turísticos sem localização.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocal({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.log('Erro ao obter localização:', error);
        }
    };

    const fetchPontosTuristicos = async () => {
        const token = await AsyncStorage.getItem('token');
        setIsLoading(true);
        try {
            const response = await axios.get('https://turistamap-backend.onrender.com/api/pontosturisticos', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPontosTuristicos(response.data);
        } catch (error) {
            console.log('Erro ao carregar pontos turísticos:', error);
            Alert.alert('Erro', 'Você precisa estar autenticado para acessar essa página!');
            navigation.navigate('Login');
        } finally {
            setIsLoading(false);
        }
    };

    const createPontosTuristicos = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!nome || !descricao || !local) {
            Alert.alert('Erro', 'Preencha todos os campos antes de criar um ponto turístico.');
            return;
        }

        try {
            const response = await axios.post(
                'https://turistamap-backend.onrender.com/api/pontosturisticos',
                {
                    nome,
                    descricao,
                    latitude: local.latitude,
                    longitude: local.longitude,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPontosTuristicos([...pontosturisticos, response.data]);
            setNome('');
            setDescricao('');
        } catch (error) {
            console.log('Erro ao criar ponto turístico:', error);
            Alert.alert('Erro', 'Não foi possível criar o ponto turístico.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Criar Ponto Turístico</Text>
                <TextInput
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                    style={styles.input}
                />
                <Button title="Criar" onPress={createPontosTuristicos} />
            </View>
            <Text style={styles.title}>Pontos Turísticos</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={pontosturisticos}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Detalhes', { idPonto: item._id })}
                            style={styles.itemContainer}
                        >
                            <Text style={styles.itemTitle}>{item.nome}</Text>
                            <Text>{item.descricao}</Text>
                            <Text style={styles.itemLocation}>
                                Local: {item.latitude}, {item.longitude}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    form: {
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
    },
    itemContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemLocation: {
        fontSize: 14,
        color: '#555',
    },
});
