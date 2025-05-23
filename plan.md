# Mini CRM Development Plan

## Phase 1: Core CRM Setup

### Goals
- Be able to add clients (customers)
- Be able to add products/services your company offers
- Attach products/services to clients (record a sale or service per client)

### Tasks

#### 1. Dev Environment
- [ ] Set up Docker Compose for Postgres, .NET backend, and React frontend
- [ ] Create `.env` files for DB secrets (not committed to git)

#### 2. Database Schema & Backend
- [ ] Design initial DB schema:
    - Customers table
    - Products/Services table
    - Sales (or Orders) table (links customer to product/service)
- [ ] Implement backend models and DB migrations for these tables
- [ ] Create CRUD API endpoints:
    - [ ] Customers (add/edit/delete/list)
    - [ ] Products/Services (add/edit/delete/list)
    - [ ] Sales/Orders (add product/service to client)

#### 3. Frontend UI
- [ ] Set up basic React frontend (connects to API)
- [ ] Customer management UI (add/edit/list customers)
- [ ] Products/Services management UI (add/edit/list products/services)
- [ ] Add product/service to customer UI (record a sale/order)

#### 4. Testing & Docs
- [ ] Test adding clients, products/services, and linking them
- [ ] Update `readme.md` and this plan with any new info

---

## Notes

- Payments, renewals, and reminders will be added in the next phase.
- Use dummy/test logins for now—real auth can come later if needed.

---

## Recently Completed

- (To be filled as you finish tasks)