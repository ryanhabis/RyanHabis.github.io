# setup_website.py
import os
import subprocess

def setup_website():
    print("Setting up Shipman Analysis website...")
    
    # Create directory structure
    directories = [
        'portfolio/shipman-analysis',
        'portfolio/shipman-analysis/data',
        'portfolio/shipman-analysis/images'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")
    
    # Run export script
    print("\nExporting data...")
    try:
        subprocess.run(['python', 'export_data.py'], check=True)
    except subprocess.CalledProcessError:
        print("Error running export script. Please run it manually.")
    
    # Copy HTML, CSS, JS files
    print("\nCopying template files...")
    files_to_create = {
        'portfolio/shipman-analysis/index.html': """
<!-- This file will be created by the main setup -->
<!-- Run the export_data.py script first -->
""",
        'portfolio/shipman-analysis/style.css': """
/* CSS will be added here */
""",
        'portfolio/shipman-analysis/script.js': """
// JavaScript will be added here
"""
    }
    
    for filepath, content in files_to_create.items():
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Created file: {filepath}")
    
    print("\n" + "="*50)
    print("SETUP COMPLETE!")
    print("="*50)
    print("\nNext steps:")
    print("1. Run 'python export_data.py' to generate analysis data")
    print("2. Copy the HTML, CSS, and JS code provided above")
    print("3. Upload to GitHub Pages")
    print("\nYour website will be available at:")
    print("https://yourusername.github.io/portfolio/shipman-analysis/")

if __name__ == "__main__":
    setup_website()