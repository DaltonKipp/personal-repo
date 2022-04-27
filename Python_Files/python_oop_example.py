# Python OOP
from calendar import weekday
from hashlib import new
import datetime

class Employee:         # Class
    numb = 0            # Class variable
    raise_amount = 1.04 # Class variable

    def __init__(self,first,last,pay):                 # self represents the class instance
        self.first = first                             # Assigns function variable to a local variable
        self.last = last                               # Last name variable
        self.email = first + '.' + last + '@email.com' # Creates an email based on the first and last name given
        self.pay = pay                                 # Pay variable

        Employee.numb += 1 # Increases the number variable for each instance of the class
    
    def fullname(self):                             # Method that returns the first and last name of the Employee instance 
        return '{} {}'.format(self.first,self.last) # Returns the full name of the Employee instance

    def apply_raise(self):                           # Method that applies the raise amount to the class instance
        self.pay = int(self.pay * self.raise_amount) # Calculates the pay after the raise is applies for the instance

    @classmethod                   # Alternative constructor
    def set_raise_amt(cls,amount): # cls == class variable name == class
        cls.raise_amount = amount  # Sets the raise amount to the instance amount

    @classmethod                              # Alternative contructor that takes a given string and converts it into a class instance
    def from_string(cls,emp_str):             # inputs instance variable and the given employee string
        first, last, pay = emp_str.split('-') # Parses the string separated by hyphens
        return cls(first,last,pay)            # Returns the parsed variables

    @staticmethod                                    # Does not operate on the instance or the class
    def is_workday(day):                             # Defines is_workday function
        if day.weekday() == 5 or day.weekday() == 6: # 5 == Saturday, 6 == Sunday
            return False                             # False if it is a weekend
        return True                                  # True if it is a weekday

# Inheritance -- Inherits the functionality from the Employee class
class Developer(Employee):                       # Developer class that inherits Employee attributes
    raise_amount = 1.10                          # Developer raise_amount
    def __init__(self,first,last,pay,prog_lang): # Add programming language
        super().__init__(first,last,pay)         # Calls the parent (Employee) __init__ method
        self.prog_lang = prog_lang               # Sets the instance programming language

# Inheritance -- Inherits the functionality from the Employee class
class Manager(Employee):                              # Subclass of Employee
    def __init__(self,first,last,pay,employees=None): # Adds number of employees to a manager
        super().__init__(first,last,pay)              # Calls the parent (Employee) __init__ method
        if employees is None:                         # Redefines employees=None to avoid having an object in the parameters
            self.employees = []                       # Sets employees to an empty list
        else:
            self.employees = employees # Sets employees to the class instance employees

    def add_emp(self,emp):             # Defines the add employee method to the Manager class
        if emp not in self.employees:  # Adds an employee to the class imstance
            self.employees.append(emp) # Appends the emp to the employees list

    def remove_emp(self,emp):          # Defines the remove employee method to the manager class
        if emp in self.employees:      # Revoves the employee from the Manager class instance
            self.employees.remove(emp) # Removes the emp from the employee list

    def print_emps(self):                               # Method to print the employees tied to the manager
        print('\nManager --> ',self.fullname())         # Print manager name
        for emp in self.employees:                      # For each emp in the employees list
            print('\n    Employee --> ',emp.fullname()) # Print the emp's full name from the Employee class

print(help(Employee))  # Prints information regarding the Employee class
print(help(Developer)) # Prints information regarding the Developer class
print(help(Manager))   # Prints information regarding the Manager class

emp_1 = Employee('Dalton','Kipp',50000)             # Employee class instance
emp_2 = Employee('Test','Employee',100000)          # Employee class instance 2
dev_1 = Developer('Bob', 'Jackson', 60000,'Python') # Developer class instance
dev_2 = Developer('Test','Developer',120000,'C++')  # Developer class instance 2
mgr_1 = Manager('Sue','Smith',90000,[dev_1])        # Manager class instance
mgr_2 = Manager('Test','Manager',700000,[emp_2])    # Manager class instance

date = datetime.date(2022,3,10) # Defines date

print('\nEmployee.is_workday(date) --> ',Employee.is_workday(date)) # Calls static method from the employee class with specified date

Employee.set_raise_amt(1.05) # == Employee.raise_amount = 1.05

emp_str_1 = 'John-Doe-70000'    # Employee String to be put into from_string()
emp_str_2 = 'Steve-Smith-30000' # Employee String to be put into from_string()
emp_str_3 = 'Jane-Doe-90000'    # Employee String to be put into from_string()

new_emp_1 = Employee.from_string(emp_str_1)                 # Creates a class instance from a string
print('\nnew_emp_1.email --> ',new_emp_1.email)             # Prints the employee email from emp_str_1
print('\nEmployee.raise_amount --> ',Employee.raise_amount) # Prints the class variable raise_amount
emp_1.raise_amount = 1.25                                   # Defines class instance raise_amount
print('\nemp_1.raise_amount --> ',emp_1.raise_amount)       # Prints the Employee class instance (emp_1) raise_amount
emp_1.apply_raise()                                         # Applies the Employee apply_raise() to emp_1
print('\ndev_1.raise_amount -->',dev_1.raise_amount)        # Prints the Developer class instance (dev_1) raise_amount
dev_1.apply_raise()                                         # Applies the Developer class raise_amount to the Employee class apply_raise
print('\ndev_1.pay --> ',dev_1.pay)                         # Prints the pay of dev_1 with the applied raise from Employee
print('\ndev_1.prog_lang --> ',dev_1.prog_lang)             # Prints dev_1 programming language
print('\nmgr_1.email -->',mgr_1.email)                      # Prints mgr_1 email

print('\nisinstance(mgr_1,Employee) --> ',isinstance(mgr_1,Employee))         # Tests if mgr_1 is an instance of the Employee Class
print('\nisinstance(mgr_1,Developer) --> ',isinstance(mgr_1,Developer))       # Tests if the mgr_1 is an instance of the Developer class
print('\nissubclass(Developer,Employee) --> ',issubclass(Developer,Employee)) # Tests if the Developer class is a subclass of Employee
print('\nissubclass(Manager,Developer) --> ',issubclass(Manager,Developer))   # Tests if the Manager class is a subclass of Developer
mgr_1.add_emp(dev_2)    # Adds dev_2 to mgr_1 employees
mgr_1.add_emp(emp_1)    # Adds emp_2 to mgr_1 employees
mgr_1.remove_emp(dev_1) # Removes dev_1 from mgr_1 employees
mgr_1.print_emps()      # Prints manager 1 and their employees
mgr_2.print_emps()      # Prints manager 2 and their employees