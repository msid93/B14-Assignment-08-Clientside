"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowUpRight, LocateFixed } from "lucide-react";
import "swiper/css";

const features = [
  {
    lead: "Space to",
    emphasis: "make it.",
    image: "portrait-campaign",
    title: "Terracotta Corner",
    city: "Uttara, Dhaka",
    medium: "Photography",
    caption: "A fashion shoot on the rust-coloured sweep at Terracotta Corner.",
    description:
      "Independent spaces for photography, film, sound and art. Find your next set in Bangladesh.",
    cta: "Explore studios",
    href: "/studios",
  },
  {
    lead: "Set the",
    emphasis: "scene.",
    image: "film",
    title: "Framehouse Stage",
    city: "Nasirabad, Chattogram",
    medium: "Film production",
    caption: "A director’s chair and a blue cyclorama inside Framehouse Stage.",
    description: "Scout the floor, the grid and the blackout before your crew arrives.",
    cta: "Explore sound stages",
    href: "/studios?category=Film%20Stage",
  },
  {
    lead: "Room to",
    emphasis: "be heard.",
    image: "podcast",
    title: "The Listening Room",
    city: "Banani, Dhaka",
    medium: "Audio production",
    caption: "Two microphones in the walnut-lined Listening Room.",
    description:
      "Find a quiet room with the microphones, treatment and space your conversation needs.",
    cta: "Explore podcast rooms",
    href: "/studios?category=Podcast%20Lounge",
  },
];

export default function Hero() {
  const [swiper, setSwiper] = useState(null);
  const [index, setIndex] = useState(0);
  const current = features[index];
  return (
    <section className="campaign" aria-label="Studio highlights">
      <Swiper
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true, onlyInViewport: true }}
        rewind
        speed={500}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndex(s.realIndex)}
      >
        {features.map((s, i) => (
          <SwiperSlide key={s.image}>
            <article className={"campaign-frame frame-" + i} inert={i !== index}>
              <img
                className="campaign-photo"
                src={"/photos/" + s.image + ".webp"}
                alt={s.caption}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              <div className="campaign-shade" />
              <div className="shell campaign-inner">
                <div className="campaign-story">
                  <p className="campaign-kicker">
                    <span aria-hidden="true" /> The studio index <i /> Bangladesh
                  </p>
                  <h1>
                    {s.lead}
                    <br />
                    <em>{s.emphasis}</em>
                  </h1>
                  <p className="campaign-summary">{s.description}</p>
                  <div className="campaign-actions">
                    <Link className="btn on-photo" href={s.href}>
                      {s.cta}
                      <ArrowUpRight size={17} />
                    </Link>
                    <Link className="campaign-host" href="/add-studio">
                      Host your space
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="campaign-bottom">
        <div className="shell campaign-rail">
          <div className="reel-controls">
            <button aria-label="Previous slide" onClick={() => swiper?.slidePrev()}>
              <ArrowLeft size={17} />
            </button>
            <button aria-label="Next slide" onClick={() => swiper?.slideNext()}>
              <ArrowRight size={17} />
            </button>
            <span className="reel-count" aria-live="polite">
              0{index + 1} <i>/</i> 03
            </span>
            <span className="reel-ticks" aria-hidden="true">
              {features.map((s, i) => (
                <i className={i === index ? "current" : ""} key={s.image} />
              ))}
            </span>
          </div>
          <div className="location-stamp">
            <LocateFixed size={20} />
            <div>
              <small>On location · {current.medium}</small>
              <b>
                {current.title} <span>/ {current.city}</span>
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
