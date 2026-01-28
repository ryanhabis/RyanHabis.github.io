document.addEventListener('DOMContentLoaded', function() {
    // Interactive notification
    const notification = document.getElementById('notification');
    const closeNotificationBtn = document.getElementById('closeNotification');
    
    // Show notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'flex';
    }, 3000);
    
    // Close notification button
    closeNotificationBtn.addEventListener('click', () => {
        notification.style.display = 'none';
    });
    
    // Auto-hide notification after 10 seconds
    setTimeout(() => {
        if (notification.style.display !== 'none') {
            notification.style.display = 'none';
        }
    }, 10000);
    
    // View notebook button functionality
    const viewNotebookBtn = document.getElementById('viewNotebookBtn');
    viewNotebookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create modal for notebook preview
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Jupyter Notebook Preview</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="notebook-preview">
                        <div class="code-cell">
                            <div class="cell-header">In [1]:</div>
                            <pre><code># Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np</code></pre>
                        </div>
                        <div class="code-cell">
                            <div class="cell-header">In [2]:</div>
                            <pre><code>credit_data = pd.read_csv('creditcard.csv')</code></pre>
                        </div>
                        <div class="markdown-cell">
                            <h4>Requirements – Statistics</h4>
                            <p>Exploration of data including description, identification of outliers/missing data, and treatment.</p>
                        </div>
                        <div class="code-cell">
                            <div class="cell-header">In [3]:</div>
                            <pre><code># Basic info about the dataset
print("Dataset shape:", credit_data.shape)
print("First few rows:")
print(credit_data.head())</code></pre>
                        </div>
                        <div class="output-cell">
                            <div class="cell-header">Out [3]:</div>
                            <pre><code>Dataset shape: (284807, 31)
First few rows:
   Time        V1        V2        V3  ... Amount  Class
0   0.0 -1.359807 -0.072781  2.536347  ...  149.62      0
1   0.0  1.191857  0.266151  0.166480  ...    2.69      0
2   1.0 -1.358354 -1.340163  1.773209  ...  378.66      0</code></pre>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <p><i class="fas fa-info-circle"></i> This is a preview. The full notebook contains 162+ code cells with complete analysis.</p>
                    <a href="#" class="btn" id="requestNotebookBtn">
                        <i class="fas fa-envelope"></i> Request Full Notebook
                    </a>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
                background: #2c3e50;
                color: white;
                border-radius: 12px 12px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
                color: white;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.8rem;
                cursor: pointer;
                line-height: 1;
            }
            
            .modal-body {
                padding: 20px;
                background: #f8f9fa;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                background: white;
                border-radius: 0 0 12px 12px;
            }
            
            .notebook-preview {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #ddd;
            }
            
            .code-cell, .markdown-cell, .output-cell {
                border-bottom: 1px solid #eee;
                padding: 15px;
            }
            
            .code-cell {
                background: #f6f8fa;
            }
            
            .markdown-cell {
                background: white;
            }
            
            .output-cell {
                background: #f8f9fa;
                border-left: 4px solid #28a745;
            }
            
            .cell-header {
                font-family: 'Roboto Mono', monospace;
                font-size: 0.9rem;
                color: #6c757d;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .code-cell pre, .output-cell pre {
                margin: 0;
                font-family: 'Roboto Mono', monospace;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .output-cell pre {
                color: #155724;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModalBtn = modal.querySelector('.modal-close');
        closeModalBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
        
        // Request notebook button
        const requestNotebookBtn = modal.querySelector('#requestNotebookBtn');
        requestNotebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Thank you for your interest! Please contact me via email to request the full Jupyter notebook.');
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
    });
    
    // Download button functionality
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create a simple text file with project summary
        const projectSummary = `Credit Card Fraud Detection Analysis
=====================================

Project Summary:
- Analyzed 284,807 credit card transactions
- Identified 473 fraudulent transactions (0.17%)
- Used Python with Pandas, NumPy, and Matplotlib
- Performed statistical analysis and data visualization
- Implemented outlier detection using IQR method

Key Findings:
1. Extreme class imbalance (0.17% fraud rate)
2. Fraudulent transactions have higher average amounts
3. PCA components effectively anonymized sensitive data

Technical Skills Demonstrated:
- Data cleaning and preprocessing
- Statistical analysis
- Data visualization
- Exploratory Data Analysis (EDA)
- Jupyter Notebook proficiency

For the complete project files including the Jupyter notebook,
please contact me directly.`;
        
        // Create download link
        const blob = new Blob([projectSummary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'credit_card_fraud_analysis_summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show confirmation
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Summary Downloaded!';
        downloadBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.background = '';
        }, 2000);
    });
    
    // Add interactive hover effect to method steps
    const methodSteps = document.querySelectorAll('.method-step');
    methodSteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1.2)';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add animation to skill tags on scroll
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(tag);
    });
    
    // Add current year to footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('footer p');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('2023', currentYear);
    }
});