# Skyway

## Stack

- NODE 18.x
- Electron
- Electron Forge
- Electron Store
- React 18
- MUI 5
- CryptoJS
- Zustand

## Design Goals

- easy to use interface with power tools
- multiple engines
- encrypted chats / system prompts
- exportable chats / system prompts

## INSTALLATION

- requires node 18.x on x86 Windows, Mac, and Linux (debian)
- requires node 18.x on ARM Mac
- requires node 16.x on ARM64 Linux (debian)
- ARM32 Linux not supported
- ARM64 Windows not supported

### NPM

To install dependencies:

```npm install```

### Running Skyway Locally

Make sure you have installed dependecies first:

```npm run start```

### Building an installer file for Skyway

On x86 and ARM Mac:

```npm run makeMac```

Optionally, on ARM Mac:

```npm run makeMacARM```

On x86 Windows:

```npm run makeWindows```

On x86 Linux (debian):

```npm run makeLinux```

On ARM Linux (debian):

```npm run makeLinuxARM```

### Using the installer file for Skyway

Navigate to the ```out/make``` folder from the root of the project. Inside ```make``` will be another folder based on the platform Skyway was built for. Navigate inside that folder, and navigate again inside the next folder. You should be two levels down from ```make```

#### On Windows

- Click the .exe file to begin the install process. If Skyway was already installed, it will be overwritted / updated

#### On Mac (x64 + ARM64)

- Unzip the zip file
- Drag the unzipped file into the ```Applications``` folder.
- Launch the program from the applications folder or by pressing ```CMD``` + ```spacebar```
- Optionally, Skyway can be dragged or locked to the dock for convenience

#### On Linux (debian, x64 + ARM64)

- Use Eddy or "Software Store" install the .deb with a GUI
  - or
- in terminal, in the folder contianing the .deb run ```sudo dpkg -i DEB_PACKAGE``` and replace ```DEB_PACKAGE``` with the name of the .deb file
