const postgres = require('postgres');

async function runMigrations() {
  try {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!url) {
      throw new Error('POSTGRES_URL not found in environment');
    }

    const sql = postgres(url);

    console.log('Creating tables...');
    
    // Players table
    await sql`
      CREATE TABLE IF NOT EXISTS public.players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        player_id TEXT UNIQUE,
        application_status TEXT NOT NULL DEFAULT 'UNDER REVIEW',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;
    console.log('✓ Players table created');

    // Contact submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS public.contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;
    console.log('✓ Contact submissions table created');

    // Announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS public.announcements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;
    console.log('✓ Announcements table created');

    // Admins table
    await sql`
      CREATE TABLE IF NOT EXISTS public.admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;
    console.log('✓ Admins table created');

    // Admin audit log table
    await sql`
      CREATE TABLE IF NOT EXISTS public.admin_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_email TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;
    console.log('✓ Admin audit log table created');

    // Create indices
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_players_player_id_unique ON public.players(player_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_players_application_status ON public.players(application_status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_players_created_at ON public.players(created_at DESC)`;
    console.log('✓ Player indices created');

    console.log('\n✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

runMigrations();
