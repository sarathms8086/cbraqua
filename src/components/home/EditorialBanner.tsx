import { Link } from "react-router-dom";

interface EditorialBannerProps {
  image: string;
  title?: string;
  link?: string;
  aspectRatio?: string;
}

const EditorialBanner = ({
  image,
  title,
  link,
  aspectRatio = "aspect-[16/7]",
}: EditorialBannerProps) => {
  const content = (
    <div className={`relative w-full ${aspectRatio} overflow-hidden group`}>
      <img
        src={image}
        alt={title || "Editorial"}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {title && (
        <>
          <div className="absolute inset-0 bg-foreground/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-heading tracking-tight text-background text-center">
              {title}
            </h2>
          </div>
        </>
      )}
    </div>
  );

  if (link) {
    return <Link to={link} className="block">{content}</Link>;
  }

  return <section>{content}</section>;
};

export default EditorialBanner;
