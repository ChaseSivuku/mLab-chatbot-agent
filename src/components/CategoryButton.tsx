interface CategoryButtonProps {
  label: string;
  onClick: () => void;
}

const CategoryButton = ({ label, onClick }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 sm:px-4 md:px-5 bg-white border cursor-pointer border-[#A6CE39] rounded-xl text-black font-medium hover:border-[#A6CE39] hover:bg-[#A6CE39] hover:shadow-sm transition-all text-center text-xs sm:text-sm md:text-base"
    >
      {label}
    </button>
  );
};

export default CategoryButton;
