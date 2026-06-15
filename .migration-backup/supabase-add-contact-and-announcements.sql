-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so users can submit the contact form)
CREATE POLICY "Allow public insert into contact_submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users (admins) to select/delete/update contact_submissions
CREATE POLICY "Allow admin operations on contact_submissions"
ON public.contact_submissions
FOR ALL
USING (auth.role() = 'authenticated');

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public reads on announcements (so everyone can see active announcements)
CREATE POLICY "Allow public read on announcements"
ON public.announcements
FOR SELECT
USING (true);

-- Allow authenticated users (admins) to perform all operations on announcements
CREATE POLICY "Allow admin operations on announcements"
ON public.announcements
FOR ALL
USING (auth.role() = 'authenticated');

-- Insert initial announcement if not exists
INSERT INTO public.announcements (text, is_active)
VALUES ('Season One registrations are now open.', true)
ON CONFLICT DO NOTHING;
