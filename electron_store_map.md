# Electron Store Schema #

## __internal__ ##
    managed by electron store
## recovery ##
    the numbers of the seed phrase separated by x
## password_set ## 
    true if user has confirmed seed phrase before
## integrity_check ## 
    salted password hash
## system_prompts ## 
    local system prompts
## color_mode ## 
    dark or light mode
## open_ai_api_key ##
    index of current OpenAI API key
## open_ai_api_keys ## 
    array of OpenAI keys
## last_prompt ## 
    index of last prompt used
## chats ## 
    encrypted array of chats
## migration_1_3_1_bcrypt ## 
    only true when migrating 1.3.0 to 1.3.1
