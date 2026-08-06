import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {CaseIcon} from '@sanity/icons/Case'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'auristate',

  projectId: 's055z044',
  dataset: 'production',

  plugins: [
    structureTool({
      // Projects get the orderable list so they can be dragged into order.
      // That order drives the homepage carousel, so it is content, not a
      // Studio convenience. Posts are ordered by their publish date instead
      // and use the default list.
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              icon: CaseIcon,
              S,
              context,
            }),
            S.documentTypeListItem('post').title('Blog Posts').icon(DocumentTextIcon),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
