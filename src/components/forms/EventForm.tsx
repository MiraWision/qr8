import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EventFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
}

const EventForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={data.title}
          onChangeText={(title) => onChange({ ...data, title })}
          placeholder="Event title"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={data.location}
          onChangeText={(location) => onChange({ ...data, location })}
          placeholder="Event location"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={data.description}
          onChangeText={(description) => onChange({ ...data, description })}
          placeholder="Event description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          value={data.startDate}
          onChangeText={(startDate) => onChange({ ...data, startDate })}
          placeholder="YYYYMMDDTHHmmss"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          value={data.endDate}
          onChangeText={(endDate) => onChange({ ...data, endDate })}
          placeholder="YYYYMMDDTHHmmss"
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

export default EventForm;

