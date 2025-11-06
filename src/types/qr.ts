export type QRType = 'wifi' | 'text' | 'link' | 'vcard' | 'email' | 'phone' | 'sms' | 'event';

export enum CellShape {
  Square = 'square',
  Circle = 'circle',
  RoundedSquareSlight = 'rounded-square-slight',
  RoundedSquareFull = 'rounded-square-full',
  RoundedTopLeftBottomRight = 'rounded-top-left-bottom-right',
  RoundedTopRightBottomLeft = 'rounded-top-right-bottom-left',
  VerticalLines = 'vertical-lines',
  HorizontalLines = 'horizontal-lines',
}

export enum EyeShape {
  Square = 'square',
  RoundedSquare = 'rounded-square',
  Circle = 'circle',
  Drop = 'drop',
}

export interface QRStyle {
  foregroundColor: string;
  backgroundColor: string;
  cellShape: CellShape;
  eyeShape: EyeShape;
  logoBase64?: string;
}

export interface QRCodeItem {
  id: string;
  name: string;
  type: QRType;
  data: any;
  style: QRStyle;
  isPinned: boolean;
  createdAt: number;
}
