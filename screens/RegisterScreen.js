
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const register = async () => {
    try {
      await axios.post('http://localhost:3000/api/users/register', { nome, senha });
      alert('Usuário adicionado com sucesso!');
      navigation.replace('Login');
    } catch (error) {
      alert('Erro ao registrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Cadastre-se</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      <Button title="Cadastrar" onPress={register} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
});
