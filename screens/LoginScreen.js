import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/auth/login', { nome, senha });
      await AsyncStorage.setItem('token', response.data.token);
      alert('Boas-vindas!');
      navigation.replace('Home');
    } catch (error) {
      alert('Nome e/ou senha errados!');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Olá! Autentique-se para entrar.</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Entrar" onPress={login} />
      
      {/* Botão para navegar até a tela de registro */}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.registerText}>Você não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
  registerText: { color: 'blue', marginTop: 10, textAlign: 'center' }
});
