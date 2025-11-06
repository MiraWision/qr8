import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { QRCodeItem } from '../types/qr';
import CustomQR from './CustomQR';
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
    switch (item.type) {
      case 'wifi':
        return <QRWiFiIcon size={24} color={theme.colors.primary} />;
      case 'text':
        return <QRTextIcon size={24} color={theme.colors.primary} />;
      case 'link':
        return <QRWebIcon size={24} color={theme.colors.primary} />;
      case 'vcard':
        return <QRVCardIcon size={24} color={theme.colors.primary} />;
      case 'email':
        return <QREmailIcon size={24} color={theme.colors.primary} />;
      case 'phone':
        return <QRPhoneIcon size={24} color={theme.colors.primary} />;
      case 'sms':
        return <QRSMSIcon size={24} color={theme.colors.primary} />;
      case 'event':
        return <QREventIcon size={24} color={theme.colors.primary} />;
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Preview */}
            <View style={styles.previewContainer}>
              <CustomQR
                value={buildQrPayload(item.type as any, item.data)}
                size={200}
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

            {/* Type */}
            <View style={styles.typeContainer}>
              <View style={styles.typeIconContainer}>
                {getTypeIcon()}
              </View>
              <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.contentLabel}>Content:</Text>
              <Text style={styles.contentText}>{getContent()}</Text>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => {
                onSave(item);
                onClose();
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  scrollView: {
    padding: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  typeIconContainer: {
    marginRight: 12,
  },
  typeLabel: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentLabel: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  contentText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  closeButtonText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.background,
  },
});

export default ScanResultModal;
