// src/features/profile/sections/CollectionSection/CollectionSection.jsx
import SecHead from '../../components/SecHead';

import img1 from '@/assets/result2.jpg';
import img2 from '@/assets/class2.jpg';
import img3 from '@/assets/making.jpg';
import img4 from '@/assets/flowerpot.jpg';

/**
 * 컬렉션 섹션 ('홈' 탭에서만 노출).
 *
 * 추후 props로 collections 배열을 받도록 변경 예정.
 * 현재는 mock 데이터를 컴포넌트 내부에 보관.
 */
export default function CollectionSection({ isMobile }) {
  const collections = [
    {
      title: '2024 식기 세트',
      desc: '컵 · 그릇 · 식기 도구 세트',
      chips: [{ label: '상품', count: 7 }, { label: '도안', count: 5 }],
      img: img1,
    },
    {
      title: '도자기 입문 시리즈',
      desc: '초보자 추천 클래스',
      chips: [{ label: '클래스', count: 8 }, { label: '도안', count: 4 }],
      img: img2,
    },
    {
      title: '도안 모음집',
      desc: 'PDF 패턴 컬렉션',
      chips: [{ label: '도안', count: 24 }],
      img: img3,
    },
    {
      title: '베스트 소품',
      desc: '인기 제품 큐레이션',
      chips: [
        { label: '상품', count: 12 },
        { label: '도안', count: 4 },
        { label: '클래스', count: 2 },
      ],
      img: img4,
    },
  ];

  return (
    <section className="collection-section">
      <SecHead en="Curated COLLECTION" ko="컬렉션" onMore={() => {}} />

      <div className="collection-section__scroll">
        <div className="collection-section__track">
          {collections.map((item, index) => (
            <article key={index} className="collection-card-v2">
              <div className="collection-card-v2__image-wrap">
                <img
                  src={item.img}
                  alt={item.title}
                  className="collection-card-v2__image"
                />
              </div>
              <div className="collection-card-v2__overlay" />

              <div className="collection-card-v2__body">
                <h3 className="collection-card-v2__title">{item.title}</h3>
                <p className="collection-card-v2__desc">{item.desc}</p>
                <div className="collection-card-v2__chips">
                  {item.chips
                    .filter((c) => c.count > 0)
                    .map((c) => (
                      <span key={c.label} className="collection-chip">
                        {c.label} {c.count}개
                      </span>
                    ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}