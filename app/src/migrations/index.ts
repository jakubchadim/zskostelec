import * as migration_20261002_142226_initial from './20261002_142226_initial';

export const migrations = [
  {
    up: migration_20261002_142226_initial.up,
    down: migration_20261002_142226_initial.down,
    name: '20261002_142226_initial'
  },
];
