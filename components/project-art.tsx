import { AudioLines } from 'lucide-react';
import { PlayCaseArt } from '@/components/playcase-art';
import type { Project } from '@/lib/portfolio';
export function ProjectArt({project,detail=false}:{project:Project,detail?:boolean}){
 if(project.id==='playcase')return <PlayCaseArt eager={detail}/>;
 if(project.id==='newton'&&!detail)return <><div className="app-title"><img src="/images/newton-logo.png" alt="" width="55" height="55"/><span>Newton</span></div><img className="app-screen" src="/images/newton.webp" alt="Newton’s dark desktop interface and apple mascot" width="1800" height="1220" loading="lazy"/></>;
 if(project.id==='current'&&!detail)return <><div className="app-title current-title"><AudioLines size={37}/><span>current</span></div><img className="app-screen" src="/images/current.webp" alt="Current live rhyme studio with phrase ideas and vowel matches" width="1440" height="1100" loading="lazy"/></>;
 if(!project.cover)return null;
 return <img src={project.cover} alt={project.id==='olympic-jerseys'?'A Team USA archer competing in the Olympic jersey designed by Shelby Klein':`${project.originalTitle} — ${project.summary}`} loading={detail?'eager':'lazy'} width="1200" height="960"/>;
}
