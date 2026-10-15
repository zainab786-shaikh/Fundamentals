import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MarkdownViewerComponent } from './components/markdown-viewer/markdown-viewer.component';
import { Subject, SubTopic } from './services/github.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SidebarComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  activeSubject: Subject | null = null;
  activeTopic:   SubTopic | null = null;
  activePath     = '';
  isMobile       = false;

  constructor(private bp: BreakpointObserver) {
    this.bp.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  onTopicSelected(event: { subject: Subject; topic: SubTopic }): void {
    this.activeSubject = event.subject;
    this.activeTopic   = event.topic;
    this.activePath    = event.topic.path;
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
