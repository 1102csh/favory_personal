// src/features/community/components/PostListItem/PostListItem.jsx
import PostCard from '../PostCard';
import MagazineCard from '../MagazineCard';
import { POST_TYPES } from '../../constants/postConstants';

/**
 * 게시글 type에 따른 카드 선택자.
 *
 * 매거진 → MagazineCard (큰 가로 이미지 + 큰 제목 + 메타)
 * 그 외   → PostCard (작성자 → 본문 → 이미지 → 액션)
 *
 * 두 카드는 동일한 prop 인터페이스를 가집니다:
 *   - post
 *   - onToggleLike, isLikePending
 *   - onToggleBookmark, isBookmarkPending
 *   - onDelete
 *   - linkToDetail, expandImages
 *
 * 일부 prop은 매거진에서 무시될 수 있음 (예: expandImages).
 */
const PostListItem = (props) => {
  const isMagazine = props.post?.post_type === POST_TYPES.MAGAZINE;
  const Card = isMagazine ? MagazineCard : PostCard;
  return <Card {...props} />;
};

export default PostListItem;