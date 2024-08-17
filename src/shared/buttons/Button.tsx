interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      className={`px-2 font-outfit ${className} ${disabled ? "disabled" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const button = {
  PrimaryButton,
};
