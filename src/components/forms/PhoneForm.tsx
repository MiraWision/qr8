import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { PhoneFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: PhoneFormData;
  onChange: (data: PhoneFormData) => void;
}

const PhoneForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={data.phone}
          onChangeText={(phone) => onChange({ phone })}
          placeholder="+1234567890"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
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
});

export default PhoneForm;

