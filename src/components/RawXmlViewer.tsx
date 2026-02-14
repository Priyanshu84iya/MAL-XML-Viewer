interface Props {
  rawXml: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function RawXmlViewer({ rawXml, isOpen, onToggle }: Props) {
  if (!isOpen) return null;

  return (
    <div className="border-3 border-[#39FF14] bg-[#0A0A0A] slide-in-up">
      <div className="flex items-center justify-between p-4 border-b-2 border-[#39FF14]">
        <h3 className="text-xs font-extrabold text-[#39FF14] tracking-widest">
          ▶ RAW XML DATA
        </h3>
        <button
          onClick={onToggle}
          className="px-3 py-1 bg-[#39FF14] text-black text-[10px] font-extrabold tracking-widest hover:bg-white transition-all cursor-pointer"
        >
          CLOSE
        </button>
      </div>
      <div className="xml-viewer">{rawXml}</div>
    </div>
  );
}
