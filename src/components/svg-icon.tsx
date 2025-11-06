import React from 'react';
import { SvgXml } from 'react-native-svg';

interface SvgIconProps {
  name: 'arrow-down' | 'arrow-left' | 'arrow-right' | 'home' | 'rotate' | 'settings';
  size?: number;
  color?: string;
}

// SVG content as XML strings
const iconMap = {
  'arrow-down': `<svg width="54" height="66" viewBox="0 0 54 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_923_1177)">
<path d="M3.05366 37.0088C1.55964 38.6358 1.6672 41.1659 3.2939 42.6602L24.2939 61.9463C25.824 63.3515 28.1759 63.3515 29.706 61.9463L50.706 42.6602C52.3327 41.1659 52.4403 38.6358 50.9462 37.0088C49.452 35.3817 46.921 35.2743 45.2939 36.7686L31 49.8955V5C31 2.79086 29.2091 1 27 1C24.7908 1 23 2.79086 23 5V49.8955L8.70601 36.7686C7.07891 35.2743 4.54794 35.3817 3.05366 37.0088Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_923_1177" x="-0.00012207" y="0" width="54.0001" height="66.0001" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_923_1177"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_923_1177" result="shape"/>
</filter>
</defs>
</svg>`,
  'arrow-left': `<svg width="66" height="54" viewBox="0 0 66 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_923_1178)">
<path d="M28.9912 3.05366C27.3642 1.55964 24.8341 1.6672 23.3398 3.2939L4.05366 24.2939C2.64848 25.824 2.64848 28.1759 4.05366 29.706L23.3398 50.706C24.8341 52.3327 27.3642 52.4403 28.9912 50.9462C30.6183 49.452 30.7257 46.921 29.2314 45.2939L16.1045 31H61C63.2091 31 65 29.2091 65 27C65 24.7908 63.2091 23 61 23H16.1045L29.2314 8.70601C30.7257 7.07891 30.6183 4.54794 28.9912 3.05366Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_923_1178" x="0" y="-0.00012207" width="66.0001" height="54.0001" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_923_1178"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_923_1178" result="shape"/>
</filter>
</defs>
</svg>`,
  'arrow-right': `<svg width="66" height="54" viewBox="0 0 66 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_923_1179)">
<path d="M37.0088 3.05366C38.6358 1.55964 41.1659 1.6672 42.6602 3.2939L61.9463 24.2939C63.3515 25.824 63.3515 28.1759 61.9463 29.706L42.6602 50.706C41.1659 52.3327 38.6358 52.4403 37.0088 50.9462C35.3817 49.452 35.2743 46.921 36.7686 45.2939L49.8955 31H5C2.79086 31 1 29.2091 1 27C1 24.7908 2.79086 23 5 23H49.8955L36.7686 8.70601C35.2743 7.07891 35.3817 4.54794 37.0088 3.05366Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_923_1179" x="0" y="-0.00012207" width="66.0001" height="54.0001" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_923_1179"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_923_1179" result="shape"/>
</filter>
</defs>
</svg>`,
  'home': `<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_923_1180)">
<path d="M27 2L50 25V52H35V35H19V52H4V25L27 2Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_923_1180" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_923_1180"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_923_1180" result="shape"/>
</filter>
</defs>
</svg>`,
  'rotate': `<svg width="73" height="66" viewBox="0 0 73 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_923_1185)">
<path d="M63.7408 42.8756C58.9306 54.7888 48.9764 61.2252 36.3584 62.3355C29.3981 62.9479 22.0066 60.0122 16.4684 55.1101C10.8745 50.1586 6.7691 42.8442 6.96858 34.275C7.02007 32.0666 8.85281 30.3178 11.0613 30.3692C13.2696 30.4209 15.0176 32.2532 14.9662 34.4615C14.8317 40.2434 17.5893 45.4187 21.7703 49.1196C26.007 52.8697 31.3031 54.7501 35.6575 54.3669C45.6688 53.4859 52.7777 48.6595 56.3226 39.8798C57.1498 37.8315 59.4806 36.8418 61.529 37.6688C63.5775 38.4959 64.5679 40.8271 63.7408 42.8756Z" fill="white"/>
<path d="M9.55479 20.5403C14.3651 8.62706 24.3193 2.19064 36.9372 1.08033C43.8975 0.467901 51.289 3.40363 56.8272 8.30576C62.4211 13.2572 66.5265 20.5716 66.327 29.1408C66.2756 31.3493 64.4428 33.098 62.2343 33.0466C60.0261 32.9949 58.278 31.1627 58.3294 28.9543C58.4639 23.1724 55.7063 17.9972 51.5253 14.2963C47.2886 10.5461 41.9925 8.66577 37.6381 9.04893C27.6268 9.92992 20.518 14.7563 16.973 23.5361C16.1458 25.5843 13.815 26.574 11.7666 25.747C9.71816 24.9199 8.72769 22.5887 9.55479 20.5403Z" fill="white"/>
<path d="M63.3299 33.4785C62.2462 33.7864 61.1102 33.6144 60.2026 33.0057L53.6706 28.6263C51.8921 27.4337 51.4664 24.927 52.7196 23.0285C53.9728 21.1302 56.4305 20.5584 58.2089 21.7508L61.1967 23.7547L63.0173 20.3672C64.0947 18.3635 66.5006 17.5542 68.3908 18.5597C70.281 19.5653 70.9399 22.0051 69.8627 24.009L65.8945 31.3893L65.7871 31.5778C65.2278 32.5049 64.3458 33.1899 63.3299 33.4785Z" fill="white"/>
<path d="M10.0246 29.9561C11.0981 29.6806 12.2112 29.8723 13.0969 30.485L20.7527 35.7804C22.514 36.9987 22.9065 39.5121 21.6293 41.3942C20.352 43.2763 17.8888 43.8145 16.1275 42.5963L11.8984 39.6706L9.28781 44.1436C8.14052 46.1085 5.71137 46.8256 3.86271 45.7458C2.0143 44.6661 1.44554 42.1984 2.59242 40.2336L7.43691 31.9373L7.5489 31.7556C8.13118 30.8615 9.01807 30.2145 10.0246 29.9561Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_923_1185" x="0" y="0" width="72.3801" height="65.4159" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_923_1185"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_923_1185" result="shape"/>
</filter>
</defs>
</svg>`,
  'settings': `<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_939_2619)">
<path d="M37.932 26.003C37.932 19.9584 33.034 15.0583 26.992 15.0583C20.95 15.0583 16.052 19.9584 16.052 26.003C16.052 32.0476 20.95 36.9477 26.992 36.9477C33.034 36.9477 37.932 32.0476 37.932 26.003ZM41.5787 26.003C41.5787 34.0625 35.048 40.596 26.992 40.596C18.936 40.596 12.4053 34.0625 12.4053 26.003C12.4053 17.9435 18.936 11.41 26.992 11.41C35.048 11.41 41.5787 17.9435 41.5787 26.003Z" fill="white"/>
<path d="M19.7084 1.20903C21.0173 0.666645 22.5061 1.21596 23.1628 2.43818L23.2803 2.69113L23.6293 3.53194L25.9548 2.57C26.6247 2.29241 27.3788 2.29264 28.0488 2.57L30.3814 3.5355L30.7268 2.70894C31.2688 1.39979 32.7107 0.735106 34.0387 1.13422L34.3022 1.22685L39.3556 3.32174C40.7511 3.90003 41.4151 5.5026 40.837 6.89872L40.4916 7.72528L42.8242 8.69434C43.4932 8.97202 44.0245 9.50353 44.3021 10.1729L45.2743 12.5278L46.1254 12.1787L46.389 12.0825C47.7162 11.6843 49.1551 12.3492 49.6973 13.6572L51.7913 18.7128C52.3693 20.1089 51.7053 21.7114 50.3098 22.2897L49.4623 22.6389L50.4238 24.9547C50.7011 25.6254 50.6984 26.3791 50.4202 27.0496L49.3412 29.6539L50.1816 30.0031C51.5768 30.5812 52.2404 32.1806 51.6631 33.5765L49.5691 38.632C48.9912 40.0278 47.3925 40.6916 45.9972 40.1141L45.1532 39.7614L44.3021 41.8278C44.0247 42.498 43.494 43.032 42.8242 43.3099L40.4596 44.2896L40.805 45.1233C41.3826 46.5188 40.7213 48.1178 39.3271 48.6967L34.2702 50.7916C32.875 51.369 31.2762 50.7052 30.6983 49.3095L30.3493 48.4758L28.0488 49.4307C27.3787 49.7083 26.6249 49.7083 25.9548 49.4307L23.6008 48.4545L23.2483 49.306C22.6702 50.7021 21.0684 51.3664 19.6728 50.7881L14.6195 48.6932C13.2241 48.1148 12.5636 46.5122 13.1416 45.1162L13.4906 44.2647L11.1794 43.3099C10.5124 43.0333 9.98353 42.5013 9.70504 41.8349L8.72214 39.4871L7.87458 39.8433C6.47946 40.4208 4.88075 39.7567 4.3027 38.3612L2.20871 33.3057C1.63067 31.9096 2.29465 30.307 3.69017 29.7287L4.54486 29.3725L3.58333 27.046C3.30683 26.3775 3.30441 25.6272 3.57977 24.9582L4.54486 22.6104L3.70085 22.2612C2.306 21.6831 1.64255 20.0835 2.21939 18.6878L4.31338 13.6323L4.43446 13.3793C5.04792 12.2385 6.38521 11.6844 7.6253 12.0576L7.88882 12.1502L8.73283 12.4993L9.70147 10.1693C9.97931 9.5017 10.5118 8.97164 11.1794 8.69434L13.5226 7.72171L13.1736 6.87734C12.5963 5.4815 13.26 3.88214 14.6551 3.30392L19.7084 1.20903ZM16.8915 6.32512L17.2405 7.16593C17.8184 8.56164 17.1575 10.1642 15.7626 10.7429L12.9244 11.9186L11.7492 14.7439C11.1691 16.1367 9.57079 16.7963 8.17728 16.2188L7.33328 15.8661L5.93729 19.2365L6.78129 19.5892C8.17453 20.1665 8.84001 21.764 8.26631 23.159L7.09468 25.9985L8.26275 28.8202C8.8407 30.2161 8.17991 31.8187 6.78485 32.3972L5.92304 32.7499L7.32259 36.1203L8.1666 35.7711C9.47214 35.2301 10.9582 35.7762 11.6174 36.9931L11.7385 37.2461L12.9208 40.082L15.7306 41.2435C17.1261 41.8218 17.7865 43.4244 17.2085 44.8205L16.8559 45.6684L20.2284 47.065L20.5809 46.2171L20.6985 45.9641C21.3116 44.8234 22.6494 44.2699 23.8893 44.6423L24.1528 44.735L27.0018 45.9142L29.8009 44.7563L30.0644 44.6637C31.3034 44.2923 32.6384 44.8462 33.2517 45.9855L33.3728 46.2384L33.7146 47.0721L37.0835 45.6755L36.7417 44.8419C36.1638 43.4458 36.8277 41.8467 38.2231 41.2684L41.0756 40.082L42.1333 37.5276L42.2544 37.2746C42.8678 36.134 44.2052 35.5798 45.4452 35.9528L45.7088 36.0455L46.5456 36.391L47.9416 33.0207L47.1048 32.6751C45.7085 32.0965 45.044 30.4945 45.6233 29.0981L46.9089 25.9985L45.7479 23.1947C45.17 21.7987 45.8307 20.1962 47.2258 19.6177L48.0734 19.265L46.6774 15.8946L45.8298 16.2473C44.4346 16.8249 42.8359 16.161 42.258 14.7652L41.0756 11.9186L38.2552 10.75C36.8596 10.1717 36.1957 8.56917 36.7737 7.17305L37.1156 6.33937L33.7467 4.94278L33.4048 5.77646C32.827 7.17208 31.2281 7.83576 29.8329 7.25856L27.0018 6.08285L24.1849 7.25499C22.7896 7.83289 21.1911 7.16857 20.613 5.7729L20.2604 4.92853L16.8915 6.32512Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_939_2619" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_939_2619"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_939_2619" result="shape"/>
</filter>
</defs>
</svg>`
};

export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 24, color = '#FFFFFF' }) => {
  const iconSource = iconMap[name];
  
  if (!iconSource) {
    return null;
  }

  return (
    <SvgXml 
      xml={iconSource} 
      width={size} 
      height={size} 
      color={color}
    />
  );
};
