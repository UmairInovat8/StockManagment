import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { LayoutGrid, MapPin, ChevronRight, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react-native';
import useAuditStore from '../store/useAuditStore';
import useAuthStore from '../store/useAuthStore';

const Dashboard = ({ navigation }) => {
    const { assignedSections, refreshTasks, isSyncing, eventQueue } = useAuditStore();
    const { user, logout } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshTasks();
        setRefreshing(false);
    };

    useEffect(() => {
        refreshTasks();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AuditSession', { section: item })}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'OPEN' ? '#f0f9ff' : '#f0fdf4' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'OPEN' ? '#0ea5e9' : '#10b981' }]}>
                        {item.status}
                    </Text>
                </View>
                <Text style={styles.locationCode}>{item.location?.code || 'LOC-01'}</Text>
            </View>

            <Text style={styles.locationName}>{item.location?.name}</Text>
            <Text style={styles.auditName}>{item.audit?.name}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.meta}>
                    <MapPin size={12} color="#94a3b8" />
                    <Text style={styles.metaText}>{item.location?.type || 'Standard Section'}</Text>
                </View>
                <ChevronRight size={16} color="#cbd5e1" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.firstName || 'Auditor'}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <LogOut size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            {eventQueue.length > 0 && (
                <View style={styles.syncBanner}>
                    <RefreshCw size={14} color="#f59e0b" style={isSyncing ? styles.spinning : null} />
                    <Text style={styles.syncText}>
                        {isSyncing ? 'Syncing counts...' : `${eventQueue.length} counts pending sync`}
                    </Text>
                </View>
            )}

            <FlatList
                data={assignedSections}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>Assigned Tasks</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <LayoutGrid size={48} color="#f1f5f9" />
                        <Text style={styles.emptyText}>No sections assigned to you yet.</Text>
                        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
                            <Text style={styles.refreshBtnText}>Refresh Tasks</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12 },
    welcome: { fontSize: 13, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    userName: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
    logoutBtn: { p: 8 },
    syncBanner: { backgroundColor: '#fffbeb', padding: 12, marginHorizontal: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWeight: 1, borderColor: '#fef3c7' },
    syncText: { fontSize: 12, fontWeight: '700', color: '#d97706' },
    spinning: { transform: [{ rotate: '45deg' }] }, // simplified for mock
    list: { padding: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    statusBadge: { paddingHorizontal: 10, py: 4, borderRadius: 8 },
    statusText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
    locationCode: { fontSize: 10, fontWeight: '800', color: '#cbd5e1', fontFamily: 'monospace' },
    locationName: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    auditName: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 16 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f8fafc' },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
    emptyContainer: { alignItems: 'center', py: 80 },
    emptyText: { fontSize: 14, color: '#94a3b8', fontWeight: '600', marginTop: 12, marginBottom: 24 },
    refreshBtn: { backgroundColor: '#0f172a', px: 24, py: 12, borderRadius: 14 },
    refreshBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' }
});

export default Dashboard;
