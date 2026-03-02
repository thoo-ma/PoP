-- Enable Supabase Realtime for the mystery_boxes table so that clients
-- subscribed via postgres_changes receive INSERT/UPDATE/DELETE events.
ALTER PUBLICATION supabase_realtime ADD TABLE public.mystery_boxes;
