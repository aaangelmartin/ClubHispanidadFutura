-- Esquema de la app. ES EL CONTRATO entre módulos: no se cambia sin avisar al equipo.
-- Ejecutar una vez en Supabase → SQL Editor.
-- Todo el acceso pasa por el servidor (service role). RLS activado y sin políticas:
-- el navegador no puede leer ni escribir directamente.

create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  country text not null,
  university text not null,
  skills text[] not null default '{}',
  github text,
  portfolio text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text not null,
  email text not null unique,
  country text not null,
  created_at timestamptz not null default now()
);

create type challenge_status as enum ('borrador', 'abierto', 'en_valoracion', 'cerrado');

create table challenges (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  description text not null,              -- lo que escribió la empresa
  title text not null,
  summary text not null,
  context text not null,
  task text not null,
  profile text not null,
  deliverable text not null,
  duration_days int not null check (duration_days between 1 and 14),
  rubric jsonb not null,                  -- [{criterion, weight, description}]
  suggested_prize text,
  warnings text[] not null default '{}',
  is_example boolean not null default false,
  status challenge_status not null default 'borrador',
  deadline timestamptz,
  created_at timestamptz not null default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  link text,
  notes text,
  ai_summary jsonb,                       -- salida del prompt 10.2
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (challenge_id, student_id)
);

create table evaluations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references submissions(id) on delete cascade,
  scores jsonb not null,                  -- [{criterion, score}] score 0-10
  feedback text not null,
  contact_requested boolean not null default false,
  created_at timestamptz not null default now()
);

alter table students enable row level security;
alter table companies enable row level security;
alter table challenges enable row level security;
alter table submissions enable row level security;
alter table evaluations enable row level security;
