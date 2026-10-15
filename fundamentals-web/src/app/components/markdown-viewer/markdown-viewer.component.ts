import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService, Subject, SubTopic } from '../../services/github.service';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss'],
})
export class MarkdownViewerComponent implements OnChanges {
  @Input() subject: Subject | null = null;
  @Input() topic:   SubTopic | null = null;

  loading = false;
  error   = false;
  html: SafeHtml = '';

  constructor(
    private github: GithubService,
    private sanitizer: DomSanitizer
  ) {
    this.configureMarked();
  }

  private configureMarked(): void {
    // Use a marked extension/walkTokens to post-process tokens
    // For marked v9, use the override approach with useExtension
    marked.use({
      gfm: true,
      breaks: true,
      renderer: {
        link({ href, title, text }: any) {
          const t = title ? ` title="${title}"` : '';
          return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`;
        },
        table({ header, rows }: any) {
          return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${rows}</tbody></table></div>`;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic'] && this.topic) {
      this.loadContent();
    }
  }

  loadContent(): void {
    if (!this.topic) return;
    this.loading = true;
    this.error   = false;
    this.html    = '';

    this.github.getMarkdown(this.topic.path).subscribe({
      next: md => {
        try {
          let processedMd = md;
          if (this.topic) {
            const parts = this.topic.path.split('/');
            parts.pop(); // remove filename
            const dir = parts.join('/');
            const rawPrefix = `https://raw.githubusercontent.com/zainab786-shaikh/Fundamentals/main/${dir ? encodeURIComponent(dir) + '/' : ''}`;
            
            // Replace relative img src
            processedMd = processedMd.replace(
              /src=["'](?!https?:\/\/|\/)([^"']+)["']/gi,
              `src="${rawPrefix}$1"`
            );
            // Replace markdown image links
            processedMd = processedMd.replace(
              /!\[(.*?)\]\(((?!https?:\/\/|\/)(.*?))\)/gi,
              `![$1](${rawPrefix}$2)`
            );
          }
          const parsed = marked.parse(processedMd) as string;
          this.html = this.sanitizer.bypassSecurityTrustHtml(parsed);
        } catch {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error   = true;
      }
    });
  }

  get githubUrl(): string {
    if (!this.topic) return '#';
    return `https://github.com/zainab786-shaikh/Fundamentals/blob/main/${encodeURIComponent(this.topic.path).replace(/%2F/g, '/')}`;
  }
}
