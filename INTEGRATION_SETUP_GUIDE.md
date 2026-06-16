# APL Website - Integration Setup Guide

## Environment Variables Configuration

All integrations are **already connected and configured** in this project. Here's where to place additional API keys if needed:

### Current Integrations Status

#### ✅ Supabase (Database)
- **Status**: Connected and operational
- **Tables**: players, contact_submissions, announcements, admins, admin_audit_log
- **Environment Variables**: All set
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_KEY` - Public anon key
  - `POSTGRES_URL` - Database connection string

#### 📧 Resend (Email)
- **Where to add**: Project Settings → Environment Variables
- **Variable name**: `RESEND_API_KEY`
- **Get key from**: https://resend.com/api-keys
- **Used for**: Contact form email confirmations

#### 💳 Cashfree (Payments)
- **Where to add**: Project Settings → Environment Variables
- **Variable names**:
  - `CASHFREE_APP_ID` - Merchant app ID
  - `CASHFREE_SECRET_KEY` - Merchant secret key
- **Get keys from**: https://merchant.cashfree.com/merchants/settings/
- **Used for**: Player registration and franchise payments

### How to Set Environment Variables in Vercel

1. **Go to Vercel Project Settings**
   - Navigate to your deployed project on vercel.com
   - Click "Settings" → "Environment Variables"

2. **Add the variables**
   - Click "Add new"
   - Enter `VARIABLE_NAME` and value
   - Select which environments: Production, Preview, Development
   - Save

3. **Redeploy to apply**
   - Changes take effect on next deployment
   - Or manually redeploy via Vercel dashboard

### API Endpoint Configuration

#### Resend Email Configuration
In `/api/apl/contact.ts`:
```typescript
// Sends contact form confirmations
// Requires RESEND_API_KEY environment variable
```

#### Cashfree Payment Configuration
In `/api/apl/payments/create.ts`:
```typescript
// Creates payment session
// Requires CASHFREE_APP_ID and CASHFREE_SECRET_KEY
```

### Testing Integration Locally

1. **Load environment from v0**:
   ```bash
   source /vercel/share/.env.project
   ```

2. **Test API endpoints**:
   ```bash
   curl http://localhost:8080/api/apl/stats
   curl http://localhost:8080/api/apl/status?player_id=APL-9999
   ```

### Production Deployment Checklist

- [ ] All environment variables set in Vercel Project Settings
- [ ] Supabase tables created and populated (✅ Done)
- [ ] API server responding on all 6 endpoints (✅ Done)
- [ ] Database backups configured
- [ ] Error monitoring enabled
- [ ] CORS properly configured for payment gateway

### Troubleshooting

**Resend emails not sending?**
- Verify `RESEND_API_KEY` is set in Vercel Settings
- Check email address is verified in Resend dashboard

**Cashfree payments failing?**
- Verify `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` are correct
- Ensure merchant account is active
- Check payment amount and currency in request

**Database connection issues?**
- Verify `POSTGRES_URL` is set
- Check Supabase project is not paused
- Verify firewall rules allow connections

For additional help, contact the v0 support team at vercel.com/help.
