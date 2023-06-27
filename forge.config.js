// Forge Configuration
const path = require('path');
const rootDir = process.cwd();

module.exports = {
  // Packager Config
  packagerConfig: {
    // Create asar archive for main, renderer process files
    asar: true,
    // Set executable name
    executableName: 'skyway',
    // Set application copyright
    appCopyright: 'Copyright (C) 2023 Ben Chapman',
    // Set application icon
    icon: "./public/icons/icon"
  },
  // Forge Makers
  makers: [
    {
      // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
      // Windows applications and is therefore the most user friendly you can get.
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Skyway',
      },
    },
    {
      // The Zip target builds basic .zip files containing your packaged application.
      // There are no platform specific dependencies for using this maker and it will run on any platform.
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      // The deb target builds .deb packages, which are the standard package format for Debian-based
      // Linux distributions such as Ubuntu.
      name: '@electron-forge/maker-deb',
      config: {
        name: "Skyway",
        productName: "Skyway",
        description: "Tomorrow Begins Today",
        icon: "./public/icons/icon.png"
      }
    }
  ],
  // Forge Plugins
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        // Fix content-security-policy error when image or video src isn't same origin
        // Remove 'unsafe-eval' to get rid of console warning in development mode.
        devContentSecurityPolicy: "default-src 'self' data: *; style-src 'self' 'unsafe-inline';",
        // Ports
        port: 3011, // Webpack Dev Server port
        loggerPort: 9000, // Logger port
        // Main process webpack configuration
        mainConfig: path.join(rootDir, "./webpack.main.config.js",),
        // Renderer process webpack configuration
        renderer: {
          // Configuration file path
          config: path.join(rootDir, './webpack.renderer.config.js'),
          // Entrypoints of the application
          entryPoints: [
            {
              // Window process name
              name: 'main_window',
              // React Hot Module Replacement (HMR)
              rhmr: 'react-hot-loader/patch',
              // HTML index file template
              html: path.join(rootDir, './src/index.html'),
              // Renderer
              js: path.join(rootDir, './src/renderer.js'),
            },
          ],
        },
        devServer: {
          liveReload: false,
        },
      },
    },
  ],
};
