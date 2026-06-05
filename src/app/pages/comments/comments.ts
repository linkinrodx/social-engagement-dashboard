import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton/skeleton';
import { SupabaseService, CommentedPost } from '../../services/supabase.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  template: `
    <h2>Posts Comentados</h2>

    @if (loading()) {
      <app-skeleton variant="table" [rows]="5" [cols]="4" />
    } @else {
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            @for (post of posts; track post.id) {
              <tr>
                <td class="truncate-cell"><span [title]="post.post_id">{{ post.post_id }}</span></td>
                <td>{{ post.comment_text }}</td>
                <td>{{ post.commented_at | date: 'short' }}</td>
                <td>
                  <a [href]="post.post_url" target="_blank">Ver post</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export default class CommentsPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  loading = signal(true);
  posts: CommentedPost[] = [];

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      this.posts = await this.supabase.getCommentedPosts();
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }
}
