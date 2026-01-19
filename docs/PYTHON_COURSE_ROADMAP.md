# Python Course Roadmap - From Zero to Professional

Complete roadmap for the Python programming course, from absolute beginner to professional level with modern tooling (mypy, pytest, black, etc.).

## Course Philosophy

- **Audience**: Complete beginners with zero programming knowledge
- **Goal**: Professional Python development with industry best practices
- **Approach**: Gradual introduction of tools as soon as pedagogically feasible
- **Quality**: All code examples must pass linters/formatters once introduced

## Module Structure

Each module includes:

- Theory explanation (clear, beginner-friendly)
- Practical examples
- Exercises with proposed solutions
- Progressive difficulty

---

## 📚 MODULE 1: Getting Started (Lessons 1-5)

### Lesson 1: Introduction to Programming

**Target**: Complete beginners
**Topics**:

- What is programming?
- What is a programming language?
- Why Python in 2026?
- Real-world Python applications (web, AI, automation)
- How computers execute code

**Deliverable**: Student understands what programming is and why Python

---

### Lesson 2: Setting Up the Environment

**Target**: Complete beginners
**Topics**:

- Installing asdf (version manager)
- Installing Python 3.12+ via asdf
- Verifying installation (`python --version`)
- Installing VS Code
- Configuring VS Code for Python
- First program: `print("Hello, World!")`

**Deliverable**: Working Python environment + first program executed

**Example**:

```python
print("Hello, World!")
print("Welcome to Python programming!")
```

---

### Lesson 3: Variables and Basic Data Types

**Target**: Complete beginners
**Topics**:

- What is a variable? (memory analogy)
- Variable naming rules (snake_case)
- Basic types: `int`, `float`, `str`, `bool`
- Type checking with `type()`
- Variable reassignment
- Basic `input()` for user interaction

**Deliverable**: Students can create variables and understand basic types

**Example**:

```python
name = "Alice"
age = 25
height = 1.68
is_student = True

print(f"Name: {name}, Age: {age}")
```

**Exercise**: Create a program that asks for user's name and age, then prints a greeting.

---

### Lesson 4: Operators

**Target**: Complete beginners
**Topics**:

- Arithmetic operators: `+`, `-`, `*`, `/`, `//`, `%`, `**`
- Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical operators: `and`, `or`, `not`
- Assignment operators: `=`, `+=`, `-=`, etc.
- Operator precedence

**Deliverable**: Students can perform calculations and comparisons

**Example**:

```python
x = 10
y = 3

print(f"Sum: {x + y}")
print(f"Division: {x / y}")
print(f"Integer division: {x // y}")
print(f"Is x greater than y? {x > y}")
```

**Exercise**: Create a simple calculator for two numbers.

---

### Lesson 5: Strings and String Methods

**Target**: Complete beginners
**Topics**:

- String creation (single/double quotes)
- String concatenation
- f-strings (formatted strings)
- Multiline strings
- Common methods: `.upper()`, `.lower()`, `.strip()`, `.replace()`, `.split()`
- String indexing and slicing basics

**Deliverable**: Students can manipulate text effectively

**Example**:

```python
message = "  Hello, Python!  "
print(message.strip())
print(message.upper())
print(message.replace("Python", "World"))

name = "Alice"
age = 25
print(f"{name} is {age} years old")
```

**Exercise**: Create a program that formats user input (name) into a professional email signature.

---

## 📚 MODULE 2: Control Flow (Lessons 6-10)

### Lesson 6: Conditional Statements (if/elif/else)

**Target**: Students with basic variable/operator knowledge
**Topics**:

- Boolean expressions
- `if` statement
- `elif` for multiple conditions
- `else` as fallback
- Nested conditionals (when appropriate)
- Truthiness and falsiness

**Deliverable**: Students can make programs that make decisions

**Example**:

```python
age = int(input("Enter your age: "))

if age < 18:
    print("You are a minor")
elif age < 65:
    print("You are an adult")
else:
    print("You are a senior")
```

**Exercise**: Create a grading system (A, B, C, D, F) based on numeric score.

---

### Lesson 7: while Loops

**Target**: Students understanding conditionals
**Topics**:

- Loop concept (repetition)
- `while` syntax
- Loop condition
- Infinite loops (and how to avoid them)
- `break` statement
- `continue` statement
- Practical use cases

**Deliverable**: Students can create repetitive logic

**Example**:

```python
count = 0
while count < 5:
    print(f"Count is: {count}")
    count += 1

# Input validation loop
password = ""
while password != "secret":
    password = input("Enter password: ")
```

**Exercise**: Create a number guessing game (user has 5 attempts).

---

### Lesson 8: for Loops and range()

**Target**: Students understanding loops
**Topics**:

- `for` loop syntax
- `range()` function: `range(n)`, `range(start, stop)`, `range(start, stop, step)`
- Iterating over sequences
- `break` and `continue` in `for` loops
- Nested loops (basic introduction)

**Deliverable**: Students can iterate over sequences

**Example**:

```python
# Simple range
for i in range(5):
    print(f"Iteration {i}")

# Range with start/stop
for num in range(1, 11):
    print(f"{num} squared is {num ** 2}")

# Countdown
for i in range(10, 0, -1):
    print(i)
print("Blast off!")
```

**Exercise**: Create a multiplication table (1-10) for any number.

---

### Lesson 9: Lists Basics

**Target**: Students understanding loops
**Topics**:

- What are lists? (ordered collections)
- Creating lists: `[]`
- Accessing elements (indexing)
- Negative indexing
- List slicing
- Iterating lists with `for`
- List length: `len()`
- `in` operator

**Deliverable**: Students can work with collections

**Example**:

```python
fruits = ["apple", "banana", "cherry"]

print(fruits[0])
print(fruits[-1])

for fruit in fruits:
    print(f"I like {fruit}")

if "banana" in fruits:
    print("We have bananas!")
```

**Exercise**: Create a shopping list program that displays items with numbers.

---

### Lesson 10: List Methods and Manipulation

**Target**: Students understanding lists basics
**Topics**:

- Adding elements: `.append()`, `.insert()`, `.extend()`
- Removing elements: `.remove()`, `.pop()`, `del`
- Modifying: `.sort()`, `.reverse()`
- Searching: `.index()`, `.count()`
- List comprehensions (basic introduction)

**Deliverable**: Students can modify lists dynamically

**Example**:

```python
numbers = [3, 1, 4, 1, 5]

numbers.append(9)
numbers.sort()
print(numbers)

# List comprehension (preview)
squares = [x ** 2 for x in range(1, 6)]
print(squares)
```

**Exercise**: Create a to-do list app (add, remove, show tasks).

---

## 📚 MODULE 3: Functions and Modularity (Lessons 11-15)

### Lesson 11: Defining Functions

**Target**: Students understanding control flow
**Topics**:

- Why functions? (DRY principle introduction)
- Function syntax: `def`
- Parameters and arguments
- Return values
- `None` return (implicit)
- Function naming conventions
- Calling functions

**Deliverable**: Students can create reusable code blocks

**Example**:

```python
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

message = greet("Alice")
print(message)

result = add(5, 3)
print(f"Sum: {result}")
```

**Exercise**: Create a calculator with functions for +, -, \*, /.

---

### Lesson 12: Function Parameters (Default, Keyword, \*args, \*\*kwargs)

**Target**: Students understanding basic functions
**Topics**:

- Default parameters
- Keyword arguments
- Positional vs keyword arguments
- `*args` for variable positional arguments
- `**kwargs` for variable keyword arguments
- When to use each

**Deliverable**: Students understand flexible function signatures

**Example**:

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))
print(greet("Bob", greeting="Hi"))

def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4, 5))
```

**Exercise**: Create a flexible function to format addresses (with optional fields).

---

### Lesson 13: Scope and Namespaces

**Target**: Students understanding functions
**Topics**:

- Local vs global scope
- `global` keyword (and why to avoid it)
- Nested functions
- `nonlocal` keyword
- Best practices for scope management

**Deliverable**: Students understand variable visibility

**Example**:

```python
x = 10  # Global

def outer():
    y = 20  # Local to outer

    def inner():
        z = 30  # Local to inner
        print(f"Inner: {x}, {y}, {z}")

    inner()
    print(f"Outer: {x}, {y}")

outer()
```

**Exercise**: Debug scope-related errors in provided code.

---

### Lesson 14: Lambda Functions and Higher-Order Functions

**Target**: Students comfortable with functions
**Topics**:

- Lambda syntax
- When to use lambdas
- `map()`, `filter()`, `reduce()`
- Functions as first-class objects
- Passing functions as arguments

**Deliverable**: Students can use functional programming concepts

**Example**:

```python
# Lambda
square = lambda x: x ** 2
print(square(5))

# map
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))

# filter
evens = list(filter(lambda x: x % 2 == 0, numbers))

print(squared)
print(evens)
```

**Exercise**: Use `filter()` and `map()` to process a list of temperatures (Celsius to Fahrenheit conversion).

---

### Lesson 15: Recursion Basics

**Target**: Students comfortable with functions
**Topics**:

- What is recursion?
- Base case and recursive case
- Stack overflow risk
- When recursion is appropriate
- Classic examples: factorial, fibonacci

**Deliverable**: Students understand recursive thinking

**Example**:

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print([fibonacci(i) for i in range(10)])
```

**Exercise**: Implement recursive sum of a list.

---

## 📚 MODULE 4: Code Quality and Professional Tools (Lessons 16-20)

**🚨 CRITICAL TRANSITION POINT**: From this module forward, ALL code examples MUST be validated with the tools introduced.

### Lesson 16: Introduction to Code Quality

**Target**: Students with basic Python knowledge
**Topics**:

- Why code quality matters
- Readability vs cleverness
- The cost of technical debt
- Introduction to PEP8 style guide
- Setting up VS Code for PEP8 warnings

**Deliverable**: Students understand the importance of clean code

**No code in this lesson** - conceptual foundation.

---

### Lesson 17: Black - Automatic Code Formatting

**Target**: Students understanding code quality importance
**Topics**:

- What is code formatting?
- Installing black: `pip install black`
- Running black: `black file.py`
- Black philosophy (no configuration)
- Integrating black with VS Code
- Format on save

**Deliverable**: Students can auto-format their code

**Setup**:

```bash
pip install black
black --version
```

**Example** (before black):

```python
def function(arg1,arg2,arg3):
    result=arg1+arg2+arg3
    return result
```

**Example** (after black):

```python
def function(arg1, arg2, arg3):
    result = arg1 + arg2 + arg3
    return result
```

**Exercise**: Format provided messy code with black.

---

### Lesson 18: isort - Import Organization

**Target**: Students using black
**Topics**:

- Why import organization matters
- Installing isort: `pip install isort`
- Running isort: `isort file.py`
- Import grouping (stdlib, third-party, local)
- Configuring isort with black compatibility

**Deliverable**: Students organize imports correctly

**Setup**:

```bash
pip install isort
isort --version
```

**Example** (before isort):

```python
from my_module import something
import sys
from typing import List
import os
```

**Example** (after isort):

```python
import os
import sys
from typing import List

from my_module import something
```

**Exercise**: Organize imports in provided files.

---

### Lesson 19: flake8 - Linting and Style Checking

**Target**: Students using black and isort
**Topics**:

- What is linting?
- Installing flake8: `pip install flake8`
- Running flake8: `flake8 file.py`
- Understanding error codes
- Configuring flake8 (`.flake8` file)
- Ignoring specific errors (when justified)
- Integrating with VS Code

**Deliverable**: Students can identify and fix code issues

**Setup**:

```bash
pip install flake8
flake8 --version
```

**Example** (flake8 errors):

```python
import os
import sys  # F401: imported but unused

def my_function(x):
    result = x + 1
    return result

    # E302: expected 2 blank lines
def another_function():
    pass
```

**Example** (fixed):

```python
import os


def my_function(x):
    result = x + 1
    return result


def another_function():
    pass
```

**Exercise**: Fix all flake8 errors in provided code.

---

### Lesson 20: Integrating Tools (Workflow Setup)

**Target**: Students familiar with black, isort, flake8
**Topics**:

- Creating a quality check script
- Pre-commit hooks (optional introduction)
- VS Code settings for automatic checks
- Running all tools in sequence
- Making quality checks a habit

**Deliverable**: Students have an automated workflow

**Setup script** (`check.sh`):

```bash
#!/bin/bash
echo "Running isort..."
isort .

echo "Running black..."
black .

echo "Running flake8..."
flake8 .

echo "All checks complete!"
```

**Exercise**: Set up the workflow for their own project.

---

## 📚 MODULE 5: Type Hints and mypy (Lessons 21-25)

**🚨 FROM THIS POINT**: All code examples MUST include type hints and pass `mypy --strict`.

### Lesson 21: Introduction to Type Hints

**Target**: Students using linters/formatters
**Topics**:

- Dynamic vs static typing (revisited with experience)
- Why type hints in Python?
- Basic type hints: `int`, `float`, `str`, `bool`
- Function annotations
- Variable annotations
- Type hints don't affect runtime

**Deliverable**: Students understand the value of types

**Example**:

```python
def add(a: int, b: int) -> int:
    return a + b


def greet(name: str) -> str:
    return f"Hello, {name}!"


age: int = 25
price: float = 19.99
```

**Exercise**: Add type hints to previously written functions.

---

### Lesson 22: mypy - Static Type Checking

**Target**: Students understanding type hints
**Topics**:

- Installing mypy: `pip install mypy`
- Running mypy: `mypy file.py`
- Understanding mypy errors
- `--strict` mode (recommended)
- Common type errors and fixes

**Deliverable**: Students can validate their types

**Setup**:

```bash
pip install mypy
mypy --version
```

**Example** (mypy error):

```python
def add(a: int, b: int) -> int:
    return a + b


result = add("5", "3")  # error: Argument 1 has incompatible type "str"; expected "int"
```

**Example** (fixed):

```python
def add(a: int, b: int) -> int:
    return a + b


result = add(5, 3)
```

**Exercise**: Fix mypy errors in provided code.

---

### Lesson 23: Advanced Type Hints (Optional, Union, List, Dict)

**Target**: Students comfortable with basic types
**Topics**:

- `from typing import ...`
- `Optional[T]` for nullable values
- `Union[T1, T2]` for multiple types
- `List[T]`, `Dict[K, V]`, `Tuple[T1, T2]`, `Set[T]`
- Type aliases
- When to use each

**Deliverable**: Students can type complex structures

**Example**:

```python
from typing import Dict, List, Optional, Union


def find_user(user_id: int) -> Optional[str]:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)


def process_numbers(numbers: List[int]) -> int:
    return sum(numbers)


def get_config() -> Dict[str, Union[str, int, bool]]:
    return {"host": "localhost", "port": 8080, "debug": True}
```

**Exercise**: Type annotate a function that processes nested data structures.

---

### Lesson 24: Type Hints for Functions (Callable, TypeVar)

**Target**: Students comfortable with advanced types
**Topics**:

- `Callable[[ArgTypes], ReturnType]`
- Generic functions with `TypeVar`
- Higher-order function typing
- Decorators typing (basic)

**Deliverable**: Students can type functional patterns

**Example**:

```python
from typing import Callable, List, TypeVar

T = TypeVar("T")


def apply_twice(func: Callable[[int], int], value: int) -> int:
    return func(func(value))


def double(x: int) -> int:
    return x * 2


result = apply_twice(double, 5)


def first(items: List[T]) -> T:
    return items[0]
```

**Exercise**: Type annotate higher-order functions from previous exercises.

---

### Lesson 25: Practical Typing (Real-World Patterns)

**Target**: Students comfortable with typing
**Topics**:

- Typing class methods
- `@property` typing
- Protocol (structural typing)
- `cast()` when necessary
- `# type: ignore` (when justified)
- Best practices for maintainable types

**Deliverable**: Students can type real projects

**Example**:

```python
from typing import Protocol


class Drawable(Protocol):
    def draw(self) -> None:
        ...


class Circle:
    def draw(self) -> None:
        print("Drawing circle")


class Square:
    def draw(self) -> None:
        print("Drawing square")


def render(shape: Drawable) -> None:
    shape.draw()


render(Circle())
render(Square())
```

**Exercise**: Type annotate a complete mini-project.

---

## 📚 MODULE 6: Testing with pytest (Lessons 26-32)

**🚨 FROM THIS POINT**: All code examples MUST include tests with 100% coverage target.

### Lesson 26: Introduction to Testing

**Target**: Students with typed code
**Topics**:

- Why testing matters
- Types of tests (unit, integration, e2e)
- TDD philosophy (Red-Green-Refactor)
- Installing pytest: `pip install pytest`
- Running pytest: `pytest`
- Test file naming conventions

**Deliverable**: Students understand testing value

**Setup**:

```bash
pip install pytest
pytest --version
```

**No code yet** - conceptual foundation.

---

### Lesson 27: Writing Your First Tests

**Target**: Students understanding testing concepts
**Topics**:

- Test function naming: `test_*`
- Assertions: `assert`
- Test organization (test files alongside code)
- Running specific tests
- Understanding test output

**Deliverable**: Students can write basic tests

**Code** (`calculator.py`):

```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b
```

**Tests** (`test_calculator.py`):

```python
from calculator import add, subtract


def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0


def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 0) == 0
    assert subtract(-1, -1) == 0
```

**Exercise**: Write tests for previously created functions.

---

### Lesson 28: Test-Driven Development (TDD)

**Target**: Students who can write tests
**Topics**:

- TDD cycle: Red → Green → Refactor
- Writing tests first
- Minimal implementation
- Refactoring with confidence
- Practical TDD workflow

**Deliverable**: Students can practice TDD

**Example** (TDD for `is_palindrome`):

**Step 1 - Red** (write test first):

```python
# test_palindrome.py
from palindrome import is_palindrome


def test_palindrome_simple():
    assert is_palindrome("radar") is True
    assert is_palindrome("hello") is False
```

**Step 2 - Green** (minimal implementation):

```python
# palindrome.py
def is_palindrome(text: str) -> bool:
    return text == text[::-1]
```

**Step 3 - Refactor** (if needed, then add more tests).

**Exercise**: Implement a function using TDD (FizzBuzz, prime checker, etc.).

---

### Lesson 29: Test Fixtures and Setup

**Target**: Students practicing TDD
**Topics**:

- What are fixtures?
- `@pytest.fixture` decorator
- Setup and teardown
- Fixture scope (function, module, session)
- Sharing fixtures across tests
- Fixture dependencies

**Deliverable**: Students can manage test data

**Example**:

```python
import pytest
from typing import List


@pytest.fixture
def sample_numbers() -> List[int]:
    return [1, 2, 3, 4, 5]


def test_sum(sample_numbers: List[int]) -> None:
    assert sum(sample_numbers) == 15


def test_length(sample_numbers: List[int]) -> None:
    assert len(sample_numbers) == 5
```

**Exercise**: Create fixtures for complex test data.

---

### Lesson 30: Parametrized Tests

**Target**: Students comfortable with fixtures
**Topics**:

- `@pytest.mark.parametrize` decorator
- Testing multiple inputs
- Reducing test duplication
- Naming parametrized tests
- Combining with fixtures

**Deliverable**: Students can test multiple scenarios efficiently

**Example**:

```python
import pytest


def is_even(n: int) -> bool:
    return n % 2 == 0


@pytest.mark.parametrize(
    "number,expected",
    [
        (2, True),
        (3, False),
        (0, True),
        (-4, True),
        (-5, False),
    ],
)
def test_is_even(number: int, expected: bool) -> None:
    assert is_even(number) == expected
```

**Exercise**: Parametrize tests for calculator operations.

---

### Lesson 31: Testing Exceptions and Edge Cases

**Target**: Students writing parametrized tests
**Topics**:

- `pytest.raises()` for exception testing
- Testing error messages
- Edge cases identification
- Negative testing
- Boundary testing

**Deliverable**: Students test unhappy paths

**Example**:

```python
import pytest


def divide(a: int, b: int) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def test_divide_normal():
    assert divide(10, 2) == 5.0


def test_divide_by_zero():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)
```

**Exercise**: Test error handling in previous functions.

---

### Lesson 32: Test Coverage

**Target**: Students writing comprehensive tests
**Topics**:

- What is test coverage?
- Installing pytest-cov: `pip install pytest-cov`
- Running coverage: `pytest --cov=module`
- Coverage reports
- 100% coverage target (and its limits)
- Coverage vs quality

**Deliverable**: Students can measure test quality

**Setup**:

```bash
pip install pytest-cov
pytest --cov=. --cov-report=term-missing
```

**Exercise**: Achieve 100% coverage on a module.

---

## 📚 MODULE 7: Data Structures Deep Dive (Lessons 33-38)

### Lesson 33: Lists Advanced

**Target**: Students with testing skills
**Topics**:

- List comprehensions (deep dive)
- Nested lists
- List slicing advanced patterns
- `zip()`, `enumerate()`
- Sorting with custom keys
- Performance considerations

**Example**:

```python
from typing import List


def flatten(nested: List[List[int]]) -> List[int]:
    return [item for sublist in nested for item in sublist]


def square_evens(numbers: List[int]) -> List[int]:
    return [x**2 for x in numbers if x % 2 == 0]


# Tests
def test_flatten() -> None:
    assert flatten([[1, 2], [3, 4]]) == [1, 2, 3, 4]


def test_square_evens() -> None:
    assert square_evens([1, 2, 3, 4]) == [4, 16]
```

**Exercise**: Implement matrix operations with tests.

---

### Lesson 34: Tuples and Named Tuples

**Target**: Students comfortable with lists
**Topics**:

- Tuples vs lists (immutability)
- Tuple unpacking
- Multiple return values
- `namedtuple` from collections
- `@dataclass` preview
- When to use tuples

**Example**:

```python
from collections import namedtuple
from typing import Tuple

Point = namedtuple("Point", ["x", "y"])


def get_coordinates() -> Tuple[int, int]:
    return (10, 20)


x, y = get_coordinates()


def test_point() -> None:
    p = Point(x=5, y=10)
    assert p.x == 5
    assert p.y == 10
```

**Exercise**: Model a playing card with named tuples.

---

### Lesson 35: Dictionaries Deep Dive

**Target**: Students understanding tuples
**Topics**:

- Dictionary comprehensions
- `dict.get()` with defaults
- `dict.setdefault()`
- `dict.update()`
- Iterating: `.keys()`, `.values()`, `.items()`
- `defaultdict` and `Counter` from collections
- Performance characteristics

**Example**:

```python
from collections import Counter, defaultdict
from typing import Dict, List


def count_words(text: str) -> Dict[str, int]:
    words = text.lower().split()
    return dict(Counter(words))


def group_by_length(words: List[str]) -> Dict[int, List[str]]:
    groups: Dict[int, List[str]] = defaultdict(list)
    for word in words:
        groups[len(word)].append(word)
    return dict(groups)


def test_count_words() -> None:
    assert count_words("hello world hello") == {"hello": 2, "world": 1}
```

**Exercise**: Build a word frequency analyzer with tests.

---

### Lesson 36: Sets and Frozensets

**Target**: Students comfortable with dicts
**Topics**:

- Sets basics (unique elements)
- Set operations: union, intersection, difference
- Set comprehensions
- `frozenset` (immutable sets)
- Practical use cases (deduplication, membership)

**Example**:

```python
from typing import List, Set


def remove_duplicates(items: List[int]) -> List[int]:
    return list(dict.fromkeys(items))  # preserves order


def common_elements(list1: List[int], list2: List[int]) -> Set[int]:
    return set(list1) & set(list2)


def test_remove_duplicates() -> None:
    assert remove_duplicates([1, 2, 2, 3, 1]) == [1, 2, 3]


def test_common_elements() -> None:
    assert common_elements([1, 2, 3], [2, 3, 4]) == {2, 3}
```

**Exercise**: Implement set operations with tests.

---

### Lesson 37: Stacks and Queues

**Target**: Students understanding all data structures
**Topics**:

- Stack concept (LIFO)
- Queue concept (FIFO)
- Implementing with lists
- `collections.deque`
- Real-world use cases

**Example**:

```python
from collections import deque
from typing import List


class Stack:
    def __init__(self) -> None:
        self._items: List[int] = []

    def push(self, item: int) -> None:
        self._items.append(item)

    def pop(self) -> int:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def is_empty(self) -> bool:
        return len(self._items) == 0


def test_stack() -> None:
    stack = Stack()
    stack.push(1)
    stack.push(2)
    assert stack.pop() == 2
    assert stack.pop() == 1
```

**Exercise**: Implement a queue with tests.

---

### Lesson 38: Choosing the Right Data Structure

**Target**: Students understanding all structures
**Topics**:

- Performance comparison (Big O basics)
- When to use lists vs tuples
- When to use dicts vs sets
- Memory considerations
- Practical decision-making

**No code** - decision matrix and case studies.

**Exercise**: Refactor previous exercises with optimal data structures.

---

## 📚 MODULE 8: Object-Oriented Programming (Lessons 39-46)

### Lesson 39: Introduction to Classes

**Target**: Students comfortable with data structures
**Topics**:

- What is OOP?
- Class definition
- Instance attributes
- `__init__` method
- `self` parameter
- Creating objects
- Instance methods

**Example**:

```python
class Dog:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def bark(self) -> str:
        return f"{self.name} says woof!"


def test_dog() -> None:
    dog = Dog("Rex", 3)
    assert dog.name == "Rex"
    assert dog.age == 3
    assert dog.bark() == "Rex says woof!"
```

**Exercise**: Create a `BankAccount` class with deposit/withdraw methods.

---

### Lesson 40: Class Attributes and Methods

**Target**: Students understanding instances
**Topics**:

- Class vs instance attributes
- `@classmethod` decorator
- `@staticmethod` decorator
- When to use each
- Class variables

**Example**:

```python
class Counter:
    count: int = 0

    def __init__(self) -> None:
        Counter.count += 1

    @classmethod
    def get_count(cls) -> int:
        return cls.count

    @staticmethod
    def is_valid_number(n: int) -> bool:
        return n > 0


def test_counter() -> None:
    Counter.count = 0  # reset
    c1 = Counter()
    c2 = Counter()
    assert Counter.get_count() == 2
```

**Exercise**: Implement a `Person` class with class methods.

---

### Lesson 41: Encapsulation and Properties

**Target**: Students understanding class basics
**Topics**:

- Private attributes convention (`_` and `__`)
- `@property` decorator
- Getters and setters
- Computed properties
- Data validation

**Example**:

```python
class Temperature:
    def __init__(self, celsius: float) -> None:
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + 32


def test_temperature() -> None:
    temp = Temperature(0)
    assert temp.celsius == 0
    assert temp.fahrenheit == 32
```

**Exercise**: Create a `Rectangle` class with validated dimensions.

---

### Lesson 42: Inheritance

**Target**: Students understanding encapsulation
**Topics**:

- Parent and child classes
- `super()` function
- Method overriding
- `isinstance()` and `issubclass()`
- When to use inheritance

**Example**:

```python
class Animal:
    def __init__(self, name: str) -> None:
        self.name = name

    def speak(self) -> str:
        return "Some sound"


class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} barks"


class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} meows"


def test_inheritance() -> None:
    dog = Dog("Rex")
    cat = Cat("Whiskers")
    assert dog.speak() == "Rex barks"
    assert cat.speak() == "Whiskers meows"
```

**Exercise**: Create a vehicle hierarchy (Car, Truck, Motorcycle).

---

### Lesson 43: Polymorphism

**Target**: Students understanding inheritance
**Topics**:

- Polymorphism concept
- Duck typing in Python
- Interface through inheritance
- Abstract base classes
- Protocol (from typing)

**Example**:

```python
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass


class Circle(Shape):
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius**2


class Square(Shape):
    def __init__(self, side: float) -> None:
        self.side = side

    def area(self) -> float:
        return self.side**2


def test_polymorphism() -> None:
    shapes = [Circle(5), Square(4)]
    areas = [shape.area() for shape in shapes]
    assert len(areas) == 2
```

**Exercise**: Implement a payment system with different payment methods.

---

### Lesson 44: Magic Methods (Dunder Methods)

**Target**: Students comfortable with OOP basics
**Topics**:

- `__str__` and `__repr__`
- `__len__`, `__getitem__`, `__setitem__`
- Comparison methods: `__eq__`, `__lt__`, etc.
- Arithmetic methods: `__add__`, `__sub__`, etc.
- Context managers: `__enter__`, `__exit__`

**Example**:

```python
class Money:
    def __init__(self, amount: float) -> None:
        self.amount = amount

    def __add__(self, other: "Money") -> "Money":
        return Money(self.amount + other.amount)

    def __str__(self) -> str:
        return f"${self.amount:.2f}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented
        return self.amount == other.amount


def test_money() -> None:
    m1 = Money(10)
    m2 = Money(5)
    total = m1 + m2
    assert total.amount == 15
    assert str(total) == "$15.00"
```

**Exercise**: Implement a `Vector` class with math operations.

---

### Lesson 45: Composition over Inheritance

**Target**: Students understanding inheritance and polymorphism
**Topics**:

- Composition concept
- Has-a vs is-a relationships
- Favor composition over inheritance
- Dependency injection basics
- Practical design patterns

**Example**:

```python
class Engine:
    def start(self) -> str:
        return "Engine started"


class Car:
    def __init__(self) -> None:
        self.engine = Engine()

    def start(self) -> str:
        return self.engine.start()


def test_composition() -> None:
    car = Car()
    assert car.start() == "Engine started"
```

**Exercise**: Refactor an inheritance hierarchy to use composition.

---

### Lesson 46: Dataclasses

**Target**: Students comfortable with classes
**Topics**:

- `@dataclass` decorator
- Automatic `__init__`
- Automatic `__repr__`
- Immutability with `frozen=True`
- Default values
- Field customization

**Example**:

```python
from dataclasses import dataclass


@dataclass
class Point:
    x: float
    y: float


@dataclass(frozen=True)
class ImmutablePoint:
    x: float
    y: float


def test_dataclass() -> None:
    p = Point(1.0, 2.0)
    assert p.x == 1.0
    assert p.y == 2.0

    ip = ImmutablePoint(3.0, 4.0)
    # ip.x = 5.0  # This would raise an error
```

**Exercise**: Convert previous classes to dataclasses where appropriate.

---

## 📚 MODULE 9: Error Handling (Lessons 47-50)

### Lesson 47: Exceptions Basics

**Target**: Students understanding OOP
**Topics**:

- What are exceptions?
- `try`/`except` blocks
- Catching specific exceptions
- Multiple except blocks
- Exception hierarchy

**Example**:

```python
def safe_divide(a: int, b: int) -> float:
    try:
        return a / b
    except ZeroDivisionError:
        return 0.0


def test_safe_divide() -> None:
    assert safe_divide(10, 2) == 5.0
    assert safe_divide(10, 0) == 0.0
```

**Exercise**: Add error handling to previous functions.

---

### Lesson 48: Raising Exceptions

**Target**: Students catching exceptions
**Topics**:

- `raise` statement
- Creating custom exceptions
- Exception chaining
- When to raise vs return errors
- Best practices

**Example**:

```python
class InvalidAgeError(Exception):
    pass


def set_age(age: int) -> None:
    if age < 0:
        raise InvalidAgeError("Age cannot be negative")
    if age > 150:
        raise InvalidAgeError("Age unrealistic")


def test_invalid_age() -> None:
    import pytest

    with pytest.raises(InvalidAgeError, match="Age cannot be negative"):
        set_age(-1)
```

**Exercise**: Create custom exceptions for a domain model.

---

### Lesson 49: finally and else in Exception Handling

**Target**: Students raising exceptions
**Topics**:

- `finally` block
- `else` block in try/except
- Resource cleanup
- When to use each
- Exception handling patterns

**Example**:

```python
def read_file(filename: str) -> str:
    try:
        with open(filename, "r") as f:
            return f.read()
    except FileNotFoundError:
        return ""
    finally:
        print("Cleanup complete")
```

**Exercise**: Implement robust file operations.

---

### Lesson 50: Context Managers

**Target**: Students comfortable with exceptions
**Topics**:

- `with` statement
- Context manager protocol
- `__enter__` and `__exit__`
- `contextlib.contextmanager`
- Real-world use cases

**Example**:

```python
from contextlib import contextmanager
from typing import Generator


@contextmanager
def temporary_value(var: list, value: int) -> Generator[None, None, None]:
    original = var[0]
    var[0] = value
    try:
        yield
    finally:
        var[0] = original


def test_context_manager() -> None:
    data = [10]
    with temporary_value(data, 20):
        assert data[0] == 20
    assert data[0] == 10
```

**Exercise**: Create a timer context manager.

---

## 📚 MODULE 10: Modules and Packages (Lessons 51-54)

### Lesson 51: Creating Modules

**Target**: Students with solid Python foundation
**Topics**:

- What are modules?
- Creating `.py` files as modules
- Importing modules: `import`, `from ... import`
- Module namespaces
- `if __name__ == "__main__"`
- Module docstrings

**Example**:

**File** (`math_utils.py`):

```python
"""Math utility functions."""


def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b


if __name__ == "__main__":
    print(add(2, 3))
```

**File** (`test_math_utils.py`):

```python
from math_utils import add, multiply


def test_add() -> None:
    assert add(2, 3) == 5


def test_multiply() -> None:
    assert multiply(2, 3) == 6
```

**Exercise**: Organize previous code into logical modules.

---

### Lesson 52: Packages and **init**.py

**Target**: Students understanding modules
**Topics**:

- Package structure
- `__init__.py` role
- Subpackages
- Relative imports
- Package namespaces
- `__all__` variable

**Example**:

**Structure**:

```
mypackage/
    __init__.py
    module1.py
    module2.py
    subpackage/
        __init__.py
        module3.py
```

**File** (`mypackage/__init__.py`):

```python
"""My package."""
from mypackage.module1 import function1
from mypackage.module2 import function2

__all__ = ["function1", "function2"]
```

**Exercise**: Create a package for a domain (e.g., shopping cart).

---

### Lesson 53: Standard Library Tour

**Target**: Students organizing code into packages
**Topics**:

- Overview of standard library
- `os` and `pathlib`
- `sys`
- `datetime`
- `random`
- `collections`
- `itertools`
- `functools`

**Example**:

```python
from pathlib import Path
from datetime import datetime
import random


def create_log_file() -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / f"log_{timestamp}.txt"
    log_file.write_text("Log created\n")
    return log_file


def test_create_log_file() -> None:
    log_file = create_log_file()
    assert log_file.exists()
    log_file.unlink()  # cleanup
```

**Exercise**: Explore standard library modules with practical examples.

---

### Lesson 54: Third-Party Packages and pip

**Target**: Students comfortable with standard library
**Topics**:

- What is pip?
- Installing packages: `pip install`
- `requirements.txt`
- Virtual environments (venv)
- Package versioning
- Finding packages (PyPI)

**Example**:

**Setup**:

```bash
python -m venv venv
source venv/bin/activate
pip install requests
pip freeze > requirements.txt
```

**Code**:

```python
import requests


def fetch_github_user(username: str) -> dict:
    response = requests.get(f"https://api.github.com/users/{username}")
    return response.json()
```

**Exercise**: Install and use a third-party package (requests, rich, etc.).

---

## 📚 MODULE 11: File I/O and Data Formats (Lessons 55-59)

### Lesson 55: Reading and Writing Text Files

**Target**: Students understanding modules
**Topics**:

- Opening files: `open()`
- File modes: `r`, `w`, `a`
- Reading: `.read()`, `.readline()`, `.readlines()`
- Writing: `.write()`, `.writelines()`
- `with` statement (context manager)
- `pathlib.Path` for file operations

**Example**:

```python
from pathlib import Path


def write_lines(filename: str, lines: list[str]) -> None:
    path = Path(filename)
    path.write_text("\n".join(lines))


def read_lines(filename: str) -> list[str]:
    path = Path(filename)
    return path.read_text().splitlines()


def test_file_operations(tmp_path: Path) -> None:
    file = tmp_path / "test.txt"
    lines = ["line1", "line2", "line3"]
    write_lines(str(file), lines)
    assert read_lines(str(file)) == lines
```

**Exercise**: Create a text-based note-taking app.

---

### Lesson 56: Working with CSV Files

**Target**: Students handling text files
**Topics**:

- CSV format
- `csv` module
- Reading CSV: `csv.reader`, `csv.DictReader`
- Writing CSV: `csv.writer`, `csv.DictWriter`
- Headers and delimiters

**Example**:

```python
import csv
from pathlib import Path


def write_csv(filename: str, data: list[dict[str, str]]) -> None:
    with open(filename, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "age"])
        writer.writeheader()
        writer.writerows(data)


def read_csv(filename: str) -> list[dict[str, str]]:
    with open(filename, "r") as f:
        return list(csv.DictReader(f))


def test_csv(tmp_path: Path) -> None:
    file = tmp_path / "test.csv"
    data = [{"name": "Alice", "age": "30"}, {"name": "Bob", "age": "25"}]
    write_csv(str(file), data)
    assert read_csv(str(file)) == data
```

**Exercise**: Process a CSV dataset (filtering, transforming).

---

### Lesson 57: JSON Data

**Target**: Students handling CSV
**Topics**:

- JSON format
- `json` module
- Serialization: `json.dumps()`, `json.dump()`
- Deserialization: `json.loads()`, `json.load()`
- Pretty printing
- Custom encoders

**Example**:

```python
import json
from pathlib import Path


def save_json(filename: str, data: dict) -> None:
    Path(filename).write_text(json.dumps(data, indent=2))


def load_json(filename: str) -> dict:
    return json.loads(Path(filename).read_text())


def test_json(tmp_path: Path) -> None:
    file = tmp_path / "test.json"
    data = {"name": "Alice", "age": 30}
    save_json(str(file), data)
    assert load_json(str(file)) == data
```

**Exercise**: Create a JSON-based configuration system.

---

### Lesson 58: Binary Files

**Target**: Students handling text formats
**Topics**:

- Binary mode: `rb`, `wb`
- Reading binary data
- Writing binary data
- Use cases (images, etc.)
- `pickle` module (serialization)

**Example**:

```python
import pickle
from pathlib import Path


def save_object(filename: str, obj: object) -> None:
    with open(filename, "wb") as f:
        pickle.dump(obj, f)


def load_object(filename: str) -> object:
    with open(filename, "rb") as f:
        return pickle.load(f)


def test_pickle(tmp_path: Path) -> None:
    file = tmp_path / "test.pkl"
    data = {"numbers": [1, 2, 3], "name": "test"}
    save_object(str(file), data)
    assert load_object(str(file)) == data
```

**Exercise**: Serialize and deserialize Python objects.

---

### Lesson 59: Path Operations

**Target**: Students comfortable with file I/O
**Topics**:

- `pathlib.Path` deep dive
- Path manipulation: `/`, `.parent`, `.name`, `.suffix`
- Checking existence: `.exists()`, `.is_file()`, `.is_dir()`
- Directory operations: `.mkdir()`, `.iterdir()`, `.glob()`
- File operations: `.rename()`, `.unlink()`

**Example**:

```python
from pathlib import Path


def find_python_files(directory: str) -> list[Path]:
    path = Path(directory)
    return list(path.glob("**/*.py"))


def test_find_files(tmp_path: Path) -> None:
    (tmp_path / "file1.py").touch()
    (tmp_path / "file2.txt").touch()
    files = find_python_files(str(tmp_path))
    assert len(files) == 1
```

**Exercise**: Build a file organizer (sort files by extension).

---

## 📚 MODULE 12: Advanced Topics (Lessons 60-68)

### Lesson 60: Iterators and the Iterator Protocol

**Target**: Advanced students
**Topics**:

- What are iterators?
- Iterator protocol: `__iter__`, `__next__`
- `StopIteration` exception
- Creating custom iterators
- `iter()` and `next()` built-ins

**Example**:

```python
from typing import Iterator


class Countdown:
    def __init__(self, start: int) -> None:
        self.current = start

    def __iter__(self) -> Iterator[int]:
        return self

    def __next__(self) -> int:
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1


def test_countdown() -> None:
    result = list(Countdown(5))
    assert result == [5, 4, 3, 2, 1]
```

**Exercise**: Implement a custom range-like iterator.

---

### Lesson 61: Generators

**Target**: Students understanding iterators
**Topics**:

- Generator functions (`yield`)
- Generator expressions
- Lazy evaluation
- Memory efficiency
- `yield from`
- Practical use cases

**Example**:

```python
from typing import Generator


def fibonacci(n: int) -> Generator[int, None, None]:
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


def test_fibonacci() -> None:
    result = list(fibonacci(10))
    assert result == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**Exercise**: Create a generator for reading large files line-by-line.

---

### Lesson 62: Decorators Deep Dive

**Target**: Students comfortable with functions
**Topics**:

- What are decorators?
- Function decorators
- Decorators with arguments
- `functools.wraps`
- Class decorators
- Practical decorators (timing, caching, validation)

**Example**:

```python
import functools
from typing import Callable


def timing_decorator(func: Callable) -> Callable:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time

        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result

    return wrapper


@timing_decorator
def slow_function() -> None:
    import time

    time.sleep(0.1)


def test_decorator() -> None:
    slow_function()  # Prints timing
```

**Exercise**: Create a caching decorator.

---

### Lesson 63: Context Managers Deep Dive

**Target**: Students understanding context basics
**Topics**:

- Context manager protocol review
- `contextlib` utilities
- `contextlib.contextmanager`
- `contextlib.closing`
- Nested context managers
- Real-world patterns

**Example**:

```python
from contextlib import contextmanager
from typing import Generator


@contextmanager
def database_transaction() -> Generator[None, None, None]:
    print("BEGIN TRANSACTION")
    try:
        yield
        print("COMMIT")
    except Exception:
        print("ROLLBACK")
        raise


def test_transaction() -> None:
    with database_transaction():
        print("Doing work")
```

**Exercise**: Create a context manager for timing code blocks.

---

### Lesson 64: Comprehensions Deep Dive

**Target**: Advanced students
**Topics**:

- List comprehensions review
- Dict comprehensions
- Set comprehensions
- Nested comprehensions
- Conditional comprehensions
- Performance considerations

**Example**:

```python
def test_comprehensions() -> None:
    # List
    squares = [x**2 for x in range(10) if x % 2 == 0]
    assert squares == [0, 4, 16, 36, 64]

    # Dict
    square_dict = {x: x**2 for x in range(5)}
    assert square_dict == {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

    # Set
    unique = {x % 3 for x in range(10)}
    assert unique == {0, 1, 2}
```

**Exercise**: Solve complex data transformation problems with comprehensions.

---

### Lesson 65: Regular Expressions

**Target**: Advanced students
**Topics**:

- `re` module
- Pattern matching
- `re.match()`, `re.search()`, `re.findall()`
- Groups and capturing
- Substitution: `re.sub()`
- Compiled patterns
- Common patterns

**Example**:

```python
import re


def extract_emails(text: str) -> list[str]:
    pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
    return re.findall(pattern, text)


def test_extract_emails() -> None:
    text = "Contact: john@example.com or jane@test.org"
    emails = extract_emails(text)
    assert emails == ["john@example.com", "jane@test.org"]
```

**Exercise**: Validate and parse various formats (phone numbers, dates, etc.).

---

### Lesson 66: Introduction to Concurrency

**Target**: Advanced students
**Topics**:

- Concurrency vs parallelism
- Threading basics: `threading` module
- GIL (Global Interpreter Lock)
- When threading helps (I/O-bound tasks)
- `concurrent.futures.ThreadPoolExecutor`

**Example**:

```python
import concurrent.futures
import time


def slow_task(n: int) -> int:
    time.sleep(0.1)
    return n * 2


def test_threading() -> None:
    numbers = [1, 2, 3, 4, 5]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(slow_task, numbers))
    assert results == [2, 4, 6, 8, 10]
```

**Exercise**: Speed up I/O-bound tasks with threading.

---

### Lesson 67: Asyncio Basics

**Target**: Advanced students
**Topics**:

- `async`/`await` syntax
- `asyncio` module
- Coroutines
- `asyncio.run()`
- `asyncio.gather()`
- When to use async

**Example**:

```python
import asyncio


async def slow_task(n: int) -> int:
    await asyncio.sleep(0.1)
    return n * 2


async def main() -> list[int]:
    tasks = [slow_task(i) for i in range(5)]
    return await asyncio.gather(*tasks)


def test_asyncio() -> None:
    result = asyncio.run(main())
    assert result == [0, 2, 4, 6, 8]
```

**Exercise**: Build an async web scraper.

---

### Lesson 68: Multiprocessing for CPU-Bound Tasks

**Target**: Advanced students
**Topics**:

- `multiprocessing` module
- Process vs thread
- CPU-bound vs I/O-bound
- `concurrent.futures.ProcessPoolExecutor`
- Practical use cases

**Example**:

```python
import concurrent.futures


def cpu_intensive(n: int) -> int:
    return sum(i * i for i in range(n))


def test_multiprocessing() -> None:
    numbers = [1000000, 2000000, 3000000]
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(cpu_intensive, numbers))
    assert len(results) == 3
```

**Exercise**: Speed up a CPU-intensive task with multiprocessing.

---

## 🎯 Final Project (Lessons 69-70)

### Lesson 69: Final Project Part 1 - Planning and Design

**Target**: Students completing all modules
**Topics**:

- Requirements gathering
- Project structure design
- Module organization
- Test planning
- Setting up tooling (black, mypy, pytest, etc.)

**Deliverable**: Project plan and structure

---

### Lesson 70: Final Project Part 2 - Implementation

**Target**: Students with project plan
**Topics**:

- TDD implementation
- Code reviews (self-review checklist)
- Documentation
- Testing (100% coverage target)
- Final polish

**Example project ideas**:

- Task management CLI
- URL shortener
- File encryption tool
- Personal finance tracker
- Blog generator
- API client for a public API

**Deliverable**: Complete, tested, typed, documented project

---

## 📝 Appendices

### Appendix A: Development Environment Setup

- VS Code extensions (Python, Pylance, etc.)
- Settings configuration
- Keyboard shortcuts
- Debugging setup

### Appendix B: Common Patterns

- Factory pattern
- Singleton pattern
- Observer pattern
- Strategy pattern

### Appendix C: Performance Tips

- Profiling with `cProfile`
- Memory profiling
- Optimization strategies
- When optimization matters

### Appendix D: Resources for Continued Learning

- Official Python documentation
- PEPs (Python Enhancement Proposals)
- Books
- Communities (Stack Overflow, Reddit, Discord)
- Open source contribution

---

## 🛠️ Tooling Summary

**From Lesson 17 onwards, all code must pass**:

```bash
isort .
black .
flake8 .
mypy --strict .
pytest --cov=. --cov-report=term-missing
```

**Configuration files to include in course**:

- `.flake8` (for flake8 configuration)
- `pyproject.toml` (for black, isort, mypy)
- `pytest.ini` (for pytest configuration)

---

## 📊 Course Metrics

**Estimated duration**: 60-80 hours of study
**Number of lessons**: 70 lessons
**Number of exercises**: 70+ exercises
**Coverage target**: 100% (aspirational, 95%+ realistic)
**Code quality**: All code passes linters/formatters/type checkers once introduced

---

## ✅ Success Criteria

A student completes the course successfully when they can:

1. Write type-annotated Python code that passes mypy strict
2. Write comprehensive tests with pytest (TDD approach)
3. Format code automatically with black and isort
4. Organize code into packages and modules
5. Handle errors gracefully
6. Work with files and data formats
7. Apply OOP principles appropriately
8. Understand and use advanced features (generators, decorators, etc.)
9. Build a complete project from scratch following best practices

---

**End of Roadmap**
