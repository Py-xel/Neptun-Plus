<p align="center">
  <img width="140" alt="Neptun Plus logo" src="public/Neptun_Plus_Logo.png">
</p>

<h1 align="center">
Neptun Plus
  
<picture>![Status](https://img.shields.io/badge/Status-active-0db556) ![Chromium](https://img.shields.io/badge/Chromium-supported-0db556?logo=googlechrome) ![Firefox](https://img.shields.io/badge/Firefox-supported-0db556?logo=firefoxbrowser) ![University](https://img.shields.io/badge/Supported_Universities-47-8A2BE2?style=flat) ![Locales](https://img.shields.io/badge/Locales-multiple-EC4899?style=flat)</picture>

</h1>

[Magyar](README.md) | [English](README.en.md)

A lightweight, cross-platform browser extension for the unified higher education platform **Neptun**, with the goal of making the platform easier to use, and adding missing features.

## Installation

### Chromium based browsers

<picture>![Chrome](https://img.shields.io/badge/Chrome-3e3e3e?style=for-the-badge&logo=googlechrome&logoColor=4285F4) ![Opera](https://img.shields.io/badge/Opera-3e3e3e?style=for-the-badge&logo=opera&logoColor=FF1B2D) ![OperaGX](https://img.shields.io/badge/Opera_GX-3e3e3e?style=for-the-badge&logo=operagx&logoColor=EE2950) ![Brave](https://img.shields.io/badge/Brave-3e3e3e?style=for-the-badge&logo=brave&logoColor=FB542B) ![Vivaldi](https://img.shields.io/badge/Vivaldi-3e3e3e?style=for-the-badge&logo=vivaldi&logoColor=EF3939)</picture>

#### 1. Download

- For the latest version, [click here](https://github.com/Py-xel/Neptun-Plus/releases/latest).
- Exctract the `.zip` file into a folder of your choice.

**2. Loading the extension**

- In the address bar, type: `about://extensions`.
- Enable developer mode.
- In the same location, click the `Load unpacked` button.
- Find the extracted folder, then click open.

---

### Gecko based browsers

<picture>![Firefox](https://img.shields.io/badge/Firefox-3e3e3e?style=for-the-badge&logo=firefoxbrowser&logoColor=FF7139) ![Zen](https://img.shields.io/badge/Zen-3e3e3e?style=for-the-badge&logo=zenbrowser&logoColor=F76F53)</picture>

**1. Download**

- For the latest release, [click here](https://github.com/Py-xel/Neptun-Plus/releases/latest).

**2. Loading the extension**

- In the address bar, type: `about:debugging#/runtime/this-firefox`.
- In the same location, click the `Load Temporary Add-on...` button.
- Find the `.zip` file, then click open.

## Features and usage

It is recommended to pin the extension, as all settings are found there. Most browsers let you do that from a dropdown window, usually found in the top right corner, next to the address bar.

To read more about settings, features and all other documentation, visit the [wiki]().

## For developers

The project was made using **Vite**, **React** and **CRXJS**. The developer environment is only available for chromium.

**First install**

```bash
git clone https://github.com/Py-xel/Neptun-Plus.git
cd Neptun-Plus
npm install
npx playwright install chromium
```

**Developer environment**

```bash
npm run build:css
npm run dev
```

To see the changes made in `.scss` files live, run this in a separate terminal:

```bash
npm run watch:css
```

**Checks and build**

```bash
npm run lint
npm run i18n:check
npm run build:release
```

---

The `check-universities.mjs` file can be run locally from the `/src` directory.

> [!IMPORTANT]
> The installation of **`playwright chromium`** is mandatory before running.

**WebServer validation**

```bash
npm run server-check:validate
```

**WebServer discovery**

```bash
npm run server-check:discover
```

## Contribution / Feedback

To find out more about the format and process for contributing to the project, providing feedback, or reporting bugs [click here]().

## License and Privacy

The project is licensed under [MIT License](/LICENSE). The entire codebase is open-source, which you can freely use, modify or redistribute. **The user assumes all responsibility.**

The extension does **not store** personal, sensitive or other data on third party servers. Communication between Neptun servers occur strictly with user consent. All other features run in the user's browser, **locally**.
