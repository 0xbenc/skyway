const { generateKeyV4 } = require('./uuid');
// Uses require because the function is called by src/main.js
// ----------------------------------------------------------------------

const migration_1_1_0 = (store) => {
  const system_prompts = store.get("system_prompts");

  if (system_prompts !== undefined) {
    store.set('open_ai_api_keys',
      [{
        key: store.get("open_ai_api_key"),
        name: "default"
      }]
    );
    store.set('open_ai_api_key', 0);
  };

  store.set('version', '1.1.0');
};

const migration_1_2_0 = (store) => {
  const system_prompts = store.get("system_prompts")

  if (system_prompts !== undefined) {
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

      system_prompts_new[i].skywayVersion = '1.2.0';
    };

    store.set('system_prompts', system_prompts_new)
  }

  store.set('last_prompt', 1);
  store.set('version', '1.2.0');
};

const migration_1_3_0 = (store) => {
  const system_prompts = store.get("system_prompts");

  if (system_prompts !== undefined) {
    let system_prompts_new = [...system_prompts];

    for (let i = 0; i < system_prompts.length; i++) {
      system_prompts_new[i].skywayVersion = '1.3.0';
    };

    store.set('system_prompts', system_prompts_new);
  } else {
    store.set('color_mode', "dark");
    store.set('open_ai_api_key', 0);
  };

  store.set('last_prompt', 0);
  store.set('version', '1.3.0');
};

const migration_1_3_1 = (store) => {
  const system_prompts = store.get("system_prompts");

  if (system_prompts !== undefined) {
    let system_prompts_new = [...system_prompts];

    for (let i = 0; i < system_prompts.length; i++) {
      system_prompts_new[i].skywayVersion = '1.3.1';
    };

    store.set('system_prompts', system_prompts_new);
    store.set('migration_1_3_1_bcrypt', true)
  };

  store.set('last_prompt', 0);
  store.set('version', '1.3.1');
};

export { migration_1_1_0, migration_1_2_0, migration_1_3_0, migration_1_3_1 };
