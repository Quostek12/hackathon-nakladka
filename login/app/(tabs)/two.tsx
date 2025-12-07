import { StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = 'http://localhost:8000'; // zmień gdy backend jest hostowany inaczej

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const resp = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password }),
      });

      if (resp.ok) {
        const data = await resp.json();
        // data.access_token available — możesz zapisać go jeśli potrzebujesz
        router.replace('/(tabs)');
      } else {
        // Spróbuj odczytać szczegóły błędu z backendu
        let msg = 'Błąd logowania';
        try {
          const err = await resp.json();
          if (err.detail) msg = String(err.detail);
        } catch (_) {}
        setError(msg);
      }
    } catch (e) {
      setError('Błąd sieciowy: ' + String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zaloguj się</Text>

      <Text style={styles.label}>Nazwa użytkownika</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="np. admin"
        autoCapitalize="none"
        importantForAutofill="yes"
      />

      <Text style={styles.label}>Hasło</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="hasło"
        secureTextEntry
        importantForAutofill="yes"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={[styles.button, loading ? styles.buttonDisabled : null]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Zaloguj</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  button: {
    marginTop: 18,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    marginTop: 8,
    color: '#d9534f',
  },
});
