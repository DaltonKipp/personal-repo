import turtle
import time

t = turtle.Turtle()
screen = turtle.Screen()
screen.setup(width=1.0,height=1.0)
screen.bgcolor("black")
t.width(5)
t.speed(100)
col = ('red','white','cyan','black')
def colors(i):
    return col[i%3]
#iter = int(input('Number of iterations: '))
iter = 50
def right(i,angle):
    t.pencolor(colors(i))
    t.forward(i*10+i)
    t.right(angle)

def left(i,angle):
    t.pencolor(colors(i))
    t.forward(i*10+i)
    t.left(angle)

def top_left(i,angle):
    bottom_right(-i,angle)
    t.setpos(0,0)

def top_right(i,angle):
    right(i,-angle)
    left(i,-angle)
    left(i,-angle)
    left(i,-angle)
    t.setpos(0,0)

def bottom_right(i,angle):
    right(i,angle)
    right(i,angle)
    right(i,angle)
    right(i,angle)
    t.setpos(0,0)

def bottom_left(i,angle):
    top_right(-i,angle)
    t.setpos(0,0)

for i in range(0,iter):
    top_left(i,90)
    top_right(i,-90)
    bottom_right(i,-90)
    bottom_left(i,90)

time.sleep(1)
    