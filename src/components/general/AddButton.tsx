import '@/styles/components/general/addButton.css';

type AddButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <div>
      <button type="button" className="np-button-add" onClick={onClick}>
        <i className="fa-solid fa-circle-plus" />
      </button>
    </div>
  );
}
