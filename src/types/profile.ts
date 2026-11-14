export type ThemeId =
  | 'discord-signature'
  | 'minimal-light'
  | 'dark-mode'
  | 'pastel-peach'
  | 'neo-brutal';

export interface LinkItem {
  id: string;
  type: 'link' | 'header';
  title: string;
  url?: string;
  order: number;
  subtitle?: string;
  icon?: string;          // 이모지 또는 아이콘 식별자 (예: '🚀', 'Github', 'ExternalLink')
  badge?: string;         // 'NEW', 'HOT', 'Featured', 'Open Source' 등
  isFeatured?: boolean;   // 시그니처 강조 카드 여부
  category?: string;      // 카테고리 필터용 식별자 (예: 'projects', 'articles', 'contact')
  createdAt?: number | string; // 타임스탬프 (밀리초 또는 ISO 문자열)
  clicks?: number;        // 링크 누적 클릭 수
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

export interface UserProfile {
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  themeId: ThemeId;
  socials: SocialLinks;
  links: LinkItem[];
  updatedAt: string;
}
