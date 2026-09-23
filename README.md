<p align="center">
  <img width="140" alt="Neptun Plus logo" src="public/Neptun_Plus_Logo.png">
</p>

<h1 align="center">
Neptun Plus
  
<picture>![Status](https://img.shields.io/badge/Státusz-aktív-0db556) ![Chromium](https://img.shields.io/badge/Chromium-támogatott-0db556?logo=googlechrome) ![Firefox](https://img.shields.io/badge/Firefox-támogatott-0db556?logo=firefoxbrowser) ![University](https://img.shields.io/badge/Támogatott_Egyetemek-47-8A2BE2?style=flat) ![Locales](https://img.shields.io/badge/Nyelvek-többnyelvű-EC4899?style=flat)</picture>

</h1>

[Magyar](README.md) | [English](README.en.md)

Egy könnyű, többplatformos böngészőbővítmény a **Neptun** egységes felsőoktatási platformhoz, melynek célja a felület használatának megkönnyítése és az alapvető, hiányzó funkciók hozzáadása.

## Telepítés

### Chromium alapú böngészőkre

<picture>![Chrome](https://img.shields.io/badge/Chrome-3e3e3e?style=for-the-badge&logo=googlechrome&logoColor=4285F4) ![Opera](https://img.shields.io/badge/Opera-3e3e3e?style=for-the-badge&logo=opera&logoColor=FF1B2D) ![OperaGX](https://img.shields.io/badge/Opera_GX-3e3e3e?style=for-the-badge&logo=operagx&logoColor=EE2950) ![Brave](https://img.shields.io/badge/Brave-3e3e3e?style=for-the-badge&logo=brave&logoColor=FB542B) ![Vivaldi](https://img.shields.io/badge/Vivaldi-3e3e3e?style=for-the-badge&logo=vivaldi&logoColor=EF3939)</picture>

#### 1. Letöltés

- A legújabb verzióért, [kattints ide](https://github.com/Py-xel/Neptun-Plus/releases/latest).
- Csomagold ki a `.zip` fájlt egy tetszőleges mappába.

**2. Bővítmény betöltése**

- A böngésződ címsorába írd be: `about://extensions`.
- Engedélyezd a fejlesztői módot.
- Ugyanitt, navigálj a `Load unpacked` gombra.
- Keresd meg a kicsomagolt mappát, majd kattints a megnyitás gombra.

---

### Gecko alapú böngészőkre

<picture>![Firefox](https://img.shields.io/badge/Firefox-3e3e3e?style=for-the-badge&logo=firefoxbrowser&logoColor=FF7139) ![Zen](https://img.shields.io/badge/Zen-3e3e3e?style=for-the-badge&logo=zenbrowser&logoColor=F76F53)</picture>

**1. Letöltés**

- A legújabb verzióért, [kattints ide](https://github.com/Py-xel/Neptun-Plus/releases/latest).

**2. Bővítmény betöltése**

- A böngésződ címsorába írd be: `about:debugging#/runtime/this-firefox`.
- Ugyanitt, navigálj a `Load Temporary Add-on...` gombra.
- Keresd meg a `.zip`-et, majd kattints a megnyitás gombra.

## Funkciók és használat

A használathoz javasolt a bővítmény kitűzése, mivel minden beállítás ott érhető el. A böngészők nagyrésze egy lenyíló ablakból engedi ezt elvégezni, melyet általában a jobbfelső sarokban lehet megtalálni, a címsor mellett.

A beállításokról, funkciókról és minden más dokumentációról a [wikin]() olvashatsz részletesebben.

## Fejlesztőknek

A projekt **Vite**, **React** és **CRXJS** segítségével készült. Fejlesztői környezet azonban csak Chromium-hoz érhető el.

**Első telepítés**

```bash
git clone https://github.com/Py-xel/Neptun-Plus.git
cd Neptun-Plus
npm install
npx playwright install chromium
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

A `check-universities.mjs` fájl helyileg is futtatható az `/src` mappából.

> [!IMPORTANT]
> A **`playwright chromium`** telepítése az első futtatás előtt szükséges.

**WebSzerver hitelesítés**

```bash
npm run server-check:validate
```

**WebSzerver felfedezés**

```bash
npm run server-check:discover
```

## Hozzájárulás / Visszajelzés

A projekthez történő hozzájárulás, visszajelzés vagy hibabejelentés menetéről és formájáról [itt]() tudhatsz meg többet.

## Licensz és Adatvédelem

A projektre az [MIT License](/LICENSE) feltételei vonatkoznak. A teljes forráskód nyílt terjedelmű, melyet szabadon felhasználhatsz, módosíthatsz vagy továbbíthatsz. **Minden felelősség a felhasználót érinti.**

A bővítmény **nem tárol** személyes, érzékeny vagy egyéb adatokat külső szervereken. A Neptun szerverekkel való kommunikáció kizárólag a felhasználó hozzájárulásával történik. Minden más funkció a felhasználó böngészőjében, **helyileg fut**.
