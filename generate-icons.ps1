# Icon Generation Script
# This script helps you generate proper app icons from your profile image

# Requirements:
# 1. Install ImageMagick: https://imagemagick.org/script/download.php#windows
# 2. Or use an online tool like: https://favicon.io/favicon-converter/
# 3. Or use VS Code extension: "Image Preview" and manual resize

# Icon sizes needed:
# - favicon.ico (16x16, 32x32, 48x48)
# - favicon-16x16.png (16x16)
# - favicon-32x32.png (32x32)
# - apple-touch-icon.png (180x180)
# - android-chrome-192x192.png (192x192)
# - android-chrome-512x512.png (512x512)

# If you have ImageMagick installed, run these commands in PowerShell:

# Generate favicon sizes
# magick charles_passport_size.png -resize 16x16 favicon-16x16.png
# magick charles_passport_size.png -resize 32x32 favicon-32x32.png
# magick charles_passport_size.png -resize 48x48 temp-48x48.png

# Generate Apple touch icon
# magick charles_passport_size.png -resize 180x180 apple-touch-icon.png

# Generate Android Chrome icons
# magick charles_passport_size.png -resize 192x192 android-chrome-192x192.png
# magick charles_passport_size.png -resize 512x512 android-chrome-512x512.png

# Generate multi-size favicon.ico
# magick favicon-16x16.png favicon-32x32.png temp-48x48.png favicon.ico

# Alternative: Online Tools
echo "Visit these online tools to generate icons from charles_passport_size.png:"
echo "1. https://favicon.io/favicon-converter/"
echo "2. https://www.favicon-generator.org/"
echo "3. https://realfavicongenerator.net/"
echo ""
echo "Upload your charles_passport_size.png and download the generated icon pack."
echo "Then replace the existing icon files in the public folder."
