import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TextFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: TextFormData;
  onChange: (data: TextFormData) => void;
}

const TextForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Text</Text>
        <TextInput
          style={styles.textArea}
          value={data.text}
          onChangeText={(text) => onChange({ text })}
          placeholder="Enter your text"
          placeholderTextColor="#999"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 120,
    color: theme.colors.text,
  },
});

export default TextForm;
