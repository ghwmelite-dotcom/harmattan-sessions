import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    sounds: collection({
      label: 'Sounds', slugField: 'name', path: 'src/content/sounds/*', format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        bpmRange: fields.text({ label: 'BPM range', defaultValue: '70–80' }),
        mood: fields.text({ label: 'Mood' }),
        order: fields.integer({ label: 'Order' }),
        chipFrom: fields.text({ label: 'Chip gradient from (hex)' }),
        chipTo: fields.text({ label: 'Chip gradient to (hex)' }),
        blurb: fields.text({ label: 'Blurb', multiline: true }),
      },
    }),
    mixes: collection({
      label: 'Mixes', slugField: 'title', path: 'src/content/mixes/*', format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        primaryGenre: fields.select({ label: 'Primary sound', defaultValue: 'afro_lofi', options: [
          { label: 'Afro-Lofi', value: 'afro_lofi' }, { label: 'Highlife Chill', value: 'highlife_chill' },
          { label: 'Amapiano Lounge', value: 'amapiano_lounge' }, { label: 'Afro-Soul Sunset', value: 'afro_soul_sunset' },
          { label: 'Afro-Jazz Lounge', value: 'afro_jazz_lounge' }, { label: 'Coastal Afro-House', value: 'coastal_house' },
          { label: 'Ancestral Ambient', value: 'ancestral_ambient' }, { label: 'Afrobeats Rain', value: 'afrobeats_rain' } ] }),
        durationSeconds: fields.integer({ label: 'Duration (seconds)' }),
        youtubeVideoId: fields.text({ label: 'YouTube video ID' }),
        thumbnail: fields.image({ label: 'Thumbnail', directory: 'public/mixes', publicPath: '/mixes/' }),
        releasedAt: fields.date({ label: 'Released at' }),
        isPublished: fields.checkbox({ label: 'Published' }),
        description: fields.markdoc({ label: 'Description' }),
      },
    }),
    'field-recordings': collection({
      label: 'Field recordings', slugField: 'location', path: 'src/content/field-recordings/*', format: { data: 'json' },
      schema: {
        location: fields.slug({ name: { label: 'Location' } }),
        description: fields.text({ label: 'Description' }),
        order: fields.integer({ label: 'Order' }),
      },
    }),
  },
});
