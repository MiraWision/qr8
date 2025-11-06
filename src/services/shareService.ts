import { captureRef } from 'react-native-view-shot';
import { Share, Alert } from 'react-native';

class ShareService {
  async shareQRCode(qrRef: React.RefObject<any>, name: string): Promise<void> {
    try {
      if (!qrRef.current) {
        Alert.alert('Error', 'QR code is not ready for sharing');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const uri = await captureRef(qrRef.current, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      await Share.share({
        url: uri,
        message: `QR Code: ${name}`,
      });
    } catch (error: any) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share QR code. Please try again.');
    }
  }
}

export const shareService = new ShareService();
