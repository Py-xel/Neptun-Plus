import '@/styles/components/Shortcut.css';

export default function Shortcut() {
  return (
    <div className="shortcutContainer">
      <div className="shortcutCard">
        <i class="fa-solid fa-bars" />
        <div className="shortcutIcon"></div>
        <div className="shortcutField nameField">
          <input type="text" className="shortcutName" placeholder="Name" />
        </div>
        <div className="shortcutField linkField">
          <input type="text" className="shortcutLink" placeholder="https://www.example.com/" />
        </div>
      </div>
    </div>
  );
}
