import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import bannerOne from "/images/Hero Slider/banner-one.jpg";
import bannerTwo from "/images/Hero Slider/banner-two.jpg";
import bannerThree from "/images/Hero Slider/banner-three.avif";
import bannerFour from "/images/Hero Slider/banner-four.avif";
import bannerFive from "/images/Hero Slider/banner-five.avif";

export default function CenterModeCarousel({
  autoplay = true,
  interval = 3500,
}) {
  const items = [
    bannerOne,
    bannerTwo,
    bannerThree,
    bannerFour,
    bannerFive,
  ];

  const n = items.length;
  const [current, setCurrent] = useState(0);

  const timerRef = useRef(null);

  const next = () => setCurrent((c) => (c + 1) % n);
  const prev = () => setCurrent((c) => (c - 1 + n) % n);

  const start = useCallback(() => {
    if (!autoplay) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % 5000);
    }, interval);
  }, [autoplay, interval, n]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // next/prev helpers (reset timer to keep UX snappy)
  const goNext = useCallback(() => {
    stop();
    setCurrent((c) => (c + 1) % n);
    start();
  }, [n, start, stop]);

  const goPrev = useCallback(() => {
    stop();
    setCurrent((c) => (c - 1 + n) % n);
    start();
  }, [n, start, stop]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, n]);

  // Render exactly 5 slides: center ±1 ±2 (virtualized)
  const visible = useMemo(() => {
    const order = [-2, -1, 0, 1, 2].map((k) => (current + k + n) % n);
    return order.map((realIdx, j) => {
      const rel = j - 2; // [-2,-1,0,1,2]
      let cls = "far";
      if (rel === -2) cls = "lt2";
      else if (rel === -1) cls = "lt1";
      else if (rel === 0) cls = "slick-center";
      else if (rel === 1) cls = "gt1";
      else if (rel === 2) cls = "gt2";
      return { id: realIdx, src: items[realIdx], cls };
    });
  }, [current, items, n]);

  // swipe / drag
  const startX = useRef(0);
  const dx = useRef(0);
  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dx.current = 0;
  };
  const onPointerMove = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    if (x) dx.current = x - startX.current;
  };
  const onPointerUp = () => {
    if (Math.abs(dx.current) > 50) dx.current < 0 ? goNext() : goPrev();
    dx.current = 0;
  };

  return (
    <>
      <section className="hero_slider py-10">
        <div
          className="cmc-wrap custom-container mx-auto px-4"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          <button className="nav prev" onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="track">
            {visible.map(({ id, src, cls }) => (
              <div className={`slide ${cls}`} key={id}>
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="w-full min-h-[470px] object-cover rounded-[50px]"
                />
              </div>
            ))}
          </div>

          <button className="nav next" onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}

