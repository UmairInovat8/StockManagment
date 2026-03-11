import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated } from 'react-native';
import { Camera, MapPin, ScanBarcode, CheckCircle2, AlertTriangle, ShieldCheck, History } from 'lucide-react-native';
import useAuditStore from '../store/useAuditStore';
import ScannerModal from '../components/ScannerModal'; // To be implemented

const AuditSession = ({ route, navigation }) => {
    const { section } = route.params;
    const { addCountEvent } = useAuditStore();

    const [locationVerified, setLocationVerified] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [lastScan, setLastScan] = useState(null);
    const [quantity, setQuantity] = useState('1');
    const [isTatmeenVerified, setIsTatmeenVerified] = useState(false);

    const handleLocationScan = (code) => {
        if (code === section.location?.code) {
            setLocationVerified(true);
            setScanning(false);
        } else {
            alert('Location mismatch! Please scan the QR code for ' + section.location?.name);
            setScanning(false);
        }
    };

    const handleItemScan = (data) => {
        // Mock Tatmeen integrated logic
        const isSerialized = data.length > 20; // Simplified POC logic
        setLastScan(data);
        setIsTatmeenVerified(isSerialized);
        setScanning(false);
        setQuantity('1');
    };

    const confirmCount = () => {
        if (!lastScan) return;
        addCountEvent({
            auditId: section.auditId,
            sectionId: section.id,
            itemId: lastScan, // Simplified for POC
            sku: lastScan,
            quantity: parseInt(quantity),
            isTatmeenVerified
        });
        setLastScan(null);
        setIsTatmeenVerified(false);
    };

    if (!locationVerified) {
        return (
            <View style={styles.verifyContainer}>
                <View style={styles.verifyHeader}>
                    <MapPin size={48} color="#0f172a" />
                    <Text style={styles.verifyTitle}>Verify Location</Text>
                    <Text style={styles.verifySubtitle}>Scan the QR code at {section.location?.name} to unlock counting</Text>
                </View>

                <TouchableOpacity style={styles.scanBtn} onPress={() => setScanning(true)}>
                    <Camera size={24} color="#fff" />
                    <Text style={styles.scanBtnText}>Scan Location QR</Text>
                </TouchableOpacity>

                <ScannerModal
                    visible={scanning}
                    onScan={handleLocationScan}
                    onClose={() => setScanning(false)}
                    mode="location"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.sessionHeader}>
                <View style={styles.sectionInfo}>
                    <Text style={styles.sectionLabel}>Active Section</Text>
                    <Text style={styles.sectionName}>{section.location?.name}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                    <ShieldCheck size={14} color="#10b981" />
                    <Text style={styles.verifiedText}>SECURED</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.scanArea}>
                    {!lastScan ? (
                        <TouchableOpacity style={styles.bigScanBtn} onPress={() => setScanning(true)}>
                            <ScanBarcode size={64} color="#0f172a" />
                            <Text style={styles.bigScanText}>Tap to Scan Item</Text>
                            <Text style={styles.bigScanSub}>Supports Barcode, GTIN, QR</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.resultCard}>
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultLabel}>Captured Data</Text>
                                {isTatmeenVerified && (
                                    <View style={styles.tatmeenBadge}>
                                        <ShieldCheck size={10} color="#fff" />
                                        <Text style={styles.tatmeenText}>Tatmeen Verified</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.resultValue}>{lastScan}</Text>

                            <View style={styles.qtyArea}>
                                <Text style={styles.qtyLabel}>Enter Physical Quantity</Text>
                                <TextInput
                                    style={styles.qtyInput}
                                    keyboardType="numeric"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    selectTextOnFocus
                                    autoFocus
                                />
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setLastScan(null)}>
                                    <Text style={styles.cancelBtnText}>Discard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmBtn} onPress={confirmCount}>
                                    <CheckCircle2 size={18} color="#fff" />
                                    <Text style={styles.confirmBtnText}>Confirm Count</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.historyBtn}>
                    <History size={20} color="#64748b" />
                    <Text style={styles.historyBtnText}>Recent Counts</Text>
                </TouchableOpacity>
            </View>

            <ScannerModal
                visible={scanning}
                onScan={handleItemScan}
                onClose={() => setScanning(false)}
                mode="item"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    verifyContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 40, alignItems: 'center' },
    verifyHeader: { alignItems: 'center', marginBottom: 48 },
    verifyTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 24 },
    verifySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 22 },
    scanBtn: { backgroundColor: '#0f172a', height: 64, width: '100%', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    sectionLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    sectionName: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 10, py: 4, borderRadius: 8, gap: 4 },
    verifiedText: { fontSize: 9, fontWeight: '900', color: '#10b981' },

    scrollContent: { padding: 24 },
    scanArea: { minHeight: 400, justifyContent: 'center' },
    bigScanBtn: { backgroundColor: '#f8fafc', borderWeight: 2, borderStyle: 'dotted', borderColor: '#e2e8f0', height: 260, borderRadius: 32, alignItems: 'center', justifyContent: 'center', gap: 16 },
    bigScanText: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    bigScanSub: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

    resultCard: { backgroundColor: '#fff', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    resultLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' },
    tatmeenBadge: { backgroundColor: '#10b981', paddingHorizontal: 8, py: 3, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
    tatmeenText: { fontSize: 8, fontWeight: '900', color: '#fff', textTransform: 'uppercase' },
    resultValue: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 24 },

    qtyArea: { marginBottom: 24 },
    qtyLabel: { fontSize: 12, fontWeight: '800', color: '#64748b', marginBottom: 12 },
    qtyInput: { backgroundColor: '#f8fafc', height: 80, borderRadius: 16, fontSize: 32, fontWeight: '900', textAlign: 'center', color: '#0f172a', borderWidth: 1, borderColor: '#f1f5f9' },

    actionRow: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWeight: 1, borderColor: '#f1f5f9' },
    cancelBtnText: { fontSize: 14, fontWeight: '800', color: '#94a3b8' },
    confirmBtn: { flex: 2, backgroundColor: '#0f172a', height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    confirmBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

    footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    historyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    historyBtnText: { fontSize: 13, fontWeight: '800', color: '#64748b' }
});

export default AuditSession;
