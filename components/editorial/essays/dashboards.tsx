'use client';
import { Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';
export const dashboardsSections = [
  { id: 'skdstudio', title: 'SKDStudio: the sites, without the fluff' },
  { id: 'skdworkbench', title: 'SKDWorkbench: a bench for dev projects' },
  { id: 'newton', title: 'Newton: the whole picture' },
  { id: 'proving-it', title: 'Now they have to prove it' },
];
export function DashboardsEssay() {
  return <>
    <Section id="skdstudio" index="01" title="SKDStudio: the sites, without the fluff">
      <p>I look after a lot of WordPress sites. The work itself is rarely hard. What wears me down is the trip to get there: log in, find the right dashboard, get past the notices and upsells, and dig for the one setting I came to change.</p>
      <p>SKDStudio is my way around that, and it exists thanks to WordPress Studio. Studio made running local copies of sites fast and easy. Once that part was simple, I could build a single place to see every site and do the everyday work of keeping them up. Updates, content, checks. Only the controls I actually use.</p>
      <p>It’s less a new product than a quieter room to work in. The sites haven’t changed. I just get to them without the clutter.</p>
    </Section>
    <Section id="skdworkbench" index="02" title="SKDWorkbench: a bench for dev projects">
      <p>Dev projects needed their own home. Apps, experiments, and half-finished ideas each come with repositories, running servers, notes, and a next step I can never remember.</p>
      <p>SKDWorkbench keeps them on one bench. I can see what’s running, what changed recently, and where I left off. When I sit down to build, I’m picking something up, not rebuilding my memory of it first.</p>
    </Section>
    <Section id="newton" index="03" title="Newton: the whole picture">
      <p>Studio and Workbench are about specific kinds of work. <a href={sitePath('/work/newton')}>Newton</a> sits above them. It’s where I go to see the whole picture: clients, products, creative work, and how they connect.</p>
      <p>Newton is organized around projects. A project holds its context, files, and decisions in one place, so when I bring AI in, it starts from what I already know instead of a blank prompt. It’s the thinking side of the setup, where I decide what matters. The other two are where it gets done.</p>
    </Section>
    <Section id="proving-it" index="04" title="Now they have to prove it">
      <p>These tools keep expanding. <a href={sitePath('/work/tracker-trapper')}>Tracker Trapper</a> started as a small menu-bar checklist for following my agents’ progress. Now it has an iPhone companion with widgets and notifications. Every time one of these tools saves me a step, I find three more steps it could save. That’s exciting, and it’s also a warning sign. A tool that only grows is not always a tool that helps.</p>
      <p>So the next phase is proving them. Do they make real client work faster? Do they hold up on a busy week, not just a good one? Would I miss them if they disappeared? I want honest answers to those before I call any of this finished.</p>
      <p>Still, I can’t overstate how good it feels to build this way. With LLMs working as my hands, an idea can become a working tool in an afternoon. I bring the judgment, taste, and sense of what the work needs. The models bring speed I never had on my own. For someone who has always had more ideas than hours, that is deeply empowering.</p>
      <p>I’m building the tools I wish I’d had for years. Now I get to find out which ones earn their place.</p>
    </Section>
  </>;
}
