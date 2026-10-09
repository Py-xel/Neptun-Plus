<div align="center">
  <img width="140" alt="Neptun Plus logo" src="public/Neptun_Plus_Logo.png">

# Neptun Plus

[![Status](https://img.shields.io/badge/Státusz-aktív-0db556)](https://github.com/Py-xel/Neptun-Plus/releases) [![Chromium](https://img.shields.io/badge/Chromium-támogatott-0db556?logo=googlechrome)](https://www.google.com/chrome/) [![Firefox](https://img.shields.io/badge/Firefox-támogatott-0db556?logo=firefoxbrowser)](https://www.mozilla.org/firefox/) [![University](https://img.shields.io/badge/Támogatott_Egyetemek-47-8A2BE2?style=flat)](src/data/universities.json) [![Locales](https://img.shields.io/badge/Nyelvek-többnyelvű-EC4899?style=flat)](src/locales/)

</div>

**[Magyar](README.md)** | **[English](README.en.md)**

Egy könnyű, többplatformos böngészőbővítmény a **Neptun** egységes felsőoktatási platformhoz, melynek célja a felület használatának megkönnyítése és az alapvető, hiányzó funkciók hozzáadása.

## Telepítés

### Chromium alapú böngészőkre

[![Chrome](https://img.shields.io/badge/Chrome-3e3e3e?style=for-the-badge&logo=googlechrome&logoColor=4285F4)](https://www.google.com/chrome/) [![Opera](https://img.shields.io/badge/Opera-3e3e3e?style=for-the-badge&logo=opera&logoColor=FF1B2D)](https://www.opera.com/) [![OperaGX](https://img.shields.io/badge/Opera_GX-3e3e3e?style=for-the-badge&logo=operagx&logoColor=EE2950)](https://www.opera.com/gx) [![Brave](https://img.shields.io/badge/Brave-3e3e3e?style=for-the-badge&logo=brave&logoColor=FB542B)](https://brave.com/) [![Vivaldi](https://img.shields.io/badge/Vivaldi-3e3e3e?style=for-the-badge&logo=vivaldi&logoColor=EF3939)](https://vivaldi.com/)

**Letöltés**

- A legújabb verzióért, [kattints ide](https://github.com/Py-xel/Neptun-Plus/releases/latest).
- Csomagold ki a `.zip` fájlt egy tetszőleges mappába.

**Bővítmény betöltése**

- A böngésződ címsorába írd be: `about://extensions`.
- Engedélyezd a fejlesztői módot.
- Ugyanitt, navigálj a `Load unpacked` gombra.
- Keresd meg a kicsomagolt mappát, majd kattints a megnyitás gombra.

---

### Gecko alapú böngészőkre

[![Firefox](https://img.shields.io/badge/Firefox-3e3e3e?style=for-the-badge&logo=firefoxbrowser&logoColor=FF7139)](https://www.mozilla.org/firefox/) [![Zen](https://img.shields.io/badge/Zen-3e3e3e?style=for-the-badge&logo=zenbrowser&logoColor=F76F53)](https://zen-browser.app/)

**Letöltés**

- A legújabb verzióért, [kattints ide](https://github.com/Py-xel/Neptun-Plus/releases/latest).

**Bővítmény betöltése**

- A böngésződ címsorába írd be: `about:debugging#/runtime/this-firefox`.
- Ugyanitt, navigálj a `Load Temporary Add-on...` gombra.
- Keresd meg a `.zip`-et, majd kattints a megnyitás gombra.

## Funkciók és használat

A használathoz javasolt a bővítmény kitűzése, mivel minden beállítás ott érhető el. A böngészők nagyrésze egy lenyíló ablakból engedi ezt elvégezni, melyet általában a jobbfelső sarokban lehet megtalálni, a címsor mellett.

A beállításokról, funkciókról és minden más dokumentációról a [wikin](https://github.com/Py-xel/Neptun-Plus/wiki) olvashatsz részletesebben.

## Fejlesztőknek

A projekt **Vite**, **React** és **CRXJS** segítségével készült. Fejlesztői környezet azonban csak Chromium-hoz érhető el.

**Első telepítés**

```bash
git clone https://github.com/Py-xel/Neptun-Plus.git
cd Neptun-Plus
npm install
```

**Fejlesztői környezet**

```bash
npm run build:css
npm run dev
```

Az `.scss` fájlok módosításainak automatikus fordításához a fejlesztői terminál mellett egy másikban futtasd:

```bash
npm run watch:css
```

**Ellenőrzések és build**

```bash
npm run lint
npm run i18n:check
npm run build:release
```

---

## Hozzájárulás / Visszajelzés

A projekthez történő hozzájárulás, visszajelzés vagy hibabejelentés menetéről és formájáról [itt](https://github.com/Py-xel/Neptun-Plus/blob/main/.github/CONTRIBUTING.md) tudhatsz meg többet.

## Licensz és Adatvédelem

A projektre az [MIT License](/LICENSE) feltételei vonatkoznak. A teljes forráskód nyílt terjedelmű, melyet szabadon felhasználhatsz, módosíthatsz vagy továbbíthatsz. **Minden felelősség a felhasználót érinti.**

A bővítmény **nem tárol** személyes, érzékeny vagy egyéb adatokat külső szervereken. A Neptun szerverekkel való kommunikáció kizárólag a felhasználó hozzájárulásával történik. Minden más funkció a felhasználó böngészőjében, **helyileg fut**.
