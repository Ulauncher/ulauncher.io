#!/bin/bash
set -uo pipefail

# Demo generation script:
# - Cycle through screenshots (animated WebP)
# - Knock out the solid background → transparency
# - Smooth animation between frames (crossfade, not just cuts)

ORIGINAL_BACKGROUND_COLOR="white"  # Adjust if needed

INPUT_DIR="cleaned"
rm -rf "$INPUT_DIR"
mkdir -p "$INPUT_DIR"
for img in *.png; do
  echo "Removing background from $img"
  convert "$img" -fuzz 15% -fill none -floodfill +0+0 $ORIGINAL_BACKGROUND_COLOR "$INPUT_DIR/$img"
done

# Directory containing cleaned PNGs
# Directory for generated frames
OUTPUT_DIR="frames"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Number of frames per transition (controls smoothness)
TRANSITION_FRAMES=10

# Frame rate for the output (fps)
FRAME_RATE=30

# Delay between transitions in seconds
DELAY_SECONDS=2

# Calculate number of hold frames for the delay
HOLD_FRAMES=$((DELAY_SECONDS * FRAME_RATE))

# Rename all files in INPUT_DIR to format 'imd\g{number}.png'.
count=1
for img in "$INPUT_DIR"/*.png; do
    mv "$img" "$INPUT_DIR/imd$(printf "%03d" $count).png"
    ((count++))
done

# Read all PNGs in sorted order
mapfile -t IMAGES < <(ls "$INPUT_DIR"/*.png | sort)
echo "Found ${#IMAGES[@]} images for processing."

FRAME_COUNT=0

# Loop over consecutive image pairs
for ((i=0; i<${#IMAGES[@]}-1; i++)); do
    echo "Processing transition from ${IMAGES[i]} to ${IMAGES[i+1]}"
    IMG1="${IMAGES[i]}"
    IMG2="${IMAGES[i+1]}"

    # Copy the first image as the starting frame
    cp "$IMG1" "$OUTPUT_DIR/frame_$(printf "%04d" $FRAME_COUNT).png"
    ((FRAME_COUNT++))

    # Generate hold frames for delay
    for ((f=1; f<=HOLD_FRAMES; f++)); do
        cp "$IMG1" "$OUTPUT_DIR/frame_$(printf "%04d" $FRAME_COUNT).png"
        ((FRAME_COUNT++))
    done

    # Generate crossfade frames
    for ((f=1; f<=TRANSITION_FRAMES; f++)); do
        # Blend factor between 0 and 1
        echo "  Generating frame $f of $TRANSITION_FRAMES"
        alpha=$(awk "BEGIN{print $f/$((TRANSITION_FRAMES+1))}")
        ffmpeg -y -i "$IMG1" -i "$IMG2" -filter_complex \
            "[0][1]blend=all_expr='A*(1-$alpha)+B*$alpha'" \
            -frames:v 1 "$OUTPUT_DIR/frame_$(printf "%04d" $FRAME_COUNT).png" > /dev/null 2>&1
        ((FRAME_COUNT++))
    done
done

# Copy the last image as the final frame
cp "${IMAGES[-1]}" "$OUTPUT_DIR/frame_$(printf "%04d" $FRAME_COUNT).png"

# Generate hold frames for the last image
for ((f=1; f<=HOLD_FRAMES; f++)); do
    cp "${IMAGES[-1]}" "$OUTPUT_DIR/frame_$(printf "%04d" $FRAME_COUNT).png"
    ((FRAME_COUNT++))
done

echo "Generated $FRAME_COUNT frames in $OUTPUT_DIR"

echo "Convert frames to animated WebP"
ffmpeg -y -framerate $FRAME_RATE -i frames/frame_%04d.png -loop 0 -lossless 0 -qscale 50 out.webp

echo "Saved animated WebP as out.webp"