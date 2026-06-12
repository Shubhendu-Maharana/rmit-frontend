const SkeletonTable = ({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) => {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: columns }, (_, j) => (
            <td
              key={j}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <div className="h-4 w-10 bg-gray-200 rounded-full animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default SkeletonTable;
