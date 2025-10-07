-- Create event_leads table for storing workshop landing page submissions
CREATE TABLE IF NOT EXISTS public.event_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    role TEXT,
    message TEXT,
    event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_city TEXT NOT NULL,
    event_start_date DATE NOT NULL,
    event_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.event_leads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from service role
CREATE POLICY "Allow insert for service role" ON public.event_leads
    FOR INSERT
    WITH CHECK (true);

-- Allow selects from service role
CREATE POLICY "Allow select for service role" ON public.event_leads
    FOR SELECT
    USING (true);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_event_leads_email ON public.event_leads(email);
CREATE INDEX IF NOT EXISTS idx_event_leads_event_id ON public.event_leads(event_id);
CREATE INDEX IF NOT EXISTS idx_event_leads_created_at ON public.event_leads(created_at);

-- Ensure updated_at stays current
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_leads_updated_at
    BEFORE UPDATE ON public.event_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
