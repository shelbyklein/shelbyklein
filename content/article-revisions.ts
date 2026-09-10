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

<h2>Making it work for me</h2>

<p>For a while, I think I treated the interface and the AI as more or less the same product. You open ChatGPT and talk to the AI. You open a coding agent and build with the AI. The software is basically the window through which you access the intelligence.</p>

<p>But as the underlying models get more capable, I’m finding myself less interested in the window. I do not necessarily need someone else’s idea of a project manager, inbox, dashboard, or workflow just because that happens to be the software wrapped around the model.</p>

<p>What I need is an environment that can meet the work where it is: a quick artifact when that is enough, a durable coding workspace when the product needs to last, or a project home for the many tasks that make up a larger effort.</p>

<p>Newton is what I’ve been building in that space. It is not about replacing ChatGPT, coding agents, or artifacts. I still use all of them. It is about letting those tools, the projects around them, and the way I need to execute work start working together for me.</p>`,
  },
};
