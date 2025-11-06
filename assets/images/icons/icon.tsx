import React from 'react';
import Svg, { G, SvgProps } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
}

export const Icon: React.FC<SvgProps & IconProps> = ({ 
  children, 
  size = 24, 
  color = '#9CA3AF',
  ...props 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <G>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              fill: color,
            } as any);
          }
          return child;
        })}
      </G>
    </Svg>
  );
};

