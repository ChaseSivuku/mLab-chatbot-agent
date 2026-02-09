interface CategoryButtonProps {
  label: string;
  onClick: () => void;
}

const CategoryButton = ({ label, onClick }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-5 bg-white border cursor-pointer border-[#A6CE39] rounded-xl text-blackfont-medium hover:border-[#A6CE39] hover:bg-[#A6CE39] hover:shadow-sm transition-all text-center"
    >
     
            {label}
          
    </button>
  );
};

export default CategoryButton;
