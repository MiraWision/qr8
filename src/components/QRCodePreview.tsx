import React, { useMemo } from 'react';
import { View, ViewStyle, Text } from 'react-native';
import { QRCodeItem } from '../types/qr';
import CustomQR from './CustomQR';
import { buildQrPayload } from '../utils/qrPayload';

interface Props {
  item: QRCodeItem;
  size?: number;
  style?: ViewStyle;
  quietZone?: number;
}

const QRCodePreview: React.FC<Props> = ({ item, size = 100, style, quietZone }) => {
  const getQRValue = (): string => {
    try {
      switch (item.type) {
        case 'wifi':
          const wifiData = item.data || {};
          return `WIFI:T:${wifiData.encryption || 'WPA'};S:${wifiData.ssid || 'Network'};P:${wifiData.password || ''};;`;
        case 'text':
          return item.data?.text || 'Sample text';
        case 'link':
          return item.data?.url || 'https://example.com';
        case 'vcard':
          const vcardData = item.data || {};
          return `BEGIN:VCARD\nFN:${vcardData.name || 'Contact'}\nTEL:${vcardData.phone || ''}\nEND:VCARD`;
        default:
          return 'https://example.com';
      }
    } catch (error) {
      console.error('Error generating QR value:', error);
      return 'https://example.com';
    }
  };

  const styleSummary = useMemo(() => {
    const cellShapeNames: Record<string, string> = {
      'square': '■',
      'rounded-square-slight': '▦',
      'rounded-square-full': '▢',
      'circle': '●',
    };
    
    const eyeShapeNames: Record<string, string> = {
      'square': 'Square',
      'rounded-square': 'Rounded',
      'circle': 'Circle',
      'drop': 'Drop',
    };

    return {
      cell: cellShapeNames[item.style.cellShape] || '■',
      eye: eyeShapeNames[item.style.eyeShape] || 'Square',
    };
  }, [item.style.cellShape, item.style.eyeShape]);

  const qrValue = useMemo(() => getQRValue(), [item.type, item.data]);
  const qrKey = `${item.style.foregroundColor}-${item.style.backgroundColor}-${item.style.cellShape}-${item.style.eyeShape}-${item.style.logoBase64 ? 'logo' : 'nologo'}`;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <CustomQR
        key={qrKey}
        value={buildQrPayload(item.type as any, item.data)}
        size={size}
        foregroundColor={item.style.foregroundColor}
        backgroundColor={item.style.backgroundColor}
        cellShape={item.style.cellShape}
        eyeShape={item.style.eyeShape}
        errorCorrectionLevel={'Q'}
        quietZone={quietZone !== undefined ? quietZone : (size < 60 ? 4 : 12)}
        gradient={null}
        centerLogo={item.style.logoBase64 ? { width: size * 0.28, height: size * 0.28, borderRadius: 10, bgColor: '#fff', logoBase64: item.style.logoBase64 } : null}
      />
      {item.id === 'preview' && (
        <View style={{ marginTop: 12, alignItems: 'center', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            Colors: {item.style.foregroundColor} / {item.style.backgroundColor}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QRCodePreview;
