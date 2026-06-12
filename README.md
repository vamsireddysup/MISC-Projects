# Miscellaneous Python Projects

A collection of miscellaneous Python utility scripts and Jupyter notebooks for various automation tasks.

## Repository Structure

```
misc-projects/
├── notebooks/
│   ├── truth_table_generator.ipynb   # Generates truth tables for Boolean expressions
│   └── img_to_pdf_converter.ipynb    # Converts image files to PDF format
└── README.md
```

## Projects

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
