import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function TurismoScreen({ navigation }) {
    const [pontosturisticos, setPontosTuristicos] = useState([]);

    useEffect(() => {
        const fetchPontosTuristicos = async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.get('https://turistamap-backend.onrender.com/api/pontosturisticos', {
                    headers: { Authorization: 'Bearer '+ token }
                });
                setPontosTuristicos(response.data);
            } catch (error) {
                console.log('Erro ao carregar pontos turisticos:', error);
                alert(' Vocé precisa estar autenticado para acessar essa página!');
                navigation.navigate('Login');
            }
        };
        fetchPontosTuristicos();
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Criar Ponto Turístico</Text>
                <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
            </View>
            <Text style={styles.title}>Pontos Turisticos</Text>
            <FlatList
                data={pontosturisticos}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { id: item._id })}>
                        <Text style={styles.item}>{item.nome}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    item: { fontSize: 16, marginBottom: 8 },
});