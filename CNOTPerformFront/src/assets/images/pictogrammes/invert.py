from PIL import Image, ImageOps

# Load the image
image_path = "athletisme.png"
image = Image.open(image_path)

# Invert colors to have white text and black background
inverted_image = ImageOps.invert(image.convert("RGB"))

# Save the modified image
output_path = "athletisme_inverted.png"
inverted_image.save(output_path)

output_path