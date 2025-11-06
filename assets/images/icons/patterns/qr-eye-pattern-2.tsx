import React from 'react';
import { Path } from 'react-native-svg';

import { Icon, IconProps } from '../icon';

const QREyePattern2Icon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M20 2H4C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V4C22 2.89543 21.1046 2 20 2ZM4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4C0 1.79086 1.79086 0 4 0Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V7ZM17 7H7V17H17V7Z" fill="#9CA3AF"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M7 7H17V17H7V7Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QREyePattern2Icon };
