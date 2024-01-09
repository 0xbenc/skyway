import CryptoJS from 'crypto-js';
// ----------------------------------------------------------------------

/**
 * Decrypts a string using AES with a given password.
 *
 * @param {string} str - The string to decrypt.
 * @param {string} password - The password to use in decryption.
 * @returns {string} The decrypted string. If an error in decryption occurs, returns 'ERROR'.
 */
const decrypt = (str, password) => {
  try {
    const t = CryptoJS.AES.decrypt(str, password);
    const t1 = t.toString(CryptoJS.enc.Utf8);
    return t1;
  } catch (error) {
    console.log('ERROR: bad decryption');
    return 'ERROR';
  }
};

/**
 * Encrypts a string using AES with a given password.
 *
 * @param {string} str - The string to encrypt.
 * @param {string} password - The password to use for encryption.
 * @returns {string} The encrypted string.
 */
const encrypt = (str, password) => {
  return CryptoJS.AES.encrypt(str, password).toString();
};

/**
 * Encrypts the properties of an array of prompt objects using the 'encrypt' function.
 *
 * @param {Object[]} prompts - An array of prompts to encrypt.
 * @param {string} password - The password to use for encryption.
 * @returns {Object[]} The array of encrypted prompts.
 */
const encryptPrompts = (prompts, password) => {
  const encPrompts = JSON.parse(JSON.stringify(prompts));

  for (let i = 0; i < encPrompts.length; i++) {
    encPrompts[i].title = encrypt(encPrompts[i].title, password);
    encPrompts[i].prompt = encrypt(encPrompts[i].prompt, password);
    encPrompts[i].userInputLabel = encrypt(
      encPrompts[i].userInputLabel,
      password,
    );
    encPrompts[i].model = encrypt(encPrompts[i].model, password);
    encPrompts[i].engine = encrypt(encPrompts[i].engine, password);
  }

  return encPrompts;
};

/**
 * Decrypts the properties of an array of prompts objects using the 'decrypt' function.
 *
 * @param {Object[]} prompts - An array of encrypted prompts to decrypt.
 * @param {string} password - The password to use for decryption.
 * @returns {Object[]} The array of decrypted prompts.
 */
const decryptPrompts = (prompts, password) => {
  const dencPrompts = JSON.parse(JSON.stringify(prompts));

  for (let i = 0; i < prompts.length; i++) {
    dencPrompts[i].title = decrypt(dencPrompts[i].title, password);
    dencPrompts[i].prompt = decrypt(dencPrompts[i].prompt, password);
    dencPrompts[i].userInputLabel = decrypt(
      dencPrompts[i].userInputLabel,
      password,
    );
    dencPrompts[i].model = decrypt(dencPrompts[i].model, password);
    dencPrompts[i].engine = decrypt(dencPrompts[i].engine, password);
  }

  return dencPrompts;
};

export { encryptPrompts, decryptPrompts, decrypt, encrypt };
