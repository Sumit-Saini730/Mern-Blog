const Spinner = ({
  loading = true,
  size = 40,
  color = "border-blue-600",
}) => {
  if (!loading) return null;

  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400 ${color}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        role="status"
        aria-label="Loading"
      />

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    </div>
  );
};

export default Spinner;
