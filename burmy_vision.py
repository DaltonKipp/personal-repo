import time
import re
import argparse
import math
import colorama
from colorama import Fore, Style, Back

# Available colors
BLUE = Fore.BLUE
WHITE = Fore.WHITE
RED = Fore.RED
GREEN = Fore.GREEN
YELLOW = Fore.YELLOW
MAGENTA = Fore.MAGENTA
CYAN = Fore.CYAN
BLACK = Fore.BLACK
BK_WHITE = Back.WHITE
BK_CYAN = Back.CYAN
RESET_ALL = Fore.RESET + Style.RESET_ALL
BRIGHT = Style.BRIGHT

# Fore: BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, RESET.
# Back: BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, RESET.
# Style: DIM, NORMAL, BRIGHT, RESET_ALL

class GraphObj:
    def __init__(self, title='->',     # str - Title of the value being graphed
                 val_fmt='{:5.2f}',    # str - Number format of value
                 val_symbol='#',       # str - single ascii char that will represent the value
                 max_val=10.0,         # float - maximum value 
                 axis_length=25,       # int - length of axis in char length
                 negative_symbol='-',  # str - symbol to use for negative values
                 color=''              # colors - colors listed under Available Colors above.
                ):
        self.title=title
        self.val_fmt=val_fmt
        self.val_symbol=val_symbol
        self.max_val=max_val
        self.axis_length=axis_length
        self.negative_symbol=negative_symbol
        self.color=color
        self.val = 0.0

    def new_value(self, value):
        self.val = value
        return self

class RealTimeGraph:
    def __init__(self):
        self.data_start = time.time()
        self.graph_list = []

    def disp_graph(self):
        # graphs everything 
        elapsed_time = str(time.time() - self.data_start)
        re_match = re.search(r'\.[0-9]{2}', elapsed_time)
        if re_match:
            ms_str = re_match.group(0)
            time_str = 'T:{} |'.format(ms_str)
        else:
            ms_str = 'mnmnmnm'
            time_str = 'T:{} |'.format(ms_str)
        graph_str = time_str

        for g in self.graph_list:
            graph_str += self.plot_graph(g)

        print(graph_str)

        # clear the graphlist so that it can be populated next loop
        self.graph_list = []

    def add_plot(self, graph_obj):
        self.graph_list.append(graph_obj)

    def plot_graph(self, g):
        val_title = g.title
        val = g.val
        val_format = g.val_fmt
        val_symbol = g.val_symbol
        max_val = g.max_val
        axis_length = g.axis_length
        negative_symbol = g.negative_symbol
        color = g.color
        scale = max_val/axis_length

        if not val:
            val = 0.0
        try:
            if val < 0:
                histogram = abs(round(val / scale)) * negative_symbol
            else:
                histogram = abs(round(val / scale)) * val_symbol
        except:
            histogram = (abs(round(max_val / scale)) - 1) * val_symbol + 'i'
        
        
        val_hist_format = '{:<' + str(axis_length) + '}'

        graph_str = ' ' + val_title + ':' + val_format + ' ' + color + val_hist_format + RESET_ALL +'|'
        graph_str = graph_str.format(val, histogram)

        return graph_str

def main():
    x = 0
    test_plot = RealTimeGraph()
    other = RealTimeGraph()
    test_plot2 = RealTimeGraph()
    other2 = RealTimeGraph()
    sin_graph = GraphObj(title='sin', val_fmt='{:6.2f}',
                         val_symbol='/', max_val=1,
                         axis_length= 80, negative_symbol='<',
                         color=BLACK + BRIGHT)

    cos_graph = GraphObj(title='cos', val_fmt='{:6.2f}',
                         val_symbol="/", max_val=1,
                         axis_length= 80, negative_symbol='<',
                         color=GREEN + BRIGHT)
    sin_graph2 = GraphObj(title='sin', val_fmt='{:6.2f}',
                         val_symbol='/', max_val=1,
                         axis_length= 80, negative_symbol='<',
                         color=RED + BRIGHT)

    cos_graph2 = GraphObj(title='cos', val_fmt='{:6.2f}',
                         val_symbol="/", max_val=1,
                         axis_length= 80, negative_symbol='<',
                         color=BLUE + BRIGHT)

    while True:
        x += 0.01

        test_plot.add_plot(sin_graph.new_value(math.sin(x)))
        other.add_plot(cos_graph.new_value(math.cos(x)))
        test_plot2.add_plot(cos_graph2.new_value(math.cos(x*2.5)))
        other2.add_plot(sin_graph2.new_value(math.sin(x*3.6)))

        test_plot.disp_graph()
        other.disp_graph()
        test_plot2.disp_graph()
        other2.disp_graph()

        time.sleep(0.02)

if __name__ == '__main__':
    main()