type ButtonProps = {
  text: string;
  disabled?: boolean;
};

export default function Button({
  text,
  disabled = false,
}: ButtonProps) {
  return (
    <button 
      disabled={disabled}
      className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
      {text}
    </button>
  );
}