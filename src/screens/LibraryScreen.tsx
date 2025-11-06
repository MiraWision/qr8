import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { QRCodeItem } from '../types/qr';
import { qrStorageService } from '../services/QRStorageService';
import QRCodeCard from '../components/QRCodeCard';
import QRCodeModal from '../components/QRCodeModal';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PINNED_CARD_WIDTH = (SCREEN_WIDTH - theme.spacing.md * 3) / 2;

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation();
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
      
      const allItems = [...pinned, ...all.filter(item => !item.isPinned)];
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

  const renderItem = ({ item }: { item: QRCodeItem }) => (
    <View style={{ width: PINNED_CARD_WIDTH }}>
      <QRCodeCard item={item} onPress={handleItemPress} compact />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Image 
            source={require('../../assets/images/logos/qr8-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Library</Text>
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
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image 
              source={require('../../assets/images/logos/qr8-logo.png')} 
              style={styles.emptyLogo}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No QR codes yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first QR code to get started
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 0,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
    gap: theme.spacing.sm,
    flexGrow: 1,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingTop: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: theme.fonts.sizes.xxl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statBadge: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    minWidth: 50,
  },
  statBadgePinned: {
    backgroundColor: theme.colors.primary + '15',
  },
  statNumber: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    lineHeight: 18,
  },
  statNumberPinned: {
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
    marginTop: -2,
  },
  statLabelPinned: {
    color: theme.colors.primary,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: theme.spacing.md,
  },
  emptyLogo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});

export default LibraryScreen;