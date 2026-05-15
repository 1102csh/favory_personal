// src/features/dashboard/pages/FeedManagePage.jsx
import React, { useState } from 'react';
import { Image as ImageIcon, Send, Trash2, MoreHorizontal } from 'lucide-react';

/* ── 가상 데이터: 내가 올린 소식들 ── */
const INITIAL_MY_FEEDS = [
  { id: 1, text: "이번 주말 성수동 플리마켓에 참여합니다! 구경 오세요 🌸", date: "2024-05-01", image: "https://images.unsplash.com/photo-1550005808-4665f884f275?w=400", likes: 12, comments: 3 },
  { id: 2, text: "새로운 여름 도안 작업 중... 곧 공개할게요! 🧵", date: "2024-04-28", image: "https://images.unsplash.com/photo-1612160352273-df818349b6d4?w=400", likes: 45, comments: 8 },
];

export default function FeedManagePage() {
  const [myFeeds, setMyFeeds] = useState(INITIAL_MY_FEEDS);
  const [newPost, setNewPost] = useState("");

  // 소식 삭제 함수
  const handleDelete = (id) => {
    if(window.confirm("이 소식을 삭제하시겠습니까?")) {
      setMyFeeds(myFeeds.filter(f => f.id !== id));
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>소식 관리</h2>
        <p style={{ color: '#9C8B7E' }}>팔로워들에게 작가님의 일상과 새로운 소식을 공유하세요.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* ── 왼쪽: 새 소식 작성 ── */}
        <div className="card card-soft" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>새 소식 작성</h3>
          <textarea 
            placeholder="어떤 새로운 소식이 있나요?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ 
              width: '100%', height: '120px', padding: '15px', borderRadius: '12px', 
              border: '1px solid #E8DCCF', fontSize: '14px', resize: 'none', marginBottom: '15px',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', borderRadius: '10px', border: '1px solid #E8DCCF', background: 'white', fontSize: '13px', cursor: 'pointer' }}>
              <ImageIcon size={18} color="#D4A373" /> 이미지 첨부
            </button>
            <button 
              onClick={() => { alert("소식이 등록되었습니다!"); setNewPost(""); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 25px', borderRadius: '10px', border: 'none', background: '#2C2018', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              <Send size={18} /> 올리기
            </button>
          </div>
        </div>

        {/* ── 오른쪽: 내가 올린 소식 목록 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>작성한 소식 목록</h3>
          {myFeeds.map(feed => (
            <div key={feed.id} className="card card-soft" style={{ padding: '15px', display: 'flex', gap: '15px' }}>
              <img src={feed.image} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} alt="feed" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#9C8B7E' }}>{feed.date}</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Trash2 size={16} color="#E05252" style={{ cursor: 'pointer' }} onClick={() => handleDelete(feed.id)} />
                    <MoreHorizontal size={16} color="#9C8B7E" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#2C2018', marginTop: '5px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {feed.text}
                </p>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#D4A373', fontWeight: 700 }}>
                  ❤️ 응원 {feed.likes}  💬 댓글 {feed.comments}
                </div>
              </div>
            </div>
          ))}
          {myFeeds.length === 0 && <p style={{ textAlign: 'center', color: '#9C8B7E', padding: '40px' }}>작성된 소식이 없습니다.</p>}
        </div>

      </div>
    </div>
  );
}