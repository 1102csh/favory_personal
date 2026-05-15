import React, { useState } from 'react';
import { Users, MessageCircle, Search, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import styles from './CustomersPage.module.scss';

const MOCK_FANS = [
  { id: 1, name: '김민지', email: 'minji@example.com', followDate: '2026-05-10', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: '이수진', email: 'sujin_lee@example.com', followDate: '2026-05-11', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: '박지훈', email: 'hoon_p@example.com', followDate: '2026-05-12', image: 'https://i.pravatar.cc/150?u=3' },
];

const MOCK_INQUIRIES = [
  {
    id: 101,
    customerName: '김민지',
    title: '원데이 클래스 인원 문의',
    content: '안녕하세요 작가님! 혹시 이번 주말 원데이 클래스 3명이서 같이 들을 수 있을까요? 자리가 있는지 궁금합니다.',
    date: '2026-05-12',
    status: '답변대기',
    answer: null
  },
  {
    id: 102,
    customerName: '최은영',
    title: '주문제작 기간 문의',
    content: '가죽 지갑 주문제작을 맡기고 싶은데, 보통 며칠 정도 걸리나요? 선물용이라서요!',
    date: '2026-05-10',
    status: '답변완료',
    answer: '안녕하세요 은영님! 주문제작은 결제일로부터 주말 제외 7~10일 정도 소요됩니다. 여유 있게 주문해 주시면 예쁘게 만들어 드릴게요! 😊'
  },
];

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('fans');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredFans = MOCK_FANS.filter(fan => fan.name.includes(searchQuery));

  const handleSubmitReply = (e, inquiryId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setInquiries(inquiries.map(inq =>
      inq.id === inquiryId
        ? { ...inq, status: '답변완료', answer: replyText }
        : inq
    ));
    setReplyText('');
    alert('답변이 성공적으로 등록되었습니다!');
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2>고객 관리</h2>
        <p>나를 팔로우한 팬들과 1:1 문의 내역을 관리할 수 있습니다.</p>
      </header>

      <div className={styles.tabMenu}>
        <button
          onClick={() => setActiveTab('fans')}
          className={activeTab === 'fans' ? styles.tabBtnActive : styles.tabBtn}
        >
          <Users size={18} /> 나의 팬 ({MOCK_FANS.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={activeTab === 'inquiries' ? styles.tabBtnActive : styles.tabBtn}
        >
          <MessageCircle size={18} /> 1:1 고객 문의 ({inquiries.filter(i => i.status === '답변대기').length}건 대기중)
        </button>
      </div>

      {activeTab === 'fans' && (
        <div className="fade-in">
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="고객 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.fanGrid}>
            {filteredFans.length === 0 ? (
              <div className={styles.emptyState}>검색 결과가 없습니다.</div>
            ) : (
              filteredFans.map(fan => (
                <div key={fan.id} className={styles.fanCard}>
                  <img src={fan.image} alt={fan.name} />
                  <div>
                    <h4>{fan.name}</h4>
                    <p className={styles.email}>{fan.email}</p>
                    <p className={styles.date}>팔로우 날짜: {fan.followDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className={`fade-in ${styles.inquiryList}`}>
          {inquiries.length === 0 ? (
            <div className={styles.emptyState}>
              <MessageCircle size={48} color="#eee" style={{ margin: '0 auto 16px' }} />
              <p>아직 접수된 고객 문의가 없습니다.</p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div key={inq.id} className={styles.inquiryCard}>
                <div
                  onClick={() => {
                    setExpandedId(expandedId === inq.id ? null : inq.id);
                    setReplyText('');
                  }}
                  className={expandedId === inq.id ? styles.inquiryHeaderActive : styles.inquiryHeader}
                >
                  <div className={styles.inquiryInfo}>
                    <div className={styles.inquiryMeta}>
                      <span className={inq.status === '답변완료' ? styles.statusDone : styles.statusWait}>
                        {inq.status}
                      </span>
                      <span className={styles.customerName}>{inq.customerName} 고객님</span>
                      <span className={styles.date}>· {inq.date}</span>
                    </div>
                    <h4 className={styles.inquiryTitle}>{inq.title}</h4>
                  </div>
                  {expandedId === inq.id ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
                </div>

                {expandedId === inq.id && (
                  <div className={styles.inquiryBody}>
                    <div className={styles.question}>
                      <p className={styles.qMark}>Q. 문의 내용</p>
                      <p className={styles.qText}>{inq.content}</p>
                    </div>

                    {inq.status === '답변완료' ? (
                      <div className={styles.answerDone}>
                        <p className={styles.aMark}>
                          <CheckCircle size={14} color="#059669" /> A. 작가님 답변
                        </p>
                        <p className={styles.aText}>{inq.answer}</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSubmitReply(e, inq.id)} className={styles.replyForm}>
                        <label>답변 작성하기</label>
                        <textarea
                          rows="4"
                          placeholder="고객님께 남길 답변을 친절하게 작성해주세요."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className={styles.submitBtn}
                        >
                          <Send size={16} /> 답변 등록하기
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}