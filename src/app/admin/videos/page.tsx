"use client";

export default function AdminVideosPage() {
  const videos = [
    { title: "Hero Video 1", url: "/videos/hero-1.mp4" },
    { title: "Hero Video 2", url: "/videos/hero-2.mp4" },
    { title: "Hero Video 3", url: "/videos/hero-3.mp4" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-8">Hero Videos</h1>
      <p className="text-white/50 mb-6">Manage homepage background videos. Upload new videos to the public/videos folder.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.url} className="glass rounded-2xl overflow-hidden">
            <video src={video.url} muted loop autoPlay playsInline className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-white/40 text-xs mt-1">{video.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
