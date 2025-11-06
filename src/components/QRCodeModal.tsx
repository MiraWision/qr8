import React from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import QRCodePreview from './QRCodePreview';
import CustomQR, { CustomQRHandle } from './CustomQR';
import { buildQrPayload } from '../utils/qrPayload';
import { QRCodeItem } from '../types/qr';
import { theme } from '../theme';
import { PinIcon } from '../../assets/images/icons/actions/pin-icon';
import { ShareIcon } from '../../assets/images/icons/actions/share-icon';
import { DeleteIcon } from '../../assets/images/icons/actions/delete-icon';

interface Props {
  visible: boolean;
  item: QRCodeItem | null;
  onClose: () => void;
  onPin: (id: string) => Promise<void>;
  onUnpin: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const QRCodeModal: React.FC<Props> = ({ 
  visible, 
  item, 
  onClose, 
  onPin, 
  onUnpin, 
  onDelete 
}) => {
  const qrRef = React.useRef<View>(null);
  const exportQrRef = React.useRef<CustomQRHandle>(null);

  if (!item) return null;

  const handlePin = async () => {
    if (item.isPinned) {
      await onUnpin(item.id);
    } else {
      await onPin(item.id);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete QR Code',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await onDelete(item.id);
            onClose();
          }
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const base64 = await exportQrRef.current?.exportAsPng({ width: 1024, height: 1024 });
      if (!base64) return;
      const cacheDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
      const fileUri = `${cacheDir}qr_share_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' as any });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
      console.error('Error sharing:', error);
    }
  };

  const getDecodedData = () => {
    switch (item.type) {
      case 'wifi':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>WiFi Details:</Text>
            <Text style={styles.dataRow}>SSID: {item.data.ssid}</Text>
            <Text style={styles.dataRow}>Encryption: {item.data.encryption}</Text>
          </View>
        );
      case 'text':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>Text:</Text>
            <Text style={styles.dataContent}>{item.data.text}</Text>
          </View>
        );
      case 'link':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>URL:</Text>
            <Text style={styles.dataContent}>{item.data.url}</Text>
          </View>
        );
      case 'vcard':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>Contact:</Text>
            <Text style={styles.dataRow}>Name: {item.data.name}</Text>
            {item.data.phone && <Text style={styles.dataRow}>Phone: {item.data.phone}</Text>}
            {item.data.email && <Text style={styles.dataRow}>Email: {item.data.email}</Text>}
          </View>
        );
      case 'email':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>Email:</Text>
            <Text style={styles.dataRow}>To: {item.data.email}</Text>
            {item.data.subject && <Text style={styles.dataRow}>Subject: {item.data.subject}</Text>}
            {item.data.body && <Text style={styles.dataContent}>Body: {item.data.body}</Text>}
          </View>
        );
      case 'phone':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>Phone:</Text>
            <Text style={styles.dataRow}>{item.data.phone}</Text>
          </View>
        );
      case 'sms':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>SMS:</Text>
            <Text style={styles.dataRow}>To: {item.data.phone}</Text>
            {item.data.message && <Text style={styles.dataContent}>Message: {item.data.message}</Text>}
          </View>
        );
      case 'event':
        return (
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>Event:</Text>
            <Text style={styles.dataRow}>Title: {item.data.title}</Text>
            {item.data.location && <Text style={styles.dataRow}>Location: {item.data.location}</Text>}
            {item.data.startDate && <Text style={styles.dataRow}>Start: {item.data.startDate}</Text>}
            {item.data.endDate && <Text style={styles.dataRow}>End: {item.data.endDate}</Text>}
            {item.data.description && <Text style={styles.dataContent}>Description: {item.data.description}</Text>}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>{item.name}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer} ref={qrRef}>
              <QRCodePreview item={item} size={200} />
            </View>
            <View style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, opacity: 0 }}>
              <CustomQR
                ref={exportQrRef}
                value={buildQrPayload(item.type as any, item.data)}
                size={1024}
                foregroundColor={item.style.foregroundColor}
                backgroundColor={item.style.backgroundColor}
                cellShape={item.style.cellShape}
                eyeShape={item.style.eyeShape}
                errorCorrectionLevel={'Q'}
                quietZone={32}
                gradient={null}
                centerLogo={item.style.logoBase64 ? { width: 256, height: 256, borderRadius: 16, bgColor: '#fff', logoBase64: item.style.logoBase64 } : null}
              />
            </View>

            {getDecodedData()}

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.button, styles.pinButton]} 
                onPress={handlePin}
              >
                <PinIcon size={20} color={theme.colors.background} />
                <Text style={styles.buttonText}>
                  {item.isPinned ? 'Unpin' : 'Pin'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.shareButton]} 
                onPress={handleShare}
              >
                <ShareIcon size={20} color={theme.colors.background} />
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={handleDelete}
              >
                <DeleteIcon size={20} color={theme.colors.background} />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    maxHeight: '85%',
    ...theme.shadows.medium,
  },
  scrollView: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  closeIcon: {
    fontSize: 24,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  dataSection: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  dataTitle: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  dataRow: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  dataContent: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    minHeight: 44,
  },
  pinButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    ...theme.shadows.small,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
  },
});

export default QRCodeModal;
