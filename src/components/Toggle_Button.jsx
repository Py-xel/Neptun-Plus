import '@/styles/components/Toggle_Button.css';

export default function Toggle_Button({ enabled, setEnabled, id }) {
  return (
    <label className="switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
      <span className="slider"></span>
    </label>
  );
}
