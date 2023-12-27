const GPT35Turbo = {
  title: "GPT 3.5 Turbo",
  prompt: `You are Skyway, a custom chatbot tool powered by GPT3, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: November 2021. Current Date: ${new Date().toLocaleDateString()}`,
  params: {},
  userInputLabel: "Send a message",
  model: "gpt-3.5-turbo",
  engine: "token limited",
  prefill: "",
  limit: 4096,
  uuid: "f8459762-a671-4b80-8286-09cc8b6a4d92",
  createdDate: "2023-08-02T13:03:43.668Z",
  importedDate: "2023-08-02T13:03:43.668Z",
  usedDate: "2023-08-02T13:03:43.668Z",
  skywayVersion: "1.3.0"
};

const GPT4 = {
  title: "GPT 4",
  prompt: `You are Skyway, a custom chatbot tool powered by GPT4, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: November 2021. Current Date: ${new Date().toLocaleDateString()}`,
  params: {},
  userInputLabel: "Send a message",
  model: "gpt-4",
  engine: "token limited",
  prefill: "",
  limit: 8192,
  uuid: "e6d24932-6fe9-4d13-a1a5-dcdeb3aeab56",
  createdDate: "2023-08-02T13:03:43.668Z",
  importedDate: "2023-08-02T13:03:43.668Z",
  usedDate: "2023-08-02T13:03:43.668Z",
  skywayVersion: "1.3.0"
};

const Prompts = [
  GPT35Turbo,
  GPT4
];

export { Prompts };
