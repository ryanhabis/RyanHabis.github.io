from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import database
from pydantic import BaseModel
from datetime import datetime

# Pydantic models
class ProductBase(BaseModel):
    name: str
    price: float
    description: str = ""
    category: str = ""
    stock_quantity: int = 1

class ProductResponse(ProductBase):
    id: int
    store_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class StoreBase(BaseModel):
    name: str
    owner_name: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    description: str = ""
    category: str = ""

class StoreResponse(StoreBase):
    id: int
    is_approved: bool
    created_at: datetime
    products: List[ProductResponse] = []
    
    class Config:
        from_attributes = True

# Initialize FastAPI
app = FastAPI(title="Dundalk Market API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")

@app.get("/")
def root():
    return {
        "message": "🏪 Dundalk Market API v2.0",
        "database": "SQLite (development)",
        "endpoints": ["/health", "/stores", "/products", "/seed (POST)"]
    }

@app.get("/health")
def health_check(db: Session = Depends(database.get_db)):
    store_count = db.query(models.Store).count()
    product_count = db.query(models.Product).count()
    return {
        "status": "healthy",
        "database": "connected",
        "stores": store_count,
        "products": product_count
    }

@app.get("/stores", response_model=List[StoreResponse])
def get_stores(db: Session = Depends(database.get_db)):
    stores = db.query(models.Store).filter(models.Store.is_approved == True).all()
    return stores

@app.get("/stores/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(database.get_db)):
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

@app.post("/seed")
def seed_database(db: Session = Depends(database.get_db)):
    """Seed the database with sample Dundalk data"""
    
    # Clear existing data
    db.query(models.Product).delete()
    db.query(models.Store).delete()
    db.commit()
    
    # Create sample stores
    stores_data = [
        {
            "name": "DPL Engineering",
            "owner_name": "John Smith",
            "email": "dpl@example.com",
            "phone": "042 123 4567",
            "address": "Dundalk Industrial Estate, Dundalk, Co. Louth",
            "description": "Precision engineering and industrial supplies for over 20 years",
            "category": "Industrial",
            "is_approved": True
        },
        {
            "name": "Dundalk Bookshop",
            "owner_name": "Mary O'Connor",
            "email": "bookshop@example.com",
            "phone": "042 987 6543",
            "address": "Market Square, Dundalk, Co. Louth",
            "description": "Independent bookshop specializing in local authors and history",
            "category": "Retail",
            "is_approved": True
        },
        {
            "name": "The Square Bakery",
            "owner_name": "Peter Brown",
            "email": "bakery@example.com",
            "phone": "042 555 1234",
            "address": "The Square, Dundalk, Co. Louth",
            "description": "Artisan bakery using traditional methods and local ingredients",
            "category": "Food",
            "is_approved": True
        }
    ]
    
    stores = []
    for store_data in stores_data:
        db_store = models.Store(**store_data)
        db.add(db_store)
        db.commit()
        db.refresh(db_store)
        stores.append(db_store)
    
    # Create sample products
    products_data = [
        {"store_id": stores[0].id, "name": "Steel Bolts (Pack of 50)", "price": 24.99, "description": "High-quality steel bolts", "category": "Hardware"},
        {"store_id": stores[0].id, "name": "Aluminum Brackets", "price": 15.50, "description": "Lightweight aluminum brackets", "category": "Hardware"},
        {"store_id": stores[0].id, "name": "Custom CNC Machining", "price": 199.99, "description": "Custom machining services", "category": "Services"},
        {"store_id": stores[1].id, "name": "Local History of Dundalk", "price": 19.99, "description": "Comprehensive history of Dundalk", "category": "Books"},
        {"store_id": stores[1].id, "name": "Irish Poetry Collection", "price": 12.99, "description": "Collection of Irish poetry", "category": "Books"},
        {"store_id": stores[1].id, "name": "Gift Card €20", "price": 20.00, "description": "€20 gift card for the bookshop", "category": "Gifts"},
        {"store_id": stores[2].id, "name": "Sourdough Loaf", "price": 4.50, "description": "Traditional sourdough bread", "category": "Bread"},
        {"store_id": stores[2].id, "name": "Danish Pastries (Pack of 4)", "price": 8.99, "description": "Fresh danish pastries", "category": "Pastries"},
        {"store_id": stores[2].id, "name": "Coffee Beans (250g)", "price": 12.99, "description": "Premium coffee beans", "category": "Drinks"},
    ]
    
    for product_data in products_data:
        db_product = models.Product(**product_data)
        db.add(db_product)
    
    db.commit()
    
    return {
        "message": "Database seeded successfully",
        "stores_created": len(stores),
        "products_created": len(products_data)
    }

@app.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(database.get_db)):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    return products

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
