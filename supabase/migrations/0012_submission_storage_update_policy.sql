-- Allow upsert re-uploads to existing objects in the private "submissions" bucket.
-- Without an UPDATE policy, overwriting an already-uploaded file (upsert: true)
-- is denied by RLS even though the first upload (INSERT) succeeds.
drop policy if exists "Users can update own submission files" on storage.objects;
create policy "Users can update own submission files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
