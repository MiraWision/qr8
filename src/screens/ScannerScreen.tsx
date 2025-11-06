import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import QRCodeParser from '../utils/qrParser';
import { QRCodeItem, CellShape, EyeShape } from '../types/qr';
import ScanResultModal from '../components/ScanResultModal';
import { theme } from '../theme';
import { UploadIcon } from '../../assets/images/icons/actions/upload';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = 250;

const ScannerScreen: React.FC = () => {
  const navigation = useNavigation();
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
      
      const manipulatedImage = await ImageManipulator.manipulateAsync(
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

  useEffect(() => {
    if (scanStatus === 'scanning') {
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
      }, 1000);
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
          <Text>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No access to camera</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>

      <View style={styles.cameraContainer}>
        {!selectedImage ? (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.scanArea}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {scanStatus === 'scanning' && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [
                        {
                          translateY: scanLineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, SCAN_AREA_SIZE - 20],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              )}
              
              {scanStatus === 'success' && (
                <View style={styles.statusOverlay}>
                  <Text style={styles.statusTextSuccess}>✓ Success</Text>
                </View>
              )}
              
              {scanStatus === 'error' && (
                <View style={styles.statusOverlay}>
                  <Text style={styles.statusTextError}>✗ Error</Text>
                </View>
              )}
              
              {scanStatus === 'idle' && (
                <Text style={styles.scanText}>
                  Point camera at QR code
                </Text>
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
                <Text style={styles.scanStatusText}>Scanning...</Text>
              </View>
            )}
            {scanStatus === 'success' && (
              <View style={styles.statusOverlay}>
                <Text style={styles.statusTextSuccess}>✓ Success</Text>
              </View>
            )}
            {scanStatus === 'error' && (
              <View style={styles.statusOverlay}>
                <Text style={styles.statusTextError}>✗ Error</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loadButton}
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
                const imageUri = res.assets[0].uri;
                setSelectedImage(imageUri);
              }
            } catch (error) {
              console.error('Error loading image:', error);
              Alert.alert('Error', 'Failed to load image');
            }
          }}
        >
          <UploadIcon size={18} color={theme.colors.background} />
          <Text style={styles.loadButtonText}>Load from Gallery</Text>
        </TouchableOpacity>
        <Text style={styles.instructionText}>
          Position the QR code within the frame
        </Text>
      </View>

      <ScanResultModal
        visible={resultModalVisible}
        item={scannedItem}
        onClose={() => {
          setResultModalVisible(false);
          setScannedItem(null);
        }}
        onSave={(item) => {
          navigation.navigate('CreateScreen' as never, { prefilledData: item, fromScanner: true } as never);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + '30',
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
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
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  instructions: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '30',
  },
  instructionText: {
    color: '#fff',
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  loadButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
  },
  errorText: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scanLine: {
    position: 'absolute',
    width: SCAN_AREA_SIZE,
    height: 20,
    backgroundColor: theme.colors.primary,
    opacity: 0.6,
  },
  statusOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -15 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextSuccess: {
    fontSize: 32,
    color: '#4CAF50',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusTextError: {
    fontSize: 32,
    color: '#F44336',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scanStatusContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -15 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanStatusText: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.semibold,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
});

export default ScannerScreen;