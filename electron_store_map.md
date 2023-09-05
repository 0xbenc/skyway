# Electron Store Schema #

- __internal__ - managed by electron store
- recovery - the numbers of the seed phrase separated by x
- password_set - true if user has confirmed seed phrase before
- integrity_check - will decrypt to "skynet" if valid
- system_prompts - local system prompts
- color_mode - dark or light mode
- open_ai_api_key - open ai key
- last_prompt - last prompt used, index
- chats - encrypted array of chats, see zustand for construction
