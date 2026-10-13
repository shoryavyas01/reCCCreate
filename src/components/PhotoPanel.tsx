export default function PhotoPanel({
  src,
  alt,
  credit,
  ratio = "aspect-[4/3]",
}: {
  src?: string | null;
  alt: string;
  credit?: string;
  ratio?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/50">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className={`${ratio} w-full object-cover`} />
      ) : (
        <div role="img" aria-label={`Photo to come: ${alt}`} className={`${ratio} relative flex w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_68%_35%,#f5dfbe_0,transparent_23%),linear-gradient(145deg,#f4eee3,#e7eee6)] p-5 text-center text-sm text-[#64746a]`}>
          <span className="relative z-10 rounded-full border border-[#21483b]/15 bg-white/70 px-4 py-2 backdrop-blur-sm">A photo of {alt} will be added here</span>
          <span className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-[#21483b]/10" aria-hidden="true" />
          <span className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full border border-[#21483b]/10" aria-hidden="true" />
        </div>
      )}
      {credit && <figcaption className="px-3 py-2 text-xs text-[#657169]">{credit}</figcaption>}
    </figure>
  );
}
