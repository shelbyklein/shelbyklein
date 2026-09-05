import projectData from '@/content/projects.json';
import articleData from '@/content/articles.json';
export type ProjectImage = { src: string; alt: string; caption?: string; width?: number; height?: number };
export type Project = Omit<(typeof projectData)[number], 'images'> & {
  images: ProjectImage[];
  urlLabel?: string;
  galleryLayout?: string;
};
export const projects: Project[] = projectData;
export const articles = articleData;
export const featuredIds = ['newton','current','playcase','olympic-jerseys','steam-deck-hq','usa-archery-broadcast','vispix'];
export const featuredProjects = featuredIds.map(id=>projects.find(p=>p.id===id)!);
export const archiveProjects = projects.filter(p=>!featuredIds.includes(p.id));
export function getProject(id:string){return projects.find(p=>p.id===id)}
