import LanguageSelect from '@/components/header/LanguageSelect';
import '@/styles/components/header/header.css';
import { universitiesVersion, version } from '../../../package.json';

export default function Header() {
  return (
    <div className="np-header-root">
      <img className="np-logo" src="/Neptun_Plus_Logo_White.png" />
      <div className="np-header-extras">
        <div className="np-header-info">
          <p className="np-version">{`v${version}-u${universitiesVersion}`}</p>
          <a className="np-header-icon" href="https://github.com/Py-xel/Neptun-Plus" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-github" />
          </a>
        </div>
        <LanguageSelect />
      </div>
    </div>
  );
}
