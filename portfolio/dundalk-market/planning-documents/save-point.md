# DUNDALK MARKET - PROJECT SNAPSHOT
**Date:** 2026-02-09  
**Status:** MVP Complete - API + Frontend + Database Working  
**Developer:** Dylan (Masters in Data Analytics, BSc Cloud Computing)

---

## 📁 PROJECT STRUCTURE
```
C:\GitHub-RyanHabis.io repo\RyanHabis.github.io\portfolio\dundalk-market\
├── dundalk-market\                          # Main project folder
│   ├── backend\                             # FastAPI backend
│   │   ├── venv\                            # Python virtual environment
│   │   ├── __pycache__\                     # Python cache
│   │   ├── .env                            # Environment variables (DATABASE_URL)
│   │   ├── database.py                     # Database connection & session
│   │   ├── models.py                       # SQLAlchemy models (Store, Product)
│   │   ├── main.py                         # FastAPI app with endpoints
│   │   ├── main_backup.py                  # Backup of original version
│   │   ├── main_simple.py                  # Simplified test version
│   │   ├── manual_seed.py                  # Direct database seeding script
│   │   ├── seed_db.py                      # Alternative seed script
│   │   ├── seed_direct.py                  # Direct seeding (working)
│   │   ├── test_api.py                     # Initial test file
│   │   ├── test_seed.py                    # Seed testing script
│   │   └── dundalk_market.db               # SQLite database file (ACTIVE)
│   │
│   └── frontend\                           # HTML/JS frontend
│       ├── index.html                      # Main frontend (CORS issues)
│       ├── index_backup.html               # Original backup
│       ├── index_fixed.html                # Fixed version with CORS workaround
│       └── temp.js                         # JavaScript snippets
│
└── business\                               # Business materials (planned)
```

---

## 🚀 CURRENT STATE
**API:** Running at `http://127.0.0.1:8000` (FastAPI + SQLite)  
**Frontend:** `frontend/index_fixed.html` (has CORS workaround)  
**Database:** SQLite with 3 stores, 9 products seeded  
**Status:** Functional MVP with CORS issues when frontend opened via file://

---

## 🐍 PYTHON ENVIRONMENT

### Virtual Environment
- **Location:** `backend/venv/`
- **Activation:** `.\venv\Scripts\activate.bat` (Windows)
- **Python:** 3.12

### Installed Packages
```bash
# Core
fastapi==0.128.6
uvicorn==0.40.0
sqlalchemy==2.0.46
psycopg2-binary==2.9.11      # For PostgreSQL (not currently used)
stripe==14.3.0               # Payment processing (not integrated yet)
python-dotenv==1.2.1
alembic==1.18.3              # Database migrations (not used yet)

# Dependencies
pydantic==2.12.5
pydantic-core==2.41.5
greenlet==3.3.1
anyio==4.12.1
starlette==0.52.1
h11==0.16.0
Mako==1.3.10
```

### Package Installation History
```bash
# Initial setup
python -m venv venv
.\venv\Scripts\activate.bat
python -m pip install fastapi uvicorn sqlalchemy psycopg2-binary stripe python-dotenv alembic

# Added later
python -m pip install pydantic
```

---

## 🗃️ DATABASE

### Current Configuration
- **Type:** SQLite (development)
- **File:** `dundalk_market.db`
- **Connection:** `sqlite:///./dundalk_market.db` (in `.env`)
- **Supabase URL Available:** `postgresql://postgres:Cooper_molly_lucky123@db.vzdyohcdaepswecshzgs.supabase.co:5432/postgres` (not working due to .env loading issues)

### Database Schema
```python
# models.py
Store Table:
  id (PK), name, owner_name, email, phone, address, description, category
  stripe_account_id, vat_number, is_approved, created_at, updated_at
  relationships: products (one-to-many)

Product Table:
  id (PK), store_id (FK), name, price, description, category
  stock_quantity, is_active, image_url, created_at, updated_at
  relationships: store (many-to-one)
```

---

## 🔧 API ENDPOINTS (FASTAPI)

### Active Endpoints
```
GET  /              - API info
GET  /health        - Health check + counts
GET  /stores        - List all approved stores
GET  /stores/{id}   - Get specific store with products
GET  /products      - List all active products
POST /seed          - Seed database with sample data
```

### Example Responses
```json
// GET /health
{
  "status": "healthy",
  "database": "connected",
  "stores": 3,
  "products": 9
}

// GET /stores
[{
  "id": 1,
  "name": "DPL Engineering",
  "owner_name": "John Smith",
  "email": "dpl@example.com",
  "phone": "042 123 4567",
  "address": "Dundalk Industrial Estate, Dundalk, Co. Louth",
  "description": "Precision engineering...",
  "category": "Industrial",
  "is_approved": true,
  "created_at": "2026-02-09T21:...",
  "products": [...]
}]
```

---

## 💻 FRONTEND

### Current Issues
1. **CORS Problem:** Frontend opened via `file://` protocol blocked from accessing `localhost:8000`
2. **Workaround:** Created `index_fixed.html` with multiple API URL testing
3. **Alternative:** Could serve frontend from FastAPI static files

### JavaScript API Connection Logic
```javascript
// Current approach in index_fixed.html
const API_URLS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://' + window.location.hostname + ':8000'
];

// Tests each URL until one works
async function findWorkingAPI() { ... }
```

---

## 🎯 SEEDED DATA

### Stores (3)
1. **DPL Engineering** - Industrial supplies, Dundalk Industrial Estate
2. **Dundalk Bookshop** - Books & gifts, Market Square  
3. **The Square Bakery** - Food & drinks, The Square

### Products (9)
- DPL: Steel Bolts (€24.99), Aluminum Brackets (€15.50), CNC Machining (€199.99)
- Bookshop: History Book (€19.99), Poetry Collection (€12.99), Gift Card (€20.00)
- Bakery: Sourdough (€4.50), Pastries (€8.99), Coffee Beans (€12.99)

---

## ⚠️ KNOWN ISSUES

### Technical Issues
1. **CORS blocking** - Frontend can't access API when opened as file
2. **.env loading** - python-dotenv can't read .env file properly on Windows
3. **Supabase connection** - Password needs URL encoding or different auth method

### Business Logic Missing
1. No user authentication
2. No payment processing (Stripe installed but not integrated)
3. No order management system
4. No inventory management

---

## 🛠️ DEVELOPMENT COMMANDS

### Common Workflows
```powershell
# Start backend
cd backend
.\venv\Scripts\activate.bat
python -m uvicorn main:app --reload

# Seed database (alternative methods)
python manual_seed.py                    # Direct Python script
Invoke-RestMethod -Uri "http://127.0.0.1:8000/seed" -Method Post  # API call
curl -X POST http://127.0.0.1:8000/seed  # curl alternative

# Test endpoints
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/stores
```

### Windows-Specific Fixes Applied
1. **Virtual Environment Activation:** Use `.bat` not `.ps1`
2. **Execution Policy:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. **Path Issues:** Packages installed globally initially, fixed by reinstalling in venv

---

## 🎨 BUSINESS MODEL

### Revenue Model
- **12% commission** on all sales
- **Example:** €100 sale → €88 to store, €12 to platform
- **Target:** Local SMEs in Dundalk (like DPL Engineering)

### Value Proposition
1. **For Businesses:** Zero upfront cost, new customer reach, local support
2. **For Customers:** One-stop local shopping, click & collect, support local economy
3. **For Community:** Keep money in Dundalk, digital main street

---

## 📈 NEXT PRIORITIES

### Immediate (Week 1)
1. **Fix CORS permanently** - Serve frontend from FastAPI
2. **Add basic authentication** - Store owner login
3. **Create business pitch deck** - For Dundalk Chamber of Commerce

### Short-term (Month 1)
1. **Integrate Stripe payments**
2. **Add order management**
3. **Deploy to Railway/Render**
4. **Onboard 3 pilot stores**

### Long-term (Masters Integration)
1. **Data analytics dashboard** - Use Masters skills
2. **Predictive inventory** - ML models
3. **Customer behavior analysis**

---

## 🔗 EXTERNAL SERVICES

### Configured But Not Active
1. **Supabase:** PostgreSQL database ready (connection issues)
2. **Stripe:** Test API available (not integrated)
3. **Domain:** `dundalkmarket.ie` (not purchased yet)

### Needed Services
1. **Email service** (Resend, Postmark)
2. **Hosting** (Railway, Render, Vercel)
3. **Monitoring** (Sentry, LogRocket)

---

## 🎓 ACADEMIC INTEGRATION

### Masters Project Opportunities
- **Thesis:** "Data-Driven Platform for Local Retail Resilience"
- **Data Sources:** Sales patterns, customer behavior, inventory optimization
- **Techniques:** Time series forecasting, clustering, recommendation systems

### Skills Applied
1. **Cloud Computing:** FastAPI deployment, database management
2. **Data Analytics:** Will analyze platform data
3. **Mobile Development:** Potential Flutter app
4. **Software Engineering:** Full-stack development

---

## 📋 CHECKLIST FOR PRODUCTION

### Technical
- [ ] Fix CORS permanently
- [ ] Add environment-based configuration
- [ ] Implement proper error handling
- [ ] Add API versioning
- [ ] Set up logging
- [ ] Create database migrations
- [ ] Add rate limiting

### Business
- [ ] Draft terms of service
- [ ] Create privacy policy
- [ ] Setup business bank account
- [ ] Register company (LTD)
- [ ] Get business insurance
- [ ] VAT registration advice

### Legal
- [ ] GDPR compliance
- [ ] Irish Consumer Rights Act 2022
- [ ] Marketplace facilitator tax laws
- [ ] Terms for stores & customers

---

## 💡 KEY DECISIONS & LEARNINGS

### Technical Decisions
1. **Started with SQLite** instead of fighting Supabase connection issues
2. **Used FastAPI** over Flask/Django for async capabilities
3. **Separated frontend/backend** for flexibility
4. **Created multiple seed scripts** for reliability

### Business Realizations
1. **12% commission** is viable based on local business interviews
2. **Click & collect** is easier than delivery for MVP
3. **Dundalk focus** provides clear market validation
4. **Student status** is an advantage for initial outreach

### Development Lessons
1. **Windows quirks:** Execution policies, venv activation, path issues
2. **CORS is tricky** with file:// protocol
3. **.env files** need careful handling on Windows
4. **Having working seed scripts** is critical for demos

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Problems & Solutions
1. **"Cannot load stores" error in frontend**
   - Check backend is running: `python -m uvicorn main:app --reload`
   - Open browser console (F12) for CORS errors
   - Try `index_fixed.html` instead of `index.html`

2. **Database connection fails**
   - Check `.env` file exists and has `DATABASE_URL`
   - Default to SQLite: `DATABASE_URL=sqlite:///./dundalk_market.db`
   - Run `python manual_seed.py` to seed directly

3. **Packages not found in venv**
   - Activate venv: `.\venv\Scripts\activate.bat`
   - Reinstall: `python -m pip install -r requirements.txt` (if file exists)
   - Check installation: `python -c "import fastapi; print('OK')"`

---

**SAVE POINT COMPLETE** - This snapshot contains everything needed to restore, continue development, or deploy the Dundalk Market platform.