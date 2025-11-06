import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRPattern1Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M0 8V4H16V8H0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 12V8H24V12H12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M0 24V20H12V24H0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 16H8V12H4V16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 24H20V20H16V24Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 20H12V16H8V20Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 16H20V12H16V16Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 4H8V0H4V4Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 4H24V0H20V4Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRPattern1Icon };
