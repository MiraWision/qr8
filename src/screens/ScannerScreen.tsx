import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import QRCodeParser from '../utils/qrParser';
import { QRCodeItem, CellShape, EyeShape } from '../types/qr';
import ScanResultModal from '../components/ScanResultModal';
import GradientButton from '../components/ui/GradientButton';
import { theme } from '../theme';
import { UploadIcon } from '../../assets/images/icons/actions/upload';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = 260;

const ScannerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const hiddenCameraRef = useRef<CameraView>(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scannedItem, setScannedItem] = useState<QRCodeItem | null>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      decodeQRFromImage(selectedImage);
    }
  }, [selectedImage]);

  const decodeQRFromImage = async (imageUri: string) => {
    try {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }

      setScanStatus('scanning');

      await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1000 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      scanTimeoutRef.current = setTimeout(() => {
        setScanStatus((currentStatus) => {
          if (currentStatus === 'scanning') {
            return 'error';
          }
          return currentStatus;
        });
        setTimeout(() => {
          setScanStatus('idle');
          setSelectedImage(null);
          Alert.alert('No QR Code Found', 'Please select an image with a QR code. CameraView cannot scan static images.');
        }, 1500);
        scanTimeoutRef.current = null;
      }, 5000);
    } catch (error) {
      console.error('Error decoding QR from image:', error);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      setScanStatus('error');
      setTimeout(() => {
        setScanStatus('idle');
        setSelectedImage(null);
        Alert.alert('Error', 'Failed to process image.');
      }, 1500);
    }
  };

  // Gentle continuous scan-line sweep while the camera is live.
  useEffect(() => {
    if (scanStatus === 'idle' || scanStatus === 'scanning') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [scanStatus]);

  const processQRCode = (data: string) => {
    try {
      setScanStatus('scanning');
      const parsed = QRCodeParser.parse(data);

      const qrItem: QRCodeItem = {
        id: `scanned_${Date.now()}`,
        name: generateName(parsed),
        type: parsed.type,
        data: parsed.data,
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cellShape: CellShape.Square,
          eyeShape: EyeShape.Square,
        },
        isPinned: false,
        createdAt: Date.now(),
      };

      setScannedItem(qrItem);
      setScanStatus('success');

      setTimeout(() => {
        setResultModalVisible(true);
        setScanStatus('idle');
        setScanned(false);
      }, 800);
    } catch (error) {
      console.error('Parse error:', error);
      setScanStatus('error');
      setTimeout(() => {
        setScanStatus('idle');
        setScanned(false);
      }, 1500);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    processQRCode(data);
  };

  const generateName = (parsed: any): string => {
    const date = new Date().toISOString().split('T')[0];
    switch (parsed.type) {
      case 'wifi':
        return `${parsed.data.ssid || 'Network'} ${date}`;
      case 'link':
        return parsed.data.url?.replace(/^https?:\/\//, '').substring(0, 40) || `URL ${date}`;
      case 'vcard':
        return `${parsed.data.name || 'Contact'} ${date}`;
      case 'text':
        const textPreview = parsed.data.text?.substring(0, 30).replace(/\n/g, ' ') || '';
        return textPreview || `Text ${date}`;
      default:
        return `QR Code ${date}`;
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.dimText}>Requesting camera permission…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No access to camera</Text>
          <GradientButton
            title="Grant Permission"
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const frameColor =
    scanStatus === 'success'
      ? theme.colors.success
      : scanStatus === 'error'
      ? theme.colors.error
      : theme.colors.primaryLight;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.cameraContainer}>
        {!selectedImage ? (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            {/* top vignette + header */}
            <LinearGradient
              colors={['rgba(10,7,18,0.95)', 'rgba(10,7,18,0)']}
              style={styles.topVignette}
            >
              <SafeAreaView edges={['top']}>
                <Text style={styles.title}>Scan QR Code</Text>
                <Text style={styles.subtitle}>Align a code inside the frame</Text>
              </SafeAreaView>
            </LinearGradient>

            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft, { borderColor: frameColor }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: frameColor }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: frameColor }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: frameColor }]} />

              {(scanStatus === 'idle' || scanStatus === 'scanning') && (
                <Animated.View
                  style={[
                    styles.scanLineWrap,
                    {
                      transform: [
                        {
                          translateY: scanLineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, SCAN_AREA_SIZE - 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(196,160,255,0)', theme.colors.primaryLight, 'rgba(196,160,255,0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.scanLine}
                  />
                </Animated.View>
              )}

              {scanStatus === 'success' && (
                <View style={styles.statusOverlay}>
                  <Text style={[styles.statusEmoji, { color: theme.colors.success }]}>✓</Text>
                </View>
              )}
              {scanStatus === 'error' && (
                <View style={styles.statusOverlay}>
                  <Text style={[styles.statusEmoji, { color: theme.colors.error }]}>✕</Text>
                </View>
              )}
            </View>
          </CameraView>
        ) : (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <CameraView
              ref={hiddenCameraRef}
              style={styles.hiddenCamera}
              facing="back"
              onBarcodeScanned={(event) => {
                if (event && event.data && scanStatus === 'scanning') {
                  if (scanTimeoutRef.current) {
                    clearTimeout(scanTimeoutRef.current);
                    scanTimeoutRef.current = null;
                  }
                  setSelectedImage(null);
                  setScanned(true);
                  processQRCode(event.data);
                }
              }}
            />
            {scanStatus === 'scanning' && (
              <View style={styles.scanStatusContainer}>
                <Text style={styles.scanStatusText}>Scanning…</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* bottom vignette + footer */}
      <LinearGradient
        colors={['rgba(10,7,18,0)', 'rgba(10,7,18,0.97)']}
        style={styles.bottomVignette}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <GradientButton
            title="Load from Gallery"
            variant="glass"
            icon={<UploadIcon size={18} color={theme.colors.text} />}
            onPress={async () => {
              try {
                const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (perm.status !== 'granted') {
                  Alert.alert('Permission needed', 'Allow photo library access to load QR code.');
                  return;
                }
                const res = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'] as any,
                  quality: 1,
                  allowsEditing: false,
                });
                if (!res.canceled && res.assets && res.assets[0]) {
                  setSelectedImage(res.assets[0].uri);
                }
              } catch (error) {
                console.error('Error loading image:', error);
                Alert.alert('Error', 'Failed to load image');
              }
            }}
          />
        </SafeAreaView>
      </LinearGradient>

      <ScanResultModal
        visible={resultModalVisible}
        item={scannedItem}
        onClose={() => {
          setResultModalVisible(false);
          setScannedItem(null);
        }}
        onSave={(item) => {
          navigation.navigate('CreateScreen', { prefilledData: item, fromScanner: true });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  dimText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    zIndex: 2,
  },
  title: {
    fontSize: theme.fonts.sizes.xxl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    letterSpacing: 0.3,
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  scanArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -SCAN_AREA_SIZE / 2,
    marginLeft: -SCAN_AREA_SIZE / 2,
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: theme.colors.primaryLight,
    borderWidth: 4,
    borderRadius: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 18,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 18,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 18,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 18,
  },
  scanLineWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 3,
  },
  scanLine: {
    height: 3,
    borderRadius: 3,
    width: '100%',
    shadowColor: theme.colors.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  statusOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusEmoji: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: theme.spacing.xxl,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 90,
  },
  errorText: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hiddenCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  scanStatusContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanStatusText: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
    fontWeight: theme.fonts.weights.semibold,
    backgroundColor: 'rgba(10, 7, 18, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
});

export default ScannerScreen;
