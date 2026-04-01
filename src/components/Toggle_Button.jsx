import '../styles/components/Toggle_Button.css';

export default function Toggle_Button({ enabled, setEnabled }) {
  return (
    <label className="switch" htmlFor="toggle">
      <input id="toggle" type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
      <span className="slider"></span>
    </label>
  );
}
