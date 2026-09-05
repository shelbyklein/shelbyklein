import type { Project } from '@/lib/portfolio';

export function projectLinkLabel(project: Project) {
  if (project.urlLabel) return project.urlLabel;
  if (project.url?.startsWith('https://vimeo.com/')) return 'Watch on Vimeo';
  if (project.url?.startsWith('https://github.com/')) return 'View on GitHub';
  return 'Visit website';
}
