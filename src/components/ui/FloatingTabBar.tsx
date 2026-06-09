import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import PressableScale from './PressableScale';
import { theme } from '../../theme';
import { LibraryIcon } from '../../../assets/images/icons/navigation/library-icon';
import { QRCodeAddIcon } from '../../../assets/images/icons/navigation/qr-code-add-icon';
import { QRCodeScannerIcon } from '../../../assets/images/icons/navigation/qr-code-scanner-icon';

const BAR_HEIGHT = 66;
const FAB_SIZE = 60;

const ICONS: Record<string, (color: string, size: number) => React.ReactNode> = {
  Library: (c, s) => <LibraryIcon size={s} color={c} />,
  Create: (c, s) => <QRCodeAddIcon size={s} color={c} />,
  Scanner: (c, s) => <QRCodeScannerIcon size={s} color={c} />,
};

const SideTab: React.FC<{
  label: string;
  routeName: string;
  focused: boolean;
  onPress: () => void;
}> = ({ label, routeName, focused, onPress }) => {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
  }));

  const color = focused ? theme.colors.primaryLight : theme.colors.textTertiary;

  return (
    <PressableScale onPress={onPress} style={styles.sideTab} activeScale={0.9}>
      <Animated.View style={iconWrapStyle}>{ICONS[routeName]?.(color, 24)}</Animated.View>
      <Text style={[styles.sideLabel, { color }]}>{label}</Text>
      <Animated.View style={[styles.dot, dotStyle]} />
    </PressableScale>
  );
};

const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const pb = Math.max(insets.bottom, 14);

  const onPress = (routeName: string, key: string, isFocused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const focusedKey = state.routes[state.index].key;
  const centerRoute = state.routes.find((r) => r.name === 'Create');
  const sideRoutes = state.routes.filter((r) => r.name !== 'Create');

  return (
    <View style={[styles.wrap, { paddingBottom: pb }]} pointerEvents="box-none">
      <View style={styles.barRow}>
        <View style={styles.bar}>
          <LinearGradient
            colors={['rgba(38,29,54,0.94)', 'rgba(17,11,27,0.94)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {sideRoutes[0] && (
            <SideTab
              label={descriptors[sideRoutes[0].key].options.title ?? sideRoutes[0].name}
              routeName={sideRoutes[0].name}
              focused={focusedKey === sideRoutes[0].key}
              onPress={() => onPress(sideRoutes[0].name, sideRoutes[0].key, focusedKey === sideRoutes[0].key)}
            />
          )}

          {/* reserved gap for the floating center button */}
          <View style={styles.centerSpacer} />

          {sideRoutes[1] && (
            <SideTab
              label={descriptors[sideRoutes[1].key].options.title ?? sideRoutes[1].name}
              routeName={sideRoutes[1].name}
              focused={focusedKey === sideRoutes[1].key}
              onPress={() => onPress(sideRoutes[1].name, sideRoutes[1].key, focusedKey === sideRoutes[1].key)}
            />
          )}
        </View>

        {/* Center create button — overlaid so it is never clipped by the bar */}
        {centerRoute && (
          <PressableScale
            onPress={() => onPress(centerRoute.name, centerRoute.key, focusedKey === centerRoute.key)}
            style={styles.centerWrap}
            activeScale={0.9}
          >
            <LinearGradient
              colors={theme.gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.center}
            >
              <QRCodeAddIcon size={28} color={theme.colors.onPrimary} />
            </LinearGradient>
          </PressableScale>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  barRow: {
    width: '88%',
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: BAR_HEIGHT,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 16,
  },
  sideTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
  },
  sideLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.family,
    letterSpacing: 0.3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.primaryLight,
    marginTop: 1,
  },
  centerSpacer: {
    width: FAB_SIZE + 16,
  },
  centerWrap: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: BAR_HEIGHT / 2 - FAB_SIZE / 2 + 16,
  },
  center: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: theme.colors.background,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default FloatingTabBar;
