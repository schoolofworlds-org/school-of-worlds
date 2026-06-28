-- RLS policies for the private "submissions" storage bucket.
-- The bucket itself was created manually in the dashboard — not here.
-- Object paths are: {user_id}/{mission_id}/{field_name}/{filename}
-- so the FIRST path segment is the owner's user id.

drop policy if exists "Users can upload to own submission folder" on storage.objects;
create policy "Users can upload to own submission folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read own submission files" on storage.objects;
create policy "Users can read own submission files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own submission files" on storage.objects;
create policy "Users can delete own submission files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
