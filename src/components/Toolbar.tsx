interface Props {
  onExportJson: () => void;
  onToggleRawXml: () => void;
  onToggleStats: () => void;
  showStats: boolean;
  showRawXml: boolean;
}

export default function Toolbar({
  onExportJson,
  onToggleRawXml,
  onToggleStats,
  showStats,
  showRawXml,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <ToolbarButton
        label="STATS"
        isActive={showStats}
        onClick={onToggleStats}
        icon="◆"
      />
      <ToolbarButton
        label="RAW XML"
        isActive={showRawXml}
        onClick={onToggleRawXml}
        icon="⟨/⟩"
        activeColor="#39FF14"
      />
      <ToolbarButton
        label="EXPORT JSON"
        isActive={false}
        onClick={onExportJson}
        icon="↓"
        activeColor="#FF6B00"
      />
    </div>
  );
}

function ToolbarButton({
  label,
  isActive,
  onClick,
  icon,
  activeColor = '#FFE500',
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: string;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-[10px] font-extrabold tracking-widest border-2 transition-all cursor-pointer
        ${isActive
          ? 'text-black border-white'
          : 'text-[#666] border-[#333] hover:border-[#FFE500] hover:text-white bg-[#111]'
        }
      `}
      style={isActive ? { backgroundColor: activeColor, borderColor: activeColor } : undefined}
    >
      {icon} {label}
    </button>
  );
}
