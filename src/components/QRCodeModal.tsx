import React from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { View, Text, Modal, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, Easing } from 'react-native-reanimated';
import QRCodePreview from './QRCodePreview';
import CustomQR, { CustomQRHandle } from './CustomQR';
import GradientButton from './ui/GradientButton';
import PressableScale from './ui/PressableScale';
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

const QRCodeModal: React.FC<Props> = ({ visible, item, onClose, onPin, onUnpin, onDelete }) => {
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
    Alert.alert('Delete QR Code', `Are you sure you want to delete "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await onDelete(item.id);
          onClose();
        },
      },
    ]);
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
    const rows: { label: string; value: string }[] = [];
    switch (item.type) {
      case 'wifi':
        rows.push({ label: 'Network', value: item.data.ssid });
        rows.push({ label: 'Encryption', value: item.data.encryption });
        break;
      case 'text':
        rows.push({ label: 'Text', value: item.data.text });
        break;
      case 'link':
        rows.push({ label: 'URL', value: item.data.url });
        break;
      case 'vcard':
        rows.push({ label: 'Name', value: item.data.name });
        if (item.data.phone) rows.push({ label: 'Phone', value: item.data.phone });
        if (item.data.email) rows.push({ label: 'Email', value: item.data.email });
        break;
      case 'email':
        rows.push({ label: 'To', value: item.data.email });
        if (item.data.subject) rows.push({ label: 'Subject', value: item.data.subject });
        if (item.data.body) rows.push({ label: 'Body', value: item.data.body });
        break;
      case 'phone':
        rows.push({ label: 'Phone', value: item.data.phone });
        break;
      case 'sms':
        rows.push({ label: 'To', value: item.data.phone });
        if (item.data.message) rows.push({ label: 'Message', value: item.data.message });
        break;
      case 'event':
        rows.push({ label: 'Title', value: item.data.title });
        if (item.data.location) rows.push({ label: 'Location', value: item.data.location });
        if (item.data.startDate) rows.push({ label: 'Start', value: item.data.startDate });
        if (item.data.endDate) rows.push({ label: 'End', value: item.data.endDate });
        if (item.data.description) rows.push({ label: 'Description', value: item.data.description });
        break;
    }
    return (
      <View style={styles.dataSection}>
        {rows.map((r, i) => (
          <View key={i} style={styles.dataRow}>
            <Text style={styles.dataLabel}>{r.label}</Text>
            <Text style={styles.dataValue}>{r.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View entering={FadeInDown.duration(420).easing(Easing.out(Easing.cubic))} style={styles.modal}>
          <View style={styles.handle} />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
              <PressableScale onPress={onClose} style={styles.closeButton} activeScale={0.85}>
                <Text style={styles.closeIcon}>✕</Text>
              </PressableScale>
            </View>

            <View style={styles.qrContainer}>
              <View style={[styles.qrTile, { backgroundColor: item.style?.backgroundColor || theme.colors.tile }]}>
                <QRCodePreview item={item} size={210} />
              </View>
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
              <GradientButton
                title={item.isPinned ? 'Unpin' : 'Pin'}
                onPress={handlePin}
                variant="glass"
                size="md"
                icon={<PinIcon size={18} color={theme.colors.text} />}
                style={styles.actionBtn}
              />
              <GradientButton
                title="Share"
                onPress={handleShare}
                size="md"
                icon={<ShareIcon size={18} color={theme.colors.onPrimary} />}
                style={styles.actionBtn}
              />
              <GradientButton
                title="Delete"
                onPress={handleDelete}
                variant="danger"
                size="md"
                icon={<DeleteIcon size={18} color={theme.colors.onPrimary} />}
                style={styles.actionBtn}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 3, 10, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modal: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.medium,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10,
  },
  scrollView: {
    paddingHorizontal: theme.spacing.lg,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    flex: 1,
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
    marginLeft: theme.spacing.sm,
  },
  closeIcon: {
    fontSize: 16,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  qrTile: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  dataSection: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  dataRow: {
    paddingVertical: theme.spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
  },
  dataLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 0.5,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});

export default QRCodeModal;
