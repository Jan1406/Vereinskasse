# Lokal starten (ohne Lovable)

## Voraussetzungen
- Node.js (empfohlen: >= 18, besser 20+)
- npm **oder** bun

## Start (npm)
```bash
cd kasse-for-vereine-main
npm install
npm run dev
```

Dann im Browser öffnen:
- http://localhost:8080

## Start (bun, optional)
```bash
cd kasse-for-vereine-main
bun install
bun run dev
```

## Build & Preview
```bash
npm run build
npm run preview
```

## Typische Stolperfallen
### 1) `npm ci` schlägt fehl
Wenn `package.json` und `package-lock.json` nicht 100% synchron sind, schlägt `npm ci` ab.
Lösung: `npm install` ausführen (aktualisiert das Lockfile) oder alternativ bun verwenden.

### 2) Zugriff von Handy/Tablet im gleichen Netzwerk
Vite ist hier auf `host: "::"` und Port `8080` konfiguriert. Falls das in deinem Netzwerk/OS Probleme macht,
ändere in `vite.config.ts` z.B. zu:

```ts
server: {
  host: true,
  port: 8080,
}
```

### 3) Datenpersistenz
Produkte und Kassenbons werden lokal im Browser via `localStorage` gespeichert.
