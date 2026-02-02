# portfolio/shipman-analysis/generate_data.py
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import os

def main():
    print("Generating data for Harold Shipman analysis website...")
    
    # Create directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('images', exist_ok=True)
    
    # Load data
    url = "https://dspiegel29.github.io/ArtofStatistics/00-1-age-and-year-of-deathofharold-shipmans-victims/00-1-shipman-confirmed-victims-x.csv"
    df = pd.read_csv(url)
    df_clean = df.dropna()
    
    print(f"✅ Loaded {len(df_clean)} victims")
    
    # Calculate statistics
    stats = {
        "total_victims": int(len(df_clean)),
        "average_age": float(round(df_clean['Age'].mean(), 1)),
        "median_age": float(round(df_clean['Age'].median(), 1)),
        "youngest": int(df_clean['Age'].min()),
        "oldest": int(df_clean['Age'].max()),
        "first_year": float(round(df_clean['fractionalDeathYear'].min(), 2)),
        "last_year": float(round(df_clean['fractionalDeathYear'].max(), 2)),
        "time_span": float(round(df_clean['fractionalDeathYear'].max() - df_clean['fractionalDeathYear'].min(), 2))
    }
    
    # Age distribution
    age_bins = [0, 50, 60, 70, 80, 90, 100]
    age_labels = ['Under 50', '50-59', '60-69', '70-79', '80-89', '90+']
    df_clean['AgeGroup'] = pd.cut(df_clean['Age'], bins=age_bins, labels=age_labels, right=False)
    age_counts = df_clean['AgeGroup'].value_counts().sort_index()
    
    age_data = {
        "labels": age_counts.index.tolist(),
        "counts": age_counts.values.tolist(),
        "percentages": (age_counts.values / len(df_clean) * 100).round(1).tolist()
    }
    
    # Year distribution
    df_clean['Year'] = df_clean['fractionalDeathYear'].round().astype(int)
    year_counts = df_clean['Year'].value_counts().sort_index()
    
    year_data = {
        "years": year_counts.index.tolist(),
        "counts": year_counts.values.tolist()
    }
    
    # Save JSON data
    all_data = {
        "summary": stats,
        "age_distribution": age_data,
        "year_distribution": year_data,
        "correlation": float(round(df_clean['Age'].corr(df_clean['fractionalDeathYear']), 3))
    }
    
    with open('data/analysis_data.json', 'w') as f:
        json.dump(all_data, f, indent=2)
    
    # Create visualizations
    # 1. Age distribution
    plt.figure(figsize=(10, 6))
    plt.hist(df_clean['Age'], bins=15, color='#3498db', edgecolor='black', alpha=0.7)
    plt.title('Age Distribution of Victims', fontsize=16, fontweight='bold')
    plt.xlabel('Age', fontsize=12)
    plt.ylabel('Number of Victims', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('images/age_distribution.png', dpi=150)
    plt.close()
    
    # 2. Scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(df_clean['fractionalDeathYear'], df_clean['Age'], 
                alpha=0.6, color='#e74c3c', s=50, edgecolors='black', linewidth=0.5)
    plt.title('Age vs Year of Death', fontsize=16, fontweight='bold')
    plt.xlabel('Year of Death', fontsize=12)
    plt.ylabel('Age', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('images/scatter_plot.png', dpi=150)
    plt.close()
    
    # 3. Year trend
    plt.figure(figsize=(10, 6))
    plt.plot(year_counts.index, year_counts.values, 
             marker='o', linestyle='-', linewidth=2, color='#2ecc71')
    plt.title('Victims Per Year', fontsize=16, fontweight='bold')
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Number of Victims', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('images/year_trend.png', dpi=150)
    plt.close()
    
    print(f"\n✅ Data generated successfully!")
    print(f"📁 JSON file: data/analysis_data.json")
    print(f"🖼️  Images: images/")
    print(f"\n📊 Key Statistics:")
    print(f"   • Total victims: {stats['total_victims']}")
    print(f"   • Average age: {stats['average_age']} years")
    print(f"   • Time span: {stats['time_span']} years")

if __name__ == "__main__":
    main()