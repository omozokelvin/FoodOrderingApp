# SETTING UP SUPABASE

npx supabase login
npx supabase init
npx supabase link --project-ref mdezlsismtslzdjnfkcj
npx supabase db pull
npx supabase start
npx supabase status

## Migrations

npx supabase db diff -f add_push_token
npx supabase db push

npx supabase secrets set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=secret
npx supabase secrets list
