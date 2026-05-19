export interface BirdRecord {
  id: string;
  count: number;
  type: string;
  arrival_date: string;
  expected_harvest: string;
  feed_stock: number;
  status: 'Growing' | 'Ready' | 'Harvested';
  created_by: string;
  created_at?: string;
}

export interface DailyReport {
  id: string;
  batch_id: string;
  date: string;
  mortality: number;
  feed_used: number;
  notes?: string;
  created_at: any;
  created_by: string;
}

export interface SalesRecord {
  id: string;
  amount: number;
  date: string;
  customer: string;
  status: 'Paid' | 'Pending';
  created_by: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  time: string;
  user: string;
}

export type UserRole = 'ADMIN' | 'MD' | 'MANAGER' | 'STAFF';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface CommentRecord {
  id: string;
  entityId: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}
