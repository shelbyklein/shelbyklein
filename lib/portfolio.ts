import projectData from '@/content/projects.json';
import articleData from '@/content/articles.json';
export type Project = (typeof projectData)[number];
export const projects = projectData;
export const articles = articleData;
export const featuredIds = ['playcase','newton','current','olympic-jerseys','steam-deck-hq','usa-archery-broadcast'];
export const featuredProjects = featuredIds.map(id=>projects.find(p=>p.id===id)!);
export const archiveProjects = projects.filter(p=>!featuredIds.includes(p.id));
export function getProject(id:string){return projects.find(p=>p.id===id)}
