import * as migration_20261002_142226_initial from './20261002_142226_initial';
import * as migration_20261006_123048_staff from './20261006_123048_staff';
import * as migration_20261101_175453_tags_search from './20261101_175453_tags_search';

export const migrations = [
  {
    up: migration_20261002_142226_initial.up,
    down: migration_20261002_142226_initial.down,
    name: '20261002_142226_initial',
  },
  {
    up: migration_20261006_123048_staff.up,
    down: migration_20261006_123048_staff.down,
    name: '20261006_123048_staff',
  },
  {
    up: migration_20261101_175453_tags_search.up,
    down: migration_20261101_175453_tags_search.down,
    name: '20261101_175453_tags_search'
  },
];
