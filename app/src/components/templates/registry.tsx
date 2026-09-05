import type { ComponentType } from 'react'
import { CategoryTemplate } from './category'
import { DocumentsTemplate } from './documents'
import { EmployeesTemplate } from './employees'
import { GalleriesTemplate } from './galleries'
import { GalleryTemplate } from './gallery'
import { GutakTemplate } from './gutak'
import { HomeTemplate } from './home'
import { PageTemplate } from './page'
import { PostTemplate } from './post'

export type TemplateKey =
  | 'home'
  | 'page'
  | 'post'
  | 'category'
  | 'gallery'
  | 'galleries'
  | 'documents'
  | 'gutak'
  | 'employees'

export type TemplateProps<T = unknown> = {
  data: T
}

/**
 * Template key -> component. Each template accepts plain `TemplateProps`
 * and narrows `data` internally (project convention — keeps this map cast-free).
 */
export const templateRegistry: Record<TemplateKey, ComponentType<TemplateProps>> = {
  home: HomeTemplate,
  page: PageTemplate,
  post: PostTemplate,
  category: CategoryTemplate,
  gallery: GalleryTemplate,
  galleries: GalleriesTemplate,
  documents: DocumentsTemplate,
  gutak: GutakTemplate,
  employees: EmployeesTemplate
}
