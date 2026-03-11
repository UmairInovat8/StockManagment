import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react-native';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuth = useAuthStore(state => state.setAuth);

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            setAuth(res.data.access_token, res.data.user);
        } catch (e) {
            setError('Invalid credentials or network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <ShieldCheck size={48} color="#0f172a" />
                </View>
                <Text style={styles.title}>Auditor Protocol</Text>
                <Text style={styles.subtitle}>Enter your secure credentials to begin counting</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Auditor Email</Text>
                    <View style={styles.inputWrapper}>
                        <Mail size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. auditor@athgadlang.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Access Key</Text>
                    <View style={styles.inputWrapper}>
                        <Lock size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.buttonText}>Authenticate</Text>
                            <ArrowRight size={18} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>Powered by athgadlang stock engine</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 48 },
    logoContainer: { padding: 20, backgroundColor: '#f8fafc', borderRadius: 24, marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    icon: { marginRight: 12 },
    input: { flex: 1, height: 56, fontSize: 15, color: '#0f172a', fontWeight: '600' },
    button: {
        backgroundColor: '#0f172a',
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        marginTop: 12
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    errorText: { color: '#ef4444', fontSize: 12, fontWeight: '600', textAlign: 'center' },
    footer: { position: 'absolute', bottom: 40, alignSelf: 'center', fontSize: 10, fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 2 }
});

export default Login;
