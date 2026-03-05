---
title: Introduction
---

# 2b Language Documentation

Welcome to the 2b programming language documentation.

## Getting Started

2b is a modern programming language designed for clarity and performance.

```
let greeting: string = "Hello, 2b!"
```

::ide-try-it{src="/examples/hello-world.json" label="Try Hello World"}
::

::ide-try-it{src="/examples/fibonacci.json" label="Try Fibonacci"}
::

::ide-try-it{src="/examples/multi-file.json" label="Try Multi-File Project"}
::

## Grammar

Here's the expression syntax as a railroad diagram:

::ebnf-railroad{file="grammar.ebnf" rule="expression"}
::

::ebnf-railroad{file="grammar.ebnf" rule="statement"}
::

::ebnf-railroad{file="grammar.ebnf" rule="type"}
::

## Next Steps

- Read the [Language Specification](/spec/next/) for complete details
- Check out the [Downloads](/downloads) page to install 2b
