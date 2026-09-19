import '@/styles/components/general/card.css';

export default function Card() {
  return (
    <div className="np-card-container">
      <div className="np-card-top"></div>
      <div className="np-card-bottom">
        <div className="np-card-action-container">
          <button type="button" className="np-card-action-remove-container">
            <i className="fa-solid fa-remove np-card-action-remove" />
          </button>
          <button type="button" className="np-card-action-save-container">
            <i className="fa-solid fa-floppy-disk np-card-action-save" />
          </button>
        </div>
      </div>
    </div>
  );
}
