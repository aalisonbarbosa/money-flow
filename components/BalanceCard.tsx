interface BalanceCardProps {
  bgColor: string;
  title: string;
  value: number;
}

export const BalanceCard = ({ bgColor, title, value }: BalanceCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg p-4  min-w-40 font-semibold max-sm:flex justify-between items-center shadow-md`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm md:text-xl mt-2">
        {value.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
};
