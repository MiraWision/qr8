import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { VCardFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: VCardFormData;
  onChange: (data: VCardFormData) => void;
}

const VCardForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={data.name}
          onChangeText={(name) => onChange({ ...data, name })}
          placeholder="John Doe"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={data.phone}
          onChangeText={(phone) => onChange({ ...data, phone })}
          placeholder="+1234567890"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={data.email}
          onChangeText={(email) => onChange({ ...data, email })}
          placeholder="john@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.input}
          value={data.company || ''}
          onChangeText={(company) => onChange({ ...data, company })}
          placeholder="Company Name"
          placeholderTextColor="#999"
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

export default VCardForm;
