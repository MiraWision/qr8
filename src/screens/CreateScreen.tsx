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
import Animated, { FadeIn, FadeInDown, FadeInRight, Easing } from 'react-native-reanimated';
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
import AmbientBackground from '../components/ui/AmbientBackground';
import GradientButton from '../components/ui/GradientButton';
import PressableScale from '../components/ui/PressableScale';
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
  const navigation = useNavigation<any>();
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

      const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
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

  const getTypeIcon = (qrType: string, active: boolean) => {
    const c = active ? theme.colors.primaryLight : theme.colors.textSecondary;
    switch (qrType) {
      case 'text': return <QRTextIcon size={24} color={c} />;
      case 'link': return <QRWebIcon size={24} color={c} />;
      case 'email': return <QREmailIcon size={24} color={c} />;
      case 'phone': return <QRPhoneIcon size={24} color={c} />;
      case 'sms': return <QRSMSIcon size={24} color={c} />;
      case 'wifi': return <QRWiFiIcon size={24} color={c} />;
      case 'vcard': return <QRVCardIcon size={24} color={c} />;
      case 'event': return <QREventIcon size={24} color={c} />;
      default: return null;
    }
  };

  const renderHeader = (title: string, onBack: () => void, right?: React.ReactNode) => (
    <View style={styles.header}>
      <PressableScale onPress={onBack} style={styles.iconCircle} activeScale={0.88}>
        <BackIcon size={22} color={theme.colors.text} />
      </PressableScale>
      <View style={styles.headerCenter}>
        <Text style={styles.headerEyebrow}>STEP {step} OF 2</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );

  if (step === 1) {
    return (
      <AmbientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="light" />
          {renderHeader(
            'Create',
            () => navigation.goBack(),
            <PressableScale onPress={() => navigation.goBack()} activeScale={0.9}>
              <Text style={styles.cancelText}>Cancel</Text>
            </PressableScale>
          )}

          <ScrollView style={styles.content} contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(480).easing(Easing.out(Easing.cubic))} style={styles.typeSelector}>
              <Text style={styles.sectionTitle}>Choose a type</Text>
              <View style={styles.typeButtons}>
                {['text', 'link', 'email', 'phone', 'sms', 'wifi', 'vcard', 'event'].map((qrType, i) => {
                  const active = type === qrType;
                  return (
                    <Animated.View key={qrType} entering={FadeIn.delay(i * 40)} style={styles.typeButtonWrap}>
                      <PressableScale
                        style={[styles.typeButton, active && styles.typeButtonActive]}
                        onPress={() => handleTypeChange(qrType as QRType)}
                        activeScale={0.93}
                      >
                        {getTypeIcon(qrType, active)}
                        <Text style={[styles.typeButtonText, active && styles.typeButtonTextActive]}>
                          {qrType === 'vcard' ? 'vCard' : qrType.toUpperCase()}
                        </Text>
                      </PressableScale>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(480).easing(Easing.out(Easing.cubic))} style={styles.formCard}>
              {renderForm()}
            </Animated.View>

            <GradientButton
              title="Continue to Style"
              onPress={() => setStep(2)}
              style={styles.cta}
            />
          </ScrollView>
        </SafeAreaView>
      </AmbientBackground>
    );
  }

  // Step 2: Style & Preview
  return (
    <AmbientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        {renderHeader('Style & Preview', () => {
          if (fromScanner) {
            navigation.goBack();
          } else {
            setStep(1);
          }
        })}

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(480).easing(Easing.out(Easing.cubic))} style={styles.previewSection}>
            <View style={styles.previewGlow}>
              <View style={[styles.previewTile, { backgroundColor: style.backgroundColor }]}>
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
            </View>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(80).duration(480).easing(Easing.out(Easing.cubic))} style={styles.panel}>
            <View style={styles.twoColumnLayout}>
              <View style={styles.shapesColumn}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionLabel}>Eye Shape</Text>
                  <View style={styles.iconButtonsContainer}>
                    {[EyeShape.Square, EyeShape.RoundedSquare, EyeShape.Circle, EyeShape.Drop].map((shape) => {
                      const active = style.eyeShape === shape;
                      return (
                        <PressableScale
                          key={shape}
                          style={[styles.iconButton, active && styles.iconButtonActive]}
                          onPress={() => setStyle({ ...style, eyeShape: shape })}
                          activeScale={0.9}
                        >
                          <EyeShapeIcon shape={shape} color={active ? theme.colors.primaryLight : theme.colors.textSecondary} />
                        </PressableScale>
                      );
                    })}
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
                    ].map((shape) => {
                      const active = style.cellShape === shape;
                      return (
                        <PressableScale
                          key={shape}
                          style={[styles.iconButton, active && styles.iconButtonActive]}
                          onPress={() => setStyle({ ...style, cellShape: shape })}
                          activeScale={0.9}
                        >
                          <CellShapeIcon shape={shape} color={active ? theme.colors.primaryLight : theme.colors.textSecondary} />
                        </PressableScale>
                      );
                    })}
                  </View>
                </View>
              </View>

              <View style={styles.colorsColumn}>
                <Text style={styles.optionLabel}>Colors</Text>
                <View style={styles.colorPickerContainer}>
                  <View style={styles.colorItemContainer}>
                    <PressableScale
                      style={styles.colorButton}
                      activeScale={0.9}
                      onPress={() => {
                        setColorPickerType('foreground');
                        requestAnimationFrame(() => setColorPickerVisible(true));
                      }}
                    >
                      <View style={[styles.colorPreviewCircle, { backgroundColor: style.foregroundColor }]} />
                    </PressableScale>
                    <Text style={styles.colorItemLabel}>QR</Text>
                  </View>

                  <View style={styles.colorItemContainer}>
                    <PressableScale
                      style={styles.colorButton}
                      activeScale={0.9}
                      onPress={() => {
                        setColorPickerType('background');
                        requestAnimationFrame(() => setColorPickerVisible(true));
                      }}
                    >
                      <View style={[styles.colorPreviewCircle, { backgroundColor: style.backgroundColor }]} />
                    </PressableScale>
                    <Text style={styles.colorItemLabel}>BG</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(140).duration(480).easing(Easing.out(Easing.cubic))} style={styles.panel}>
            <Text style={styles.optionLabel}>Logo</Text>
            <View style={styles.logoRow}>
              <GradientButton
                title="Add Logo"
                size="md"
                icon={<UploadIcon size={18} color={theme.colors.onPrimary} />}
                style={styles.logoBtn}
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
              />
              {!!logoBase64 && (
                <GradientButton
                  title="Remove"
                  variant="danger"
                  size="md"
                  style={styles.logoBtn}
                  onPress={() => setLogoBase64(undefined)}
                />
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(200).duration(480).easing(Easing.out(Easing.cubic))} style={styles.panel}>
            <Text style={styles.optionLabel}>Name (optional)</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder={generateAutoName()}
              placeholderTextColor={theme.colors.textTertiary}
            />
          </Animated.View>

          <GradientButton title="Save QR Code" onPress={handleSave} style={styles.cta} />
        </ScrollView>

        <ColorPickerModal
          key={`color-${colorPickerType}`}
          visible={colorPickerVisible}
          onClose={() => setColorPickerVisible(false)}
          value={colorPickerType === 'foreground' ? style.foregroundColor : style.backgroundColor}
          onChange={(color, target) => {
            if (target === 'foreground') {
              setStyle((prev) => ({ ...prev, foregroundColor: color }));
            } else {
              setStyle((prev) => ({ ...prev, backgroundColor: color }));
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
    </AmbientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 10,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 2,
    marginBottom: 1,
  },
  headerRight: {
    minWidth: 42,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  cancelText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
  },
  content: {
    flex: 1,
  },
  scrollPad: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 130,
  },
  typeSelector: {
    marginBottom: theme.spacing.md,
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
  typeButtonWrap: {
    width: '22.7%',
  },
  typeButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.xs + 2,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '22',
  },
  typeButtonText: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
  },
  typeButtonTextActive: {
    color: theme.colors.primaryLight,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  cta: {
    marginTop: theme.spacing.sm,
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  previewGlow: {
    borderRadius: theme.borderRadius.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 12,
  },
  previewTile: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  shapesColumn: {
    flex: 2,
  },
  colorsColumn: {
    flex: 1,
  },
  optionButton: {
    marginBottom: theme.spacing.md,
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
    width: 46,
    height: 46,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  iconButtonActive: {
    backgroundColor: theme.colors.primary + '22',
    borderColor: theme.colors.primary,
  },
  colorPickerContainer: {
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  colorItemContainer: {
    alignItems: 'center',
    gap: 6,
  },
  colorItemLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  colorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  colorPreviewCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  nameInput: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  logoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  logoBtn: {
    flex: 1,
  },
});

export default CreateScreen;
