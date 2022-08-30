from array import array
import json
from msilib import Table
from xml.dom.minidom import Element
import matplotlib
import numpy as np
from mpl_toolkits import mplot3d
import rich
from rich.console import Console
from rich.table import Table
from rich import box
import matplotlib.pyplot as plt

table = Table(title="Radar Data Coordinate Points",
              padding=(0,2),
              box=box.SQUARE_DOUBLE_HEAD,
              width=80)
console = Console()

with open('C:/Users/nomad/Downloads/radar-data-2022-08-30T16_19_24.298Z.json','rt') as json_file:
    json_load = json.load(json_file)
data = json_load

# print("Length of data: ",len(data))
# print("Length of points in data: ",len(data[1]['points']))
# console.print("\n\ndata[1] = ",data[1])
# console.print("\n\ndata[1]['points'] = ",data[1]['points'])
# console.print("\n\ndata[1]['points'][3] = ",data[1]['points'][3])
# console.print("\n\ndata[1]['points'][3]['x'] = ",data[1]['points'][3]['x'],'\n')

count = 0
points = []
for item in range (1,len(data)):
    length = len(data[item]['points'])
    if length != 0:
        for ele in range(0,length):
            count += 1
            x = abs(data[item]['points'][ele]['x'])
            y = abs(data[item]['points'][ele]['y'])
            z = abs(data[item]['points'][ele]['z'])
            console.print('| {0:>6} | X: {1:>5.2f} | Y: {2:>5.2f} | Z: {3:>5.2f} |'.format(count,x,y,z))
            points.append([x,y,z])
# console.print("{0:-80}".format(''))            
x_array = []
y_array = []
z_array = []
num = np.arange(len(points))

table.add_column("#", justify="center", style="cyan", no_wrap=True)
table.add_column("X Points", justify="center", style="cyan", no_wrap=True)
table.add_column("Y Points", justify="center")
table.add_column("Z Points", justify="center", style="green")
for item in range(len(points)):
    x_array.append(points[item][0])
    y_array.append(points[item][1])
    z_array.append(points[item][2])
    a1, b2, c3 = str(x_array[item],y_array[item],z_array[item])
    table.add_row(a1,b2,c3)

console.print(y_array)

console.print(x_array[1])

console.print(table)
fig = plt.figure()
ax = plt.axes(projection='3d')
ax.scatter(x_array,y_array,z_array)
plt.show()