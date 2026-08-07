import '@/styles/components/AddButton.css';

export default function AddButton({ onClick }) {
  return (
    <div>
      <button type="button" className="addButton" onClick={onClick}>
        <i className="fa-solid fa-circle-plus" />
      </button>
    </div>
  );
}
