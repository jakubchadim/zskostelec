#!/usr/bin/env node
/**
 * Helper for picking the ElevenLabs narration voice (reads ELEVENLABS_API_KEY
 * from the environment or app/.env.local - never prints it).
 *
 *   node scripts/narration-voices.mjs list               # account voices + Czech library narrators
 *   node scripts/narration-voices.mjs sample <out-dir> <voiceId>[:<label>] ...
 *                                                         # same sample sentence in each voice
 *   node scripts/narration-voices.mjs add <publicOwnerId> <voiceId> <name>
 *                                                         # add a library voice to the account
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(APP, '.env.local')
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)
const KEY = process.env.ELEVENLABS_API_KEY
if (!KEY) {
  console.error('Missing ELEVENLABS_API_KEY')
  process.exit(1)
}
const api = (p, init = {}) =>
  fetch(`https://api.elevenlabs.io${p}`, { ...init, headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', ...init.headers } })

const SAMPLE =
  'Je rok tisíc osm set šedesát osm. Do Kostelce se stěhuje sedmiletý Jiří Guth. Byl to bojácný kluk… nosil brýle a koktal. A kdo by tehdy řekl, že jednou bude stát u zrodu olympijských her?'

const [cmd, ...args] = process.argv.slice(2)

if (cmd === 'list') {
  const mine = await (await api('/v1/voices')).json()
  if (mine.detail) {
    console.error(JSON.stringify(mine.detail))
    process.exit(1)
  }
  console.log('# Account voices')
  for (const v of mine.voices) {
    const l = v.labels ?? {}
    console.log([v.voice_id, v.name, v.category, l.gender, l.age, l.accent, l.description, l.use_case].filter(Boolean).join(' | '))
  }
  for (const gender of ['male', 'female']) {
    const q = new URLSearchParams({ page_size: '15', language: 'cs', gender, sort: 'usage_character_count_1y' })
    const lib = await (await api(`/v1/shared-voices?${q}`)).json()
    console.log(`\n# Library: Czech ${gender}`)
    for (const v of lib.voices ?? []) {
      console.log([v.public_owner_id, v.voice_id, v.name, v.age, v.accent, v.use_case, (v.description ?? '').slice(0, 90)].filter(Boolean).join(' | '))
    }
  }
} else if (cmd === 'sample') {
  const [outDir, ...voices] = args
  fs.mkdirSync(outDir, { recursive: true })
  for (const spec of voices) {
    const [id, label = id] = spec.split(':')
    const res = await api(`/v1/text-to-speech/${id}?output_format=mp3_44100_128`, {
      method: 'POST',
      body: JSON.stringify({
        text: SAMPLE,
        model_id: 'eleven_multilingual_v2',
        language_code: 'cs',
        voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.25 }
      })
    })
    if (!res.ok) {
      console.log(`${label}: ERROR ${res.status} ${await res.text()}`)
      continue
    }
    const file = path.join(outDir, `${label}.mp3`)
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    console.log(`${label}: ${file}`)
  }
} else if (cmd === 'add') {
  const [owner, id, name] = args
  const res = await api(`/v1/voices/add/${owner}/${id}`, { method: 'POST', body: JSON.stringify({ new_name: name }) })
  console.log(res.status, await res.text())
} else {
  console.error('Usage: list | sample <out-dir> <voiceId[:label]>... | add <ownerId> <voiceId> <name>')
  process.exit(1)
}
