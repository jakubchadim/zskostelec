'use strict'

export enum Intent {
  NONE = 'none',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger'
}

export type WithIntent<T extends object> = T & {
  intent?: Intent
}
