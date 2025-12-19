-- Sample data migration for development/testing
-- Version: 20231219_002
-- Description: Insert sample users, worksites, and data for testing

-- Note: This is for development only. Don't run in production!

-- Sample admin user (password will be set via auth)
-- You need to create this user via Supabase Auth UI or signup

-- Sample worksites (will be created after users are registered)
-- Example SQL for reference:

-- INSERT INTO public.worksites (name, description, location, status, start_date, end_date, budget, created_by)
-- VALUES 
--   ('İstanbul Konut Projesi', 'İstanbul Kadıköy''de 20 daireli konut projesi', 'İstanbul, Kadıköy', 'active', '2024-01-01', '2024-12-31', 5000000.00, 'user-uuid-here'),
--   ('Ankara Ticari Bina', 'Ankara Çankaya''da 5 katlı ticari bina', 'Ankara, Çankaya', 'planning', '2024-03-01', '2024-10-31', 3000000.00, 'user-uuid-here'),
--   ('İzmir Villa', 'İzmir Çeşme''de lüks villa', 'İzmir, Çeşme', 'active', '2024-02-01', '2024-08-31', 2000000.00, 'user-uuid-here');

-- Sample schedules
-- INSERT INTO public.schedules (worksite_id, title, description, start_date, end_date, status, created_by)
-- VALUES
--   ('worksite-uuid', 'Temel İşleri', 'Temel kazısı ve betonu', '2024-01-15', '2024-02-15', 'completed', 'user-uuid'),
--   ('worksite-uuid', 'Karkass İşleri', 'Betonarme karkas', '2024-02-16', '2024-05-31', 'in_progress', 'user-uuid'),
--   ('worksite-uuid', 'İç Mekan İşleri', 'Sıva, boya, döşeme', '2024-06-01', '2024-09-30', 'not_started', 'user-uuid');

-- Sample costs
-- INSERT INTO public.costs (worksite_id, category, description, amount, date, created_by)
-- VALUES
--   ('worksite-uuid', 'Malzeme', 'Çimento ve demir', 150000.00, '2024-01-10', 'user-uuid'),
--   ('worksite-uuid', 'İşçilik', 'Ocak ayı işçilik', 100000.00, '2024-01-31', 'user-uuid'),
--   ('worksite-uuid', 'Ekipman', 'Vinç kiralama', 50000.00, '2024-02-01', 'user-uuid');

-- Sample progress records
-- INSERT INTO public.progress_records (worksite_id, schedule_id, title, description, percentage, status, recorded_date, created_by)
-- VALUES
--   ('worksite-uuid', 'schedule-uuid', 'Temel Kazısı Tamamlandı', 'Tüm temel kazı işleri bitti', 100.00, 'completed', '2024-01-20', 'user-uuid'),
--   ('worksite-uuid', 'schedule-uuid', 'Temel Betonu Döküldü', 'Betonlama işlemi tamamlandı', 100.00, 'completed', '2024-02-10', 'user-uuid'),
--   ('worksite-uuid', 'schedule-uuid', 'Zemin Kat Kolonları', 'Kolon kalıpları hazır', 75.00, 'in_progress', '2024-03-01', 'user-uuid');

-- Create indexes for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_costs_date ON public.costs(date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_records_date ON public.progress_records(recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON public.schedules(status);
