import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EmailFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: EmailFormData;
  onChange: (data: EmailFormData) => void;
}

const EmailForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={data.email}
          onChangeText={(email) => onChange({ ...data, email })}
          placeholder="example@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={data.subject}
          onChangeText={(subject) => onChange({ ...data, subject })}
          placeholder="Optional subject"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Body</Text>
        <TextInput
          style={styles.textArea}
          value={data.body}
          onChangeText={(body) => onChange({ ...data, body })}
          placeholder="Optional message"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
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
  textArea: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 100,
    color: theme.colors.text,
  },
});

export default EmailForm;

