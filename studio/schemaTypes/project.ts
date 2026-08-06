import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * The `value` of each type doubles as the anchor id on /projects
 * (#hospitality, #residential, #luxury-villas), which the site's Projects
 * dropdown links to directly. Changing a value breaks those menu links, so
 * edit the `title` freely but leave `value` alone.
 */
export const PROJECT_TYPES = [
  {title: 'Hospitality / Venue', value: 'hospitality'},
  {title: 'Residential', value: 'residential'},
  {title: 'Luxury Villas Compound', value: 'luxury-villas'},
]

const TYPE_TITLES: Record<string, string> = Object.fromEntries(
  PROJECT_TYPES.map((entry) => [entry.value, entry.title]),
)

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description:
        'The web address for this project: /projects/<slug>. Once it is live, changing this breaks any existing links to it.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'For example: Latakia, Syria',
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      description:
        'Shown as the label on the project card, and decides which group the project appears under on the Projects page.',
      options: {list: PROJECT_TYPES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Square meters',
      type: 'string',
      description:
        'Free text, shown exactly as typed. For example: 12,000 m² — or a range such as 12,000 – 15,000 m².',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      description: 'Optional one-liner shown under the project name on its card.',
    }),
    defineField({
      name: 'description',
      type: 'array',
      description: 'The main write-up on the project page.',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photos',
      type: 'array',
      description:
        'The FIRST photo is the project’s card image on the homepage and Projects page — drag to reorder if you want a different one. Set each photo’s hotspot so the important part stays in frame: cards crop to a tall portrait shape, so wide shots lose their sides.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describes the image for screen readers and search engines.',
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule.min(1).error('Add at least one photo — the first one becomes the project’s card image.'),
    }),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      description:
        'Up to 4. The questions section only appears on the project page when there is at least one here.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          title: 'Question',
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {title: 'name', projectType: 'projectType', location: 'location', media: 'gallery.0'},
    prepare({title, projectType, location, media}) {
      const label = projectType ? (TYPE_TITLES[projectType] ?? projectType) : 'No type set'
      return {
        title,
        subtitle: location ? `${label} — ${location}` : label,
        media,
      }
    },
  },
})
