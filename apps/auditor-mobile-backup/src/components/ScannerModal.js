import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Zap, Camera as CameraIcon } from 'lucide-react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const ScannerModal = ({ visible, onScan, onClose, mode }) => {
    const devices = useCameraDevices();
    const device = devices.back;
    const [hasPermission, setHasPermission] = useState(false);
    const [torch, setTorch] = useState(false);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], { checkInverted: true });
        if (detectedBarcodes.length > 0) {
            // Trigger onScan on first detection
            // In real app, we use runOnJS to bridge back to React
            // runOnJS(onScan)(detectedBarcodes[0].displayValue);
        }
    }, [onScan]);

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                {device != null && hasPermission ? (
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={5}
                        torch={torch ? 'on' : 'off'}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <CameraIcon size={48} color="#94a3b8" />
                        <Text style={styles.placeholderText}>
                            {!hasPermission ? 'Camera permission denied' : 'Initializing optics...'}
                        </Text>
                    </View>
                )}

                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.modeBadge}>
                            <Text style={styles.modeText}>
                                {mode === 'location' ? 'SCAN LOCATION QR' : 'SCAN ITEM BARCODE'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.torchBtn} onPress={() => setTorch(!torch)}>
                            <Zap size={24} color={torch ? '#fbbf24' : '#fff'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.finderContainer}>
                        <View style={[styles.finder, mode === 'location' ? styles.finderSquare : styles.finderRect]}>
                            {/* Decorative corners */}
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>

                    <View style={styles.instructions}>
                        <Text style={styles.instructionText}>
                            {mode === 'location'
                                ? 'Align the location QR code within the frame'
                                : 'Position the barcode or GTIN inside the rectangle'}
                        </Text>
                    </View>
                </View>

                {/* Mock Scan Trigger for Environment Verification */}
                <TouchableOpacity
                    style={styles.mockTrigger}
                    onPress={() => onScan(mode === 'location' ? 'LOC-DEMO' : '8901234567890')}
                >
                    <Text style={styles.mockTriggerText}>Simulate Scan (Enviroment Test)</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    placeholderText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingVertical: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 },
    closeBtn: { p: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    torchBtn: { p: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    modeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, py: 8, borderRadius: 12 },
    modeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    finderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    finder: { borderWeight: 2, borderColor: 'rgba(255,255,255,0.3)', position: 'relative' },
    finderSquare: { width: 260, height: 260, borderRadius: 32 },
    finderRect: { width: 300, height: 160, borderRadius: 24 },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: '#fff', borderWeight: 6 },
    topLeft: { top: -2, left: -2, borderTopLeftRadius: 32, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: -2, right: -2, borderTopRightRadius: 32, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: -2, left: -2, borderBottomLeftRadius: 32, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: -2, right: -2, borderBottomRightRadius: 32, borderLeftWidth: 0, borderTopWidth: 0 },
    instructions: { alignItems: 'center', paddingBottom: 40 },
    instructionText: { color: '#fff', fontSize: 14, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    mockTrigger: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 20, py: 10, borderRadius: 10 },
    mockTriggerText: { color: '#000', fontSize: 12, fontWeight: '800' }
});

export default ScannerModal;
