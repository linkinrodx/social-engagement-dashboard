import { Injectable, inject } from '@angular/core';

export interface ExecutionLog {
  id: string;
  started_at: string;
  finished_at: string;
  status: string;
  posts_scanned: number;
  comments_posted: number;
  error_message: string | null;
  created_at: string;
}

export interface CommentedPost {
  id: string;
  post_id: string;
  post_url: string;
  comment_text: string;
  commented_at: string;
  created_at: string;
}

export interface DailyCommentCount {
  id: string;
  date: string;
  comment_count: number;
  created_at: string;
}

export interface Settings {
  id: string;
  enabled: boolean;
  max_comments_per_day: number;
  min_delay_seconds: number;
  max_delay_seconds: number;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly url = '';
  private readonly key = '';

  private get headers() {
    return {
      'Content-Type': 'application/json',
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
    };
  }

  async getSettings(): Promise<Settings | null> {
    try {
      const res = await fetch(`${this.url}/rest/v1/settings?limit=1`, {
        headers: this.headers,
      });
      if (!res.ok) return null;
      const data: Settings[] = await res.json();
      return data[0] ?? null;
    } catch {
      return null;
    }
  }

  async getExecutionLogs(limit = 50): Promise<ExecutionLog[]> {
    try {
      const res = await fetch(
        `${this.url}/rest/v1/execution_logs?order=started_at.desc&limit=${limit}`,
        { headers: this.headers }
      );
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async getCommentedPosts(limit = 50): Promise<CommentedPost[]> {
    try {
      const res = await fetch(
        `${this.url}/rest/v1/commented_posts?order=commented_at.desc&limit=${limit}`,
        { headers: this.headers }
      );
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async getDailyCommentCount(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(
        `${this.url}/rest/v1/daily_comment_count?date=eq.${today}`,
        { headers: this.headers }
      );
      if (!res.ok) return 0;
      const data: DailyCommentCount[] = await res.json();
      return data[0]?.comment_count ?? 0;
    } catch {
      return 0;
    }
  }

  async updateSettings(settings: Partial<Settings>): Promise<boolean> {
    try {
      const res = await fetch(`${this.url}/rest/v1/settings?id=eq.${settings.id}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(settings),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
