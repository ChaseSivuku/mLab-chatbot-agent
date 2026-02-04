
interface CategoryButtonProps {
  label: string;
  onClick: () => void;
}

const CategoryButton = ({ label, onClick }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="py-3 px-6 bg-white border border-zinc-200 rounded-xl text-blackfont-medium hover:border-[#a6ce39] hover:bg-[#a6ce39] hover:shadow-sm transition-all text-center"
    >
      {label}
    </button>
  );
};

export default CategoryButton;