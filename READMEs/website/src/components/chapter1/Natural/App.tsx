import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay, Pagination, EffectCards } from 'swiper/modules';
import './index.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const slides = [
  {
    id: 'eggs',
    title: 'Oeufs',
    description: 'Les femelles pondent entre 700 et 900 œufs. Ils éclosent 2 à 3 jours après la ponte.',
    image: 'https://cdn.prod.website-files.com/653a76422b6123098f5a86a1/665731a00421a889315d13e8_Bsf_Eggs.png'
  },
  {
    id: 'larvae',
    title: 'Larves',
    description: 'Le stade larvaire dure 17 à 19 jours et comprend 4 stades (P0 à P3).',
    image: 'https://cdn.prod.website-files.com/653a76422b6123098f5a86a1/6634fa66655554e281156a45_Design%20sans%20titre%20(49).png'
  },
  {
    id: 'prepupae',
    title: 'Pré-Pupe',
    description: 'Le stade pré-pupaire dure entre 6 et 8 jours. La pré-pupe devient marron et cherche un endroit sec pour se transformer.',
    image: 'https://cdn.prod.website-files.com/653a76422b6123098f5a86a1/6634fa78782f8c89d29c6220_Design%20sans%20titre%20(50).png'
  },
  {
    id: 'pupae',
    title: 'Pupe',
    description: "Le stade pupaire dure entre 11 et 13 jours. L'insecte se métamorphose à l'intérieur de son cocon et émerge sous forme de mouche adulte.",
    image: 'https://cdn.prod.website-files.com/653a76422b6123098f5a86a1/6634fa8e9909fd6d7a0efba5_Design%20sans%20titre%20(51).png'
  },
  {
    id: 'fly',
    title: 'Mouche',
    description: "Les adultes vivent entre 7 et 12 jours. Ils s'abreuvent, se reproduisent et pondent.",
    image: 'https://cdn.prod.website-files.com/653a76422b6123098f5a86a1/6634fb2e206d409c97175c4b_Design%20sans%20titre%20(52).png'
  }
];

function App() {
  useEffect(() => {
    // Assurez-vous que les styles sont correctement appliqués après le montage du composant
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(link);
    
    // Ajout d'une classe au body pour le style global
    document.body.classList.add('bsf-lifecycle-page');

    return () => {
      document.head.removeChild(link);
      document.body.classList.remove('bsf-lifecycle-page');
    };
  }, []);

  return (
    <div className="py-8 lifecycle-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="section2-bsf_life">
          <div className="wheel-slider relative">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              initialSlide={2}
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 500,
                modifier: 1.8,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-nav-btn.next',
                prevEl: '.swiper-nav-btn.prev',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              modules={[EffectCoverflow, Navigation, Autoplay, Pagination, EffectCards]}
              className="swiper-container"
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                }
              }}
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id} className="swiper-slide">
                  <div className="slide-content cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-2xl transform transition-transform duration-300 hover:scale-105">
                      <div className="slide-title absolute top-0 left-0 w-full text-center py-4 z-10">
                        <h2 className="text-2xl font-bold text-primary">
                          {slide.title}
                        </h2>
                      </div>
                      <div className="image-container flex items-center justify-center h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-4/5 h-4/5 object-contain p-4"
                        />
                      </div>
                      <div className="slide-description absolute bottom-0 left-0 w-full text-center py-4 z-10">
                        <p className="text-gray-700 text-sm max-w-xs mx-auto px-4 font-medium">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="swiper-navigation absolute w-full top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none px-4">
              <button className="swiper-nav-btn prev pointer-events-auto bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button className="swiper-nav-btn next pointer-events-auto bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            <div className="swiper-pagination mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;