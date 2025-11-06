import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QRPattern2Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 5C16 4.44772 15.5523 4 15 4H1C0.447715 4 0 4.44772 0 5V7C0 7.55228 0.447715 8 1 8H16V5Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 11C12 11.5523 12.4477 12 13 12H23C23.5523 12 24 11.5523 24 11V9C24 8.44772 23.5523 8 23 8H12V11Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M1 20C0.447715 20 0 20.4477 0 21V23C0 23.5523 0.447715 24 1 24H11C11.5523 24 12 23.5523 12 23V20H1Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4 13V15C4 15.5523 4.44772 16 5 16H7C7.55228 16 8 15.5523 8 15V13C8 12.4477 7.55228 12 7 12H5C4.44772 12 4 12.4477 4 13Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 21V23C16 23.5523 16.4477 24 17 24H19C19.5523 24 20 23.5523 20 23V21C20 20.4477 19.5523 20 19 20H17C16.4477 20 16 20.4477 16 21Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12 17C12 16.4477 11.5523 16 11 16H9C8.44772 16 8 16.4477 8 17V20H12V17Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M16 12H20V15C20 15.5523 19.5523 16 19 16H17C16.4477 16 16 15.5523 16 15V12Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M8 1C8 0.447715 7.55228 0 7 0H5C4.44772 0 4 0.447715 4 1V4H8V1Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 1V3C20 3.55228 20.4477 4 21 4H23C23.5523 4 24 3.55228 24 3V1C24 0.447715 23.5523 0 23 0H21C20.4477 0 20 0.447715 20 1Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QRPattern2Icon };
