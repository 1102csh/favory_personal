// src/features/community/components/CommunitySidebar/CommunitySidebar.jsx
import WelcomeWidget from './widgets/WelcomeWidget';
import PopularTagsWidget from './widgets/PopularTagsWidget';
import FeaturedArtistsWidget from './widgets/FeaturedArtistsWidget';
import styles from './CommunitySidebar.module.scss';

/**
 * 커뮤니티 우측 사이드바.
 *
 * 데스크톱에서만 노출 (FeedPage가 모바일/태블릿에서 hidden 처리).
 *
 * 추후 추가 위젯:
 * - <FeaturedArtistsWidget />   (추천 작가)
 * - <PopularTagsWidget />        (인기 태그)
 * - <ActivityWidget />           (내 활동 요약)
 */
const CommunitySidebar = () => {
  return (
    <aside className={styles.sidebar} aria-label="커뮤니티 사이드바">
      <WelcomeWidget />
      <PopularTagsWidget />
      <FeaturedArtistsWidget />
    </aside>
  );
};

export default CommunitySidebar;