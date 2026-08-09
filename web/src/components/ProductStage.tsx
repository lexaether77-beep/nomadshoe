import Image from "next/image";

export function ProductStage({
  image,
  alt,
  priority = false,
}: {
  image: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-contain p-6"
      />
    </div>
  );
}
