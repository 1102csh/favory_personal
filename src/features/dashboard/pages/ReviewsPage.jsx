import React, { useState } from 'react';
import { Star, MessageCircle, CheckCircle2, Search } from 'lucide-react';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/Button';
import styles from './ReviewsPage.module.scss';

// 상용 앱에서는 reviewRepository.getReviews() 로 불러올 데이터입니다.
const MOCK_REVIEWS = [
  { id: 1, user: "민들레님", rating: 5, date: "2026-05-02", product: "라피아 썸머백", content: "작가님 정성이 느껴지는 포장이었어요! 실물이 훨씬 예뻐서 올여름 내내 잘 들고 다닐 것 같아요. 감사합니다. 🥹", reply: null },
  { id: 2, user: "핸드메이드러버", rating: 4, date: "2026-04-30", product: "봄 에디션 머그컵", content: "컵 색감이 너무 따뜻해요. 다만 배송이 조금 늦어서 아쉬웠지만 상품은 대만족입니다!", reply: "소중한 후기 감사합니다! 배송 부분은 다음번에 더 신경 써서 보완하도록 하겠습니다. 즐거운 티타임 되세요!" },
  { id: 3, user: "초보뜨개꾼", rating: 5, date: "2026-04-25", product: "손뜨개 키링 도안", content: "설명이 친절해서 초보인데도 쉽게 완성했어요! 다른 도안도 구매할 예정입니다.", reply: null },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [activeFilter, setActiveFilter] = useState("전체");

  const filteredReviews = reviews.filter(review => {
    if (activeFilter === "답변대기") return !review.reply;
    if (activeFilter === "답변완료") return !!review.reply;
    return true;
  });

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < rating ? "var(--status-gold)" : "none"} 
        color={i < rating ? "var(--status-gold)" : "var(--line-strong)"} 
      />
    ));
  };

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>리뷰 피드백</h2>
          <p className={styles.subtitle}>고객들의 소중한 목소리에 귀를 기울여 보세요.</p>
        </div>
        
        <div className={styles.filterGroup}>
          {["전체", "답변대기", "답변완료"].map(filter => (
            <Button 
              key={filter}
              variant={activeFilter === filter ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </header>

      <div className={styles.reviewList}>
        {filteredReviews.length === 0 ? (
          <Card variant="soft" className={styles.emptyState}>
            <MessageCircle size={40} className={styles.emptyIcon} />
            <p>해당하는 리뷰가 없습니다.</p>
          </Card>
        ) : (
          filteredReviews.map(review => (
            <Card key={review.id} variant="soft" padding="md" className={styles.reviewCard}>
              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>{review.user[0]}</div>
                  <div className={styles.meta}>
                    <div className={styles.nameRow}>
                      <span className={styles.userName}>{review.user}</span>
                      <div className={styles.stars}>{renderStars(review.rating)}</div>
                    </div>
                    <p className={styles.productInfo}>{review.product} • {review.date}</p>
                  </div>
                </div>
                {review.reply ? (
                  <span className={styles.statusComplete}><CheckCircle2 size={14} /> 답변 완료</span>
                ) : (
                  <span className={styles.statusPending}>답변 대기 중</span>
                )}
              </div>

              <p className={styles.reviewContent}>{review.content}</p>

              {review.reply ? (
                <div className={styles.replyBox}>
                  <p className={styles.replyTitle}><MessageCircle size={14} /> 작가님의 답글</p>
                  <p className={styles.replyText}>{review.reply}</p>
                </div>
              ) : (
                <Button variant="outline" fullWidth className={styles.replyBtn}>
                  답글 달기
                </Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}