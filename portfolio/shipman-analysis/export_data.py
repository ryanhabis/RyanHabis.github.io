# export_data.py
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Run your analysis and export results
def export_shipman_data():
    print("Exporting Shipman analysis data for website...")
    
    # 1. Load and clean data
    url = "https://dspiegel29.github.io/ArtofStatistics/00-1-age-and-year-of-deathofharold-shipmans-victims/00-1-shipman-confirmed-victims-x.csv"
    df = pd.read_csv(url)
    df_clean = df.dropna()
    
    # 2. Export basic statistics as JSON
    stats = {
        "total_victims": int(len(df_clean)),
        "average_age": float(df_clean['Age'].mean()),
        "median_age": float(df_clean['Age'].median()),
        "youngest_victim": int(df_clean['Age'].min()),
        "oldest_victim": int(df_clean['Age'].max()),
        "first_year": float(df_clean['fractionalDeathYear'].min()),
        "last_year": float(df_clean['fractionalDeathYear'].max()),
        "years_span": float(df_clean['fractionalDeathYear'].max() - df_clean['fractionalDeathYear'].min())
    }
    
    # 3. Export age distribution data for charts
    age_bins = [0, 50, 60, 70, 80, 90, 100]
    age_labels = ['<50', '50-59', '60-69', '70-79', '80-89', '90+']
    df_clean['AgeGroup'] = pd.cut(df_clean['Age'], bins=age_bins, labels=age_labels, right=False)
    age_group_counts = df_clean['AgeGroup'].value_counts().sort_index()
    
    age_distribution = {
        "labels": age_group_counts.index.tolist(),
        "counts": age_group_counts.values.tolist(),
        "percentages": (age_group_counts.values / len(df_clean) * 100).round(1).tolist()
    }
    
    # 4. Export year distribution data
    df_clean['Year'] = df_clean['fractionalDeathYear'].round().astype(int)
    year_counts = df_clean['Year'].value_counts().sort_index()
    
    year_distribution = {
        "years": year_counts.index.tolist(),
        "victims_per_year": year_counts.values.tolist()
    }
    
    # 5. Create and save visualizations
    plt.figure(figsize=(10, 6))
    plt.hist(df_clean['Age'], bins=15, color='skyblue', edgecolor='black')
    plt.title('Age Distribution of Harold Shipman\'s Victims')
    plt.xlabel('Age')
    plt.ylabel('Number of Victims')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('C:\\GitHub-RyanHabis.io repo\\RyanHabis.github.io\\portfolio\\shipman-analysis\\images\\age_distribution.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # Scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(df_clean['fractionalDeathYear'], df_clean['Age'], alpha=0.6)
    plt.title('Victim Age vs. Year of Death')
    plt.xlabel('Year of Death')
    plt.ylabel('Age')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('C:\\GitHub-RyanHabis.io repo\\RyanHabis.github.io\\portfolio\\shipman-analysis\\images\\age_vs_year.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # 6. Export all data to JSON files
    export_data = {
        "summary_statistics": stats,
        "age_distribution": age_distribution,
        "year_distribution": year_distribution,
        "raw_data_sample": df_clean.head(20).to_dict('records')  # First 20 rows
    }
    
    with open('website/data/analysis_results.json', 'w') as f:
        json.dump(export_data, f, indent=2)
    
    print("Data exported successfully!")
    print(f"- Total victims: {stats['total_victims']}")
    print(f"- Average age: {stats['average_age']:.1f} years")
    print(f"- Analysis span: {stats['years_span']:.1f} years")

if __name__ == "__main__":
    export_shipman_data()