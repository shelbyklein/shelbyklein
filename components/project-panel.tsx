'use client';

import {
  createContext,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Project } from '@/lib/portfolio';
import { projectLinkLabel } from '@/lib/project-links';
import { PlayCaseArt } from '@/components/playcase-art';
import { VispixArt } from '@/components/vispix-art';

type PanelContextValue = {
  panelId: string;
  activeProject: string | null;
  openProject: (projectId: string, trigger: HTMLAnchorElement) => void;
};

const PanelContext = createContext<PanelContextValue | null>(null);

export function ProjectPanelProvider({
  projects,
  children,
}: {
  projects: Project[];
  children: ReactNode;
}) {
  const panelId = useId();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const project = projects.find((item) => item.id === projectId);

  const context = useMemo<PanelContextValue>(() => ({
    panelId,
    activeProject: open ? projectId : null,
    openProject(id, trigger) {
      if (!projects.some((item) => item.id === id)) return;
      triggerRef.current = trigger;
      setProjectId(id);
      setOpen(true);
    },
  }), [panelId, open, projectId, projects]);

  return (
    <PanelContext.Provider value={context}>
      <Sheet open={open} onOpenChange={setOpen}>
        {children}
        <SheetContent
          id={panelId}
          className="project-sheet"
          side="right"
          showCloseButton={false}
          finalFocus={triggerRef}
        >
          {project && <>
            <div className="project-sheet-topbar">
              <span>PROJECT OVERVIEW</span>
              <SheetClose className="project-sheet-close" aria-label="Close project overview">
                <X size={20} aria-hidden="true" />
              </SheetClose>
            </div>
            <div className="project-sheet-scroll">
              <header className="project-sheet-heading">
                <span className="eyebrow">{project.label}</span>
                <SheetTitle className="project-sheet-title">{project.originalTitle}</SheetTitle>
                <SheetDescription className="project-sheet-summary">{project.summary}</SheetDescription>
              </header>
              {project.cover && <figure className={`project-sheet-image ${project.id}-panel-image`}>
                {project.id === 'playcase' ? <PlayCaseArt eager/> : project.id === 'vispix' ? <VispixArt/> : <img src={project.cover} alt={`${project.originalTitle} — project preview`} />}
              </figure>}
              <dl className="project-sheet-meta">
                <div><dt>Project</dt><dd>{project.client}</dd></div>
                <div><dt>Disciplines</dt><dd>{project.tags.join(' · ')}</dd></div>
              </dl>
              <div className="project-sheet-description">
                {project.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
            <footer className="project-sheet-actions">
              <Link className="project-sheet-primary" href={`/work/${project.id}`}>
                View full project <ArrowRight size={18} aria-hidden="true" />
              </Link>
              {project.url && <a className="project-sheet-secondary" href={project.url} target="_blank" rel="noreferrer">
                {projectLinkLabel(project)} <ArrowUpRight size={18} aria-hidden="true" />
              </a>}
            </footer>
          </>}
        </SheetContent>
      </Sheet>
    </PanelContext.Provider>
  );
}

export function ProjectLink({
  projectId,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { projectId: string }) {
  const panel = useContext(PanelContext);
  return <a
    {...props}
    href={`/work/${projectId}`}
    aria-haspopup={panel ? 'dialog' : undefined}
    aria-controls={panel?.panelId}
    aria-expanded={panel ? panel.activeProject === projectId : undefined}
    onClick={(event) => {
      onClick?.(event);
      if (
        !panel || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        (props.target && props.target !== '_self') || props.download != null
      ) return;
      event.preventDefault();
      panel.openProject(projectId, event.currentTarget);
    }}
  >{children}</a>;
}
