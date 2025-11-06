import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRPattern6Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M0 4V6C0 7.10457 0.895431 8 2 8H16V6C16 4.89543 15.1046 4 14 4H0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 8V10C12 11.1046 12.8954 12 14 12H24V10C24 8.89543 23.1046 8 22 8H12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 20V24H2C0.895431 24 0 23.1046 0 22V20H12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 12V14C4 15.1046 4.89543 16 6 16H8V14C8 12.8954 7.10457 12 6 12H4Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 20V22C16 23.1046 16.8954 24 18 24H20V22C20 20.8954 19.1046 20 18 20H16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 20H12V18C12 16.8954 11.1046 16 10 16H8V20Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 12V14C16 15.1046 16.8954 16 18 16H20V12H16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 4H8V2C8 0.895431 7.10457 0 6 0H4V4Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 0V2C20 3.10457 20.8954 4 22 4H24V2C24 0.895431 23.1046 0 22 0H20Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRPattern6Icon };
