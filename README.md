# Java Interview Complete Guide

A comprehensive static site for Java interview preparation at senior/10-year experience level.

## 📚 Contents

| Section | Questions | Topics |
|---------|-----------|--------|
| Basics & Fundamentals | 45 | JVM, OOP, memory, types |
| Java Versions | 35 | Java 5–21, lambdas, records, virtual threads |
| OOP & SOLID | 30 | Design principles, patterns |
| Collections | 48 | HashMap, ArrayList, generics |
| Exception Handling | 58 | Checked/unchecked, best practices |
| Concurrency | 53 | Threads, locks, executors, Loom |
| Advanced Concurrency | 30 | Expert-level patterns |
| Methods Reference | 320+ | Quick-revision tables across 16 categories |

Shared assets live under `assets/` (`theme.css`, `main.js`). The site supports
a centralized light/dark theme: light is the default, and a sun/moon button in
the top nav toggles to dark (preference is saved in `localStorage`).

## 🚀 GitHub Pages Setup

1. Create a repo (e.g. `Java_material`)
2. Copy all `.html` files to the repo root
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your site will be live at https://krupal01.github.io/java_material/

## 🗂️ File Structure

```
index.html                  ← Landing page
basics.html                 ← Part 1: Basics
versions.html               ← Part 2: Java Versions
oop.html                    ← Part 3: OOP & SOLID
collections.html            ← Part 4: Collections
exceptions.html             ← Part 5: Exceptions
concurrency.html            ← Part 6: Concurrency
advanced-concurrency.html   ← Part 7: Expert Concurrency
methods.html                ← Methods quick-reference (320+ methods)
assets/theme.css            ← Centralized light/dark theme
assets/main.js              ← Shared interactivity (accordion, search, theme toggle)
```
