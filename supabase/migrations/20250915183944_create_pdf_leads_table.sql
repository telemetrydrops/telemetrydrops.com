-- Create pdf_leads table for storing PDF download lead capture submissions
CREATE TABLE IF NOT EXISTS public.pdf_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    resource_name TEXT NOT NULL,
    resource_type TEXT NOT NULL DEFAULT 'cheatsheet',
    source TEXT DEFAULT 'website',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.pdf_leads ENABLE ROW LEVEL SECURITY;

-- Allow INSERT for authenticated users (service role)
CREATE POLICY "Allow insert for service role" ON public.pdf_leads
    FOR INSERT
    WITH CHECK (true);

-- Allow SELECT for authenticated users (service role)
CREATE POLICY "Allow select for service role" ON public.pdf_leads
    FOR SELECT
    USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pdf_leads_email ON public.pdf_leads(email);
CREATE INDEX IF NOT EXISTS idx_pdf_leads_resource_name ON public.pdf_leads(resource_name);
CREATE INDEX IF NOT EXISTS idx_pdf_leads_resource_type ON public.pdf_leads(resource_type);
CREATE INDEX IF NOT EXISTS idx_pdf_leads_created_at ON public.pdf_leads(created_at);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_pdf_leads_updated_at
    BEFORE UPDATE ON public.pdf_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some constraints
ALTER TABLE public.pdf_leads
ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.pdf_leads
ADD CONSTRAINT check_resource_type CHECK (resource_type IN ('cheatsheet', 'guide', 'ebook', 'whitepaper', 'template'));