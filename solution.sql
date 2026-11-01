
-- Option 2: Custom Profile Table (Traditional DB Approach)

-- If you prefer a classic database design or want users to have multiple/dynamic roles, you can create a custom profiles or user_roles table in your public schema.


create table public.user_roles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'customer'
);



-- 2. Read the Role After Signing In

-- Sign the user in normally, then immediately fetch their role to determine where to redirect them or what UI elements to display in your application framework:

-- // 1. Sign in normally

const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (authError) throw authError;

-- // 2. Fetch the user's role from your public table
const { data: roleData } = await supabase.supabase
  .from('user_roles')
  .select('role')
  .eq('id', authData.user.id)
  .single();

-- // 3. Handle application routing based on role
if (roleData?.role === 'admin') {
  router.push('/admin/dashboard');
} else {
  router.push('/dashboard');
}



-- 3. Use a Security Definer Function for RLS

-- If using this database approach, you will need a helper function to check roles inside your RLS policies without creating circular dependencies:

create or replace function public.has_role(required_role text)
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.user_roles
    where id = auth.uid() and role = required_role
  );
end;
$$ language plpgsql;

-- Apply to a table
create policy "Moderator access"
on public.comments
for delete
using ( public.has_role('moderator') );

