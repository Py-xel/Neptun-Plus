import '@/styles/components/general/addButton.css';

export default function AddButton({ onClick }) {
  return (
    <div>
      <button type="button" className="np-button-add" onClick={onClick}>
        <i className="fa-solid fa-circle-plus" />
      </button>
    </div>
  );
}
