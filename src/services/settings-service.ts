import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wing } from '@lib/wings';
import { useWing } from '@lib/react-wings';

export type Settings = {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
};

class SettingsService extends Wing<Settings & { requests?: any }> {
  private settingsKey = 'APP_SETTINGS';

  constructor() {
    super({
      theme: 'light',
      language: 'en',
      notifications: true,
    }, {
      enabled: true,
      cacheKeys: ['theme', 'language', 'notifications'],
      storageKey: 'settings-cache',
      version: '1.0.0'
    });

    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    try {
      const settings = await AsyncStorage.getItem(this.settingsKey);
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        this.setState(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = this.getState();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(this.settingsKey, JSON.stringify(newSettings));
      this.setState(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): Settings {
    const state = this.getState();
    return {
      theme: state.theme,
      language: state.language,
      notifications: state.notifications,
    };
  }
}

const settingsService = new SettingsService();

const useSettings = () => useWing<Settings & { requests?: any }, SettingsService>(settingsService);

export { settingsService, useSettings };