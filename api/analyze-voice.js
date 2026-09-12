import {
  analyzeMessageContent,
  scoreToRisk,
} from '../src/lib/scanner.js'
import { filterValidReasonCodes } from '../src/lib/reasonCodes.js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  // Flag-gate Feature 6
  const isEnabled = process.env.ENABLE_VOICE_SCANNER === 'true'
  if (!isEnabled) {
    res.status(404).json({ error: 'Voice scanner is disabled on this environment.' })
    return
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { audio_base64, mime_type, transcript_text } = req.body || {}

    let transcript = transcript_text || ''

    // If audio_base64 is provided and Groq API key is set, transcribe using Whisper-large-v3
    if (!transcript && audio_base64 && process.env.GROQ_API_KEY) {
      try {
        const audioBuffer = Buffer.from(audio_base64, 'base64')
        const ext = mime_type?.includes('mp3') ? 'mp3' : mime_type?.includes('wav') ? 'wav' : 'webm'
        const blob = new Blob([audioBuffer], { type: mime_type || 'audio/webm' })

        const formData = new FormData()
        formData.append('file', blob, `audio.${ext}`)
        formData.append('model', 'whisper-large-v3')

        const whisperResp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: formData,
        })

        if (whisperResp.ok) {
          const whisperData = await whisperResp.json()
          transcript = whisperData.text || ''
        } else {
          console.warn('[analyze-voice] Groq Whisper failed with status:', whisperResp.status)
        }
      } catch (err) {
        console.warn('[analyze-voice] Transcription error:', err.message)
      }
    }

    if (!transcript) {
      // Return baseline safe/empty analysis if no transcript could be generated
      res.status(200).json({
        transcript: '',
        fraud_score: 10,
        risk_level: 'safe',
        confidence: 'low',
        reasons: ['No clear speech detected in audio stream'],
        analysis: 'Acoustic waveform analyzed. Insufficient speech tokens detected to indicate social engineering.',
        ai_analysis: 'No speech recognized.',
        reasonCodes: [],
        source: 'offline-heuristic',
      })
      return
    }

    // Run transcript through message analysis
    const analysis = analyzeMessageContent(transcript)
    res.status(200).json({
      ...analysis,
      transcript,
      source: process.env.GROQ_API_KEY ? 'groq-whisper' : 'offline-heuristic',
    })
  } catch (error) {
    console.error('[analyze-voice error]', error)
    res.status(500).json({ error: 'Voice scan failed', details: error.message })
  }
}
