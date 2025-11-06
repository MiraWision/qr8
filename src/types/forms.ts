export interface WiFiFormData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WPA2' | 'WEP' | 'None';
}

export interface LinkFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface VCardFormData {
  name: string;
  phone: string;
  email: string;
  company?: string;
}

export interface EmailFormData {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface SMSFormData {
  phone: string;
  message?: string;
}

export interface EventFormData {
  title: string;
  location?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export type QRFormData = WiFiFormData | LinkFormData | TextFormData | VCardFormData | EmailFormData | PhoneFormData | SMSFormData | EventFormData;

import { CellShape, EyeShape } from './qr';

export interface QRStyleConfig {
  foregroundColor: string;
  backgroundColor: string;
  cellShape: CellShape;
  eyeShape: EyeShape;
  logoBase64?: string;
}
