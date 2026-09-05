import type { ComponentType } from 'react'

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

function createPlaceholderTemplate(name: TemplateKey): ComponentType<TemplateProps> {
  function PlaceholderTemplate({ data }: TemplateProps) {
    let serialized: string | null = null

    if (data !== undefined) {
      try {
        serialized = JSON.stringify(data, null, 2) ?? null
      } catch {
        serialized = '(unable to serialize data — see console)'
      }
    }

    return (
      <div className="mx-auto max-w-site px-2 py-16">
        <p className="text-sm text-gray-6">Template: {name}</p>
        {serialized && <pre className="mt-4 overflow-auto text-xs">{serialized}</pre>}
      </div>
    )
  }

  PlaceholderTemplate.displayName = `PlaceholderTemplate(${name})`

  return PlaceholderTemplate
}

/**
 * Template key -> component. Wave 2 tasks (T4-T7) replace these entries
 * one-by-one with real templates as each feature lands.
 */
export const templateRegistry: Record<TemplateKey, ComponentType<TemplateProps>> = {
  home: createPlaceholderTemplate('home'),
  page: createPlaceholderTemplate('page'),
  post: createPlaceholderTemplate('post'),
  category: createPlaceholderTemplate('category'),
  gallery: createPlaceholderTemplate('gallery'),
  galleries: createPlaceholderTemplate('galleries'),
  documents: createPlaceholderTemplate('documents'),
  gutak: createPlaceholderTemplate('gutak'),
  employees: createPlaceholderTemplate('employees')
}
