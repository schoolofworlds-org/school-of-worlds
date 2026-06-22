-- Seed the Entrepreneurship World (Level 1) curriculum: 24 missions, 7 weekly
-- quests, 1 Founder Summit. Source: "Entrepreneurship World Level 1 — Full
-- Curriculum (v2)". Reseeds cleanly (deletes existing missions for this world).

delete from public.missions
where world_id = '30eafd3a-2cc4-4c7f-a631-b41e517de1ab';

insert into public.missions
  (world_id, week_number, title, description, vocabulary, requirements, xp_value, mission_type, unlock_order)
values
-- ===== WEEK 1: Understanding Business =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 1, $t$Mission 1: Business Detective$t$, $d$Research 3 businesses — any size, any industry, any country. For each business, explain:
- What problem do they solve?
- Who is their customer?
- How do they make money? (Be specific — subscriptions, ads, product sales, licensing?)
- Why do customers choose them over competitors?
- What is one real weakness they have?

Think like a detective. Don't just find surface-level answers — dig into how the business actually works.$d$, 'Customer, Revenue, Value Proposition', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 1),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 1, $t$Mission 2: Reverse Engineer a Startup$t$, $d$Choose one startup and study its origin story in depth. Create a timeline and written analysis covering:
- How did it start? What was the founding moment?
- What was the founder's background and motivation?
- Who were the first customers, and how did the startup find them?
- What was the biggest challenge they faced in the first year?
- What decisions or circumstances made them succeed?

Do not choose the most famous startups (no Airbnb, Uber, or Apple). Find a startup with a genuinely interesting story that most people do not know.$d$, 'Startup, Market, Growth', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 2),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 1, $t$Mission 3: Competitor Wars$t$, $d$Choose one company in a competitive market and research 5 of its direct competitors. For each competitor, analyze:
- What do they do well?
- What do they do poorly?
- Who is their target customer?

Then write a final analysis:
- Which competitor is winning, and why?
- What would you change about the market leader's strategy?
- Where is the biggest gap in the market?$d$, 'Competitor, Differentiation, Competitive Advantage', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 3),

-- ===== WEEK 2: Markets and Opportunities =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 2, $t$Mission 4: Industry Deep Dive$t$, $d$Choose one industry and become an expert on it — for this week. Create a detailed report covering:
- The 5 largest companies in the industry and what each does
- The 3 biggest trends currently changing the industry
- The most common problems customers face
- The most interesting opportunities no one is fully addressing yet

Use AI to help you research faster, but verify every claim with a real source.$d$, 'Industry, Trend, Opportunity', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 4),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 2, $t$Mission 5: Opportunity Mapping$t$, $d$Working within the industry you studied in Mission 4, identify 20 specific opportunities. An opportunity is not just a problem — it is a problem that enough people have, that they are willing to pay to solve, and that no one is solving well yet.

For each of your 20 opportunities, explain:
- What is the problem?
- Who has the problem?
- Why is no one solving it well?
- What would a good solution look like?

Then rank your top 5 opportunities and explain your ranking criteria.$d$, 'Opportunity, Demand, Innovation', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 5),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 2, $t$Mission 6: Startup Idea Graveyard$t$, $d$Research 10 real startups that failed. For each one, create a case study that covers:
- What did they build?
- Who were they building it for?
- What was their business model?
- What warning signs existed before they failed?
- Why did they ultimately fail? (Be specific — not just "bad timing")
- What would you have done differently?

This Mission is about learning more from failure than from success. The best entrepreneurs study failure obsessively.$d$, 'Problem, Demand, Validation', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 6),

-- ===== WEEK 3: Entrepreneurial Thinking =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 3, $t$Mission 7: First Principles Challenge$t$, $d$Choose 5 products or services that exist today. For each one, strip it back to its most basic elements:
- What fundamental problem is it solving?
- What assumptions did the industry make when designing it?
- What constraints — technical, regulatory, financial, social — shaped it?
- If you removed every assumption and constraint, how would you rebuild it from scratch?

This is how the best entrepreneurs find billion-dollar ideas — by rebuilding things everyone else accepts as fixed.$d$, 'First Principles, Assumption, Constraint', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 7),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 3, $t$Mission 8: Business Mythbusters$t$, $d$Find 15 commonly held beliefs about business or startups (e.g. "more features make a better product", "lower prices always win", "funding guarantees success", "the best idea wins", "you need to be an expert to build a business").

For each belief, research evidence for and against it, then determine whether it is:
- True in most cases
- False in most cases
- Situational (true in some contexts, false in others)

Support every conclusion with at least one real-world example.$d$, 'Assumption, Evidence, Validation', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 8),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 3, $t$Mission 9: Founder Decision Simulator$t$, $d$Research 10 real startup decision scenarios where founders faced genuine tradeoffs with no obvious right answer (e.g. grow fast vs grow profitably, bootstrap vs raise funding, ship fast vs build quality, focus vs expand).

For each scenario:
- Describe the real situation
- Explain both sides of the decision
- Choose what you would do and defend your reasoning with evidence$d$, 'Tradeoff, Risk, Decision-Making', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 9),

-- ===== WEEK 4: AI-Powered Entrepreneurship =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 4, $t$Mission 10: AI vs Human$t$, $d$Choose one industry. First, research it yourself with no AI — spend 30–45 minutes using only traditional methods (articles, videos, websites). Then research the same industry using AI for 30–45 minutes.

Compare the results:
- What did you find faster with AI?
- Where did human research produce better results?
- What did AI get wrong or miss?
- What did your human research miss?
- Where are the blind spots in each approach?

Write a detailed analysis of what this tells you about how entrepreneurs should use AI.$d$, 'Research, Insight, Analysis', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 10),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 4, $t$Mission 11: AI Startup Builder$t$, $d$Use AI tools to build the basic materials for a hypothetical startup. Create:
- A logo (using an AI image tool)
- A customer persona document (AI to draft, your judgment to refine)
- A one-page landing page description (headline, value proposition, call to action)
- A basic marketing plan outline
- A pitch deck outline (10 slides, headlines only)

Document every tool you used, every prompt you entered, and every decision you made about what to keep or change.$d$, 'Automation, Workflow, Efficiency', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 11),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 4, $t$Mission 12: Prompt Engineering Lab$t$, $d$Create and test 30 entrepreneur-focused AI prompts, organized into categories:
- Research prompts (industries, companies, markets)
- Brainstorming prompts (ideas, opportunities)
- Validation prompts (stress-testing ideas)
- Marketing prompts (copy, campaigns)
- Learning prompts (understanding complex concepts quickly)

For each category, identify the 3 best prompts. Compile your top prompts into a personal Prompt Library you will keep using throughout the program.$d$, 'Prompt, Context, Output', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 12),

-- ===== WEEK 5: Strategy and Decision-Making =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 5, $t$Mission 13: Billion Dollar Decision$t$, $d$Research 3 famous business decisions that changed a company's trajectory (e.g. Netflix DVD to streaming, Amazon building AWS, Apple killing the headphone jack, Instagram pivoting from Burbn).

For each decision, analyze:
- What was the context? What was happening in the market?
- What risks existed on both sides?
- What did the company actually decide?
- What happened as a result?
- What lessons does this decision teach?
- What would you have done in the same situation, and why?$d$, 'Strategy, Execution, Outcome', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 13),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 5, $t$Mission 14: Startup Crime Scene$t$, $d$Choose one failed startup and conduct a deep investigation. Create a full autopsy report covering:
- What was the business model?
- Who was the target customer?
- What competition did they face?
- What was customer demand for their product?
- What early warning signs were there?
- What specifically went wrong — and when?
- Was this a bad idea, bad execution, bad timing, or bad market?
- Could it have been saved? How?

Dig into real articles, founder interviews, and post-mortems.$d$, 'Failure, Market Fit, Execution', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 14),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 5, $t$Mission 15: Contrarian Challenge$t$, $d$Find one industry where nearly everyone believes the same thing — a dominant assumption most players accept without question. Then build a research-backed argument for why that industry may be wrong.

Your argument should:
- Clearly state the dominant assumption
- Explain why most people believe it
- Present evidence that challenges the assumption
- Identify the opportunity that opens up if you are right

Support your position with real data, real examples, and clear reasoning.$d$, 'Opportunity, Trend, Contrarian Thinking', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 15),

-- ===== WEEK 6: Founder Skills =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 6, $t$Mission 16: Leverage Hunt$t$, $d$Leverage is the ability to produce outsized results from a given input. Find and document:
- 10 examples of technology leverage (software doing the work of many people)
- 10 examples of media leverage (content reaching millions without ongoing effort)
- 10 examples of capital leverage (money working to create more money)
- 10 examples of people leverage (teams or networks that multiply individual impact)

For each example, explain specifically how the leverage works and what result it produces.$d$, 'Leverage, Scale, Systems', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 16),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 6, $t$Mission 17: Brand Breakdown$t$, $d$Choose 5 companies with strong, distinct brand identities. For each company, analyze:
- What is their core message? What do they want you to feel about them?
- Who is their target audience, and how do they speak to that specific person?
- How do they position themselves relative to competitors?
- What is their brand personality? (Professional, playful, rebellious, premium, etc.)
- What is their actual competitive advantage, and how does their brand reflect it?

Conclude with a synthesis: what do the best brands have in common?$d$, 'Brand, Positioning, Target Audience', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 17),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 6, $t$Mission 18: Business Remodel$t$, $d$Choose one local or small business you interact with regularly. Analyze its current state honestly:
- How does it make money?
- Who are its customers?
- What does it do well / poorly?
- What technology is it missing?

Then redesign it with a before-and-after comparison showing: a new revenue model, improved customer experience, updated marketing, operational improvements, and technology additions. Make it realistic — what could actually improve with a small budget and smart decisions?$d$, 'Business Model, Innovation, Unit Economics', 'Mission Report, Research Notes, AI Prompt Log, Reflection Document', 50, 'mission', 18),

-- ===== WEEK 7: Opportunity Discovery (Team) =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 7, $t$Mission 19: Industry Selection$t$, $d$(Team challenge) As a team, select one industry and divide the research. Each member becomes the expert on one aspect:
- Market size and growth trajectory
- Major competitors and their market share
- Key customer segments and their needs
- Emerging trends and technological changes

Combine your findings into a single Industry Briefing document.$d$, 'Industry, Market, Trend', 'Mission Report, Research Notes, AI Prompt Log, Individual Reflections', 50, 'mission', 19),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 7, $t$Mission 20: Problem Discovery$t$, $d$(Team challenge) Identify and rank the 10 biggest problems customers face in your chosen industry. For each problem:
- Describe it in specific, concrete terms
- Estimate how many people have it
- Find evidence people are actively seeking solutions (forums, reviews, complaints, workarounds)
- Rate its severity on a scale of 1–5

Your final ranking should clearly identify the most valuable problem to solve, with written reasoning.$d$, 'Pain Point, Demand, Opportunity', 'Mission Report, Research Notes, AI Prompt Log, Individual Reflections', 50, 'mission', 20),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 7, $t$Mission 21: Competitor Analysis$t$, $d$(Team challenge) Research the major competitors in your chosen industry. For each competitor, analyze:
- Their strengths (what they do better than everyone else)
- Their weaknesses (where they fail customers)
- The customers they are not serving well
- The gaps they are leaving in the market

Produce a Competitor Matrix and a written recommendation identifying where a new company could most effectively compete, and why.$d$, 'Competitor, Market Gap, Differentiation', 'Mission Report, Research Notes, AI Prompt Log, Individual Reflections', 50, 'mission', 21),

-- ===== WEEK 8: Founder Summit (Team) =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 8, $t$Mission 22: Opportunity Thesis$t$, $d$(Team challenge) Write a formal Opportunity Thesis — a 1–2 page document that argues, with evidence, that your identified opportunity is real, valuable, and worth pursuing. It must include:
- The specific problem you are addressing
- The size of the market
- Why current solutions are insufficient
- Why this is the right time for a new solution
- What success would look like if someone pursued this opportunity$d$, 'Thesis, Evidence, Strategy', 'Thesis Document, Research Notes, AI Prompt Log, Individual Reflections', 50, 'mission', 22),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 8, $t$Mission 23: Business Concept Design$t$, $d$(Team challenge) Design a business concept around your identified opportunity. Include:
- Customer: who is the primary customer? (Be specific — not "everyone")
- Problem: what exact problem are you solving for them?
- Solution: what do you build or offer?
- Business Model: how does the company make money?
- Competitive Advantage: what makes this company hard to copy?

This is a concept, not a pitch for funding. Focus on clarity and logic.$d$, 'Customer, Solution, Value Proposition', 'Mission Report, Research Notes, AI Prompt Log, Individual Reflections', 50, 'mission', 23),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 8, $t$Mission 24: Pitch Preparation$t$, $d$(Team challenge) Prepare and practice your Founder Summit Presentation. Focus on:
- Storytelling: does your presentation have a clear narrative arc?
- Clarity: can someone who knows nothing about your industry understand your idea?
- Evidence: is every major claim supported by real data or real examples?
- Confidence: have you practiced enough to present without reading from notes?
- Team coordination: does each member have a clear role?

Record one full practice run, watch it back, and identify what to improve.$d$, 'Vision, Pitch, Storytelling', 'Presentation materials, Practice recording, Individual Reflections', 50, 'mission', 24),

-- ===== WEEKLY QUESTS (200 XP) =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 1, $t$Week 1 Quest: Entrepreneur's Notebook$t$, $d$Due Sunday of Week 1. Create a structured notebook document containing:
- 10 businesses you admire, with a brief explanation of why each works
- 10 businesses you dislike, with a brief explanation of why each fails or frustrates you
- 5 business ideas you discovered or were inspired by this week
- 5 lessons you learned from studying successful companies

This Quest grows with you — start it on Day 1 and add to it throughout the week.$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 2, $t$Week 2 Quest: Market Map$t$, $d$Due Sunday of Week 2. Choose one industry you find genuinely interesting and create a visual market map showing:
- The major players (companies, platforms, services)
- Their customers and who those customers actually are
- The current trends shaping the industry
- The gaps and opportunities no one is filling well yet

This should be a real research document that proves you understand this industry better than the average person.$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 3, $t$Week 3 Quest: Founder Mindset Journal$t$, $d$Due Sunday of Week 3. Throughout the week, record 25 moments where you notice: a system that works badly, an assumption everyone takes for granted, an inefficiency that wastes time or money, or an opportunity that seems obvious once you see it.

For each of the 25 observations, write: What did you notice? Why does this problem exist? What would you improve, and how?$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 4, $t$Week 4 Quest: AI Founder Operating System$t$, $d$Due Sunday of Week 4. Design your personal AI workflow for entrepreneurship. Document how you use AI for: Research, Brainstorming, Learning, Writing, Planning, and Validation. Include the specific prompts, tools, and workflows you have found most useful. This should be a real system, not a theoretical one.$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 5, $t$Week 5 Quest: Founder Casebook$t$, $d$Due Sunday of Week 5. Create a Casebook of the 10 most important business decisions you studied this week. For each: What was the situation? What decision was made? What was the outcome? What is the lesson? End with a 200-word analysis connecting the decisions and the common patterns among good decision-makers.$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 6, $t$Week 6 Quest: Founder Toolkit$t$, $d$Due Sunday of Week 6. Build your personal Founder Toolkit — a handbook of the most useful frameworks, prompts, and mental models from the first six weeks. Include: your 5 most useful thinking frameworks, your top 10 AI prompts, your 5 most important lessons, your 3 personal decision-making rules, and your go-to research process. Make it something you can actually use.$d$, null, null, 200, 'quest', null),

('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 7, $t$Week 7 Quest: Opportunity Report$t$, $d$Due Sunday of Week 7. As a team, produce a full Opportunity Report covering: industry overview and size; key customer segments and their characteristics; major competitors and their strengths and weaknesses; the 5 biggest problems customers face; and the single best opportunity your team identified, with supporting evidence. This becomes the foundation for your Week 8 Founder Summit Presentation.$d$, null, null, 200, 'quest', null),

-- ===== FINAL FOUNDER SUMMIT (500 XP) =====
('30eafd3a-2cc4-4c7f-a631-b41e517de1ab', 8, $t$Founder Summit Presentation$t$, $d$Due end of Week 8. The culmination of Level 1: your team presents a real business opportunity with a real concept behind it. Your presentation must cover:
1. Industry — what world are you playing in?
2. Problem — what specific problem did you identify?
3. Opportunity — why is this the right opportunity?
4. Competitors — who exists, and why is there still room?
5. Business Concept — what would you build, and for whom?
6. Validation — what evidence exists that people want this?
7. Lessons Learned — what did your team discover that you did not expect?

Format: live video presentation, recorded video, or slide deck with written narrative (determined by cohort Guides).$d$, null, null, 500, 'summit', null);
