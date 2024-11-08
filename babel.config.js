// module.exports = {
//   presets: [
//     'module:metro-react-native-babel-preset',
//     'module:@react-native/babel-preset',
//     "@babel/preset-env",
//     "@babel/preset-react",
//     "@babel/preset-typescript"
//   ],
//   plugins: [
//     'react-native-reanimated/plugin',
//   ],
// };
module.exports = {
  presets: [
    'module:metro-react-native-babel-preset', // Sử dụng preset này cho React Native
    '@babel/preset-typescript', // Nếu bạn đang sử dụng TypeScript
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    'react-native-reanimated/plugin', // Đặt plugin này ở cuối
  ],
};


