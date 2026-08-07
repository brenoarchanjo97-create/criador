-- Dados iniciais. Rode depois de 0001_init.sql, também no SQL Editor do Supabase.

insert into public.site_settings (id, site_name, hero_fallback_image_url, hero_video_url)
values (1, 'Imóveis Archanjo', null, null)
on conflict (id) do nothing;

insert into public.testimonials (name, quote, approved)
values
  ('Daniel Silva', 'O Breno transformou completamente a forma como eu apresento meus imóveis. Resultado rápido e profissional.', true),
  ('Fernando Cardoso', 'Trabalho sério, atencioso e com uma visão incrível de tecnologia aplicada ao mercado imobiliário.', true)
on conflict do nothing;
