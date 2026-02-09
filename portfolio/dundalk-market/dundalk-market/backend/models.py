from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base  # Now this should work

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    owner_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    address = Column(Text)
    description = Column(Text)
    category = Column(String(50))
    stripe_account_id = Column(String(100), nullable=True)
    vat_number = Column(String(20), nullable=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    products = relationship("Product", back_populates="store")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text)
    category = Column(String(50))
    stock_quantity = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    store = relationship("Store", back_populates="products")
