import projectData from '@/content/projects.json';
import articleData from '@/content/articles.json';
import { sitePath } from '@/lib/site-path';
export type ProjectImage = { src: string; alt: string; caption?: string; width?: number; height?: number };
export type Project = Omit<(typeof projectData)[number], 'images'> & {
  images: ProjectImage[];
  urlLabel?: string;
  galleryLayout?: string;
};
export const projects: Project[] = projectData.map(project => ({
  ...project,
  cover: project.cover ? sitePath(project.cover) : null,
  images: project.images.map(image => ({ ...image, src: sitePath(image.src) })),
}));
export const articles = articleData.map(article => ({
  ...article,
  html: article.html.replace(/((?:href|src)=["'])(\/(?!\/)[^"']*)(["'])/g,
    (_, before, path, after) => before + sitePath(path) + after),
}));
export const featuredIds = ['newton','current','playcase','olympic-jerseys','steam-deck-hq','usa-archery-broadcast','vispix'];
export const featuredProjects = featuredIds.map(id=>projects.find(p=>p.id===id)!);
export const archiveProjects = projects.filter(p=>!featuredIds.includes(p.id));
export function getProject(id:string){return projects.find(p=>p.id===id)}
