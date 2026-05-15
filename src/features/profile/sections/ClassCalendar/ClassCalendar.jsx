// src/features/profile/sections/ClassCalendar/ClassCalendar.jsx
import { useState } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 클래스 일정 캘린더.
 *
 * @param {object} props
 * @param {Array} props.classes  - [{ year, month, day, title, date, time, spots, status, price }, ...]
 * @param {boolean} props.isMobile
 */
export default function ClassCalendar({ classes, isMobile }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(
    classes.length > 0 ? classes[0].year : today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    classes.length > 0 ? classes[0].month : today.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(null);

  // 이번 달의 클래스 lookup: { day: classObj }
  const classByDay = {};
  classes.forEach((cls) => {
    if (cls.year === currentYear && cls.month === currentMonth) {
      classByDay[cls.day] = cls;
    }
  });

  const selectedClass = selectedDay ? classByDay[selectedDay] : null;

  // 달 그리드 계산
  const firstDow = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday =
    today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;

  function prevMonth() {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  function handleCellClick(day) {
    if (!day) return;
    setSelectedDay(classByDay[day] ? (selectedDay === day ? null : day) : null);
  }

  return (
    <div className="class-calendar">
      {/* 월 네비게이션 */}
      <div className="class-calendar__nav">
        <button
          className="class-calendar__nav-btn"
          onClick={prevMonth}
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="class-calendar__nav-title">
          {currentYear}년 {currentMonth}월
        </span>
        <button
          className="class-calendar__nav-btn"
          onClick={nextMonth}
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="class-calendar__weekdays">
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            className="class-calendar__weekday"
            style={{
              color: i === 0 ? '#e06060' : i === 6 ? '#5b8def' : undefined,
            }}
          >
            {w}
          </span>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="class-calendar__grid">
        {cells.map((day, idx) => {
          const dow = idx % 7;
          const hasClass = day && classByDay[day];
          const isSelected = day && selectedDay === day;
          const isTodayCell = isToday && day === today.getDate();

          let cellClass = 'class-calendar__cell';
          if (!day) cellClass += ' class-calendar__cell--empty';
          if (hasClass) cellClass += ' class-calendar__cell--has-class';
          if (isSelected) cellClass += ' class-calendar__cell--selected';
          if (isTodayCell && !isSelected) cellClass += ' class-calendar__cell--today';

          const numColor = !day
            ? undefined
            : isSelected
            ? '#fff'
            : dow === 0
            ? '#e06060'
            : dow === 6
            ? '#5b8def'
            : undefined;

          return (
            <div key={idx} className={cellClass} onClick={() => handleCellClick(day)}>
              {day && (
                <>
                  <span className="class-calendar__day-num" style={{ color: numColor }}>
                    {day}
                  </span>
                  {hasClass && !isSelected && <span className="class-calendar__dot" />}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 클래스 상세 카드 */}
      {selectedClass && (
        <div className="class-calendar__detail">
          <div
            className="lift"
            style={{
              background:
                selectedClass.status === '신청중' ? 'var(--white)' : 'var(--bg-soft)',
              borderRadius: 20,
              padding: isMobile ? '16px 16px' : '18px 20px',
              border: '1px solid var(--line)',
              boxShadow:
                selectedClass.status === '신청중' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
              opacity: selectedClass.status === '마감' ? 0.62 : 1,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {selectedClass.title}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    background:
                      selectedClass.status === '신청중'
                        ? 'var(--bg-soft)'
                        : 'var(--bg-muted)',
                    color:
                      selectedClass.status === '신청중'
                        ? 'var(--brand-dark)'
                        : 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontWeight: 700,
                    border: '1px solid var(--line)',
                  }}
                >
                  {selectedClass.status}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  lineHeight: 1.72,
                  fontWeight: 500,
                }}
              >
                {selectedClass.date} · {selectedClass.time}
                <br />
                <span
                  style={{
                    color:
                      selectedClass.status === '신청중'
                        ? 'var(--brand-dark)'
                        : 'var(--text-light)',
                    fontWeight: 700,
                  }}
                >
                  잔여 {selectedClass.spots}
                </span>
              </p>
            </div>

            <div
              style={{
                textAlign: 'right',
                flexShrink: 0,
                minWidth: isMobile ? 'auto' : 110,
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: selectedClass.status === '신청중' ? 9 : 0,
                  letterSpacing: '-0.03em',
                }}
              >
                {selectedClass.price.toLocaleString()}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    marginLeft: 2,
                  }}
                >
                  원
                </span>
              </p>
              {selectedClass.status === '신청중' && (
                <button
                  className="press"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '7px 16px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 5px 14px rgba(212,163,115,0.24)',
                  }}
                >
                  신청하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 이번 달 클래스 없을 때 */}
      {Object.keys(classByDay).length === 0 && (
        <p className="class-calendar__empty">이번 달 예정된 클래스가 없어요</p>
      )}
    </div>
  );
}