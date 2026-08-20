 "use client";

import { useEffect, useMemo, useState } from "react";

type Video = {
  name: string;
  link: string;
  tag: string[];
  star: number;
};

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const idx = parts.findIndex((x) => x === "embed" || x === "shorts");
    return idx >= 0 ? parts[idx + 1] : "";
  } catch {
    return "";
  }
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(Math.max(0, Math.min(5, value)))}
      <span className="empty">{"★".repeat(5 - Math.max(0, Math.min(5, value)))}</span>
    </span>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState<Video | null>(null);
  const [featured, setFeatured] = useState<Video | null>(null);
    const [cacheKey] = useState(() => Date.now());
  useEffect(() => {
    fetch("/config.json")
      .then((r) => r.json())
      .then((data: Video[]) => {
        setVideos(data);
        if (data.length) setFeatured(data[0]);
      })
      .catch(() => setVideos([]));
  }, []);

  const tags = useMemo(
    () => ["ALL", ...Array.from(new Set(videos.flatMap((v) => v.tag || []))).sort()],
    [videos]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesQuery =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.tag.some((t) => t.toLowerCase().includes(q));
      const matchesTag = tag === "ALL" || v.tag.includes(tag);
      const matchesRating = rating === 0 || v.star === rating;
      return matchesQuery && matchesTag && matchesRating;
    });
  }, [videos, query, tag, rating]);

  return (
    <main>
<nav className="nav">
  <div className="logo">
    VIIZME
    <small>- PRIVATE VIDEO ARCHIVE</small>
  </div>
</nav>
      <section id="videos" className="archive">
        <div className="section-head">
          <div>
            <h2>Browse videos</h2>
          </div>
          <div className="count">{filtered.length} VIDEOS</div>
        </div>

        <div className="controls">

          <div className="ratings">
            {[0, 5, 4, 3, 2, 1].map((r) => (
              <button key={r} className={rating === r ? "active" : ""} onClick={() => setRating(r)}>
                {r === 0 ? "ALL ★" : `${r} ★`}
              </button>
            ))}
          </div>
        </div>

        <div className="tags">
          {tags.map((t) => (
            <button key={t} className={tag === t ? "tag active" : "tag"} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="grid">
            {filtered.map((v) => {
              const id = getYouTubeId(v.link);
              return (
                <article className="card" key={`${v.name}-${v.link}`} onClick={() => setSelected(v)}>
                  <div className="thumb">
                    <img
                      src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg?t=${cacheKey}`}
                      alt=""
                      loading="lazy"
                    />
                    <div className="card-play">▶</div>
                    <div className="quality">YOUTUBE</div>
                  </div>
                  <div className="card-body">
                    <h3>{v.name}</h3>
                    <Stars value={v.star} />
                    <div className="mini-tags">
                      {v.tag.map((t) => <span key={t}>#{t}</span>)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty">No videos found.</div>
        )}
      </section>

      <footer id="about">
        <div className="logo">VII<span>Z</span>ME</div>
        <span>VIDEO ARCHIVE</span>
      </footer>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="player-wrap" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <div className="player">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(selected.link)}?autoplay=1&rel=0&hl=en`}
                title={selected.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="player-info">
              <div>
                <h2>{selected.name}</h2>
                <div className="mini-tags">{selected.tag.map((t) => <span key={t}>#{t}</span>)}</div>
              </div>
              <Stars value={selected.star} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}