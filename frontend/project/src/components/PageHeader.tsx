export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-6 animate-fade-up">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
          {title}
        </h1>
        {badge}
      </div>
      {subtitle && <p className="mt-1.5 text-gray-500 text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
}
