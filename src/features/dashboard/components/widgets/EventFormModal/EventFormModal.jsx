import React, { useState } from 'react';
import { X, Calendar, Clock, AlignLeft } from 'lucide-react';
import  Button  from '@/shared/ui/Button';
import styles from './EventFormModal.module.scss';

export default function EventFormModal({ isOpen, onClose, onSave, selectedDate }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'work', // work, holiday
    time: '09:00',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      time: formData.time,          // 리포지토리에서 start_at으로 가공됨
      selectedDate: selectedDate    // 리포지토리에서 날짜 조합에 사용됨
    });
    
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>일정 등록 ({selectedDate})</h3>
          <button onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className={styles.typeSelector}>
            <button 
              type="button" 
              className={formData.category === 'work' ? styles.activeWork : ''}
              onClick={() => setFormData({...formData, category: 'work'})}
            >작업 일정</button>
            <button 
              type="button" 
              className={formData.category === 'holiday' ? styles.activeHoliday : ''}
              onClick={() => setFormData({...formData, category: 'holiday'})}
            >공방 휴무</button>
          </div>

          <div className={styles.inputGroup}>
            <label><AlignLeft size={16}/> 제목</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="어떤 일정인가요?" />
          </div>

          <div className={styles.inputGroup}>
            <label><Clock size={16}/> 시간</label>
            <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
          </div>

          <footer className={styles.footer}>
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit" variant="primary">일정 저장</Button>
          </footer>
        </form>
      </div>
    </div>
  );
}