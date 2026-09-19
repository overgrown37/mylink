export interface SocialLink {
  platform: 'github' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'email';
  url: string;
  label: string;
}

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: 'all' | 'projects' | 'articles' | 'contact';
  isFeatured?: boolean;
  badge?: string;
  stats?: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  handle: string;
  bio: string;
  location: string;
  status: {
    text: string;
    available: boolean;
  };
  avatarUrl: string;
  bannerUrl: string;
  stats: {
    label: string;
    value: string;
  }[];
  socials: SocialLink[];
  links: LinkItem[];
}

export const profileData: ProfileData = {
  name: "김무성 (Mooseong Kim)",
  tagline: "AI & 바이브 코딩으로 아이디어를 실현하는 개발자",
  handle: "@mooseong_dev",
  bio: "바이브 코딩과 최신 웹 기술로 가치 있는 프로덕트를 만들어갑니다. 새로운 기술 탐구와 창의적인 프로젝트를 즐기며 공유합니다 ✨",
  location: "Seoul, South Korea",
  status: {
    text: "새로운 프로젝트 및 협업 가능",
    available: true,
  },
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  stats: [
    { label: "프로젝트", value: "14+" },
    { label: "기술 아티클", value: "38편" },
    { label: "GitHub Stars", value: "1.2k" },
  ],
  socials: [
    { platform: "github", url: "https://github.com", label: "GitHub" },
    { platform: "twitter", url: "https://x.com", label: "X (Twitter)" },
    { platform: "instagram", url: "https://instagram.com", label: "Instagram" },
    { platform: "youtube", url: "https://youtube.com", label: "YouTube" },
    { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
    { platform: "email", url: "mailto:hello@example.com", label: "Email" },
  ],
  links: [
    {
      id: "project-1",
      title: "FlowNote - AI 기반 지능형 노트 앱",
      description: "생각을 구조화하고 실시간 AI 어시스턴트가 요약해주는 생산성 SaaS",
      url: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
      category: "projects",
      isFeatured: true,
      badge: "Featured",
      stats: "⭐ 540+",
    },
    {
      id: "project-2",
      title: "PixelCraft - 모던 웹 디자인 시스템",
      description: "Tailwind CSS와 React 기반의 경량화된 UI 컴포넌트 라이브러리",
      url: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80",
      category: "projects",
      isFeatured: false,
      badge: "Open Source",
      stats: "⭐ 320+",
    },
    {
      id: "article-1",
      title: "Next.js 15와 React 19 마이그레이션 실전 가이드",
      description: "서버 액션, 캐싱 전략 변경점과 프로덕션 최적화 노하우 총정리",
      url: "https://velog.io",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
      category: "articles",
      isFeatured: false,
      badge: "인기 글",
      stats: "조회수 4.5k",
    },
    {
      id: "article-2",
      title: "좋은 UI/UX를 만드는 디테일의 차이 5가지",
      description: "마이크로 인터랙션과 반응형 레이아웃으로 완성도를 높이는 방법",
      url: "https://velog.io",
      imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&auto=format&fit=crop&q=80",
      category: "articles",
      isFeatured: false,
      stats: "조회수 2.8k",
    },
    {
      id: "contact-1",
      title: "1:1 커피챗 & 멘토링 신청",
      description: "이직, 기술 스택 고민, 사이드 프로젝트 아이디어에 대해 편하게 이야기 나눠요.",
      url: "mailto:hello@example.com",
      imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80",
      category: "contact",
      isFeatured: true,
      badge: "Coffee Chat",
    },
  ],
};
