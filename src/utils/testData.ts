import { QRCodeItem, CellShape, EyeShape } from '../types/qr';
import { qrStorageService } from '../services/QRStorageService';

export const createTestData = async (): Promise<void> => {
  await qrStorageService.init();

  const existing = await qrStorageService.getAll();
  if (existing.length > 0) {
    console.log('Test data already exists');
    return;
  }

  const testItems: QRCodeItem[] = [
    {
      id: '1',
      name: 'WiFi Home',
      type: 'wifi',
      data: {
        ssid: 'MyNetwork',
        password: 'password123',
        encryption: 'WPA',
      },
      style: {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cellShape: CellShape.Square,
        eyeShape: EyeShape.Square,
      },
      isPinned: true,
      createdAt: Date.now() - 86400000,
    },
    {
      id: '2',
      name: 'Website Link',
      type: 'link',
      data: {
        url: 'https://example.com',
      },
      style: {
        foregroundColor: '#1a1a1a',
        backgroundColor: '#FFFFFF',
        cellShape: CellShape.RoundedSquareSlight,
        eyeShape: EyeShape.RoundedSquare,
      },
      isPinned: true,
      createdAt: Date.now() - 43200000,
    },
    {
      id: '3',
      name: 'Important Note',
      type: 'text',
      data: {
        text: 'This is an important note that needs to be remembered',
      },
      style: {
        foregroundColor: '#0066FF',
        backgroundColor: '#FFFFFF',
        cellShape: CellShape.Square,
        eyeShape: EyeShape.Square,
      },
      isPinned: false,
      createdAt: Date.now() - 21600000,
    },
    {
      id: '4',
      name: 'Business Card',
      type: 'vcard',
      data: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
      },
      style: {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cellShape: CellShape.RoundedSquareSlight,
        eyeShape: EyeShape.RoundedSquare,
      },
      isPinned: false,
      createdAt: Date.now() - 10800000,
    },
  ];

  for (const item of testItems) {
    await qrStorageService.add(item);
  }

  console.log('Test data created successfully');
};
