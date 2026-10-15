import {
  Component, OnInit, Output, EventEmitter, Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, SubTopic, GithubService } from '../../services/github.service';

const ICON_CLASSES = [
  'icon-wrap-indigo',
  'icon-wrap-purple',
  'icon-wrap-blue',
  'icon-wrap-teal',
  'icon-wrap-green',
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() topicSelected = new EventEmitter<{ subject: Subject; topic: SubTopic }>();
  @Input() activePath = '';

  subjects: Subject[]         = [];
  filteredSubjects: Subject[]  = [];
  loading  = true;
  error    = false;
  searchQuery = '';

  constructor(private github: GithubService) {}

  ngOnInit(): void {
    this.github.getSubjects().subscribe({
      next: subjects => {
        this.subjects         = subjects;
        this.filteredSubjects = subjects;
        this.loading          = false;
      },
      error: () => {
        this.loading = false;
        this.error   = true;
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredSubjects = this.subjects;
      return;
    }
    this.filteredSubjects = this.subjects
      .map(s => ({
        ...s,
        topics: s.topics.filter(t => t.name.toLowerCase().includes(q))
      }))
      .filter(s => s.name.toLowerCase().includes(q) || s.topics.length > 0);
  }

  select(subject: Subject, topic: SubTopic): void {
    this.topicSelected.emit({ subject, topic });
  }

  getIconClass(index: number): string {
    return ICON_CLASSES[index % ICON_CLASSES.length];
  }

  trackSubject(_: number, s: Subject) { return s.name; }
  trackTopic(_: number, t: SubTopic)  { return t.path; }
}
