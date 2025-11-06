import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRTextIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5.5 7C5.5 6.72386 5.72386 6.5 6 6.5H18C18.2761 6.5 18.5 6.72386 18.5 7C18.5 7.27614 18.2761 7.5 18 7.5H6C5.72386 7.5 5.5 7.27614 5.5 7Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5.5 10C5.5 9.72386 5.72386 9.5 6 9.5H18C18.2761 9.5 18.5 9.72386 18.5 10C18.5 10.2761 18.2761 10.5 18 10.5H6C5.72386 10.5 5.5 10.2761 5.5 10Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5.5 13C5.5 12.7239 5.72386 12.5 6 12.5H18C18.2761 12.5 18.5 12.7239 18.5 13C18.5 13.2761 18.2761 13.5 18 13.5H6C5.72386 13.5 5.5 13.2761 5.5 13Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5.5 16C5.5 15.7239 5.72386 15.5 6 15.5H14C14.2761 15.5 14.5 15.7239 14.5 16C14.5 16.2761 14.2761 16.5 14 16.5H6C5.72386 16.5 5.5 16.2761 5.5 16Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRTextIcon };
