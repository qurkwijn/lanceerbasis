# 🚀 Lanceerbasis

Een vrolijke oefenplek voor kinderen in groep 3 en 4, met een ruimtethema. Op de Lanceerbasis kies je je naam en groep en vertrek je met een van de voertuigen:

- **Rekenraket** (`rekenraket/`): rekenen, van tellen en splitsen tot tafels en sommen tot 100.
- **Meetrover** (`meetrover/`): klokkijken, kalender, geld, meten, grafieken en vormen, met een plek op Mars per onderdeel.
- **Taaltelescoop** (`taaltelescoop/`): spelling, met een sterrenbeeld per onderdeel (de spellingcategorieën van groep 3 en 4).
- **Zinnenzender** (`zinnenzender/`): taal, zoals het alfabet, hoofdletters, woordenschat en meervoud, met een signaal per onderdeel.
- **Leeslander** (`leeslander/`): lezen, met een maan per onderdeel die voller wordt als je oefent.

Speel op https://lanceerbasis.app

Welke stof in welke groep zit, en wat de Lanceerbasis daarvan al heeft, staat in [docs/leerstof.md](docs/leerstof.md).

## Opbouw

Gewone HTML, CSS en JavaScript-modules, zonder build-stap.

```
index.html, js/, css/   landingspagina met naam- en groepkeuze
js/groepinfo.js         voor ouders: wat er per groep in elk voertuig zit, en waarom
shared/css/base.css     gedeelde stijl: kleuren, sterrenhemel, knoppen, planeten, infoscherm
shared/js/profile.js    naam en groep
shared/js/rewards.js    sterren per app en per groep
shared/js/info.js       info-knopje met privacy en feedback
shared/js/util.js       kleine hulpjes en voorlezen
shared/js/game.js       het spelscherm dat alle voertuigen delen
shared/css/game.css     stijl van het spelscherm
shared/css/sommen.css   sommen en invulvakjes (Rekenraket en Meetrover)
rekenraket/             de reken-app
meetrover/              meten, tijd en geld
taaltelescoop/          de spelling-app
zinnenzender/           de taal-app
leeslander/             de lees-app
```

Alles wordt alleen in `localStorage` op het apparaat bewaard, onder `lanceerbasis:v1`. Naam, groep en sterren uit de losse Rekenraket (`rekenraket:v1`) worden bij het eerste bezoek overgenomen.

Een nieuwe app krijgt een eigen map, laadt `../shared/css/base.css`, gebruikt `getProfile()` en stuurt zonder profiel door naar `startUrl('<app>')`. Sterren bewaar je met `saveStars('<app>', id, n)`. Zet de app daarna in `js/stations.js` met `ready: true`. Welk vak in welk voertuig hoort, staat in [docs/leerstof.md](docs/leerstof.md).

## Lokaal draaien

Start een simpele server in deze map (modules werken niet via `file://`):

```bash
python3 -m http.server 8010
```

En open http://localhost:8010.
