export default {
  plugins: [
    [
      "umi-plugin-library",
      {
        umd: false
      }
    ],
    [
      'umi-plugin-react',
      {
        antd: true,
      }
    ],
  ]
};
