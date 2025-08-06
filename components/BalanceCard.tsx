interface BalanceCardProps {
  bgColor: string;
  title: string;
  value: number;
}

export const BalanceCard = ({ bgColor, title, value }: BalanceCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md w-56 font-semibold`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl mt-2">R$ {value}</p>
    </div>
  );
};
