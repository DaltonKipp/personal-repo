from turtle import color
from rich.console import Console
from rich.table import Table
from rich import box
console = Console()
console.print('\n')
table = Table(title="Star Wars Movies",
              padding=(0,2),
              box=box.SQUARE,
              caption="rich table",
              highlight=True)
table.add_column("Released", justify="left", style="green", no_wrap=False)
table.add_column("Title", justify="left",style="green")
table.add_column("Box Office", justify="left", style="green")
table.add_row("Dec 20, 2019", "Star Wars: The Rise of Skywalker", "$952,110,690")
table.add_row("May 25, 2018", "Solo: A Star Wars Story", "$393,151,347")
table.add_row("Dec 15, 2017", "Star Wars Ep. V111: The Last Jedi", "$1,332,539,889")
table.add_row("Dec 16, 2016", "Rogue One: A Star Wars Story", "$1,332,439,889")
console.print(table)
console.print('\n')