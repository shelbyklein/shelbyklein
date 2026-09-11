export const articleRevisions: Record<string, { excerpt?: string; html: string }> = {
  'the-space-between-work-and-ai': {
    excerpt: 'Newton is an answer to three modes of creative work: one-shot artifacts, long-term software development, and the ongoing work that makes up a project.',
    html: `<p>I’ve spent a lot of time lately thinking about what it actually means to work with AI, mostly because building Newton has forced me to think about it in ways I hadn’t before.</p>

<p>Tools like ChatGPT and cloud coding agents are already very good at giving us a place to start. You open a session, explain what you’re trying to do, work through it, generate some code or an artifact, make changes, and eventually get somewhere useful.</p>

<p>I use that workflow constantly, often to make one-shot artifacts for other people: microsites such as Virtual Symposium, data dashboards, and other focused tools with a clear finish. In those cases, a session can be the right container for the work.</p>

<h2>Three ways I work</h2>

<p>But that is only one mode. The work I do around AI tends to fall into three distinct ways of thinking:</p>

<ol>
<li><strong>One-shot artifacts</strong> for other people: a microsite, a data dashboard, or a focused tool that solves a particular problem.</li>
<li><strong>Native coding</strong> for long-term development projects: working with Codex or Claude Code in an IDE, where the software itself needs to grow and be maintained over time.</li>
<li><strong>Self-directed task work</strong>: the diverse work that makes up my job, from graphics, videos, InDesign, and Canva to WordPress development and editing websites built in other ways.</li>
</ol>

<p>The individual tasks in that third mode can be isolated. The project is not. It has a history, priorities, files, decisions, and work that needs to be picked back up later.</p>

<p>So the observation is not really a gap between what the AI needs and what I need. It is that these are different modes of work, each with its own rhythm and interface. Once I know what I need to do, the question becomes: how can the AI be ready to help execute it at any point, without making me rebuild the context or work through unnecessary convolution first?</p>

<p>That is the question Newton is meant to answer.</p>

<h2>From a session to an environment</h2>

<p>The easiest way I’ve found to think about Newton is as bots, projects, and a dashboard.</p>

<p>The bots do the work. Different bots can have different roles, context, responsibilities, and tools. Whether those are technically separate agents, prompts, models, or processes is less important to me than understanding who is doing what and being able to work with them that way.</p>

<p>The projects compartmentalize the work. They give the people, files, conversations, and decisions around a project somewhere to live, so a task can be picked up without treating every session as a new beginning.</p>

<p>The dashboard is where I can work in the style the task needs for execution. Sometimes that is a board. Sometimes it is an approval queue, a calendar, a document, a workspace for a specific kind of work, or something that does not fit an existing category at all.</p>

<p>Together, those pieces let the work stay logically organized while still being flexible enough for the task at hand. The bots can act, the projects can hold the context, and the dashboard can give me a useful way to direct and review what is happening.</p>

<p>Appleseed gives this system an important boundary. It is a way to develop the app without needing to develop it inside the app itself. Newton can be a useful place to organize and direct work, but it should not force every kind of work through its own abstraction.</p>

<p>When the work is better served by native coding, I can step outside Newton and develop directly with the tools that make sense for the app. That keeps the system from becoming a closed loop: the workspace can support the work without becoming a requirement for making changes to the workspace itself.</p>

<p>At the same time, I’m experimenting with integrating AI directly into Newton’s development space. The aim is to give development a place where it can move slowly, steadily, linearly, and with focus. Instead of getting disjointed across unrelated conversations, tools, and partial attempts, the work can stay connected to the project while it takes shape.</p>

<h2>Making it work for me</h2>

<p>For a while, I think I treated the interface and the AI as more or less the same product. You open ChatGPT and talk to the AI. You open a coding agent and build with the AI. The software is basically the window through which you access the intelligence.</p>

<p>But as the underlying models get more capable, I’m finding myself less interested in the window. I do not necessarily need someone else’s idea of a project manager, inbox, dashboard, or workflow just because that happens to be the software wrapped around the model.</p>

<p>What I need is an environment that can meet the work where it is: a quick artifact when that is enough, a durable coding workspace when the product needs to last, or a project home for the many tasks that make up a larger effort.</p>

<p>Newton is what I’ve been building in that space. It is not about replacing ChatGPT, coding agents, or artifacts. I still use all of them. It is about letting those tools, the projects around them, and the way I need to execute work start working together for me.</p>`,
  },
  'a-working-tools-log': {
    excerpt: 'A short, living reference of the tools and projects I keep returning to across AI, coding, creative work, and publishing.',
    html: `<aside class="article-reference-card">
<span class="eyebrow">GITHUB</span>
<h2>Code, experiments, and references</h2>
<p>My GitHub is where I share public code and keep a growing collection of projects that inform my own work.</p>
<a href="https://github.com/shelbyklein?tab=stars" target="_blank" rel="noreferrer">Explore my starred repositories →</a>
</aside>

<p>This is a living reference for me and for anyone who wants to understand the tools behind my work. Each note is intentionally brief: what the tool does, and why I keep returning to it.</p>

<h2>AI and coding</h2>

<div class="article-tool-grid">
<a class="article-tool-card" href="https://chatgpt.com/" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">AI</span><span><strong>ChatGPT</strong><small>Ideas, copy, research, and getting a project moving.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://openai.com/codex/" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">CX</span><span><strong>Codex</strong><small>Building, maintaining, and shipping work in a real codebase.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/anthropic" alt=""/></span><span><strong>Claude Code</strong><small>Native coding for longer-term development work.</small></span><b>↗</b></a>
</div>

<h2>Creative production</h2>

<div class="article-tool-grid">
<a class="article-tool-card" href="https://www.adobe.com/products/illustrator.html" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">AI</span><span><strong>Adobe Illustrator</strong><small>Vector drawing, marks, and scalable graphics.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://www.adobe.com/products/indesign.html" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">ID</span><span><strong>Adobe InDesign</strong><small>Editorial layouts, print-ready documents, and page structure.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">PS</span><span><strong>Adobe Photoshop</strong><small>Image editing, compositing, and fast visual iteration.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://www.adobe.com/products/premiere.html" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">PR</span><span><strong>Adobe Premiere</strong><small>Video editing, motion, and finishing.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://www.canva.com/" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://www.canva.com/favicon.ico" alt=""/></span><span><strong>Canva</strong><small>Social graphics, working templates, and collaborative materials.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://www.aseprite.org/" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">AS</span><span><strong>Aseprite</strong><small>Pixel art, animation, and sprites.</small></span><b>↗</b></a>
</div>

<h2>Design research</h2>

<div class="article-tool-grid">
<a class="article-tool-card" href="https://mobbin.com/" target="_blank" rel="noreferrer"><span class="article-tool-logo article-tool-monogram">MB</span><span><strong>Mobbin</strong><small>Real-world app and web patterns, screens, and flows for design reference.</small></span><b>↗</b></a>
</div>

<h2>Websites and publishing</h2>

<div class="article-tool-grid">
<a class="article-tool-card" href="https://wordpress.org/" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/wordpress" alt=""/></span><span><strong>WordPress</strong><small>Content-rich sites with an approachable publishing workflow.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/shelbyklein" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>GitHub</strong><small>Public code, prototypes, and projects I can share.</small></span><b>↗</b></a>
</div>

<h2>Ideas I’m watching</h2>

<div class="article-tool-grid">
<a class="article-tool-card" href="https://github.com/kgoedecke/doop" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>doop</strong><small>People and AI agents designing together in real time.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/CopilotKit/OpenBot" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>OpenBot</strong><small>AI coworkers with their own browser, files, tools, and action record.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/zep-ia/pixel-agent-desk" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>pixel-agent-desk</strong><small>An inspiration for agent-centered desktop thinking.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/brobertsaz/claude-os" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>claude-os</strong><small>An inspiration for an organized AI operating environment.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/trailhq/Graft" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>Graft</strong><small>Context-aware acceleration for coding agents working in a real codebase.</small></span><b>↗</b></a>
<a class="article-tool-card" href="https://github.com/UditAkhourii/cdaf" target="_blank" rel="noreferrer"><span class="article-tool-logo"><img src="https://cdn.simpleicons.org/github" alt=""/></span><span><strong>CDAF</strong><small>A sidecar format that helps AI agents reuse video understanding instead of re-analyzing footage.</small></span><b>↗</b></a>
</div>

<h2>How I use this list</h2>

<p>These tools fit different modes of work. Some help make a fast, one-shot artifact; others support a long-running software project; others help with the diverse tasks that make up a creative practice. I’ll add to this list when a tool or project earns a durable place in that work.</p>`,
  },
};
