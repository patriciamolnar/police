const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/main.ts", // Main TypeScript file
  output: {
    filename: "bundle.js", // Output JavaScript file
    path: path.resolve(__dirname, "dist"),
    clean: true, // Clean the output folder before building
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to .ts files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Load CSS files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Use your HTML file as a template
      favicon: "./src/favicon.png",
    }),
  ],
  devServer: {
    static: "./dist",
    port: 3000,
    open: true, // Open the browser automatically
  },
  mode: "development", // Set to 'production' for a production build
};
