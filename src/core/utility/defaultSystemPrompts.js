const GPT35Turbo = {
  title: "GPT 3.5 Turbo",
  prompt: `You are GPT3, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: November 2021. Current Date: ${new Date().toLocaleDateString()}`,
  params: {},
  userInputLabel: "Chat message",
  model: "gpt-3.5-turbo",
  engine: "token limited",
  limit: 4096
};

const GPT4 = {
  title: "GPT 4",
  prompt: `You are GPT4, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: November 2021. Current Date: ${new Date().toLocaleDateString()}`,
  params: {},
  userInputLabel: "Chat message",
  model: "gpt-4",
  engine: "token limited",
  limit: 8192
};

const Prompts = [
  GPT35Turbo,
  GPT4
];


export default Prompts;