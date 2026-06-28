-- Store the signed file URLs alongside each submission. Keeps all existing columns.
alter table public.mission_submissions
  add column if not exists mission_report_url      text,
  add column if not exists research_notes_url      text,
  add column if not exists ai_prompt_log_url       text,
  add column if not exists reflection_document_url text;
