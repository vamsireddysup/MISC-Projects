# Miscellaneous Projects

A collection of miscellaneous utility scripts, notebooks, and web projects.

## Repository Structure

```
misc-projects/
├── notebooks/
│   ├── truth_table_generator.ipynb   # Generates truth tables for Boolean expressions
│   └── img_to_pdf_converter.ipynb    # Converts image files to PDF format
├── oregon-dmv-practice/              # Free Oregon DMV Class C practice-test website
└── README.md
```

## Projects

### Oregon DMV Practice Test Website
A free, ad-free static website (`oregon-dmv-practice/`) for practicing the Oregon Class C
knowledge test, built from the 2026–2027 Oregon Driver Manual. Unofficial study aid —
answers may vary; always verify with the official manual.

**Key features:**
- 220+ questions in real DMV formats: multiple choice, true/false, yes/no,
  fill-in-the-blank, multi-select, and sign identification
- 35-question practice-test simulator with the real 28/35 (80%) pass rule,
  optional timer and exam mode
- Flashcards with know-it / review-again piles, road sign gallery and rapid-fire sign quiz
- Behind-the-wheel drive-test prep with examiner scenarios and vehicle checklist
- Missed-question review and per-topic mastery tracking (localStorage only, no server)
- Dark/light theme, animations, fully responsive — pure HTML/CSS/JS, no dependencies

**Run it:** open `oregon-dmv-practice/index.html` in a browser, or serve it:

```bash
cd oregon-dmv-practice && python3 -m http.server 8000
```

Works as-is on GitHub Pages or any static host.

### Truth Table Generator
Generates truth tables for Boolean logic expressions using Python. Useful for digital logic analysis and verification.

**Key features:**
- Parses Boolean expressions
- Generates complete truth tables
- Displays formatted output

### Image to PDF Converter
Converts image files (JPG, PNG) to PDF format programmatically using Python.

**Key features:**
- Batch image conversion
- PDF output generation
- Simple CLI interface

## Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Launch Jupyter
jupyter notebook notebooks/
```

## Dependencies

- `jupyter` — notebook environment
- `img2pdf` — image to PDF conversion
- `pandas` / `itertools` — truth table generation
