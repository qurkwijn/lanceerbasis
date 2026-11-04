# 🚀 Lanceerbasis

Een vrolijke oefenplek voor kinderen in groep 3 en 4, met een ruimtethema. Op de Lanceerbasis kies je je naam en groep en vlieg je naar een van de apps:

- **Rekenraket** (`rekenraket/`): rekenen, van tellen tot tafels, klok en geld.
- **Taaltelescoop** (`taaltelescoop/`): spelling, met een sterrenbeeld per onderdeel.
- **Leeslander** (`leeslander/`): lezen, met een maan per onderdeel die voller wordt als je oefent.

Speel op https://lanceerbasis.app

## Opbouw

Gewone HTML, CSS en JavaScript-modules, zonder build-stap.

```
index.html, js/, css/   landingspagina met naam- en groepkeuze
shared/css/base.css     gedeelde stijl: kleuren, sterrenhemel, knoppen, planeten, infoscherm
shared/js/profile.js    naam en groep
shared/js/rewards.js    sterren per app en per groep
shared/js/info.js       info-knopje met privacy en feedback
shared/js/util.js       kleine hulpjes en voorlezen
shared/js/game.js       het spelscherm dat alle voertuigen delen
shared/css/game.css     stijl van het spelscherm
rekenraket/             de reken-app
taaltelescoop/          de spelling-app
leeslander/             de lees-app
```

Alles wordt alleen in `localStorage` op het apparaat bewaard, onder `lanceerbasis:v1`. Naam, groep en sterren uit de losse Rekenraket (`rekenraket:v1`) worden bij het eerste bezoek overgenomen.

Een nieuwe app krijgt een eigen map, laadt `../shared/css/base.css`, gebruikt `getProfile()` en stuurt zonder profiel door naar `startUrl('<app>')`. Sterren bewaar je met `saveStars('<app>', id, n)`. Zet de app daarna op `ready: true` in `js/lanceerbasis.js`.

## Lokaal draaien

Start een simpele server in deze map (modules werken niet via `file://`):

```bash
python3 -m http.server 8010
```

En open http://localhost:8010.
