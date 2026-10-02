#!/usr/bin/env node
/**
 * Generates the spoken history story (src/components/history/narration.ts)
 * into public/soubory/historie/audio/ and writes the player's manifest
 * (src/components/history/v1/narration-audio.json).
 *
 * Usage (from app/):
 *   node scripts/generate-narration.mjs [provider] [segmentId...]
 *
 * Providers (keys are read from the environment or app/.env.local):
 *   azure       AZURE_SPEECH_KEY, AZURE_SPEECH_REGION (e.g. westeurope)
 *               voice AZURE_VOICE, default cs-CZ-AntoninNeural (deep male), pitched a bit lower
 *   elevenlabs  ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID (a deep male voice), model eleven_multilingual_v2
 *   openai      OPENAI_API_KEY, voice OPENAI_VOICE (default onyx), model gpt-4o-mini-tts
 *   say         macOS `say` with the Czech voice Zuzana - offline placeholder only
 *
 * Pass segment ids to regenerate only those (e.g. after editing one chapter).
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { NARRATION } from '../src/components/history/narration.ts'

const APP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(APP, 'public/soubory/historie/audio')
const MANIFEST = path.join(APP, 'src/components/history/v1/narration-audio.json')
const PUBLIC_PREFIX = '/soubory/historie/audio'

const envFile = path.join(APP, '.env.local')
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)

const [provider = 'say', ...only] = process.argv.slice(2)
const segments = only.length ? NARRATION.filter((s) => only.includes(s.id)) : NARRATION

function need(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing ${name} (set it in the environment or app/.env.local)`)
    process.exit(1)
  }
  return value
}

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function azure(text) {
  const key = need('AZURE_SPEECH_KEY')
  const region = need('AZURE_SPEECH_REGION')
  const voice = process.env.AZURE_VOICE || 'cs-CZ-AntoninNeural'
  // "…" becomes a dramatic pause; pitch/rate a touch lower for a deep storyteller voice.
  const body = escapeXml(text).replace(/…/g, '<break time="700ms"/>')
  const ssml = `<speak version="1.0" xml:lang="cs-CZ"><voice name="${voice}"><prosody pitch="-10%" rate="-6%">${body}</prosody></voice></speak>`
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
      'User-Agent': 'zskostelec-narration'
    },
    body: ssml
  })
  if (!res.ok) throw new Error(`Azure ${res.status}: ${await res.text()}`)
  return { data: Buffer.from(await res.arrayBuffer()), ext: 'mp3' }
}

async function elevenlabs(text) {
  const key = need('ELEVENLABS_API_KEY')
  const voice = need('ELEVENLABS_VOICE_ID')
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      language_code: 'cs',
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.25 }
    })
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return { data: Buffer.from(await res.arrayBuffer()), ext: 'mp3' }
}

async function openai(text) {
  const key = need('OPENAI_API_KEY')
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: process.env.OPENAI_VOICE || 'onyx',
      input: text,
      instructions:
        'Mluv spisovnou češtinou s českou výslovností. Hluboký, klidný a vřelý mužský hlas vypravěče příběhů pro děti, s pauzami na tečkách.',
      response_format: 'mp3'
    })
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  return { data: Buffer.from(await res.arrayBuffer()), ext: 'mp3' }
}

async function say(text, id) {
  const tmp = path.join(OUT_DIR, `${id}.aiff`)
  execFileSync('say', ['-v', 'Zuzana', '-r', '170', '-o', tmp, text.replace(/…/g, '... ')])
  const out = path.join(OUT_DIR, `${id}.m4a`)
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', tmp, out])
  fs.rmSync(tmp)
  return { file: out, ext: 'm4a' }
}

/** Duration in seconds via macOS afinfo (good enough for the progress bar; the player also reads real durations). */
function durationOf(file) {
  try {
    const info = execFileSync('afinfo', [file], { encoding: 'utf8' })
    const m = info.match(/estimated duration: ([\d.]+)/)
    return m ? Math.round(Number(m[1]) * 10) / 10 : null
  } catch {
    return null
  }
}

const PROVIDERS = { azure, elevenlabs, openai, say }
if (!PROVIDERS[provider]) {
  console.error(`Unknown provider "${provider}". Use one of: ${Object.keys(PROVIDERS).join(', ')}`)
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { voice: '', segments: [] }

for (const segment of segments) {
  process.stdout.write(`${segment.id}… `)
  const result = await PROVIDERS[provider](segment.text, segment.id)
  let file = result.file
  if (!file) {
    file = path.join(OUT_DIR, `${segment.id}.${result.ext}`)
    fs.writeFileSync(file, result.data)
  }
  // Drop a stale file in the other format, so only one version is published.
  for (const ext of ['mp3', 'm4a']) {
    const other = path.join(OUT_DIR, `${segment.id}.${ext}`)
    if (other !== file && fs.existsSync(other)) fs.rmSync(other)
  }
  const entry = { id: segment.id, src: `${PUBLIC_PREFIX}/${path.basename(file)}`, duration: durationOf(file) }
  const idx = manifest.segments.findIndex((s) => s.id === segment.id)
  if (idx === -1) manifest.segments.push(entry)
  else manifest.segments[idx] = entry
  console.log(`${entry.duration ?? '?'} s`)
}

// Keep the manifest in narration order and drop segments that no longer exist.
const order = NARRATION.map((s) => s.id)
manifest.segments = manifest.segments.filter((s) => order.includes(s.id)).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
manifest.voice = { azure: 'Antonín (Azure)', elevenlabs: 'ElevenLabs', openai: 'OpenAI', say: 'Zuzana (macOS, zkušební)' }[provider]
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Wrote ${path.relative(APP, MANIFEST)}`)
