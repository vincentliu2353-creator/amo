import NextImage, { type ImageProps } from "next/image";
import { preload } from "react-dom";

import { getResponsiveImage } from "@/lib/images/image-sources";

type ResponsiveImageProps = ImageProps & { thumbnail?: boolean };

export default function ResponsiveImage({ thumbnail, ...props }: ResponsiveImageProps) {
  const { src, sizes, width, priority, loading, fetchPriority, placeholder, blurDataURL } = props;
  const image = typeof src === "string"
    ? getResponsiveImage(src, thumbnail)
    : undefined;

  if (!image) return <NextImage {...props} />;

  if (!image.srcSet) {
    return <NextImage {...props} src={image.src} blurDataURL={blurDataURL ?? image.blur} />;
  }

  const imageSizes = sizes ?? (width ? `${width}px` : "100vw");
  if (priority) {
    preload(image.src, {
      as: "image",
      imageSrcSet: image.srcSet,
      imageSizes,
      fetchPriority: fetchPriority ?? "high",
      crossOrigin: props.crossOrigin,
      referrerPolicy: props.referrerPolicy,
    });
  }

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={image.srcSet} sizes={imageSizes} />
      <NextImage
        {...props}
        src={image.src}
        priority={false}
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? fetchPriority ?? "high" : fetchPriority}
        blurDataURL={blurDataURL ?? (placeholder === "blur" ? image.blur : undefined)}
      />
    </picture>
  );
}
