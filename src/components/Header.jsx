import '@/styles/components/Header.css';
import LanguageSelect from '@/components/LanguageSelect';

export default function Header() {
  return (
    <div id="HeaderContainer">
      <img src="/Neptun_Plus_Logo_White.png" id="HeaderLogo" />
      <div id="HeaderExtras">
        <div id="HeaderInfo">
          <p id="Version">v1.0</p>
          <a id="GithubIcon" href="https://github.com/Py-xel/Neptun-Plus" target="_blank">
            <i class="fa-brands fa-github" />
          </a>
        </div>
        <LanguageSelect />
      </div>
    </div>
  );
}
