import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { QRCodeItem } from '../types/qr';
import QRCodePreview from './QRCodePreview';
import GlassCard from './ui/GlassCard';
import PressableScale from './ui/PressableScale';
import { theme } from '../theme';
import { QRWiFiIcon } from '../../assets/images/icons/qr-types/qr-wifi';
import { QRVCardIcon } from '../../assets/images/icons/qr-types/qr-vcard';
import { QRTextIcon } from '../../assets/images/icons/qr-types/qr-text';
import { QRSMSIcon } from '../../assets/images/icons/qr-types/qr-sms';
import { QRPhoneIcon } from '../../assets/images/icons/qr-types/qr-phone';
import { QRWebIcon } from '../../assets/images/icons/qr-types/qr-web';
import { QREmailIcon } from '../../assets/images/icons/qr-types/qr-email';
import { QREventIcon } from '../../assets/images/icons/qr-types/qr-event';
import { PinIcon } from '../../assets/images/icons/actions/pin-icon';

interface Props {
  item: QRCodeItem;
  onPress: (item: QRCodeItem) => void;
  compact?: boolean;
  index?: number;
}

const QRCodeCard: React.FC<Props> = ({ item, onPress, index = 0 }) => {
  const getTypeIcon = (size = 13) => {
    const c = theme.colors.primaryLight;
    switch (item.type) {
      case 'wifi':
        return <QRWiFiIcon size={size} color={c} />;
      case 'text':
        return <QRTextIcon size={size} color={c} />;
      case 'link':
        return <QRWebIcon size={size} color={c} />;
      case 'vcard':
        return <QRVCardIcon size={size} color={c} />;
      case 'email':
        return <QREmailIcon size={size} color={c} />;
      case 'phone':
        return <QRPhoneIcon size={size} color={c} />;
      case 'sms':
        return <QRSMSIcon size={size} color={c} />;
      case 'event':
        return <QREventIcon size={size} color={c} />;
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 45).duration(500).easing(Easing.out(Easing.cubic))}>
      <PressableScale onPress={() => onPress(item)} activeScale={0.95}>
        <GlassCard radius={theme.borderRadius.lg} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={[styles.tile, { backgroundColor: item.style?.backgroundColor || theme.colors.tile }]}>
              <QRCodePreview item={item} size={92} quietZone={2} />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.typeChip}>
                {getTypeIcon()}
                <Text style={styles.typeText}>{getTypeLabel()}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>

          {item.isPinned && (
            <View style={styles.pinBadge}>
              <PinIcon size={12} color={theme.colors.onPrimary} />
            </View>
          )}
        </GlassCard>
      </PressableScale>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  cardInner: {
    padding: theme.spacing.md - 2,
    alignItems: 'center',
  },
  tile: {
    borderRadius: theme.borderRadius.md,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    alignSelf: 'stretch',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '1F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.pill,
  },
  typeText: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 0.2,
  },
  date: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textTertiary,
  },
  pinBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default QRCodeCard;
