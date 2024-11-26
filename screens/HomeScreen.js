import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get('https://turistamap-backend.onrender.com/api/usuarios', {
          headers: { Authorization: 'Bearer '+ token }
        });
        setUsers(response.data);
      } catch (error) {
        console.log('Erro ao carregar usuários:', error);
        alert('Você precisa está autenticado para acessar essa página!');
        navigation.navigate('Login');
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`https://turistamap-backend.onrender.com/api/usuarios/${userId}`, {
        headers: { Authorization: 'Bearer '+ token }
      });
      setUsers(users.filter((user) => user._id !== userId));
      alert('Usuário deletado com sucesso!');
    } catch (error) {
      alert('Erro ao deletar usuário');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text>{item.nome}</Text>
            <TouchableOpacity onPress={() => deleteUser(item._id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {/* Botão de Logout */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Turismo')} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Pontos turisticos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  userContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderColor: '#ccc' },
  deleteButton: { backgroundColor: 'red', padding: 4, borderRadius: 4 },
  deleteText: { color: 'white' },
  logoutButton: { backgroundColor: 'blue', padding: 10, borderRadius: 4, marginTop: 20, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16 }
});
