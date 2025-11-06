import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { WiFiFormData } from '../../types/forms';
import { theme } from '../../theme';

interface Props {
  data: WiFiFormData;
  onChange: (data: WiFiFormData) => void;
}

const encryptionTypes = ['WPA2', 'WPA', 'WEP', 'None'];

const WiFiForm: React.FC<Props> = ({ data, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>SSID (Network Name)</Text>
        <TextInput
          style={styles.input}
          value={data.ssid}
          onChangeText={(ssid) => onChange({ ...data, ssid })}
          placeholder="Enter WiFi network name"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={data.password}
          onChangeText={(password) => onChange({ ...data, password })}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Encryption Type</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>{data.encryption}</Text>
          <Text style={styles.pickerButtonIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {encryptionTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalOption,
                  data.encryption === type && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onChange({ ...data, encryption: type as any });
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    data.encryption === type && styles.modalOptionTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
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
  pickerButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
  },
  pickerButtonIcon: {
    fontSize: theme.fonts.sizes.xs,
    fontFamily: theme.fonts.family,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    width: '80%',
    overflow: 'hidden',
  },
  modalOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalOptionActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  modalOptionText: {
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
  },
  modalOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.semibold,
  },
});

export default WiFiForm;
