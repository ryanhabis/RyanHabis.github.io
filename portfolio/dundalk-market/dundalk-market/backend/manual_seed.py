import database
import models
from sqlalchemy.orm import Session

print("🌱 Seeding Dundalk Market Database...")

# Create tables if not exist
models.Base.metadata.create_all(bind=database.engine)

# Get database session
db = Session(bind=database.engine)

# Clear existing data
print("Clearing old data...")
db.query(models.Product).delete()
db.query(models.Store).delete()
db.commit()

# Create DPL Engineering
print("Adding DPL Engineering...")
dpl = models.Store(
    name="DPL Engineering",
    owner_name="John Smith",
    email="contact@dpl-dundalk.ie",
    phone="042 123 4567",
    address="Dundalk Industrial Estate, Dundalk, Co. Louth",
    description="Precision engineering and industrial supplies serving Dundalk for 20+ years",
    category="Industrial",
    is_approved=True
)
db.add(dpl)
db.commit()
db.refresh(dpl)

# Add DPL products
dpl_products = [
    ("Steel Bolts (Pack of 50)", 24.99, "High-quality steel bolts", "Hardware"),
    ("Aluminum Brackets", 15.50, "Lightweight aluminum brackets", "Hardware"),
    ("Custom CNC Machining Service", 199.99, "Precision CNC machining", "Services"),
]
for name, price, desc, cat in dpl_products:
    db.add(models.Product(store_id=dpl.id, name=name, price=price, description=desc, category=cat))

# Create Dundalk Bookshop
print("Adding Dundalk Bookshop...")
bookshop = models.Store(
    name="Dundalk Bookshop",
    owner_name="Mary O'Connor",
    email="info@dundalkbookshop.ie",
    phone="042 987 6543",
    address="Market Square, Dundalk, Co. Louth",
    description="Independent bookshop specializing in local authors and Irish history",
    category="Retail",
    is_approved=True
)
db.add(bookshop)
db.commit()
db.refresh(bookshop)

# Add bookshop products
bookshop_products = [
    ("Local History of Dundalk", 19.99, "Comprehensive history book", "Books"),
    ("Irish Poetry Collection", 12.99, "Collection of Irish poetry", "Books"),
    ("Gift Card €20", 20.00, "€20 gift card", "Gifts"),
]
for name, price, desc, cat in bookshop_products:
    db.add(models.Product(store_id=bookshop.id, name=name, price=price, description=desc, category=cat))

# Create The Square Bakery
print("Adding The Square Bakery...")
bakery = models.Store(
    name="The Square Bakery",
    owner_name="Peter Brown",
    email="hello@squarebakery.ie",
    phone="042 555 1234",
    address="The Square, Dundalk, Co. Louth",
    description="Artisan bakery using traditional methods and local ingredients",
    category="Food",
    is_approved=True
)
db.add(bakery)
db.commit()
db.refresh(bakery)

# Add bakery products
bakery_products = [
    ("Sourdough Loaf", 4.50, "Traditional sourdough bread", "Bread"),
    ("Danish Pastries (Pack of 4)", 8.99, "Fresh danish pastries", "Pastries"),
    ("Coffee Beans (250g)", 12.99, "Premium coffee beans", "Drinks"),
]
for name, price, desc, cat in bakery_products:
    db.add(models.Product(store_id=bakery.id, name=name, price=price, description=desc, category=cat))

# Commit all products
db.commit()

# Verify
store_count = db.query(models.Store).count()
product_count = db.query(models.Product).count()

print("\n✅ SEEDING COMPLETE!")
print(f"   Stores created: {store_count}")
print(f"   Products created: {product_count}")
print("\n🌐 Test endpoints:")
print(f"   Health: http://127.0.0.1:8000/health")
print(f"   Stores: http://127.0.0.1:8000/stores")
print(f"   Products: http://127.0.0.1:8000/products")
print(f"   DPL Engineering: http://127.0.0.1:8000/stores/1")
