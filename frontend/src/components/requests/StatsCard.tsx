interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  valueColor: string
  iconColor: string
}

export default function StatsCard({
  label,
  value,
  icon,
  valueColor,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="bg-[#F4F6F8] rounded-2xl p-6 flex items-center justify-between transition hover:scale-[1.02]">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h2 className={`text-3xl font-bold ${valueColor}`}>
          {value}
        </h2>
      </div>
      <div className={iconColor}>
        {icon}
      </div>
    </div>
  )
}