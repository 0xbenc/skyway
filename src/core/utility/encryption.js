import CryptoJS from "crypto-js";

const decrypt = (str, password) => {
  try {
    const t = CryptoJS.AES.decrypt(str, password)
    const t1 = t.toString(CryptoJS.enc.Utf8);
    return t1
  } catch (error) {
    console.log("ERROR: bad decryption")
    return "ERROR";
  };
}

const encrypt = (str, password) => {
  return CryptoJS.AES.encrypt(str, password).toString();
};

const encryptPrompts = (prompts, password) => {
  const encPrompts = JSON.parse(JSON.stringify(prompts));

  for (let i = 0; i < encPrompts.length; i++) {
    encPrompts[i].title = encrypt(encPrompts[i].title, password);
    encPrompts[i].prompt = encrypt(encPrompts[i].prompt, password);
    encPrompts[i].userInputLabel = encrypt(encPrompts[i].userInputLabel, password);
    encPrompts[i].model = encrypt(encPrompts[i].model, password);
    encPrompts[i].engine = encrypt(encPrompts[i].engine, password);
  };

  return encPrompts;
};

const decryptPrompts = (prompts, password) => {
  const dencPrompts = JSON.parse(JSON.stringify(prompts));

  for (let i = 0; i < prompts.length; i++) {
    dencPrompts[i].title = decrypt(dencPrompts[i].title, password);
    dencPrompts[i].prompt = decrypt(dencPrompts[i].prompt, password);
    dencPrompts[i].userInputLabel = decrypt(dencPrompts[i].userInputLabel, password);
    dencPrompts[i].model = decrypt(dencPrompts[i].model, password);
    dencPrompts[i].engine = decrypt(dencPrompts[i].engine, password);
  };

  return dencPrompts;
};

export { encryptPrompts, decryptPrompts, decrypt, encrypt }