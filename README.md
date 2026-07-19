# Miscellaneous Projects

A collection of miscellaneous utility scripts, notebooks, and web projects.

## Repository Structure

```
misc-projects/
├── notebooks/
│   ├── truth_table_generator.ipynb   # Generates truth tables for Boolean expressions
│   └── img_to_pdf_converter.ipynb    # Converts image files to PDF format
├── index.html + css/ + js/          # Free Oregon DMV Class C practice-test website
└── README.md
```

## Projects

### Oregon DMV Practice Test Website
A free, ad-free static website (repo root: `index.html`, `css/`, `js/`) for practicing the Oregon Class C
knowledge test, built from the 2026–2027 Oregon Driver Manual. Unofficial study aid —
answers may vary; always verify with the official manual.

**🌐 Live site: https://vamsireddysup.github.io/oregon-dmv-practice/**
(auto-deployed to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to master)

**Key features:**
- 310+ questions in real DMV formats: multiple choice, true/false, yes/no,
  fill-in-the-blank, multi-select, and sign identification
- Animated SVG traffic scenarios (four-way stops, roundabouts, school buses,
  blind spots…) and read-aloud audio like the DMV's touch-screen audio assist
- 35-question practice-test simulator with the real 28/35 (80%) pass rule,
  optional timer and exam mode
- Spaced repetition — weak questions resurface more often — plus study streaks
  and a stats dashboard with practice-test history
- Flashcards with know-it / review-again piles, road sign gallery, rapid-fire
  sign quiz, and a searchable browse-all-questions view
- Behind-the-wheel drive-test prep with examiner scenarios and vehicle checklist
- Missed-question review and per-topic mastery tracking (localStorage only, no server)
- Dark/light theme, animations, fully responsive — pure HTML/CSS/JS, no dependencies

**Run locally:** open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

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
