import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { LinkFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: LinkFormData;
  onChange: (data: LinkFormData) => void;
}

const LinkForm: React.FC<Props> = ({ data, onChange }) => {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValid = isValidUrl(data.url);

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>URL</Text>
        <TextInput
          style={[styles.input, !isValid && data.url.length > 0 && styles.inputError]}
          value={data.url}
          onChangeText={(url) => onChange({ url })}
          placeholder="https://example.com"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isValid && data.url.length > 0 && (
          <Text style={styles.errorText}>Please enter a valid URL</Text>
        )}
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
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default LinkForm;
