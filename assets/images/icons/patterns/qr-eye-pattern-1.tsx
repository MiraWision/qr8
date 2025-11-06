import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QREyePattern1Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M22 2H2V22H22V2ZM24 0V24H0V0H24Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5 5H19V19H5V5ZM7 7V17H17V7H7Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M7 7H17V17H7V7Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QREyePattern1Icon };
