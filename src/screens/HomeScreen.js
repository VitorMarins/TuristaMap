import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar autenticado para acessar essa página.');
        navigation.navigate('Login');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get('https://turistamap-backend.onrender.com/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.log('Erro ao carregar usuários:', error);
        Alert.alert('Erro', 'Falha ao carregar usuários.');
        navigation.navigate('Login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Erro', 'Você precisa estar autenticado para realizar essa ação.');
      navigation.navigate('Login');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja deletar este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://turistamap-backend.onrender.com/api/usuarios/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsers(users.filter((user) => user._id !== userId));
              Alert.alert('Sucesso', 'Usuário deletado com sucesso.');
            } catch (error) {
              console.log('Erro ao deletar usuário:', error);
              Alert.alert('Erro', 'Não foi possível deletar o usuário.');
            }
          },
        },
      ]
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.nome}</Text>
              <TouchableOpacity onPress={() => deleteUser(item._id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Botão de Logout */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Navegação para Pontos Turísticos */}
      <TouchableOpacity onPress={() => navigation.navigate('Turismo')} style={styles.navigateButton}>
        <Text style={styles.navigateText}>Pontos Turísticos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigateButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  navigateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
