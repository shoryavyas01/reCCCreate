/* Every image sits on a green panel with 16px padding and 12px corners.
   With no src it shows a labelled placeholder, so missing photos are obvious. */
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
    <figure className="rounded-xl bg-green p-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className={`${ratio} w-full rounded-lg object-cover`} />
      ) : (
        <div
          role="img"
          aria-label={`Photo to come: ${alt}`}
          className={`${ratio} flex w-full items-center justify-center rounded-lg border-2 border-dashed border-white/60 p-4 text-center text-[15px] text-white`}
        >
          Photo to come: {alt}
        </div>
      )}
      {credit && <figcaption className="mt-2 text-[13px] text-white">{credit}</figcaption>}
    </figure>
  );
}
