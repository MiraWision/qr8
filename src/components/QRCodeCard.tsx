import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QRCodeItem } from '../types/qr';
import QRCodePreview from './QRCodePreview';
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
}

const QRCodeCard: React.FC<Props> = ({ item, onPress, compact = false }) => {
  const getTypeIcon = () => {
    const iconColor = compact ? theme.colors.primary : theme.colors.textSecondary;
    const iconSize = compact ? 12 : 14;
    switch (item.type) {
      case 'wifi':
        return <QRWiFiIcon size={iconSize} color={iconColor} />;
      case 'text':
        return <QRTextIcon size={iconSize} color={iconColor} />;
      case 'link':
        return <QRWebIcon size={iconSize} color={iconColor} />;
      case 'vcard':
        return <QRVCardIcon size={iconSize} color={iconColor} />;
      case 'email':
        return <QREmailIcon size={iconSize} color={iconColor} />;
      case 'phone':
        return <QRPhoneIcon size={iconSize} color={iconColor} />;
      case 'sms':
        return <QRSMSIcon size={iconSize} color={iconColor} />;
      case 'event':
        return <QREventIcon size={iconSize} color={iconColor} />;
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
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}w`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.card, styles.cardCompact]} 
        onPress={() => onPress(item)} 
        activeOpacity={0.7}
      >
        <View style={styles.previewContainerCompact}>
          <QRCodePreview item={item} size={52} quietZone={4} />
        </View>
        <View style={styles.infoContainerCompact}>
          <Text style={styles.nameCompact} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.metaContainerCompact}>
            <View style={{ marginRight: 4 }}>{getTypeIcon()}</View>
            <Text style={styles.typeCompact}>{getTypeLabel()}</Text>
            <Text style={styles.dateCompact}> • {formatDate(item.createdAt)}</Text>
          </View>
        </View>
        {item.isPinned && (
          <View style={styles.pinBadgeCompact}>
            <PinIcon size={14} color={theme.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.previewContainer}>
        <QRCodePreview item={item} size={56} quietZone={6} />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaContainer}>
          <View style={{ marginRight: 6 }}>{getTypeIcon()}</View>
          <Text style={styles.type}>{getTypeLabel()}</Text>
          <Text style={styles.date}> • {formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {item.isPinned && (
        <View style={styles.pinBadge}>
          <PinIcon size={16} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm + 2,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
    position: 'relative',
  },
  cardCompact: {
    padding: theme.spacing.sm,
    marginBottom: 0,
    borderColor: theme.colors.primary + '30',
    backgroundColor: theme.colors.background,
  },
  previewContainer: {
    marginRight: theme.spacing.sm + 2,
  },
  previewContainerCompact: {
    marginRight: theme.spacing.sm,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoContainerCompact: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  nameCompact: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.regular,
  },
  typeCompact: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.regular,
  },
  date: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textTertiary,
    fontWeight: theme.fonts.weights.regular,
  },
  dateCompact: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textTertiary,
    fontWeight: theme.fonts.weights.regular,
  },
  pinBadge: {
    position: 'absolute',
    top: theme.spacing.xs + 2,
    right: theme.spacing.xs + 2,
  },
  pinBadgeCompact: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
  },
});

export default QRCodeCard;
