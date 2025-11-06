import { Wing } from '@lib/wings';
import { useWing } from '@lib/react-wings';
import { UserState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ExampleService extends Wing<UserState> {
  private storageKey = 'USER_DATA';

  constructor() {
    super({
      currentUser: null,
      isAuthenticated: false,
    }, {
      enabled: true,
      cacheKeys: ['currentUser', 'isAuthenticated'],
      storageKey: 'example-service-cache',
      version: '1.0.0'
    });

    this.loadUser();
  }

  async loadUser(): Promise<void> {
    try {
      const userData = await AsyncStorage.getItem(this.storageKey);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        this.setState({
          currentUser: parsedUser,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async saveUser(user: { id: string; name: string; email: string }): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(user));
      this.setState({
        currentUser: user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
      this.setState({
        currentUser: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  getCurrentUser() {
    return this.getState().currentUser;
  }

  isAuthenticated(): boolean {
    return this.getState().isAuthenticated;
  }
}

const exampleService = new ExampleService();

const useExample = () => useWing<UserState, ExampleService>(exampleService);

export { exampleService, useExample };
