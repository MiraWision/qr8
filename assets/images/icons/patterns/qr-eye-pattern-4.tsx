import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QREyePattern4Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 2H4C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H22V4C22 2.89543 21.1046 2 20 2ZM4 0H20C22.2091 0 24 1.79086 24 4V24H4C1.79086 24 0 22.2091 0 20V4C0 1.79086 1.79086 0 4 0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5 8C5 6.34315 6.34315 5 8 5H16C17.6569 5 19 6.34315 19 8V19H8C6.34315 19 5 17.6569 5 16V8ZM8 7C7.44772 7 7 7.44772 7 8V16C7 16.5523 7.44772 17 8 17H17V8C17 7.44772 16.5523 7 16 7H8Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M7 7H17V17H7V7Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QREyePattern4Icon };
