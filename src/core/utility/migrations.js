const { default: generateKeyV4 } = require('./uuid');
// Uses require because the function is called by src/main.js 

const buildSystemPrompts_1_2_0 = (system_prompts) => {
  let system_prompts_new = [...system_prompts]

  system_prompts_new[0].uuid = "f8459762-a671-4b80-8286-09cc8b6a4d92";
  system_prompts_new[1].uuid = "e6d24932-6fe9-4d13-a1a5-dcdeb3aeab56";
  
  system_prompts_new[0].createdDate = "2023-08-02T13:03:43.668Z";
  system_prompts_new[0].importedDate = "2023-08-02T13:03:43.668Z";
  system_prompts_new[0].usedDate = "2023-08-02T13:03:43.668Z";
  system_prompts_new[1].createdDate = "2023-08-02T13:03:43.668Z";
  system_prompts_new[1].importedDate = "2023-08-02T13:03:43.668Z";
  system_prompts_new[1].usedDate = "2023-08-02T13:03:43.668Z";

  const migrationDate = new Date();
  const migrationDateISO = String(migrationDate.toISOString());

  for (let i = 0; i < system_prompts.length; i++) {
    if (i > 1) {
      system_prompts_new[i].uuid = generateKeyV4();
      system_prompts_new[i].createdDate = migrationDateISO;
      system_prompts_new[i].importedDate = migrationDateISO;
      system_prompts_new[i].usedDate = migrationDateISO;
    };

    if (system_prompts_new[i]?.prefil !== undefined) {
      system_prompts_new[i].prefill = system_prompts_new[i]?.prefil;
      delete system_prompts_new[i].prefil;
    } else {
      system_prompts_new[i].prefill = "";
    };
  };

  return system_prompts_new
};

export { buildSystemPrompts_1_2_0 }
