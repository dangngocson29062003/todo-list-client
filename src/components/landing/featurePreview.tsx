interface FeaturePreview {
  image: string;
  bg?: string;
}
export function FeaturePreview({
  image,
  bg = "bg-blue-100 dark:bg-blue-500",
}: FeaturePreview) {
  return (
    <div className={`w-full h-full relative ${bg}`}>
      <div className="absolute w-[1000px] top-10 left-10 hidden xl:block overflow-visible">
        <img
          src={image}
          alt="Feature Preview"
          className="relative w-[1000px] rounded-2xl rounded-r-none"
        />
      </div>
    </div>
  );
}
