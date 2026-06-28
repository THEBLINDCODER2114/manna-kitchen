type Props = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
      <div>
        <h1 className="text-4xl font-black text-white">
          {title}
        </h1>

        <p className="text-gray-400 mt-2">
          {subtitle}
        </p>
      </div>

      {action && action}
    </div>
  );
}