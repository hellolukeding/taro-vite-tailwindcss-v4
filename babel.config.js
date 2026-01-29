// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    [
      "taro",
      {
        framework: "react",
        ts: true,
        compiler: "vite",
        useBuiltIns: process.env.TARO_ENV === "h5" ? "usage" : false,
      },
    ],
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "@taroify/core",
        libraryDirectory: "",
        style: true,
      },
      "@taroify/core",
    ],
    [
      "import",
      {
        libraryName: "@taroify/icons",
        libraryDirectory: "",
        camel2DashComponentName: false,
        style: () => "@taroify/icons/style",
        customName: (name) =>
          name === "Icon"
            ? "@taroify/icons/van/VanIcon"
            : `@taroify/icons/${name}`,
      },
      "@taroify/icons",
    ],
    // ⚠️ 禁用 @babel/plugin-transform-runtime 在小程序环境中
    // 小程序不支持动态 require，会导致 @babel/runtime helpers 错误
    // ...process.env.TARO_ENV === "h5" ? [
    //   "@babel/plugin-transform-runtime",
    //   {
    //     corejs: false,
    //     helpers: true,
    //     regenerator: true,
    //     useESModules: true,
    //   },
    // ] : [],
  ],
};
