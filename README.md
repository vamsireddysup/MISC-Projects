# Miscellaneous AI-Generated Python Utilities

These repository includes some miscellaneous projects generated using GPT/AI for temporary use.

---

## [1. Truth Table Generation Using Python](#truth-table-generation-using-python)

### Description
Generates a truth table for user-defined Boolean expressions with multiple inputs and outputs, using the `ttg` and `pandas` libraries. It also supports output as an Excel file.

### Features
- Define custom logic expressions
- Auto-generate complete truth tables
- Save as Excel
- Sorted rows for clear interpretation

### Sample Expressions
```python
variables = ['in', 'Q11', 'Q12', 'Q21', 'Q22']
expressions = [
    'in and Q12',
    'in or Q12',
    'in and Q22',
    '(Q22 and (in or Q21))',
    '(in or Q12) xor ((Q22 and (in or Q21)))'
]
```

### Output
- `truth_table.xlsx` — Contains full truth table
- `state_diagram.png` — Visual transition map from a given state transition table using `Graphviz`

---

## [2. Image to PDF Conversion Using Python](#image-to-pdf-conversion-using-python)

### Description
Recursively converts images in subfolders into individual PDF files using `PIL`. Each subfolder is turned into a separate PDF file.

### Features
- Supports `.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff`, `.gif`
- Maintains subfolder structure
- Converts images to high-quality PDFs
- Output PDFs are named after their respective subfolders

### Usage
Set the root and output folders in the script:
```python
root_images_folder = "/path/to/images"
output_pdfs_folder = "/path/to/save/pdfs"
```

### Output
- A PDF file for each image subfolder under the specified directory.

---
