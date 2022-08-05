# Image RGB Pixels to CSV 
# Source: https://stackoverflow.com/questions/67831382/obtaining-rgb-data-from-image-and-writing-it-to-csv-file-with-the-corresponding

'''
GOALS:
- TAKE AN IMAGE AND CONVERT IT TO A TERMINAL PRINTOUT USING UNICODE CHARACTERS
    - USE A FLAG TO INPUT FILE PATH
    - SAVE TO A CSV
    - PRINTOUT BASED ON THE HEIGHTAND WIDTH OF THE TERMINAL
    - MAKE A NEW IMAGE FILE AFTER CONVERSION
'''

from PIL import Image
import numpy as np

img = Image.open('C:/Users/nomad/personal-repo/test_files/chicken.jpg')
# img = Image.open('C:/Users/nomad/personal-repo/test_files/taco.jpg')
print('Inspect a few pixels in the original image:')
for y in np.arange(3):
    for x in np.arange(3):
        print(x, y, img.getpixel((x, y)))

# Modified for RGB images from: https://stackoverflow.com/a/60783743/11089932
img_np = np.array(img)
xy_coords = np.flip(np.column_stack(np.where(np.all(img_np >= 0, axis=2))), axis=1)
rgb = np.reshape(img_np, (np.prod(img_np.shape[:2]), 3))

# Add pixel numbers in front
pixel_numbers = np.expand_dims(np.arange(1, xy_coords.shape[0] + 1), axis=1)
value = np.hstack([pixel_numbers, xy_coords, rgb])
print('\nCompare pixels in result:')
for y in np.arange(3):
    for x in np.arange(3):
        print(value[(value[:, 1] == x) & (value[:, 2] == y)])

# Properly save as CSV
np.savetxt("chicken.csv", value, delimiter='\t', fmt='%4d')
print('File saved as "chicken.csv" in the current directory')