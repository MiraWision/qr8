import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackIcon } from '../../assets/images/icons/navigation/back-icon';
import { theme } from '../theme';
import { QRType, QRCodeItem, CellShape, EyeShape } from '../types/qr';
import { QRFormData, QRStyleConfig } from '../types/forms';
import { qrStorageService } from '../services/QRStorageService';
import WiFiForm from '../components/forms/WiFiForm';
import LinkForm from '../components/forms/LinkForm';
import TextForm from '../components/forms/TextForm';
import VCardForm from '../components/forms/VCardForm';
import EmailForm from '../components/forms/EmailForm';
import PhoneForm from '../components/forms/PhoneForm';
import SMSForm from '../components/forms/SMSForm';
import EventForm from '../components/forms/EventForm';
import QRCodePreview from '../components/QRCodePreview';
import CustomQR from '../components/CustomQR';
import type { CustomQRHandle } from '../components/CustomQR';
import { buildQrPayload } from '../utils/qrPayload';
import ColorPickerModal from '../components/color-picker-modal';
import { CellShapeIcon, EyeShapeIcon } from '../components/shape-icons';
import * as ImagePicker from 'expo-image-picker';
import { QRWiFiIcon } from '../../assets/images/icons/qr-types/qr-wifi';
import { QRVCardIcon } from '../../assets/images/icons/qr-types/qr-vcard';
import { QRTextIcon } from '../../assets/images/icons/qr-types/qr-text';
import { QRSMSIcon } from '../../assets/images/icons/qr-types/qr-sms';
import { QRPhoneIcon } from '../../assets/images/icons/qr-types/qr-phone';
import { QRWebIcon } from '../../assets/images/icons/qr-types/qr-web';
import { QREmailIcon } from '../../assets/images/icons/qr-types/qr-email';
import { QREventIcon } from '../../assets/images/icons/qr-types/qr-event';
import { UploadIcon } from '../../assets/images/icons/actions/upload';

interface CreateScreenProps {
  route?: {
    params?: {
      prefilledData?: QRCodeItem;
      fromScanner?: boolean;
    };
  };
}

const CreateScreen: React.FC<CreateScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const prefilledData = route?.params?.prefilledData;
  const fromScanner = route?.params?.fromScanner || false;
  
  const [step, setStep] = useState<1 | 2>(prefilledData ? 2 : 1);
  const [type, setType] = useState<QRType>(prefilledData?.type || 'link');
  const [formData, setFormData] = useState<QRFormData>(prefilledData?.data || { url: '' });
  const [style, setStyle] = useState<QRStyleConfig>(prefilledData?.style || {
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    cellShape: CellShape.Square,
    eyeShape: EyeShape.Square,
  });

  const [name, setName] = useState(prefilledData?.name || '');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'foreground' | 'background'>('foreground');
  const scrollViewRef = useRef<ScrollView>(null);
  const [logoBase64, setLogoBase64] = useState<string | undefined>((prefilledData as any)?.style?.logoBase64);
  const qrRef = useRef<CustomQRHandle>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!prefilledData) {
        setStep(1);
        setType('link');
        setFormData({ url: '' });
        setStyle({
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cellShape: CellShape.Square,
          eyeShape: EyeShape.Square,
        });
        setName('');
      }
    });

    return unsubscribe;
  }, [navigation, prefilledData]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (fromScanner) {
          if (step === 2) {
            navigation.goBack();
            return true;
          }
          if (step === 1) {
            navigation.goBack();
            return true;
          }
        }
        if (step === 2 && !fromScanner) {
          setStep(1);
          return true;
        }
        return false;
      };

      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        const actionType = e.data.action.type;
        const isGoingBack = actionType === 'GO_BACK' || actionType === 'POP';
        
        if (isGoingBack) {
          if (step === 2 && fromScanner) {
            return;
          }
          if (step === 1 && fromScanner) {
            return;
          }
          if (step === 2 && !fromScanner) {
            e.preventDefault();
            setStep(1);
          }
        }
      });

      return unsubscribe;
    }, [navigation, step, fromScanner])
  );

  const generateQRData = () => {
    switch (type) {
      case 'wifi':
        return formData;
      case 'link':
        return formData;
      case 'text':
        return formData;
      case 'vcard':
        return formData;
      case 'email':
        return formData;
      case 'phone':
        return formData;
      case 'sms':
        return formData;
      case 'event':
        return formData;
    }
  };

  const generateAutoName = (): string => {
    const date = new Date().toISOString().split('T')[0];
    if (name.trim()) return name;

    switch (type) {
      case 'wifi':
        const wifiData = formData as any;
        return `${wifiData.ssid || 'Network'} ${date}`;
      case 'link':
        return (formData as any).url?.replace(/^https?:\/\//, '').substring(0, 40) || `URL ${date}`;
      case 'text':
        return `Text ${date}`;
      case 'vcard':
        const vcardData = formData as any;
        return `${vcardData.name || 'Contact'} ${date}`;
      case 'email':
        const emailData = formData as any;
        return `Email ${date}`;
      case 'phone':
        return `Phone ${date}`;
      case 'sms':
        return `SMS ${date}`;
      case 'event':
        const eventData = formData as any;
        return `${eventData.title || 'Event'} ${date}`;
    }
  };


  const handleSave = async () => {
    try {
      const id = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const qrItem = {
        id,
        name: generateAutoName(),
        type,
        data: generateQRData(),
        style: { ...style, logoBase64 },
        isPinned: false,
        createdAt: Date.now(),
      };

      await qrStorageService.add(qrItem);
      
      setStep(1);
      setType('link');
      setFormData({ url: '' });
      setStyle({
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cellShape: CellShape.Square,
        eyeShape: EyeShape.Square,
      });
      setName('');
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create QR code');
      console.error(error);
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'wifi':
        return <WiFiForm data={formData as any} onChange={setFormData} />;
      case 'link':
        return <LinkForm data={formData as any} onChange={setFormData} />;
      case 'text':
        return <TextForm data={formData as any} onChange={setFormData} />;
      case 'vcard':
        return <VCardForm data={formData as any} onChange={setFormData} />;
      case 'email':
        return <EmailForm data={formData as any} onChange={setFormData} />;
      case 'phone':
        return <PhoneForm data={formData as any} onChange={setFormData} />;
      case 'sms':
        return <SMSForm data={formData as any} onChange={setFormData} />;
      case 'event':
        return <EventForm data={formData as any} onChange={setFormData} />;
    }
  };

  const resetFormData = (targetType?: QRType) => {
    const currentType = targetType || type;
    switch (currentType) {
      case 'wifi':
        setFormData({ ssid: '', password: '', encryption: 'WPA2' });
        break;
      case 'link':
        setFormData({ url: '' });
        break;
      case 'text':
        setFormData({ text: '' });
        break;
      case 'vcard':
        setFormData({ name: '', phone: '', email: '', company: '' });
        break;
      case 'email':
        setFormData({ email: '', subject: '', body: '' });
        break;
      case 'phone':
        setFormData({ phone: '' });
        break;
      case 'sms':
        setFormData({ phone: '', message: '' });
        break;
      case 'event':
        setFormData({ title: '', location: '', description: '', startDate: '', endDate: '' });
        break;
    }
  };

  const handleTypeChange = (newType: QRType) => {
    setType(newType);
    resetFormData(newType);
  };

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create QR Code</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.typeSelector}>
            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.typeButtons}>
              {['text', 'link', 'email', 'phone', 'sms', 'wifi', 'vcard', 'event'].map((qrType) => {
                const getIcon = () => {
                  switch (qrType) {
                    case 'text': return <QRTextIcon size={24} />;
                    case 'link': return <QRWebIcon size={24} />;
                    case 'email': return <QREmailIcon size={24} />;
                    case 'phone': return <QRPhoneIcon size={24} />;
                    case 'sms': return <QRSMSIcon size={24} />;
                    case 'wifi': return <QRWiFiIcon size={24} />;
                    case 'vcard': return <QRVCardIcon size={24} />;
                    case 'event': return <QREventIcon size={24} />;
                    default: return null;
                  }
                };
                return (
                  <TouchableOpacity
                    key={qrType}
                    style={[styles.typeButton, type === qrType && styles.typeButtonActive]}
                    onPress={() => handleTypeChange(qrType as QRType)}
                  >
                    {getIcon()}
                    <Text style={[styles.typeButtonText, type === qrType && styles.typeButtonTextActive]}>
                      {qrType === 'vcard' ? 'vCard' : qrType.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {renderForm()}

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>Next: Style</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 2: Style & Preview
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (fromScanner) {
              navigation.goBack();
            } else {
              setStep(1);
            }
          }}
          style={styles.backButton}
        >
          <BackIcon size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Style & Preview</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.previewSection}>
          <View style={styles.previewContainer}>
            <CustomQR
              ref={qrRef}
              key={`qr-${style.eyeShape}-${style.cellShape}-${style.foregroundColor}-${style.backgroundColor}-${(style as any)?.logoBase64 ? 'logo' : 'nologo'}`}
              value={buildQrPayload(type as any, generateQRData())}
              size={200}
              foregroundColor={style.foregroundColor}
              backgroundColor={style.backgroundColor}
              cellShape={style.cellShape}
              eyeShape={style.eyeShape}
                errorCorrectionLevel={'H'}
                quietZone={24}
              gradient={null}
              centerLogo={logoBase64 ? { width: 56, height: 56, borderRadius: 12, bgColor: '#fff', logoBase64 } : null}
            />
          </View>
          {/* Removed save/share buttons at creation step */}
        </View>

        <View style={styles.styleSection}>
          <View style={styles.twoColumnLayout}>
            <View style={styles.shapesColumn}>
              <View style={styles.optionButton}>
                <Text style={styles.optionLabel}>Eye Shape</Text>
                <View style={styles.iconButtonsContainer}>
                  {[EyeShape.Square, EyeShape.RoundedSquare, EyeShape.Circle, EyeShape.Drop].map((shape) => (
                    <TouchableOpacity
                      key={shape}
                      style={[styles.iconButton, style.eyeShape === shape && styles.iconButtonActive]}
                      onPress={() => setStyle({ ...style, eyeShape: shape })}
                    >
                      <EyeShapeIcon shape={shape} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.optionButton}>
                <Text style={styles.optionLabel}>Cell Shape</Text>
                <View style={styles.iconButtonsContainer}>
                  {[
                    CellShape.Square,
                    CellShape.RoundedSquareSlight,
                    CellShape.RoundedSquareFull,
                    CellShape.Circle,
                    CellShape.RoundedTopLeftBottomRight,
                    CellShape.RoundedTopRightBottomLeft,
                    CellShape.HorizontalLines,
                    CellShape.VerticalLines,
                  ].map((shape) => (
                    <TouchableOpacity
                      key={shape}
                      style={[styles.iconButton, style.cellShape === shape && styles.iconButtonActive]}
                      onPress={() => setStyle({ ...style, cellShape: shape })}
                    >
                      <CellShapeIcon shape={shape} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.colorsColumn}>
              <View style={styles.colorPickerRow}>
                <View style={styles.colorPickerContainer}>
                  <View style={styles.colorItemContainer}>
                    <Text style={styles.colorItemLabel}>QR</Text>
                    <TouchableOpacity 
                      style={styles.colorButton}
                      onPress={() => {
                        setColorPickerType('foreground');
                        requestAnimationFrame(() => setColorPickerVisible(true));
                      }}
                    >
                      <View style={[styles.colorPreviewCircle, { backgroundColor: style.foregroundColor }]} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.colorItemContainer}>
                    <Text style={styles.colorItemLabel}>BG</Text>
                    <TouchableOpacity 
                      style={styles.colorButton}
                      onPress={() => {
                        setColorPickerType('background');
                        requestAnimationFrame(() => setColorPickerVisible(true));
                      }}
                    >
                      <View style={[styles.colorPreviewCircle, { backgroundColor: style.backgroundColor }]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.styleSection}>
          <View style={styles.logoRow}>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={async () => {
                try {
                  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (perm.status !== 'granted') {
                    Alert.alert('Permission needed', 'Allow photo library access to choose a logo.');
                    return;
                  }
                  const res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'] as any,
                    quality: 1,
                    base64: true,
                  });
                  if (!res.canceled && res.assets && res.assets[0]?.base64) {
                    setLogoBase64(res.assets[0].base64);
                  }
                } catch (e) {
                  Alert.alert('Error', 'Failed to open image picker. Please restart Metro.');
                  console.error(e);
                }
              }}
            >
              <UploadIcon size={18} color={theme.colors.background} />
              <Text style={styles.logoButtonText}>Add Logo</Text>
            </TouchableOpacity>
            {!!logoBase64 && (
              <TouchableOpacity
                style={[styles.logoButton, styles.logoRemoveButton]}
                onPress={() => setLogoBase64(undefined)}
              >
                <Text style={styles.logoButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.nameSection}>
          <Text style={styles.label}>Name (optional)</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder={generateAutoName()}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save QR Code</Text>
        </TouchableOpacity>
      </ScrollView>

      <ColorPickerModal
        key={`color-${colorPickerType}`}
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        value={colorPickerType === 'foreground' ? style.foregroundColor : style.backgroundColor}
        onChange={(color, target) => {
          if (target === 'foreground') {
            setStyle(prev => ({ ...prev, foregroundColor: color }));
          } else {
            setStyle(prev => ({ ...prev, backgroundColor: color }));
          }
        }}
        label={colorPickerType === 'foreground' ? 'Foreground' : 'Background'}
        isForeground={colorPickerType === 'foreground'}
        currentStyle={style}
        type={type}
        data={generateQRData()}
        logoBase64={logoBase64}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  cancelText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.primary,
  },
  backText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.primary,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeButton: {
    width: '22%',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '15',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeButtonText: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.regular,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  typeButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.semibold,
  },
  previewSection: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  previewContainer: {
    alignItems: 'center',
  },
  styleSection: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: 0,
    marginTop: -theme.spacing.md,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  shapesColumn: {
    flex: 2,
  },
  colorsColumn: {
    flex: 1,
  },
  optionButton: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  iconButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  nameSection: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: 0,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  nameInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    margin: theme.spacing.md,
    ...theme.shadows.medium,
  },
  nextButton: {},
  saveButton: {},
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
  },
  colorPickerRow: {
    alignItems: 'flex-start',
  },
  colorPickerContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  colorItemContainer: {
    alignItems: 'center',
  },
  colorItemLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 6,
  },
  colorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorPreviewCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  logoButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  logoRemoveButton: {
    backgroundColor: theme.colors.error,
  },
  logoButtonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
  },
});

export default CreateScreen;