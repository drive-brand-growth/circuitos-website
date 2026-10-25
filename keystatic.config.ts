import { collection, config, fields, singleton } from '@keystatic/core'

/**
 * Git content model shared on purpose.
 * Another site can copy this file and the content folder, then change the
 * repo string below. Collections are named for reuse: pages, steps, terms, notes.
 * On this site those are pages, method stages, the glossary, and field notes.
 *
 * Local `npm run dev` writes files in the repo. A production build uses GitHub
 * storage so /admin can commit on Vercel once Noel adds the GitHub App env.
 * See docs/cms.md. This file does not set those variables.
 */
const repo = (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ||
  'drive-brand-growth/circuitos-website') as `${string}/${string}`

const storage =
  process.env.NODE_ENV === 'production'
    ? { kind: 'github' as const, repo, branchPrefix: 'cms/' }
    : { kind: 'local' as const }

const status = fields.select({
  label: 'Status',
  description: 'Drafts stay off the navigation, the home page, and the sitemap. The address still opens, with a noindex tag, so a preview can be read.',
  options: [
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
  ],
  defaultValue: 'published',
})

const link = fields.object({
  label: fields.text({ label: 'Label' }),
  href: fields.text({ label: 'Path or email link' }),
})

const section = fields.object({
  heading: fields.text({ label: 'Heading' }),
  paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
    label: 'Paragraphs',
  }),
  items: fields.array(
    fields.object({
      label: fields.text({ label: 'Label' }),
      text: fields.text({ label: 'Text', multiline: true }),
      href: fields.text({ label: 'Link' }),
    }),
    { label: 'Items', itemLabel: (props) => props.fields.label.value || 'Item' },
  ),
  listStyle: fields.select({
    label: 'List style',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Bullets', value: 'bullets' },
      { label: 'Numbers', value: 'numbers' },
      { label: 'Cards', value: 'cards' },
      { label: 'Links', value: 'links' },
    ],
    defaultValue: 'none',
  }),
  callout: fields.text({ label: 'Callout', multiline: true }),
  embed: fields.select({
    label: 'Embed',
    description: 'Pull a shared block into this section. Steps and terms come from those collections.',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Table', value: 'table' },
      { label: 'Chart', value: 'chart' },
      { label: 'Steps', value: 'steps' },
      { label: 'Terms', value: 'terms' },
    ],
    defaultValue: 'none',
  }),
})

export default config({
  storage,
  ui: {
    brand: { name: 'Editor' },
    navigation: {
      Site: ['site', 'home'],
      Writing: ['pages', 'steps', 'terms', 'notes', 'glossary'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Site',
      path: 'content/site',
      format: { data: 'yaml' },
      previewUrl: '/',
      schema: {
        name: fields.text({ label: 'Site name', validation: { isRequired: true } }),
        tagline: fields.text({ label: 'Tagline', validation: { isRequired: true } }),
        promise: fields.text({ label: 'Promise', validation: { isRequired: true } }),
        coreLine: fields.text({ label: 'Core line', validation: { isRequired: true } }),
        description: fields.text({ label: 'Default description', multiline: true }),
        contactEmail: fields.text({ label: 'Contact email', validation: { isRequired: true } }),
        navCtaLabel: fields.text({ label: 'Navigation button label' }),
        navCtaHref: fields.text({ label: 'Navigation button path' }),
        nav: fields.array(link, {
          label: 'Navigation',
          itemLabel: (props) => props.fields.label.value || 'Link',
        }),
        linkGroups: fields.array(
          fields.object({
            title: fields.text({ label: 'Group title' }),
            links: fields.array(link, {
              label: 'Links',
              itemLabel: (props) => props.fields.label.value || 'Link',
            }),
          }),
          { label: 'Footer groups', itemLabel: (props) => props.fields.title.value || 'Group' },
        ),
      },
    }),
    home: singleton({
      label: 'Home',
      path: 'content/home',
      format: { data: 'yaml' },
      previewUrl: '/',
      schema: {
        status,
        kicker: fields.text({ label: 'Kicker' }),
        headline: fields.text({ label: 'Headline' }),
        intro: fields.text({ label: 'Problem', multiline: true }),
        villainTitle: fields.text({ label: 'Teaching title' }),
        villainBody: fields.text({ label: 'Teaching', multiline: true }),
        originTitle: fields.text({ label: 'Background title' }),
        originBody: fields.text({ label: 'Background', multiline: true }),
        revealTitle: fields.text({ label: 'Reveal' }),
        exampleTitle: fields.text({ label: 'Example title' }),
        exampleLede: fields.text({ label: 'Example', multiline: true }),
        proofTitle: fields.text({ label: 'Proof title' }),
        proofBody: fields.text({ label: 'Proof', multiline: true }),
        primaryLabel: fields.text({ label: 'The one button' }),
        primaryHref: fields.text({ label: 'Button path' }),
        circuitKicker: fields.text({ label: 'Diagram kicker' }),
        circuitTitle: fields.text({ label: 'Diagram title' }),
        circuitLede: fields.text({ label: 'Diagram introduction', multiline: true }),
        diagramTitle: fields.text({ label: 'Center title' }),
        diagramLine: fields.text({ label: 'Center line' }),
        coreSupport: fields.text({ label: 'Line under the core sentence', multiline: true }),
        pillars: fields.array(
          fields.object({
            href: fields.text({ label: 'Path' }),
            kicker: fields.text({ label: 'Kicker' }),
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'Pillars', itemLabel: (props) => props.fields.title.value || 'Pillar' },
        ),
        notesKicker: fields.text({ label: 'Notes kicker' }),
        notesTitle: fields.text({ label: 'Notes title' }),
        notesLede: fields.text({ label: 'Notes introduction', multiline: true }),
        newsletterTitle: fields.text({ label: 'Newsletter title' }),
        newsletterLede: fields.text({ label: 'Newsletter introduction', multiline: true }),
      },
    }),
    glossary: singleton({
      label: 'Glossary page',
      path: 'content/glossary',
      format: { data: 'yaml' },
      previewUrl: '/method/glossary',
      schema: {
        status,
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Description', multiline: true }),
        kicker: fields.text({ label: 'Kicker' }),
        lede: fields.text({ label: 'Opening', multiline: true }),
      },
    }),
  },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'content/pages/*',
      format: { data: 'yaml' },
      previewUrl: '/{slug}',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        path: fields.text({
          label: 'Public path',
          description: 'Include the leading slash. The file name should match this path without the slash.',
        }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        status,
        kicker: fields.text({ label: 'Kicker' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        updated: fields.text({ label: 'Updated label', description: 'Shown on legal pages. Leave empty to hide.' }),
        lede: fields.array(fields.text({ label: 'Paragraph', multiline: true }), { label: 'Opening' }),
        table: fields.object({
          caption: fields.text({ label: 'Caption', multiline: true }),
          columns: fields.array(fields.text({ label: 'Column' }), { label: 'Columns' }),
          rows: fields.array(
            fields.object({
              cells: fields.array(fields.text({ label: 'Cell' }), { label: 'Cells' }),
            }),
            { label: 'Rows' },
          ),
        }),
        sections: fields.array(section, {
          label: 'Sections',
          itemLabel: (props) => props.fields.heading.value || 'Section',
        }),
      },
    }),
    steps: collection({
      label: 'Steps',
      slugField: 'name',
      path: 'content/steps/*',
      format: { data: 'yaml' },
      previewUrl: '/method/{slug}',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'One step in an ordered method. This site uses Signal, Switch, Current, Breaker, and Ground.',
          },
        }),
        order: fields.integer({ label: 'Order', validation: { isRequired: true, min: 1 } }),
        status,
        accent: fields.checkbox({ label: 'Accent', description: 'Marks the decision step on the diagram.' }),
        kicker: fields.text({ label: 'Kicker' }),
        line: fields.text({ label: 'Short line' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        lede: fields.array(fields.text({ label: 'Paragraph', multiline: true }), { label: 'Opening' }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Heading' }),
            paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), { label: 'Paragraphs' }),
            bullets: fields.array(fields.text({ label: 'Bullet', multiline: true }), { label: 'Bullets' }),
          }),
          { label: 'Sections', itemLabel: (props) => props.fields.heading.value || 'Section' },
        ),
        caution: fields.text({ label: 'Caution', description: 'On this site, the short circuit.', multiline: true }),
        nextHref: fields.text({ label: 'Next path' }),
        nextLabel: fields.text({ label: 'Next label' }),
      },
    }),
    terms: collection({
      label: 'Terms',
      slugField: 'name',
      path: 'content/terms/*',
      format: { data: 'yaml' },
      previewUrl: '/method/glossary#{slug}',
      schema: {
        name: fields.slug({ name: { label: 'Term' } }),
        order: fields.integer({ label: 'Order', validation: { isRequired: true, min: 1 } }),
        status,
        group: fields.select({
          label: 'Group',
          options: [
            { label: 'Loop', value: 'loop' },
            { label: 'Stage', value: 'stage' },
            { label: 'Tool', value: 'tool' },
          ],
          defaultValue: 'loop',
        }),
        text: fields.text({ label: 'Definition', multiline: true }),
      },
    }),
    notes: collection({
      label: 'Notes',
      slugField: 'title',
      path: 'content/notes/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      previewUrl: '/field-notes/{slug}',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Summary', multiline: true }),
        kicker: fields.text({ label: 'Kicker' }),
        datePublished: fields.date({ label: 'Published', validation: { isRequired: true } }),
        dateModified: fields.date({ label: 'Updated', validation: { isRequired: true } }),
        status,
        featured: fields.checkbox({ label: 'Feature on the home page', defaultValue: false }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },
})
