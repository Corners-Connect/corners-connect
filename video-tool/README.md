# Corners video tool

Turns a raw talking video (interview, vlog, street question) into a **vertical 1080×1920 clip with TikTok-style animated captions in the Corners look**, ready for TikTok, Instagram Reels and YouTube Shorts.

Built with [Remotion](https://www.remotion.dev) (the professor's recommendation) from its TikTok-captions template, plus [faster-whisper](https://github.com/SYSTRAN/faster-whisper) for transcription in any language.

Owned by **Operations**, built for **Audience**.

## What it does

1. **Transcribes** the video word by word (English, Spanish, Italian, German, Swedish, Japanese… auto-detected).
2. **Shows captions** a few words at a time, with the spoken word highlighted.
3. **Adds the Corners logo** in the top-left corner.
4. **Renders** an MP4 ready to post.

Brand settings:
- Captions: off-white `#F4F1EC` with a logo-brown outline `#452E26`; the spoken word in blue `#8FD0FA`. Set in `src/CaptionedVideo/Page.tsx`.
- Logo: `public/corners-logo.png`. Its position is set in `src/CaptionedVideo/index.tsx`.

> **Open question for the team:** the logo is pale blue on brown, while the website is near-black with baby blue. We should pick one palette for videos, website and pitch.

## Setup (once)

You need [Node.js](https://nodejs.org) 20+, [Python](https://www.python.org) 3.12 and [ffmpeg](https://ffmpeg.org).

```bash
cd video-tool
npm install
python -m pip install -r requirements.txt
```

The first transcription downloads the Whisper `small` model (a few hundred MB, only once).

## Make a clip

1. Put the video in `public/`, e.g. `public/interview-01.mp4`. Only use footage where everyone on camera agreed to be published.
2. Create the captions:
   ```bash
   python transcribe.py public/interview-01.mp4
   ```
   This writes `public/interview-01.json`. Add `--lang es` (or `it`, `de`, `sv`, `ja`…) to force a language.
3. Preview it in Remotion Studio:
   ```bash
   npm run dev
   ```
   In the right-hand panel, set `src` to `interview-01.mp4`. Check the captions and fix any wrong words directly in the `.json` file.
4. Render the final video:
   ```bash
   npx remotion render CaptionedVideo out/interview-01.mp4 --props='{"src":"interview-01.mp4"}'
   ```

## Rules

- **Don't commit videos** to this repo (GitHub blocks files over 100 MB, and the repo would become huge). Raw and finished videos live in the team's shared drive folder. The only exception is `public/sample-video.mp4`, Remotion's 4 MB demo, so the Studio opens out of the box.
- **Consent first:** only publish people who agreed to it.
- **Check captions before posting,** especially names, places and anything in another language. A person reviews every clip.

## Licence

Remotion is free for individuals and teams of **up to 3 people**. Corners is 12, so check whether we need a company licence: https://www.remotion.pro/license
