import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
}

/**
 * The signature backdrop: a deep violet-black gradient with two soft
 * ambient glow blobs bleeding in from the corners. Used behind every screen
 * so the whole app feels like one continuous, atmospheric surface.
 */
const AmbientBackground: React.FC<Props> = ({ children }) => {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={theme.gradients.background}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* top-right violet glow */}
      <LinearGradient
        colors={['rgba(168,85,247,0.30)', 'rgba(168,85,247,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.blob, styles.blobTop]}
        pointerEvents="none"
      />
      {/* bottom-left cyan glow */}
      <LinearGradient
        colors={['rgba(34,211,238,0.16)', 'rgba(34,211,238,0)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={[styles.blob, styles.blobBottom]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

const BLOB = width * 1.25;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  blob: {
    position: 'absolute',
    width: BLOB,
    height: BLOB,
    borderRadius: BLOB / 2,
    opacity: 0.9,
  },
  blobTop: {
    top: -BLOB * 0.55,
    right: -BLOB * 0.35,
  },
  blobBottom: {
    bottom: -BLOB * 0.6,
    left: -BLOB * 0.4,
  },
});

export default AmbientBackground;
