import React from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, SlideInDown, Easing } from 'react-native-reanimated';
import { QRCodeItem } from '../types/qr';
import CustomQR from './CustomQR';
import GradientButton from './ui/GradientButton';
import { buildQrPayload } from '../utils/qrPayload';
import { QRWiFiIcon } from '../../assets/images/icons/qr-types/qr-wifi';
import { QRVCardIcon } from '../../assets/images/icons/qr-types/qr-vcard';
import { QRTextIcon } from '../../assets/images/icons/qr-types/qr-text';
import { QRSMSIcon } from '../../assets/images/icons/qr-types/qr-sms';
import { QRPhoneIcon } from '../../assets/images/icons/qr-types/qr-phone';
import { QRWebIcon } from '../../assets/images/icons/qr-types/qr-web';
import { QREmailIcon } from '../../assets/images/icons/qr-types/qr-email';
import { QREventIcon } from '../../assets/images/icons/qr-types/qr-event';
import { theme } from '../theme';

interface Props {
  visible: boolean;
  item: QRCodeItem | null;
  onClose: () => void;
  onSave: (item: QRCodeItem) => void;
}

const ScanResultModal: React.FC<Props> = ({ visible, item, onClose, onSave }) => {
  if (!item) return null;

  const getTypeIcon = () => {
    const c = theme.colors.primaryLight;
    switch (item.type) {
      case 'wifi':
        return <QRWiFiIcon size={22} color={c} />;
      case 'text':
        return <QRTextIcon size={22} color={c} />;
      case 'link':
        return <QRWebIcon size={22} color={c} />;
      case 'vcard':
        return <QRVCardIcon size={22} color={c} />;
      case 'email':
        return <QREmailIcon size={22} color={c} />;
      case 'phone':
        return <QRPhoneIcon size={22} color={c} />;
      case 'sms':
        return <QRSMSIcon size={22} color={c} />;
      case 'event':
        return <QREventIcon size={22} color={c} />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'wifi':
        return 'WiFi';
      case 'text':
        return 'Text';
      case 'link':
        return 'Link';
      case 'vcard':
        return 'vCard';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'sms':
        return 'SMS';
      case 'event':
        return 'Event';
      default:
        return 'Unknown';
    }
  };

  const getContent = () => {
    switch (item.type) {
      case 'wifi':
        const wifiData = item.data as any;
        return `SSID: ${wifiData.ssid || 'N/A'}\nEncryption: ${wifiData.encryption || 'N/A'}`;
      case 'text':
        return (item.data as any).text || '';
      case 'link':
        return (item.data as any).url || '';
      case 'vcard':
        const vcardData = item.data as any;
        return `Name: ${vcardData.name || 'N/A'}\nPhone: ${vcardData.phone || 'N/A'}\nEmail: ${vcardData.email || 'N/A'}`;
      case 'email':
        const emailData = item.data as any;
        return `Email: ${emailData.email || 'N/A'}\nSubject: ${emailData.subject || 'N/A'}`;
      case 'phone':
        return (item.data as any).phone || '';
      case 'sms':
        const smsData = item.data as any;
        return `Phone: ${smsData.phone || 'N/A'}\nMessage: ${smsData.message || 'N/A'}`;
      case 'event':
        const eventData = item.data as any;
        return `Title: ${eventData.title || 'N/A'}\nLocation: ${eventData.location || 'N/A'}`;
      default:
        return '';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View entering={SlideInDown.duration(440).easing(Easing.out(Easing.cubic))} style={styles.modal}>
          <View style={styles.handle} />
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SCANNED</Text>
            </View>

            <View style={styles.previewContainer}>
              <View style={styles.qrTile}>
                <CustomQR
                  value={buildQrPayload(item.type as any, item.data)}
                  size={190}
                  foregroundColor={item.style.foregroundColor}
                  backgroundColor={item.style.backgroundColor}
                  cellShape={item.style.cellShape}
                  eyeShape={item.style.eyeShape}
                  errorCorrectionLevel={'H'}
                  quietZone={16}
                  gradient={null}
                  centerLogo={null}
                />
              </View>
            </View>

            <View style={styles.typeContainer}>
              <View style={styles.typeIconContainer}>{getTypeIcon()}</View>
              <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.contentLabel}>CONTENT</Text>
              <Text style={styles.contentText}>{getContent()}</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <GradientButton title="Close" onPress={onClose} variant="glass" style={styles.button} />
            <GradientButton
              title="Save"
              onPress={() => {
                onSave(item);
                onClose();
              }}
              style={styles.button}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 3, 10, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.surfaceSolid,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    paddingBottom: theme.spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  scrollView: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary + '22',
    borderColor: theme.colors.primary + '55',
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.pill,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 2,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  qrTile: {
    backgroundColor: theme.colors.tile,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '1F',
  },
  typeLabel: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  contentContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.md,
  },
  contentLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
  },
});

export default ScanResultModal;
