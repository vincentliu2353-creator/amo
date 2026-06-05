-- AMO example seed data
-- This seed intentionally avoids auth.users, public.users, favorites, and RFQ tables.

begin;

insert into public.categories (
  slug,
  name,
  short_description,
  description,
  status,
  sort_order,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  og_image_url,
  published_at
)
values
  (
    'planar-motors',
    'Planar Motors',
    'Contactless planar motion platforms for high-speed and clean manufacturing.',
    'AMO planar motors provide programmable mover routing, cleanroom-friendly transport, and compact buffering for premium production systems.',
    'published',
    10,
    'AMO Planar Motors',
    'Explore AMO planar motors for semiconductor, optics, and precision automation lines.',
    array['planar motor', 'contactless transport', 'semiconductor automation'],
    'https://amo.example.com/products',
    'https://amo.example.com/og/planar-motors.jpg',
    timezone('utc', now())
  ),
  (
    'levitation-stages',
    'Levitation Stages',
    'Six-DOF and precision positioning stages for optics, metrology, and laser processing.',
    'AMO levitation stages are designed for ultra-smooth positioning, active stabilization, and contamination-sensitive manufacturing steps.',
    'published',
    20,
    'AMO Levitation Stages',
    'Precision levitation stages for photonics, inspection, and micro-manufacturing.',
    array['levitation stage', 'six-dof stage', 'optical alignment'],
    'https://amo.example.com/products',
    'https://amo.example.com/og/levitation-stages.jpg',
    timezone('utc', now())
  ),
  (
    'transfer-modules',
    'Transfer Modules',
    'Levitated carriers and sortation modules for flexible factory routing.',
    'AMO transfer modules replace fixed conveyor assumptions with software-defined carrier motion and route-level flexibility.',
    'published',
    30,
    'AMO Transfer Modules',
    'Levitated transfer modules for flexible factories and buffer-free routing.',
    array['levitation conveyor', 'transfer module', 'flexible factory'],
    'https://amo.example.com/products',
    'https://amo.example.com/og/transfer-modules.jpg',
    timezone('utc', now())
  ),
  (
    'oem-platforms',
    'OEM Platforms',
    'Reference levitation kits and co-development packages for machine builders.',
    'AMO OEM platforms accelerate proof-of-concept work and support white-label or custom manufacturing programs.',
    'published',
    40,
    'AMO OEM Platforms',
    'OEM and ODM magnetic levitation platforms for machine builders and private-label programs.',
    array['oem motion platform', 'odm automation', 'white label levitation'],
    'https://amo.example.com/oem-odm',
    'https://amo.example.com/og/oem-platforms.jpg',
    timezone('utc', now())
  )
on conflict (slug) do update
set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  status = excluded.status,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_keywords = excluded.seo_keywords,
  canonical_url = excluded.canonical_url,
  og_image_url = excluded.og_image_url,
  published_at = excluded.published_at;

insert into public.products (
  category_id,
  slug,
  sku,
  name,
  series,
  status,
  featured,
  summary,
  description,
  highlight,
  lead_time_text,
  min_order_qty,
  min_order_unit,
  hero_metric,
  tags,
  applications,
  features,
  specs,
  filter_attributes,
  faq_items,
  sort_order,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  og_image_url,
  published_at
)
values
  (
    (select id from public.categories where slug = 'planar-motors'),
    'aircore-planar-x1',
    'AMO-X1-2400',
    'AirCore Planar X1',
    'X Series',
    'published',
    true,
    'High-throughput planar transport system for semiconductor, optics, and precision assembly lines.',
    'AirCore Planar X1 combines frictionless transport, sub-micron repeatability, and modular tile expansion for manufacturing cells that need both speed and contamination control.',
    'Up to 6 independent movers on one deck with no mechanical contact.',
    '8-10 weeks',
    1,
    'line',
    '2.4 g dynamic acceleration',
    array['cleanroom', 'high-speed', 'semiconductor'],
    array['wafer handling', 'optical alignment', 'advanced electronics assembly'],
    array[
      'Contactless planar motion with programmable mover paths',
      'Compact tile architecture for scalable OEM layouts',
      'Integrated position feedback for closed-loop precision control'
    ],
    '{
      "payload_per_mover":"2.5 kg",
      "repeatability":"+/- 5 um",
      "deck_size":"Up to 2400 x 1200 mm",
      "cleanroom_class":"ISO Class 5 compatible"
    }'::jsonb,
    '{
      "industry":"semiconductor",
      "cleanroom":true,
      "max_payload_kg":2.5,
      "repeatability_um":5
    }'::jsonb,
    '[
      {
        "question":"Can the deck geometry be customized for existing equipment frames?",
        "answer":"Yes. Tile count, mover size, cable exit, and mechanical interface can be adapted for OEM integration."
      },
      {
        "question":"Does it support synchronized multi-mover workflows?",
        "answer":"Yes. Motion profiles can coordinate multiple movers for handoff, buffering, or parallel work zones."
      }
    ]'::jsonb,
    10,
    'AirCore Planar X1 | AMO',
    'High-throughput planar motor for contactless semiconductor and precision assembly transport.',
    array['aircore planar x1', 'planar motor supplier', 'contactless transport'],
    'https://amo.example.com/products/aircore-planar-x1',
    'https://amo.example.com/og/aircore-planar-x1.jpg',
    timezone('utc', now())
  ),
  (
    (select id from public.categories where slug = 'levitation-stages'),
    'halo-stage-m200',
    'AMO-HALO-M200',
    'Halo Stage M200',
    'Halo',
    'published',
    true,
    'Six-degree-of-freedom magnetic levitation stage for metrology, laser processing, and inspection tools.',
    'Halo Stage M200 is engineered for ultra-smooth motion, zero-wear positioning, and vibration isolation in high-value industrial processes.',
    'Fine stabilization platform for precision optics and metrology payloads.',
    '6-8 weeks',
    2,
    'units',
    '0.2 um settling precision',
    array['metrology', 'laser processing', 'six-dof'],
    array['optical inspection', 'laser cutting', 'precision dispensing'],
    array[
      'Six-degree-of-freedom active stabilization',
      'No particle generation from ball screws or rails',
      'High bandwidth control for dynamic process compensation'
    ],
    '{
      "travel":"200 x 200 x 50 mm",
      "angular_correction":"±3 deg",
      "settling_time":"< 12 ms",
      "max_payload":"8 kg"
    }'::jsonb,
    '{
      "industry":"photonics",
      "six_dof":true,
      "max_payload_kg":8,
      "settling_precision_um":0.2
    }'::jsonb,
    '[
      {
        "question":"Can AMO tune the controller around our process tool dynamics?",
        "answer":"Yes. Controller gains, payload models, and fieldbus mappings are tuned jointly during commissioning."
      },
      {
        "question":"Is cleanroom validation available?",
        "answer":"Validation packages can be supplied for cleanroom-oriented builds and process qualification plans."
      }
    ]'::jsonb,
    20,
    'Halo Stage M200 | AMO',
    'Six-DOF magnetic levitation stage for optical inspection and laser processing lines.',
    array['halo stage m200', 'levitation stage', 'optical alignment stage'],
    'https://amo.example.com/products/halo-stage-m200',
    'https://amo.example.com/og/halo-stage-m200.jpg',
    timezone('utc', now())
  ),
  (
    (select id from public.categories where slug = 'transfer-modules'),
    'vector-loop-lt',
    'AMO-VECTOR-LT',
    'Vector Loop LT',
    'Vector',
    'published',
    true,
    'Closed-loop levitation conveyor for buffer-free transfer between process stations and test cells.',
    'Vector Loop LT replaces belts, pallets, and stop stations with independent magnetic carriers that route parts with deterministic timing and zero contact wear.',
    'Continuous routing for flexible factories and short-cycle production.',
    '10-12 weeks',
    1,
    'line',
    '120 ppm carrier throughput',
    array['flexible factory', 'carrier routing', 'high uptime'],
    array['battery module transfer', 'e-motor assembly', 'inline testing'],
    array[
      'Independent carrier routing without mechanical switching',
      'Low maintenance transfer path for 24/7 production',
      'Fast format changes through software recipes'
    ],
    '{
      "carrier_count":"Up to 48 per loop",
      "top_speed":"4.2 m/s",
      "positioning_accuracy":"+/- 20 um",
      "ingress_protection":"Up to IP54 enclosure"
    }'::jsonb,
    '{
      "industry":"new energy",
      "loop_architecture":true,
      "carrier_count":48,
      "top_speed_mps":4.2
    }'::jsonb,
    '[
      {
        "question":"Can the loop be built in straight and curved sections?",
        "answer":"Yes. Standard loop modules support mixed geometry for compact and high-throughput layouts."
      },
      {
        "question":"How is carrier identification handled?",
        "answer":"Each carrier can be mapped to a digital identity for traceability, routing logic, and recipe assignment."
      }
    ]'::jsonb,
    30,
    'Vector Loop LT | AMO',
    'Levitated transfer loop for flexible factory routing and high-uptime production lines.',
    array['vector loop lt', 'levitation transfer module', 'carrier routing system'],
    'https://amo.example.com/products/vector-loop-lt',
    'https://amo.example.com/og/vector-loop-lt.jpg',
    timezone('utc', now())
  ),
  (
    (select id from public.categories where slug = 'oem-platforms'),
    'flux-drive-oem-kit',
    'AMO-FLUX-OEM',
    'Flux Drive OEM Kit',
    'Flux',
    'published',
    true,
    'Developer kit for machine builders that need AMO levitation motion embedded inside their own equipment.',
    'Flux Drive OEM Kit packages coils, movers, controller, reference mechanics, and application engineering support for rapid OEM integration.',
    'Fastest path for partners building proprietary levitation equipment around AMO motion cores.',
    '4-6 weeks',
    1,
    'kit',
    '12-week OEM launch path',
    array['oem', 'integration', 'development kit'],
    array['custom tools', 'r-and-d platforms', 'pilot production systems'],
    array[
      'Reference hardware for fast proof-of-concept work',
      'Controller APIs for machine software teams',
      'Joint engineering workshops for OEM deployment'
    ],
    '{
      "kit_contents":"Controller, movers, coils, cable set",
      "software":"SDK + sample recipes",
      "support_window":"90-day engineering package",
      "mounting":"Reference frame included"
    }'::jsonb,
    '{
      "industry":"oem",
      "private_label_supported":true,
      "sdk_included":true,
      "launch_path_weeks":12
    }'::jsonb,
    '[
      {
        "question":"Can AMO support DFM and field deployment after prototyping?",
        "answer":"Yes. The OEM program extends from concept validation through pilot builds and scaled production handoff."
      },
      {
        "question":"Is white-label manufacturing available?",
        "answer":"Yes. OEM, ODM, and private-label programs are available depending on volume and geography."
      }
    ]'::jsonb,
    40,
    'Flux Drive OEM Kit | AMO',
    'OEM levitation development kit for machine builders and white-label motion platforms.',
    array['flux drive oem kit', 'oem levitation platform', 'white label automation'],
    'https://amo.example.com/products/flux-drive-oem-kit',
    'https://amo.example.com/og/flux-drive-oem-kit.jpg',
    timezone('utc', now())
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  sku = excluded.sku,
  name = excluded.name,
  series = excluded.series,
  status = excluded.status,
  featured = excluded.featured,
  summary = excluded.summary,
  description = excluded.description,
  highlight = excluded.highlight,
  lead_time_text = excluded.lead_time_text,
  min_order_qty = excluded.min_order_qty,
  min_order_unit = excluded.min_order_unit,
  hero_metric = excluded.hero_metric,
  tags = excluded.tags,
  applications = excluded.applications,
  features = excluded.features,
  specs = excluded.specs,
  filter_attributes = excluded.filter_attributes,
  faq_items = excluded.faq_items,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_keywords = excluded.seo_keywords,
  canonical_url = excluded.canonical_url,
  og_image_url = excluded.og_image_url,
  published_at = excluded.published_at;

insert into public.product_variants (
  product_id,
  sku,
  slug,
  name,
  status,
  option_values,
  specs_override,
  lead_time_text,
  min_order_qty,
  min_order_unit,
  is_default,
  sort_order,
  published_at
)
values
  (
    (select id from public.products where slug = 'aircore-planar-x1'),
    'AMO-X1-1200',
    'x1-1200',
    'X1 1200 Deck',
    'published',
    '{"deck_length_mm":1200,"mover_count":4}'::jsonb,
    '{"deck_size":"1200 x 1200 mm"}'::jsonb,
    '8 weeks',
    1,
    'line',
    false,
    10,
    timezone('utc', now())
  ),
  (
    (select id from public.products where slug = 'aircore-planar-x1'),
    'AMO-X1-2400-V1',
    'x1-2400',
    'X1 2400 Deck',
    'published',
    '{"deck_length_mm":2400,"mover_count":6}'::jsonb,
    '{"deck_size":"2400 x 1200 mm"}'::jsonb,
    '10 weeks',
    1,
    'line',
    true,
    20,
    timezone('utc', now())
  ),
  (
    (select id from public.products where slug = 'halo-stage-m200'),
    'AMO-HALO-M200-STD',
    'm200-standard',
    'M200 Standard',
    'published',
    '{"travel":"200 x 200 x 50 mm","controller":"standard"}'::jsonb,
    '{"settling_time":"< 12 ms"}'::jsonb,
    '6 weeks',
    2,
    'units',
    true,
    10,
    timezone('utc', now())
  ),
  (
    (select id from public.products where slug = 'vector-loop-lt'),
    'AMO-VECTOR-LT-24',
    'lt-24-carrier',
    'LT 24 Carrier Loop',
    'published',
    '{"carrier_count":24,"geometry":"compact"}'::jsonb,
    '{"carrier_count":"Up to 24 per loop"}'::jsonb,
    '10 weeks',
    1,
    'line',
    true,
    10,
    timezone('utc', now())
  ),
  (
    (select id from public.products where slug = 'flux-drive-oem-kit'),
    'AMO-FLUX-OEM-DEV',
    'developer-kit',
    'Developer Kit',
    'published',
    '{"sdk":true,"private_label":true}'::jsonb,
    '{"support_window":"90-day engineering package"}'::jsonb,
    '4 weeks',
    1,
    'kit',
    true,
    10,
    timezone('utc', now())
  )
on conflict (sku) do update
set
  product_id = excluded.product_id,
  slug = excluded.slug,
  name = excluded.name,
  status = excluded.status,
  option_values = excluded.option_values,
  specs_override = excluded.specs_override,
  lead_time_text = excluded.lead_time_text,
  min_order_qty = excluded.min_order_qty,
  min_order_unit = excluded.min_order_unit,
  is_default = excluded.is_default,
  sort_order = excluded.sort_order,
  published_at = excluded.published_at;

insert into public.product_images (
  product_id,
  image_url,
  storage_path,
  alt_text,
  sort_order,
  is_primary
)
values
  (
    (select id from public.products where slug = 'aircore-planar-x1'),
    'https://amo.example.com/media/products/aircore-planar-x1/hero.jpg',
    'products/aircore-planar-x1/hero.jpg',
    'AirCore Planar X1 hero product render',
    10,
    true
  ),
  (
    (select id from public.products where slug = 'aircore-planar-x1'),
    'https://amo.example.com/media/products/aircore-planar-x1/detail.jpg',
    'products/aircore-planar-x1/detail.jpg',
    'AirCore Planar X1 deck detail view',
    20,
    false
  ),
  (
    (select id from public.products where slug = 'halo-stage-m200'),
    'https://amo.example.com/media/products/halo-stage-m200/hero.jpg',
    'products/halo-stage-m200/hero.jpg',
    'Halo Stage M200 product render',
    10,
    true
  ),
  (
    (select id from public.products where slug = 'vector-loop-lt'),
    'https://amo.example.com/media/products/vector-loop-lt/hero.jpg',
    'products/vector-loop-lt/hero.jpg',
    'Vector Loop LT line layout',
    10,
    true
  ),
  (
    (select id from public.products where slug = 'flux-drive-oem-kit'),
    'https://amo.example.com/media/products/flux-drive-oem-kit/hero.jpg',
    'products/flux-drive-oem-kit/hero.jpg',
    'Flux Drive OEM Kit product overview',
    10,
    true
  )
on conflict (product_id, sort_order) do update
set
  image_url = excluded.image_url,
  storage_path = excluded.storage_path,
  alt_text = excluded.alt_text,
  is_primary = excluded.is_primary;

insert into public.cases (
  slug,
  title,
  industry,
  client_name,
  summary,
  challenge,
  solution,
  results,
  status,
  featured,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  og_image_url,
  published_at
)
values
  (
    'wafer-inspection-cell',
    'Wafer Inspection Cell with Contactless Part Routing',
    'Semiconductor',
    'Confidential Semiconductor OEM',
    'AMO replaced belt and shuttle transport with a planar levitation deck to reduce particles and improve takt-time stability.',
    'The customer needed cleaner transport, more compact buffering, and faster handoff between inspection stations without adding manual maintenance.',
    'AirCore Planar X1 was integrated as a programmable routing layer with independent movers and software-defined queues for each inspection path.',
    '["Particle-related rejects reduced by 31 percent","Buffer footprint reduced by 42 percent","Recipe changeovers moved from hardware change to software selection"]'::jsonb,
    'published',
    true,
    'Wafer Inspection Case Study | AMO',
    'See how AMO improved wafer inspection transport with contactless planar motion.',
    array['wafer inspection case study', 'semiconductor transport', 'planar motor'],
    'https://amo.example.com/cases/wafer-inspection-cell',
    'https://amo.example.com/og/wafer-inspection-cell.jpg',
    timezone('utc', now())
  ),
  (
    'optical-module-assembly',
    'Optical Module Assembly with Active Levitation Alignment',
    'Photonics',
    'Global Photonics Equipment Builder',
    'A photonics OEM used AMO levitation stages to stabilize high-value alignment during bonding and inspection.',
    'The assembly process suffered from vibration and wear-related drift that reduced alignment consistency during continuous production runs.',
    'Halo Stage M200 and Flux Drive OEM Kit were tuned around the bonding head dynamics, providing fine positioning and active disturbance rejection.',
    '["Alignment yield improved across three optical alignment steps","Maintenance intervals extended after eliminating rail wear","The machine builder launched a differentiated premium tool"]'::jsonb,
    'published',
    true,
    'Optical Module Assembly Case Study | AMO',
    'Learn how AMO levitation stages improved optical module assembly stability and yield.',
    array['optical alignment case study', 'levitation stage', 'photonics manufacturing'],
    'https://amo.example.com/cases/optical-module-assembly',
    'https://amo.example.com/og/optical-module-assembly.jpg',
    timezone('utc', now())
  )
on conflict (slug) do update
set
  title = excluded.title,
  industry = excluded.industry,
  client_name = excluded.client_name,
  summary = excluded.summary,
  challenge = excluded.challenge,
  solution = excluded.solution,
  results = excluded.results,
  status = excluded.status,
  featured = excluded.featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_keywords = excluded.seo_keywords,
  canonical_url = excluded.canonical_url,
  og_image_url = excluded.og_image_url,
  published_at = excluded.published_at;

insert into public.case_products (case_id, product_id)
values
  (
    (select id from public.cases where slug = 'wafer-inspection-cell'),
    (select id from public.products where slug = 'aircore-planar-x1')
  ),
  (
    (select id from public.cases where slug = 'wafer-inspection-cell'),
    (select id from public.products where slug = 'flux-drive-oem-kit')
  ),
  (
    (select id from public.cases where slug = 'optical-module-assembly'),
    (select id from public.products where slug = 'halo-stage-m200')
  ),
  (
    (select id from public.cases where slug = 'optical-module-assembly'),
    (select id from public.products where slug = 'flux-drive-oem-kit')
  )
on conflict do nothing;

insert into public.blogs (
  author_user_id,
  slug,
  title,
  excerpt,
  body,
  category_label,
  tags,
  status,
  featured,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  og_image_url,
  published_at
)
values
  (
    null,
    'why-contactless-motion-matters-in-clean-manufacturing',
    'Why Contactless Motion Matters in Clean Manufacturing',
    'Contactless motion changes more than maintenance schedules. It reshapes contamination control, line flexibility, and process repeatability.',
    '[
      {"type":"paragraph","heading":"Mechanical friction is a process variable","content":"In contamination-sensitive industries, rails, belts, and screws create wear, debris, and variability that become hidden process costs over time."},
      {"type":"paragraph","heading":"Software-defined routing improves flexibility","content":"Independent levitated carriers allow machine builders to re-route products, rebalance buffers, and add new workflows without replacing transport hardware."},
      {"type":"paragraph","heading":"OEM value comes from system architecture","content":"The strongest ROI appears when levitation is integrated early in the machine architecture rather than treated as a last-minute subsystem swap."}
    ]'::jsonb,
    'Manufacturing',
    array['clean manufacturing', 'contactless motion', 'magnetic levitation'],
    'published',
    true,
    'Why Contactless Motion Matters | AMO',
    'AMO explains the manufacturing advantages of contactless levitation motion.',
    array['contactless motion', 'clean manufacturing', 'magnetic levitation'],
    'https://amo.example.com/blog/why-contactless-motion-matters-in-clean-manufacturing',
    'https://amo.example.com/og/blog-contactless-motion.jpg',
    timezone('utc', now())
  ),
  (
    null,
    'how-to-spec-a-levitation-platform-for-oem-equipment',
    'How to Spec a Levitation Platform for OEM Equipment',
    'A practical checklist for motion envelope, payload, fieldbus, environmental constraints, and commissioning scope.',
    '[
      {"type":"paragraph","heading":"Start from the process, not the axis count","content":"Payload behavior, settling requirements, contamination limits, and handoff logic should define the levitation architecture before hardware selection begins."},
      {"type":"paragraph","heading":"Specify integration boundaries clearly","content":"Mechanical interfaces, software ownership, safety boundaries, and acceptance criteria need to be documented early for OEM projects to scale cleanly."},
      {"type":"paragraph","heading":"Account for validation work","content":"The production launch plan should include motion tuning, sample part verification, cleanroom checks, and spare strategy planning."}
    ]'::jsonb,
    'OEM Guide',
    array['oem guide', 'levitation platform', 'machine builder'],
    'published',
    false,
    'How to Spec a Levitation Platform | AMO',
    'Checklist for specifying an OEM magnetic levitation platform for industrial equipment.',
    array['levitation platform specification', 'oem automation', 'machine builder checklist'],
    'https://amo.example.com/blog/how-to-spec-a-levitation-platform-for-oem-equipment',
    'https://amo.example.com/og/blog-levitation-platform.jpg',
    timezone('utc', now())
  )
on conflict (slug) do update
set
  author_user_id = excluded.author_user_id,
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  category_label = excluded.category_label,
  tags = excluded.tags,
  status = excluded.status,
  featured = excluded.featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_keywords = excluded.seo_keywords,
  canonical_url = excluded.canonical_url,
  og_image_url = excluded.og_image_url,
  published_at = excluded.published_at;

commit;
