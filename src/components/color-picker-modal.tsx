import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  PanResponder 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomQR from './CustomQR';
import { buildQrPayload } from '../utils/qrPayload';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PICKER_SIZE = SCREEN_WIDTH - 170;

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChange: (color: string, target: 'foreground' | 'background') => void;
  label: string;
  isForeground: boolean;
  currentStyle: any; // QRStyleConfig
  type: any; // QRType
  data: any; // QR data
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
  logoBase64?: string;
}

const hsvToRgb = (h: number, s: number, v: number): string => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h * 6 < 1) {
    r = c; g = x; b = 0;
  } else if (h * 6 < 2) {
    r = x; g = c; b = 0;
  } else if (h * 6 < 3) {
    r = 0; g = c; b = x;
  } else if (h * 6 < 4) {
    r = 0; g = x; b = c;
  } else if (h * 6 < 5) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const rgbToHsv = (hex: string): { h: number; s: number; v: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }
  
  h = h / 6;
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  
  return { h, s, v };
};

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ 
  visible, 
  onClose, 
  value, 
  onChange, 
  label,
  isForeground,
  currentStyle,
  type,
  data,
  onGestureStart,
  onGestureEnd,
  logoBase64,
}) => {
  const hsv = rgbToHsv(value);
  const [hue, setHue] = useState(hsv.h);
  const [saturation, setSaturation] = useState(hsv.s);
  const [brightness, setBrightness] = useState(hsv.v);
  const [currentColor, setCurrentColor] = useState(value);
  
  const [mainPickerX, setMainPickerX] = useState(hsv.s * PICKER_SIZE);
  const [mainPickerY, setMainPickerY] = useState((1 - hsv.v) * PICKER_SIZE);
  const [hueSliderY, setHueSliderY] = useState(hsv.h * PICKER_SIZE);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentHue = hueSliderY / PICKER_SIZE;

  const updateColor = (x: number, y: number) => {
    const normalizedX = Math.max(0, Math.min(x, PICKER_SIZE));
    const normalizedY = Math.max(0, Math.min(y, PICKER_SIZE));
    
    const s = normalizedX / PICKER_SIZE;
    const v = 1 - (normalizedY / PICKER_SIZE);
    
    setMainPickerX(normalizedX);
    setMainPickerY(normalizedY);
    setSaturation(s);
    setBrightness(v);
    mainPickerXRef.current = normalizedX;
    mainPickerYRef.current = normalizedY;
    
    const newColor = hsvToRgb(currentHueRef.current, s, v);
    setCurrentColor(newColor);
    onChange(newColor, isForeground ? 'foreground' : 'background');
  };

  const updateHue = (y: number) => {
    const normalizedY = Math.max(0, Math.min(y, PICKER_SIZE));
    const h = normalizedY / PICKER_SIZE;
    
    setHueSliderY(normalizedY);
    
    setHue(h);
    currentHueRef.current = h;
    
    const s = mainPickerXRef.current / PICKER_SIZE;
    const v = 1 - (mainPickerYRef.current / PICKER_SIZE);
    const newColor = hsvToRgb(h, s, v);
    
    setCurrentColor(newColor);
    onChange(newColor, isForeground ? 'foreground' : 'background');
  };

  const currentHueRef = useRef(currentHue);
  const mainPickerXRef = useRef(mainPickerX);
  const mainPickerYRef = useRef(mainPickerY);
  
  useEffect(() => {
    currentHueRef.current = currentHue;
    mainPickerXRef.current = mainPickerX;
    mainPickerYRef.current = mainPickerY;
  }, [currentHue, mainPickerX, mainPickerY]);

  useEffect(() => {
    if (visible) {
      const newHsv = rgbToHsv(value);
      
      const initialHue = newHsv.s === 0 ? 0.5 : newHsv.h;
      
      if (!isInitialized) {
        setHue(initialHue);
        setSaturation(newHsv.s);
        setBrightness(newHsv.v);
        setCurrentColor(value);
        setMainPickerX(newHsv.s * PICKER_SIZE);
        setMainPickerY((1 - newHsv.v) * PICKER_SIZE);
        setHueSliderY(initialHue * PICKER_SIZE);
        currentHueRef.current = initialHue;
        mainPickerXRef.current = newHsv.s * PICKER_SIZE;
        mainPickerYRef.current = (1 - newHsv.v) * PICKER_SIZE;
        setIsInitialized(true);
      } else {
        setCurrentColor(value);
      }
    }
    
    if (!visible) {
      setIsInitialized(false);
    }
  }, [visible, value]);

  const colorPickerResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        onGestureStart?.();
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        onGestureStart?.();
        const { locationX, locationY } = evt.nativeEvent;
        updateColor(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        updateColor(locationX, locationY);
      },
      onPanResponderRelease: () => {
        onGestureEnd?.();
      },
      onPanResponderTerminate: () => {
        onGestureEnd?.();
      },
    })
  ).current;

  const hueSliderResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        onGestureStart?.();
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        onGestureStart?.();
        const { locationY } = evt.nativeEvent;
        updateHue(locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationY } = evt.nativeEvent;
        updateHue(locationY);
      },
      onPanResponderRelease: () => {
        onGestureEnd?.();
      },
      onPanResponderTerminate: () => {
        onGestureEnd?.();
      },
    })
  ).current;

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select {label}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.previewContainer}>
              <View style={styles.previewTile}>
              <CustomQR
                value={buildQrPayload(type as any, data)}
                size={130}
                foregroundColor={isForeground ? currentColor : currentStyle.foregroundColor}
                backgroundColor={!isForeground ? currentColor : currentStyle.backgroundColor}
                cellShape={currentStyle.cellShape}
                eyeShape={currentStyle.eyeShape}
                errorCorrectionLevel={'H'}
                quietZone={16}
                gradient={null}
                centerLogo={logoBase64 ? { width: 40, height: 40, borderRadius: 10, bgColor: '#fff', logoBase64 } : null}
              />
              </View>
            </View>

            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>{label}</Text>
              
              <View style={styles.colorPickerRow}>
                <View 
                  style={styles.mainPickerContainer}
                  {...colorPickerResponder.panHandlers}
                >
                  <LinearGradient
                    colors={['#FFFFFF', hsvToRgb(currentHue, 1, 1)]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saturationGradient}
                  />
                  <View style={styles.brightnessOverlay}>
                    <LinearGradient
                      colors={['#00000000', '#000000']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.brightnessGradient}
                    />
                  </View>
                  
                  <View style={[
                    styles.mainIndicator, 
                    { 
                      left: mainPickerX - 12,
                      top: mainPickerY - 12
                    }
                  ]}>
                    <View style={styles.mainIndicatorCircle} />
                  </View>
                </View>

                <View 
                  style={styles.hueSliderContainer}
                  {...hueSliderResponder.panHandlers}
                >
                  <LinearGradient
                    colors={[
                      '#FF0000',
                      '#FFFF00',
                      '#00FF00',
                      '#00FFFF',
                      '#0000FF',
                      '#FF00FF',
                      '#FF0000',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.hueGradient}
                  />
                  
                  <View style={[styles.hueIndicator, { top: hueSliderY - 10 }]}>
                    <View style={styles.hueIndicatorCircle} />
                  </View>
                </View>
              </View>
              
              <View style={styles.colorInfo}>
                <View style={[styles.colorPreviewBox, { backgroundColor: currentColor }]} />
                <Text style={styles.colorText}>{currentColor}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 3, 10, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.xl,
    width: '90%',
    maxHeight: '92%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  closeIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  previewTile: {
    backgroundColor: theme.colors.tile,
    padding: 12,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  pickerSection: {
    marginBottom: 4,
  },
  pickerLabel: {
    fontSize: 13,
    fontFamily: theme.fonts.family,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  colorPickerRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  mainPickerContainer: {
    width: PICKER_SIZE,
    height: PICKER_SIZE,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceElevated,
    position: 'relative',
    overflow: 'hidden',
  },
  saturationGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  brightnessOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  brightnessGradient: {
    width: '100%',
    height: '100%',
  },
  mainIndicator: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  mainIndicatorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  hueSliderContainer: {
    width: 30,
    height: PICKER_SIZE,
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceElevated,
    position: 'relative',
    overflow: 'hidden',
  },
  hueGradient: {
    width: '100%',
    height: '100%',
  },
  hueIndicator: {
    position: 'absolute',
    left: -5,
    width: 40,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  hueIndicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreviewBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  colorText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderLight,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.family,
    fontWeight: '600',
    color: theme.colors.text,
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.family,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});

export default ColorPickerModal;

