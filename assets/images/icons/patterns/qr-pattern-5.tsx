import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRPattern5Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M0 8V6C0 4.89543 0.895431 4 2 4H16V8H0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 12V8H24V10C24 11.1046 23.1046 12 22 12H12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M0 24V22C0 20.8954 0.895431 20 2 20H12V22C12 23.1046 11.1046 24 10 24H0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 14V16H6C7.10457 16 8 15.1046 8 14V12H6C4.89543 12 4 12.8954 4 14Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 22V24H18C19.1046 24 20 23.1046 20 22V20H18C16.8954 20 16 20.8954 16 22Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 18V20H12V16H10C8.89543 16 8 16.8954 8 18Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 12V14C16 15.1046 16.8954 16 18 16C19.1046 16 20 15.1046 20 14V12H16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 2V4H8V0H6C4.89543 0 4 0.895431 4 2Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 2V4H22C23.1046 4 24 3.10457 24 2V0H22C20.8954 0 20 0.895431 20 2Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRPattern5Icon };
