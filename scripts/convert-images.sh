#!/usr/bin/env bash
set -euo pipefail

# Convert key images to WebP and AVIF if tools are available.
# Requires: cwebp and avifenc (preferred), or ImageMagick 'magick' as fallback.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PUB="$ROOT_DIR/public"

convert_webp() {
  local src="$1"; local dst="$2"
  if command -v cwebp >/dev/null 2>&1; then
    cwebp -q 82 "$src" -o "$dst"
  elif command -v magick >/dev/null 2>&1; then
    magick "$src" -quality 82 "$dst"
  else
    echo "[skip] No cwebp or ImageMagick found for WebP: $src" >&2
  fi
}

convert_avif() {
  local src="$1"; local dst="$2"
  if command -v avifenc >/dev/null 2>&1; then
    avifenc --min 28 --max 32 --speed 6 "$src" "$dst"
  elif command -v magick >/dev/null 2>&1; then
    # ImageMagick may support AVIF via libheif
    magick "$src" -quality 45 "$dst" || echo "[skip] magick failed AVIF for $src" >&2
  else
    echo "[skip] No avifenc or ImageMagick found for AVIF: $src" >&2
  fi
}

main() {
  local files=(
    "Heris-halfbody.JPG"
    "Heris-Headshot.jpg"
  )
  for f in "${files[@]}"; do
    local src="$PUB/$f"
    [ -f "$src" ] || { echo "[warn] Missing $src" >&2; continue; }
    local base="${f%.*}"
    convert_webp "$src" "$PUB/$base.webp"
    convert_avif "$src" "$PUB/$base.avif"
  done
  echo "Done. Created WebP/AVIF where tools were available."
}

main "$@"


