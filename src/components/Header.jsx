import '@/styles/components/Header.css';
import LanguageSelect from '@/components/LanguageSelect';

export default function Header() {
  return (
    <div id="HeaderContainer">
      <img src="/Neptun_Plus_Logo_White.png" id="HeaderLogo" />
      <div id="HeaderExtras">
        <div id="HeaderInfo">
          <p id="Version">v1.0</p>
          <i class="fa-brands fa-github"></i>
        </div>
        <LanguageSelect />
      </div>
    </div>
  );
}
