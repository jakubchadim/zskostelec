import { PageTemplateType, type ResolvedRoute } from '@/lib/wp'
import type { TemplateKey } from './registry'

const TEMPLATE_KEY_BY_PAGE_TYPE: Record<PageTemplateType, TemplateKey> = {
  [PageTemplateType.HOME]: 'home',
  [PageTemplateType.GALLERIES]: 'galleries',
  [PageTemplateType.DOCUMENTS]: 'documents',
  [PageTemplateType.GUTAKY]: 'gutak',
  [PageTemplateType.EMPLOYEES]: 'employees',
  [PageTemplateType.DEFAULT]: 'page'
}

export function templateKeyForRoute(route: ResolvedRoute): TemplateKey {
  switch (route.kind) {
    case 'page':
      return TEMPLATE_KEY_BY_PAGE_TYPE[route.templateType] ?? 'page'
    case 'post':
      return 'post'
    case 'category':
      return 'category'
    case 'gallery':
      return 'gallery'
  }
}
