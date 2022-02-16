import tkinter as tk
import screeninfo
from screeninfo import get_monitors
# Gets Screen Dimensions
screen = tk.Tk()
screenWidth = screen.winfo_screenwidth()
screenHeight = screen.winfo_screenheight()
print('Screen Height: {}'.format(screenHeight))
print('Screen Width: {}'.format(screenWidth))
for m in get_monitors():
    print(str(m))
# Gets screen dimensions from primary monitor
for m in get_monitors():
    if m.is_primary:
        screenHeight = m.height
        screenWidth = m.width
exit()