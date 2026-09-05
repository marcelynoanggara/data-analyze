import os
import csv
import random

random.seed(42)
os.makedirs("D:/project/data-analyze/sample-data", exist_ok=True)

regions = ["North", "South", "East", "West"]
categories = ["Electronics", "Clothing", "Home & Kitchen", "Books"]
products = {
    "Electronics": ["Laptop", "Smartphone", "Headphones", "Monitor"],
    "Clothing": ["T-Shirt", "Jeans", "Jacket", "Sneakers"],
    "Home & Kitchen": ["Coffee Maker", "Blender", "Microwave", "Toaster"],
    "Books": ["Fiction Novel", "Sci-Fi Book", "Cookbook", "History Book"]
}

rows = []
for i in range(1, 501):
    cat = random.choice(categories)
    prod = random.choice(products[cat])
    reg = random.choice(regions)
    qty = random.randint(1, 10)
    unit_price = round(random.uniform(10.0, 500.0), 2)
    revenue = round(qty * unit_price, 2)
    cust_age = random.randint(18, 70)
    
    if i in [50, 150, 250, 350, 450]:
        unit_price = round(unit_price * 15, 2)
        revenue = round(qty * unit_price, 2)
    
    cust_age_val = "" if i % 25 == 0 else str(cust_age)
    reg_val = "" if i % 40 == 0 else reg
    
    rows.append([f"2025-{(i%12)+1:02d}-{(i%28)+1:02d}", prod, cat, reg_val, qty, unit_price, revenue, cust_age_val])

rows.append(rows[0])
rows.append(rows[1])

with open("D:/project/data-analyze/sample-data/sample_sales.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["date", "product", "category", "region", "quantity", "unit_price", "revenue", "customer_age"])
    writer.writerows(rows)
print("sample_sales.csv generated successfully")
