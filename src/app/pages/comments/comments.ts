import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupabaseService, CommentedPost } from '../../services/supabase.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h2>Posts Comentados</h2>

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
            <td>{{ post.post_id }}</td>
            <td>{{ post.comment_text }}</td>
            <td>{{ post.commented_at | date: 'short' }}</td>
            <td>
              <a [href]="post.post_url" target="_blank">Ver post</a>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export default class CommentsPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  posts: CommentedPost[] = [];

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    this.posts = await this.supabase.getCommentedPosts();
    this.cdr.detectChanges();
  }
}
