import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {ImageIcon} from '@sanity/icons/Image'

const DATE_FORMAT: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'short', year: 'numeric'}

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description:
        'The web address for this post: /blog/<slug>. Once the post is live, changing this breaks any existing links to it.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publish date',
      type: 'datetime',
      description: 'Posts are listed newest first. The homepage shows the most recent one.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'The short preview shown on the homepage and the blog index.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Shown on cards and used as the social sharing image. Set the hotspot so the subject stays in frame when cropped.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describes the image for screen readers and search engines.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      description: 'The article itself.',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
      description: 'Optional. Falls back to the excerpt when left empty.',
      validation: (rule) =>
        rule.max(160).warning('Search engines usually cut off past about 160 characters.'),
    }),
  ],
  preview: {
    select: {title: 'title', date: 'date', media: 'coverImage'},
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('en-GB', DATE_FORMAT) : 'No date set',
        media,
      }
    },
  },
})
