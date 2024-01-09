const Store = require('electron-store');
const {
  migration_1_1_0,
  migration_1_2_0,
  migration_1_3_0,
  migration_1_3_1,
} = require('../../core/utility/migrations');

const store = new Store({
  migrations: {
    '<1.0.1': (store) => {
      store.set('version', '1.0.0');
    },
    '1.0.1': (store) => {
      store.set('version', '1.0.1');
    },
    '1.1.0': (store) => {
      migration_1_1_0(store);
    },
    '1.1.1': (store) => {
      store.set('version', '1.1.1');
    },
    '1.2.0': (store) => {
      migration_1_2_0(store);
    },
    '1.3.0': (store) => {
      migration_1_3_0(store);
    },
    '1.3.1': (store) => {
      migration_1_3_1(store);
    },
  },
});

module.exports = store;
