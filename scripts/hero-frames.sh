#!/bin/sh
# Cuts the hero's city timelapse into the frames the homepage scroll plays (see HERO_CITY in lib/home.ts).
# Usage: scripts/hero-frames.sh <video.mp4> [frames=72]
# Writes public/media/home/city/NNN.webp (1600×900) and public/media/home/city/m/NNN.webp (720×960 centre crop for phones).
set -eu
src=$1; count=${2:-72}
out=public/media/home/city
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
fps=$(echo "$count / $dur" | bc -l)
ffmpeg -loglevel error -y -i "$src" -vf "fps=$fps,scale=1600:900:flags=lanczos" -frames:v "$count" -start_number 0 "$tmp/%03d.png"
rm -rf "$out"; mkdir -p "$out/m"
for f in "$tmp"/*.png; do
 n=$(basename "$f" .png)
 cwebp -quiet -q 62 -m 6 -af "$f" -o "$out/$n.webp"
 # Phones: a 3:4 window around the centre, a little below middle where the homes are.
 ffmpeg -loglevel error -y -i "$f" -vf "crop=675:900:462:0,scale=720:960:flags=lanczos" "$tmp/m.png"
 cwebp -quiet -q 58 -m 6 "$tmp/m.png" -o "$out/m/$n.webp"
done
ls "$out" | grep -c webp
du -sh "$out" "$out/m"
