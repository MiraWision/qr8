export const COLOR_PRESETS = {
  foreground: [
    '#000000',
    '#FFFFFF',
    '#007AFF',
    '#34C759',
    '#FF9500',
    '#FF3B30',
    '#AF52DE',
    '#5856D6',
  ],
  background: [
    '#FFFFFF',
    '#000000',
    '#F5F5F5',
    '#E5E5EA',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ],
};

export const getColorName = (color: string): string => {
  const presets: Record<string, string> = {
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#007AFF': 'Blue',
    '#34C759': 'Green',
    '#FF9500': 'Orange',
    '#FF3B30': 'Red',
    '#AF52DE': 'Purple',
    '#5856D6': 'Indigo',
  };
  return presets[color] || color;
};
