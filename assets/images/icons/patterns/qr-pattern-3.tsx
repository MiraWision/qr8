import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRPattern3Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 8V6C16 4.89543 15.1046 4 14 4H2C0.895431 4 0 4.89543 0 6C0 7.10457 0.895431 8 2 8H16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 8V10C12 11.1046 12.8954 12 14 12H22C23.1046 12 24 11.1046 24 10C24 8.89543 23.1046 8 22 8H12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M2 20C0.895431 20 0 20.8954 0 22C0 23.1046 0.895431 24 2 24H10C11.1046 24 12 23.1046 12 22V20H2Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 14C8 12.8954 7.10457 12 6 12C4.89543 12 4 12.8954 4 14C4 15.1046 4.89543 16 6 16C7.10457 16 8 15.1046 8 14Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 22C20 20.8954 19.1046 20 18 20C16.8954 20 16 20.8954 16 22C16 23.1046 16.8954 24 18 24C19.1046 24 20 23.1046 20 22Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 18V20H12V18C12 16.8954 11.1046 16 10 16C8.89543 16 8 16.8954 8 18Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 12V14C16 15.1046 16.8954 16 18 16C19.1046 16 20 15.1046 20 14V12H16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 2V4H8V2C8 0.895431 7.10457 0 6 0C4.89543 0 4 0.895431 4 2Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M24 2C24 0.895431 23.1046 0 22 0C20.8954 0 20 0.895431 20 2C20 3.10457 20.8954 4 22 4C23.1046 4 24 3.10457 24 2Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRPattern3Icon };
