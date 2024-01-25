# Changelog

## 1.4.0

- Password encyption uses a bcrypt blowfish + salt setup.
  - Includes a migration for previous versions to use same password
- UI Adjustments
  - Login
- Adopted ESLint + Prettier + prop types
- Attribution Page
- Main chat page performance and responsiveness improvements

## 1.3.0

- Chats are encrypted and stored locally
- Chats can be imported and exported as JSON files
- Package updates to crypto-js and electron to address vulnerabilities
- UI / UX / Copy improvements to first time setup
- Added support for GPT 4 Turbo (preview model)

## 1.2.0

- Prompts can be imported and exported as JSON files
- Added Ctrl+N as "new chat" shortcut
- Added better migrations between versions

## 1.1.1

- Added file and edit sections to native menu bar
- MacOS can copy / paste now

## 1.1.0

- UI evolution
- Markdown / code syntax highlighting in AI responses
- Messages are timestamped
- Optional input prefils for prompts
- User can store multiple API keys and switch between them

## 1.0.1

- UI cleanup
- dependency upgrades
- community files added
- project restructuring

## 1.0.0

- login page
  - password
  - OpenAI API key
  - seed phrase
- password recovery page
- landing page
- system prompts Page
- new system prompt Page
- edit system prompt Page
- new Chat Page
- change API key page
- dark mode / light mode
- encrypted system prompts stored on persistently disk
