from solid import *
from solid.utils import *
import viewscad
d = []
for i in range(0,100):
    cube(i) + right(5+i)(sphere(5+i)) - up(i)(cylinder(r=2, h=6))

a = difference()(
    cube(100),  # Note the comma between each element!
    sphere(150),
    cylinder(50)
)
scad_render_to_file(a,'test_a.scad')
renderer = viewscad.Renderer(openscad_exec='./test_a.scad')
scad_render_to_file(d,'test_d.scad')
renderer = viewscad.Renderer(openscad_exec='./test_d.scad')
