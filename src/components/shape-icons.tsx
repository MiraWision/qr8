import React from 'react';
import { View } from 'react-native';
import { CellShape, EyeShape } from '../types/qr';
import { QRPattern1Icon } from '../../assets/images/icons/patterns/qr-pattern-1';
import { QRPattern2Icon } from '../../assets/images/icons/patterns/qr-pattern-2';
import { QRPattern3Icon } from '../../assets/images/icons/patterns/qr-pattern-3';
import { QRPattern4Icon } from '../../assets/images/icons/patterns/qr-pattern-4';
import { QRPattern5Icon } from '../../assets/images/icons/patterns/qr-pattern-5';
import { QRPattern6Icon } from '../../assets/images/icons/patterns/qr-pattern-6';
import { QRPattern7Icon } from '../../assets/images/icons/patterns/qr-pattern-7';
import { QRPattern8Icon } from '../../assets/images/icons/patterns/qr-pattern-8';
import { QREyePattern1Icon } from '../../assets/images/icons/patterns/qr-eye-pattern-1';
import { QREyePattern2Icon } from '../../assets/images/icons/patterns/qr-eye-pattern-2';
import { QREyePattern3Icon } from '../../assets/images/icons/patterns/qr-eye-pattern-3';
import { QREyePattern4Icon } from '../../assets/images/icons/patterns/qr-eye-pattern-4';

export const CellShapeIcon: React.FC<{ shape: CellShape }> = ({ shape }) => {
  const renderCell = () => {
    switch (shape) {
      case CellShape.Square:
        return <QRPattern1Icon size={18} color="#1a1a1a" />;
      case CellShape.RoundedSquareSlight:
        return <QRPattern2Icon size={18} color="#1a1a1a" />;
      case CellShape.RoundedSquareFull:
        return <QRPattern3Icon size={18} color="#1a1a1a" />;
      case CellShape.Circle:
        return <QRPattern4Icon size={18} color="#1a1a1a" />;
      case CellShape.RoundedTopLeftBottomRight:
        return <QRPattern5Icon size={18} color="#1a1a1a" />;
      case CellShape.RoundedTopRightBottomLeft:
        return <QRPattern6Icon size={18} color="#1a1a1a" />;
      case CellShape.HorizontalLines:
        return <QRPattern7Icon size={18} color="#1a1a1a" />;
      case CellShape.VerticalLines:
        return <QRPattern8Icon size={18} color="#1a1a1a" />;
      default:
        return <QRPattern1Icon size={18} color="#1a1a1a" />;
    }
  };

  return <View>{renderCell()}</View>;
};

export const EyeShapeIcon: React.FC<{ shape: EyeShape }> = ({ shape }) => {
  const renderEye = () => {
    switch (shape) {
      case EyeShape.Square:
        return <QREyePattern1Icon size={22} color="#1a1a1a" />;
      case EyeShape.RoundedSquare:
        return <QREyePattern2Icon size={22} color="#1a1a1a" />;
      case EyeShape.Circle:
        return <QREyePattern3Icon size={22} color="#1a1a1a" />;
      case EyeShape.Drop:
        return <QREyePattern4Icon size={22} color="#1a1a1a" />;
      default:
        return <QREyePattern1Icon size={22} color="#1a1a1a" />;
    }
  };

  return <View>{renderEye()}</View>;
};
