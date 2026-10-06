"""Create TikTok-style caption files for Remotion with faster-whisper.

Usage:
    python transcribe.py public/my-video.mp4            # auto-detect language
    python transcribe.py public/my-video.mp4 --lang es  # force a language
    python transcribe.py public/                        # every video in a folder

Writes my-video.json next to the video, in the Caption format that
src/CaptionedVideo reads. Works in any language Whisper supports
(English, Spanish, Italian, German, Swedish, Japanese...).
"""

import argparse
import json
from pathlib import Path

import truststore

# Use the Windows certificate store, so the model download works behind
# networks where Python's own certificate bundle fails.
truststore.inject_into_ssl()

from faster_whisper import WhisperModel  # noqa: E402

VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".webm"}


def transcribe(model: WhisperModel, video: Path, lang: str | None) -> None:
    segments, info = model.transcribe(str(video), language=lang, word_timestamps=True)
    captions = []
    for segment in segments:
        for word in segment.words or []:
            captions.append(
                {
                    "text": word.word,
                    "startMs": round(word.start * 1000),
                    "endMs": round(word.end * 1000),
                    "timestampMs": round((word.start + word.end) / 2 * 1000),
                    "confidence": round(word.probability, 3),
                }
            )
    out = video.with_suffix(".json")
    out.write_text(json.dumps(captions, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{video.name}: {len(captions)} words, language={info.language} -> {out.name}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("path", type=Path, help="A video file or a folder of videos")
    parser.add_argument("--lang", default=None, help="Language code (en, es, it, de, sv, ja). Default: auto-detect")
    parser.add_argument("--model", default="small", help="Whisper model size: tiny, base, small, medium. Default: small")
    args = parser.parse_args()

    videos = (
        sorted(p for p in args.path.iterdir() if p.suffix.lower() in VIDEO_EXTENSIONS)
        if args.path.is_dir()
        else [args.path]
    )
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    for video in videos:
        transcribe(model, video, args.lang)


if __name__ == "__main__":
    main()
