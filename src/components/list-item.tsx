interface ListItemProps {
  title: string;
  value: any;
}

export default function ListItem({ title, value }: ListItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2 last:border-none">
      <span className="font-medium text-gray-700">{title}</span>
      <span className="text-gray-500">{value}</span>
    </div>
  );
}
