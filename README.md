# Skyway

> A cross-platform, desktop, ChatGPT-esque interface featuring encryption and custom system prompts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![A screenshot of Skyway](screenshot.png)

## Developer Quick Start

Prerequisites: Node 18 - no `.ENV` file

```npm i```
```npm start```

## Not-a-Developer Quick Start

Refer to [How do I get started using Skyway?](#how-do-i-get-started-using-skyway) below.

## FAQs

### What is Skyway?

Skyway is desktop chatbot application powered by OpenAI models and APIs.

Skyway currently runs models such as `gpt-3.5-turbo` and `gpt-4`.

### Who is Skyway for?

Everyone!

You do not need to know how to code or be technically inclined to use Skyway.
If you have a desire to interact with a chatbot effectively and securely, Skyway is for you.

### How do I get started using Skyway?

Obtain an API Key from OpenAI.
See [Is Skyway Free to Use?](#is-skyway-free-to-use) if you do not have a key.

To install Skyway without using a terminal / command prompt,
see the [Precompiled Binaries](#precompiled-binaries) section below.
(This is the easiest way to install Skyway)

To start devloping with Skyway see [Making, Building, and Installing](#making-building-and-installing).

### Is Skyway free to use?

Skyway free to use and modify as you see fit.

You must have an API key from OpenAI to chat using Skyway.
Basic users can expect to pay $2 a month or less. More advanced users may see
higher token usage.

For more info see:
[OpenAI Signup](https://github.com/0xbenc) | [Pricing](https://github.com/0xbenc) | [Finding your API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)

### Why is there a password in Skyway?

A Skyway design goal is that chats and prompts stored on your computer are encrypted.

The password you create does not communicate with the internet, it decrypts the
data you save when using Skyway.

### Why should I use Skyway vs ChatGPT?

- Customization via system prompts and engines
- Potential to develop integrations more securely than through a web service
- Data Privacy

### What tech does Skyway use?

Skyway is an Electron app with a React frontend.
Electron Forge is used to simplify the make / build process.
Electron Store is used for persistent storage on the user's disk.

The UI is built with Material UI 5.

CryptoJS handles encryption. Zustand is used for state management.

Responses are powered by OpenAI chat completions APIs,
on models such as `gpt-3.5-turbo` and `gpt-4`.

### What systems does Skyway run on?

Mac, Windows 10 / 11, and Debian Linux (64bit) are officially supported.

ChromeOS is not officially supported, but many modern Chromebooks and Chromeboxes
can install .deb files from the Downloads folder.

Skyway is not a website or a native mobile app. To chat and recieve messages,
an internet connection must be present.

The ARM64 architecture is officially supported for Mac
and Linux (M1, M2, Raspberry Pi 4, Jetson Nano, etc).

While Skyway does not have active Windows ARM (64bit) support, technical users
should be able to make / build for this platform with small modifications to the
Electron Forge configuration.

While only Debian (Ubuntu, PopOS, Raspberry Pi OS, etc) Linux builds are
officially supported, Skyway can be made / built / installed on most x86 *nix PCs.

### Does Skyway have an API? Can I use Skyway at scale?

Skyway does not provide an API of its own.

Skyway uses axios in the main electron thread to communicate with OpenAI APIs
and sends the data to the renderer with IPCHandlers.

This makes Skyway ill-suited for modification into large scale projects.
OpenAI also places limits on the numbers of requests you can make per-min per-key.

### What are the Skyway design goals?

- intuitive UI with complete keyboard-only support
- no compromises between ease-of-use and inclusion of power tools
  - should not confuse noobs, should not hinder pros
- multiple engines
  - conversational chat (token-limited)
  - one-shot chat (amnesia)
- encrypted chats / system prompts
- easily exportable chats / system prompts

## Precompiled Binaries

### The easiest way to install skyway

Go to the `Releases` section of this repository, go to the newest stable version,
and download the file appropriate for your platform.

- Mac:
  - Darwin .zip file
  - After downloading:
    - Double click to unzip
    - Drag app into Application folder, try to run app
    - Allow app in system preferences -> security
- Linux:
  - .deb file
  - see Linux installer instructions below
- Windows:
  - .exe file
  - after downloading, double click to run

## Making, Building, and Installing

### System pre-requisites

- requires node 18.x on x86 Windows, Mac (Intel), and Linux (Debian)
- requires node 18.x on ARM Mac (M1, M2)
- requires node 16.x on ARM64 Linux (Debian)
- ARM32 Linux not supported
  - It is recommended you find a more lightweight project, with a non-web GUI.
- ARM64 Windows not supported
  - If you have an ARM64 Windows device and you are interested in development,
  plase reach out to a maintainer!

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

Navigate to the `out/make` folder from the root of the project.
Inside `make` will be another folder based on the platform Skyway was built for.
Navigate inside that folder, and navigate again inside the next folder.
You should be two levels down from `make`.

#### On Windows

- Click the .exe file to begin the install process.
If Skyway was already installed, it will be updated.

#### On Mac (x64 + ARM64)

- Unzip the zip file
- Drag the unzipped file into the `Applications` folder
- Launch the program from the applications folder,
or by pressing `CMD` + `spacebar`
- Optionally, Skyway can be dragged or locked to the dock for convenience

#### On Linux (debian, x64 + ARM64)

- Use Eddy or "Software Store" install the .deb with a GUI
  - or
- in terminal, in the folder contianing the .deb run `sudo dpkg -i DEB_PACKAGE`
and replace `DEB_PACKAGE` with the name of the .deb file

## Code of Conduct

See the Skyway [Code of Conduct](./CODE_OF_CONDUCT.md).

## Contributing to Skyway

If you wish to write issues or develop features for Skyway see [here](./CONTRIBUTING.md).

## Contributors

- [0xbenc](https://github.com/0xbenc) - maintainer
