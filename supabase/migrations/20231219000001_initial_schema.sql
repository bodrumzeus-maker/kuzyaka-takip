-- Initial schema for kuzyaka-takip (Construction Worksite Tracking)
-- Version: 20231219_001
-- Description: Create base tables, enums, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'employer');
CREATE TYPE worksite_status AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'employer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Worksites/Jobs table
CREATE TABLE public.worksites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    status worksite_status NOT NULL DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    budget NUMERIC(12, 2),
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Worksite assignments (who can access which worksite)
CREATE TABLE public.worksite_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worksite_id UUID NOT NULL REFERENCES public.worksites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(worksite_id, user_id)
);

-- Schedules/Programs table
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worksite_id UUID NOT NULL REFERENCES public.worksites(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assigned_to UUID REFERENCES public.users(id),
    status progress_status NOT NULL DEFAULT 'not_started',
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Costs table
CREATE TABLE public.costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worksite_id UUID NOT NULL REFERENCES public.worksites(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Progress records table
CREATE TABLE public.progress_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worksite_id UUID NOT NULL REFERENCES public.worksites(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.schedules(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    percentage NUMERIC(5, 2) CHECK (percentage >= 0 AND percentage <= 100),
    status progress_status NOT NULL DEFAULT 'in_progress',
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX idx_worksites_created_by ON public.worksites(created_by);
CREATE INDEX idx_worksites_status ON public.worksites(status);
CREATE INDEX idx_worksite_assignments_user_id ON public.worksite_assignments(user_id);
CREATE INDEX idx_worksite_assignments_worksite_id ON public.worksite_assignments(worksite_id);
CREATE INDEX idx_schedules_worksite_id ON public.schedules(worksite_id);
CREATE INDEX idx_schedules_assigned_to ON public.schedules(assigned_to);
CREATE INDEX idx_costs_worksite_id ON public.costs(worksite_id);
CREATE INDEX idx_progress_records_worksite_id ON public.progress_records(worksite_id);
CREATE INDEX idx_progress_records_schedule_id ON public.progress_records(schedule_id);

-- Function to get user role from JWT
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to worksite
CREATE OR REPLACE FUNCTION public.has_worksite_access(worksite_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val user_role;
BEGIN
    user_role_val := public.get_user_role();
    
    -- Admins have access to all worksites
    IF user_role_val = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Moderators have access to all worksites
    IF user_role_val = 'moderator' THEN
        RETURN TRUE;
    END IF;
    
    -- Employers can access worksites they created or are assigned to
    RETURN EXISTS (
        SELECT 1 FROM public.worksites 
        WHERE id = worksite_uuid AND created_by = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.worksite_assignments 
        WHERE worksite_id = worksite_uuid AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksite_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
    ON public.users FOR SELECT
    USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can update any user"
    ON public.users FOR UPDATE
    USING (public.get_user_role() = 'admin');

-- RLS Policies for worksites table
CREATE POLICY "Users can view worksites they have access to"
    ON public.worksites FOR SELECT
    USING (public.has_worksite_access(id));

CREATE POLICY "Admins and moderators can create worksites"
    ON public.worksites FOR INSERT
    WITH CHECK (public.get_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Employers can create worksites"
    ON public.worksites FOR INSERT
    WITH CHECK (public.get_user_role() = 'employer');

CREATE POLICY "Admins can update any worksite"
    ON public.worksites FOR UPDATE
    USING (public.get_user_role() = 'admin');

CREATE POLICY "Moderators can update any worksite"
    ON public.worksites FOR UPDATE
    USING (public.get_user_role() = 'moderator');

CREATE POLICY "Employers can update their own worksites"
    ON public.worksites FOR UPDATE
    USING (created_by = auth.uid() AND public.get_user_role() = 'employer');

CREATE POLICY "Admins can delete any worksite"
    ON public.worksites FOR DELETE
    USING (public.get_user_role() = 'admin');

-- RLS Policies for worksite_assignments table
CREATE POLICY "Users can view their assignments"
    ON public.worksite_assignments FOR SELECT
    USING (user_id = auth.uid() OR public.has_worksite_access(worksite_id));

CREATE POLICY "Admins and moderators can manage assignments"
    ON public.worksite_assignments FOR ALL
    USING (public.get_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Worksite creators can manage assignments"
    ON public.worksite_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.worksites 
            WHERE id = worksite_id AND created_by = auth.uid()
        )
    );

-- RLS Policies for schedules table
CREATE POLICY "Users can view schedules for accessible worksites"
    ON public.schedules FOR SELECT
    USING (public.has_worksite_access(worksite_id));

CREATE POLICY "Admins and moderators can manage all schedules"
    ON public.schedules FOR ALL
    USING (public.get_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Worksite creators can manage schedules"
    ON public.schedules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.worksites 
            WHERE id = worksite_id AND created_by = auth.uid()
        )
    );

-- RLS Policies for costs table
CREATE POLICY "Users can view costs for accessible worksites"
    ON public.costs FOR SELECT
    USING (public.has_worksite_access(worksite_id));

CREATE POLICY "Admins and moderators can manage all costs"
    ON public.costs FOR ALL
    USING (public.get_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Worksite creators can manage costs"
    ON public.costs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.worksites 
            WHERE id = worksite_id AND created_by = auth.uid()
        )
    );

-- RLS Policies for progress_records table
CREATE POLICY "Users can view progress for accessible worksites"
    ON public.progress_records FOR SELECT
    USING (public.has_worksite_access(worksite_id));

CREATE POLICY "Admins and moderators can manage all progress records"
    ON public.progress_records FOR ALL
    USING (public.get_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Worksite creators can manage progress records"
    ON public.progress_records FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.worksites 
            WHERE id = worksite_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Assigned users can create progress records"
    ON public.progress_records FOR INSERT
    WITH CHECK (public.has_worksite_access(worksite_id));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_worksites_updated_at BEFORE UPDATE ON public.worksites
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_costs_updated_at BEFORE UPDATE ON public.costs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_records_updated_at BEFORE UPDATE ON public.progress_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
