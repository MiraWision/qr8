import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { QRCodeItem } from '../types/qr';
import { qrStorageService } from '../services/QRStorageService';
import QRCodeCard from '../components/QRCodeCard';
import QRCodeModal from '../components/QRCodeModal';
import AmbientBackground from '../components/ui/AmbientBackground';
import GradientButton from '../components/ui/GradientButton';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = theme.spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - theme.spacing.md * 2 - COLUMN_GAP) / 2;

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<QRCodeItem[]>([]);
  const [pinnedItems, setPinnedItems] = useState<QRCodeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<QRCodeItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      await qrStorageService.init();
      const all = await qrStorageService.getAll();
      const pinned = await qrStorageService.getPinned();
      const allItems = [...pinned, ...all.filter((item) => !item.isPinned)];
      setItems(allItems);
      setPinnedItems(pinned);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, []);

  const handleItemPress = (item: QRCodeItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handlePin = async (id: string) => {
    await qrStorageService.pin(id);
    await loadItems();
  };

  const handleUnpin = async (id: string) => {
    await qrStorageService.unpin(id);
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    await qrStorageService.remove(id);
    await loadItems();
  };

  const renderItem = ({ item, index }: { item: QRCodeItem; index: number }) => (
    <View style={{ width: CARD_WIDTH }}>
      <QRCodeCard item={item} onPress={handleItemPress} index={index} />
    </View>
  );

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
      <View style={styles.titleRow}>
        <Image
          source={require('../../assets/images/logos/qr8-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Library</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>total</Text>
        </View>
        {pinnedItems.length > 0 && (
          <View style={[styles.statBadge, styles.statBadgePinned]}>
            <Text style={[styles.statNumber, styles.statNumberPinned]}>{pinnedItems.length}</Text>
            <Text style={[styles.statLabel, styles.statLabelPinned]}>pinned</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <AmbientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Animated.View entering={FadeIn.delay(150)} style={styles.emptyContainer}>
              <Image
                source={require('../../assets/images/logos/qr8-logo.png')}
                style={styles.emptyLogo}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No QR codes yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the button below to craft your first beautiful QR code
              </Text>
              <GradientButton
                title="Create QR Code"
                onPress={() => navigation.navigate('Create')}
                style={styles.emptyButton}
              />
            </Animated.View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primaryLight}
              colors={[theme.colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <QRCodeModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleModalClose}
          onPin={handlePin}
          onUnpin={handleUnpin}
          onDelete={handleDelete}
        />
      </SafeAreaView>
    </AmbientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 130,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm + 2,
  },
  logo: {
    width: 44,
    height: 44,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: theme.fonts.family,
    color: theme.colors.primaryLight,
    letterSpacing: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: theme.fonts.sizes.xxl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md - 2,
    paddingVertical: theme.spacing.xs + 2,
    alignItems: 'center',
    minWidth: 52,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  statBadgePinned: {
    backgroundColor: theme.colors.primary + '22',
    borderColor: theme.colors.primary + '55',
  },
  statNumber: {
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    lineHeight: 22,
  },
  statNumberPinned: {
    color: theme.colors.primaryLight,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textTertiary,
    marginTop: -2,
  },
  statLabelPinned: {
    color: theme.colors.primaryLight,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: COLUMN_GAP,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  emptyLogo: {
    width: 110,
    height: 110,
    marginBottom: theme.spacing.lg,
    opacity: 0.85,
  },
  emptyText: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    minWidth: 220,
  },
});

export default LibraryScreen;
