import { HiPlus } from "react-icons/hi";
import Button from "@/components/Button";

interface Props {
  onClick: () => void;
}

export default function AddTeacherButton({ onClick }: Props) {
  return (
    <div className="flex justify-end mb-6">
      <Button
        leftIcon={<HiPlus />}
        className="bg-[#003366] hover:bg-[#002244] text-white w-48 h-12 justify-start px-4"
        onClick={onClick}
      >
        Nouveau enseignant
      </Button>
    </div>
  );
}