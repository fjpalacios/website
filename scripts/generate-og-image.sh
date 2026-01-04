#!/bin/bash

# Script to generate Open Graph images with text or logos
# Usage:
#   ./scripts/generate-og-image.sh text "Your text here" "#FF5733" output.jpg
#   ./scripts/generate-og-image.sh logo path/to/logo.svg "#FF5733" output.jpg
#   ./scripts/generate-og-image.sh logo path/to/logo.svg "gradient:rgb(45,65,95)-rgb(60,85,120)-rgb(45,65,95)" output.jpg

set -e

MODE="$1"
CONTENT="$2"
BG_COLOR="$3"
OUTPUT="$4"

# Default values
WIDTH=1840
HEIGHT=720
BORDER_SIZE=100
BORDER_OPACITY=0.21
BORDER_DARKEN=21  # Percentage to darken border for gradients
FONT="Press-Start-2P-Regular"
FONT_SIZE=72
TEXT_COLOR="white"

# Validate arguments
if [ -z "$MODE" ] || [ -z "$CONTENT" ] || [ -z "$BG_COLOR" ] || [ -z "$OUTPUT" ]; then
    echo "Usage:"
    echo "  Text mode: $0 text \"Your text\" \"#COLOR\" output.jpg"
    echo "  Logo mode: $0 logo path/to/logo.svg \"#COLOR\" output.jpg"
    echo "  Gradient mode: $0 logo path/to/logo.svg \"gradient:rgb(R,G,B)-rgb(R,G,B)-rgb(R,G,B)\" output.jpg"
    exit 1
fi

# Detect if BG_COLOR is a gradient or solid color
if [[ "$BG_COLOR" == gradient:* ]]; then
    USE_GRADIENT=true
    GRADIENT_SPEC="${BG_COLOR#gradient:}"
else
    USE_GRADIENT=false
fi

# Create temporary directory
TMP_DIR="/tmp/og-image-$$"
mkdir -p "$TMP_DIR"

# Cleanup on exit
trap "rm -rf $TMP_DIR" EXIT

# Function to create base image with background and border
create_base_image() {
    local output_file="$1"
    
    if [ "$USE_GRADIENT" = true ]; then
        # Create base gradient
        magick -size ${WIDTH}x${HEIGHT} gradient:"$GRADIENT_SPEC" "$TMP_DIR/base_gradient.jpg"
        
        # Darken entire image for border effect (more visible)
        magick "$TMP_DIR/base_gradient.jpg" -fill black -colorize ${BORDER_DARKEN}% "$TMP_DIR/darkened_full.jpg"
        
        # Create inner gradient (lighter, original colors)
        magick -size $((WIDTH - 2*BORDER_SIZE))x$((HEIGHT - 2*BORDER_SIZE)) gradient:"$GRADIENT_SPEC" "$TMP_DIR/inner_gradient.jpg"
        
        # Composite inner over darkened base to create border effect
        magick "$TMP_DIR/darkened_full.jpg" "$TMP_DIR/inner_gradient.jpg" -geometry +${BORDER_SIZE}+${BORDER_SIZE} -composite "$output_file"
    else
        # Create solid color background with border
        magick -size ${WIDTH}x${HEIGHT} xc:"$BG_COLOR" \
          -fill "rgba(0,0,0,$BORDER_OPACITY)" -draw "rectangle 0,0 $WIDTH,$HEIGHT" \
          -fill "$BG_COLOR" -draw "rectangle $BORDER_SIZE,$BORDER_SIZE $((WIDTH-BORDER_SIZE)),$((HEIGHT-BORDER_SIZE))" \
          "$output_file"
    fi
}

if [ "$MODE" = "text" ]; then
    # Text mode
    TEXT="$CONTENT"
    
    # Check if text is too long and needs line break
    TEXT_LENGTH=${#TEXT}
    
    if [ $TEXT_LENGTH -gt 20 ]; then
        # Split text into two lines at the middle space
        MIDDLE=$((TEXT_LENGTH / 2))
        
        # Find the position of the space closest to the middle
        SPACE_POS=-1
        MIN_DIST=$TEXT_LENGTH
        
        for ((i=0; i<TEXT_LENGTH; i++)); do
            if [ "${TEXT:$i:1}" = " " ]; then
                DIST=$((i - MIDDLE))
                [ $DIST -lt 0 ] && DIST=$((-DIST))
                if [ $DIST -lt $MIN_DIST ]; then
                    MIN_DIST=$DIST
                    SPACE_POS=$i
                fi
            fi
        done
        
        if [ $SPACE_POS -gt 0 ]; then
            LINE1="${TEXT:0:$SPACE_POS}"
            LINE2="${TEXT:$((SPACE_POS + 1))}"
        else
            LINE1="$TEXT"
            LINE2=""
        fi
        
        # Use smaller font size for two lines
        MULTILINE_FONT_SIZE=72
        
        # Create base image with border
        create_base_image "$TMP_DIR/base.jpg"
        
        # Add first line of text
        magick "$TMP_DIR/base.jpg" \
          -font "$FONT" -pointsize $MULTILINE_FONT_SIZE -fill "$TEXT_COLOR" \
          -gravity center -annotate +0-55 "$LINE1" \
          "$TMP_DIR/with_text1.jpg"
        
        # Add second line of text
        magick "$TMP_DIR/with_text1.jpg" \
          -font "$FONT" -pointsize $MULTILINE_FONT_SIZE -fill "$TEXT_COLOR" \
          -gravity center -annotate +0+55 "$LINE2" \
          "$OUTPUT"
    else
        # Single line text
        create_base_image "$TMP_DIR/base.jpg"
        
        magick "$TMP_DIR/base.jpg" \
          -font "$FONT" -pointsize $FONT_SIZE -fill "$TEXT_COLOR" \
          -gravity center -annotate +0+0 "$TEXT" \
          "$OUTPUT"
    fi
    
elif [ "$MODE" = "logo" ]; then
    # Logo mode
    LOGO_PATH="$CONTENT"
    
    if [ ! -f "$LOGO_PATH" ]; then
        echo "Error: Logo file not found: $LOGO_PATH"
        exit 1
    fi
    
    # Convert logo to PNG (keep original colors)
    # Note: Use a white logo for best contrast against colored backgrounds
    LOGO_EXT="${LOGO_PATH##*.}"
    if [ "$LOGO_EXT" = "svg" ]; then
        magick "$LOGO_PATH" -background none -resize 400x400 "$TMP_DIR/logo.png"
        LOGO_TO_USE="$TMP_DIR/logo.png"
    else
        magick "$LOGO_PATH" -resize 400x400 "$TMP_DIR/logo.png"
        LOGO_TO_USE="$TMP_DIR/logo.png"
    fi
    
    # Create base image with border
    create_base_image "$TMP_DIR/base.jpg"
    
    # Composite logo on top
    magick "$TMP_DIR/base.jpg" "$LOGO_TO_USE" -gravity center -compose over -composite "$OUTPUT"
    
else
    echo "Error: Invalid mode '$MODE'. Use 'text' or 'logo'"
    exit 1
fi

echo "✓ Image generated: $OUTPUT"
