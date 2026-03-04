---
title: 2b Language Specification
---

# 2b Language Specification

This document defines the syntax and semantics of the 2b programming language.

## 1. Lexical Structure

### 1.1 Identifiers

An identifier is a sequence of letters, digits, and underscores, starting with a letter or underscore.

::ebnf-railroad{file="grammar.ebnf" rule="identifier"}

### 1.2 Literals

#### Number Literals

::ebnf-railroad{file="grammar.ebnf" rule="number"}

#### String Literals

::ebnf-railroad{file="grammar.ebnf" rule="string"}

## 2. Expressions

### 2.1 Expression Grammar

::ebnf-railroad{file="grammar.ebnf" rule="expression"}

### 2.2 Function Calls

::ebnf-railroad{file="grammar.ebnf" rule="call"}

## 3. Statements

### 3.1 Let Bindings

::ebnf-railroad{file="grammar.ebnf" rule="let-statement"}

### 3.2 If Statements

::ebnf-railroad{file="grammar.ebnf" rule="if-statement"}

### 3.3 Function Declarations

::ebnf-railroad{file="grammar.ebnf" rule="function-decl"}
