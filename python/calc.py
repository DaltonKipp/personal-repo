# Bing AI

# Import tkinter module for GUI
import tkinter as tk

# Create a window
window = tk.Tk()
window.title("Calculator")

# Create an entry widget to display the result
entry = tk.Entry(window, width=20)
entry.grid(row=0, column=0, columnspan=4)

# Define the functions for each button
def clear():
    # Clear the entry widget
    entry.delete(0, tk.END)

def append(value):
    # Append a value to the entry widget
    entry.insert(tk.END, value)

def evaluate():
    # Evaluate the expression in the entry widget
    try:
        result = eval(entry.get())
        entry.delete(0, tk.END)
        entry.insert(0, result)
    except:
        entry.delete(0, tk.END)
        entry.insert(0, "Error")

# Create buttons for digits and operators
buttons = [
    ["C", "/", "*", "-"],
    ["7", "8", "9", "+"],
    ["4", "5", "6", "="],
    ["1", "2", "3", ""],
    ["0", ".", "", ""]
]

# Add buttons to the window using a loop
for i in range(len(buttons)):
    for j in range(len(buttons[i])):
        # Get the value of the button
        value = buttons[i][j]
        # Create a lambda function to pass the value as an argument
        command = lambda x=value: append(x) if x != "=" else evaluate()
        # Create a button with the value and command
        button = tk.Button(window, text=value, width=5, command=command)
        # Add the button to the window
        button.grid(row=i+1, column=j)

# Start the main loop
window.mainloop()