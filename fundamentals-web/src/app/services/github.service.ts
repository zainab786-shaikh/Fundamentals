import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface SubTopic {
  name: string;        // Display name (filename without .md)
  path: string;        // Full repo path e.g. "Computer Networks/Computer Network.md"
  sha: string;
}

export interface Subject {
  name: string;        // Folder name e.g. "Computer Networks"
  icon: string;        // Material icon
  topics: SubTopic[];
}

// Icon mapping per subject folder name keyword
const ICON_MAP: Record<string, string> = {
  'network':       'lan',
  'os':            'memory',
  'operating':     'memory',
  'architecture':  'developer_board',
  'organization':  'account_tree',
  'software':      'code',
  'engineering':   'code',
  'ai':            'smart_toy',
  'agent':         'smart_toy',
  'langchain':     'hub',
  'langraph':      'hub',
  'lang':          'hub',
  'database':      'storage',
  'algorithm':     'functions',
  'math':          'calculate',
  'data':          'data_object',
};

function iconFor(name: string): string {
  const lower = name.toLowerCase();
  for (const key of Object.keys(ICON_MAP)) {
    if (lower.includes(key)) return ICON_MAP[key];
  }
  return 'menu_book';
}

interface GithubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  download_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly OWNER  = 'zainab786-shaikh';
  private readonly REPO   = 'Fundamentals';
  private readonly BRANCH = 'main';
  private readonly API    = `https://api.github.com/repos/${this.OWNER}/${this.REPO}/contents`;
  private readonly RAW    = `https://raw.githubusercontent.com/${this.OWNER}/${this.REPO}/${this.BRANCH}`;

  constructor(private http: HttpClient) {}

  /** Fetch all subjects (folders) + their .md subtopics from GitHub, with localStorage & catalog.json fallback */
  getSubjects(): Observable<Subject[]> {
    return this.http.get<GithubContent[]>(this.API).pipe(
      switchMap(roots => {
        // Only directories (skip files at root like README, hidden folders, and fundamentals-web)
        const dirs = roots.filter(
          r => r.type === 'dir' && !r.name.startsWith('.') && r.name !== 'fundamentals-web'
        );
        if (dirs.length === 0) return of([]);

        // For each dir, fetch its contents to find .md files
        const requests = dirs.map(dir =>
          this.http.get<GithubContent[]>(`${this.API}/${encodeURIComponent(dir.name)}`).pipe(
            map(contents => {
              const mdFiles = contents.filter(
                f => f.type === 'file' && f.name.toLowerCase().endsWith('.md')
              );
              const topics: SubTopic[] = mdFiles.map(f => ({
                name: f.name.replace(/\.md$/i, ''),
                path: f.path,
                sha:  f.sha,
              }));
              return {
                name:   dir.name,
                icon:   iconFor(dir.name),
                topics,
              } as Subject;
            }),
            catchError(() => of({ name: dir.name, icon: iconFor(dir.name), topics: [] } as Subject))
          )
        );

        return forkJoin(requests);
      }),
      // Filter subjects that actually have markdown files
      map(subjects => {
        const valid = subjects.filter(s => s.topics.length > 0);
        if (valid.length > 0) {
          try {
            localStorage.setItem('fundamentals_subjects', JSON.stringify(valid));
          } catch {}
        }
        return valid;
      }),
      catchError(err => {
        console.warn('GitHub API rate limited or unreachable. Using cache/catalog fallback.', err);
        // 1. Try localStorage
        try {
          const cached = localStorage.getItem('fundamentals_subjects');
          if (cached) {
            const parsed = JSON.parse(cached) as Subject[];
            if (parsed && parsed.length > 0) return of(parsed);
          }
        } catch {}
        // 2. Fallback to bundled catalog.json
        return this.http.get<Subject[]>('assets/catalog.json').pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  /** Fetch the raw markdown content for a given repo path */
  getMarkdown(path: string): Observable<string> {
    const url = `${this.RAW}/${path.split('/').map(encodeURIComponent).join('/')}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(() => of('# Error\n\nCould not load this document. Please check your network connection or try again later.'))
    );
  }
}
