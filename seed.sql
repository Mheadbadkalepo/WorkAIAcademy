-- Seed data for WorkAI Academy

-- 1. Insert AI Jobs
INSERT INTO public.ai_jobs (company, title, type, pay, location, requirements, description) VALUES
('Outlier AI', 'AI Training Specialist', 'Remote', '$15-$20/hour', 'Worldwide', 'Bachelor''s degree, English proficiency', 'Train AI models through data annotation and evaluation tasks.'),
('Scale AI', 'Data Annotation Expert', 'Remote', '$18-$25/hour', 'Global', 'Detail-oriented, computer literacy', 'Annotate images, text, and videos for AI model training.'),
('Telus AI', 'AI Evaluator', 'Remote', '$12-$18/hour', 'Multiple regions', 'Attention to detail, reliable internet', 'Evaluate and rate AI-generated content for quality.'),
('Appen', 'AI Trainer', 'Remote', '$10-$15/hour', 'Worldwide', 'Native language skills, basic tech knowledge', 'Complete various AI training tasks and micro-tasks.');

-- 2. Insert Remote Jobs
INSERT INTO public.remote_jobs (company, title, type, pay, location, category) VALUES
('Clickworker', 'Micro Task Worker', 'Remote', '$8-$12/hour', 'Worldwide', 'Micro Tasks'),
('Remotasks', 'Task Specialist', 'Remote', '$10-$15/hour', 'Global', 'Data Entry'),
('Various Platforms', 'Virtual Assistant', 'Remote', '$12-$20/hour', 'Multiple regions', 'Administrative'),
('Freelance Platforms', 'Content Writer', 'Remote', '$15-$30/hour', 'Worldwide', 'Writing');

-- 3. Insert Guides
INSERT INTO public.guides (title, description, price, lessons, path, tier) VALUES
('Appen Complete Guide', 'Step-by-step guide to getting hired and succeeding at Appen', 2, 12, 'appen', 'low'),
('Remotasks Walkthrough', 'Master Remotasks with our comprehensive training guide', 2, 10, 'remotasks', 'low'),
('Clickworker Success Guide', 'Learn how to maximize earnings on Clickworker', 2, 8, 'clickworker', 'low'),
('Outlier AI Complete Guide', 'Everything you need to get hired and excel at Outlier AI', 5, 15, 'outlier', 'high'),
('Telus AI Walkthrough', 'Comprehensive guide to Telus AI application and success', 5, 14, 'telus', 'high'),
('Scale AI Application Guide', 'Insider tips for Scale AI applications and tasks', 5, 16, 'scale', 'high');
