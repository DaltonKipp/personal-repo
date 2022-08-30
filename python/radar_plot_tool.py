import json
from msilib import Table
from xml.dom.minidom import Element
import matplotlib
import numpy as np
from mpl_toolkits import mplot3d
import rich
from rich.console import Console
from rich.table import Table
import matplotlib.pyplot as plt

table = Table(title="Radar Data Coordinate Points")
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
            x = data[item]['points'][ele]['x']
            y = data[item]['points'][ele]['y']
            z = data[item]['points'][ele]['z']
            # console.print('[ {0:<6} ]  X: {1:<6.2f}  |  Y: {2:<6.2f}  |  Z: {3:<6.2f}  |'.format(count,x,y,z))
            points.append([x,y,z])
            
x_array = []
y_array = []
z_array = []

table.add_column(" X ", justify="right", style="cyan", no_wrap=True)
table.add_column(" Y ", style="magenta")
table.add_column(" Z ", justify="right", style="green")
for item in range(len(points)):
    x_array.append(points[item][0])
    y_array.append(points[item][1])
    z_array.append(points[item][2])
    #table.add_row(x_array[item],y_array[item],z_array[item])

console.print(x_array[1])

console.print(table)
fig = plt.figure()
ax = plt.axes(projection='3d')
ax.scatter(x_array,y_array,z_array)
plt.show()