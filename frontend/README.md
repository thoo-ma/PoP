# Pop - Application React Native + Supabase

Application mobile avec authentification OAuth2 (X/Twitter et Google) via Supabase.

## 🚀 Modes de Développement

### 1. **Expo Go** (Développement UI rapide)
**Usage:** Pour itérer rapidement sur l'UI sans OAuth2
```bash
pnpm start:go          # Ouvre avec Expo Go
pnpm android:go        # Lance directement sur Android
pnpm ios:go            # Lance directement sur iOS
```
**Limitations:** OAuth2 ne fonctionne pas (redirects non supportés)

### 2. **Dev Build** (Test OAuth2 complet)
**Usage:** Pour tester l'authentification Supabase OAuth2
```bash
pnpm start:dev         # Lance avec dev client
pnpm android           # Compile et lance sur Android
pnpm ios               # Compile et lance sur iOS
```
**Requis:** Un dev build doit être installé sur votre appareil

## 📦 Installation

```bash
pnpm install
```

## 🏗️ Créer un Dev Build

```bash
# Android
pnpm build:android
# ou
eas build --platform android --profile development

# iOS
pnpm build:ios
# ou
eas build --platform ios --profile development
```

## 🌐 Variables d'Environnement

Fichier `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://mtnluwkvhkwwxvxdtkgs.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

## 🔐 Configuration OAuth2

### Deep Link Scheme: `pop://`

**Supabase Dashboard:**
1. Aller dans Authentication > URL Configuration
2. Ajouter les Redirect URLs:
   - `pop://` (mobile)
   - `http://localhost:8081` (développement web)

**Providers configurés:**
- X (Twitter)
- Google

## 📱 Structure du Projet

```
├── App.tsx                 # Point d'entrée, gestion session
├── components/
│   └── Auth.tsx           # Écran de connexion OAuth2
├── lib/
│   └── supabase.ts        # Configuration client Supabase
├── assets/                # Images et icônes
├── app.json              # Configuration Expo
├── eas.json              # Configuration EAS Build
└── package.json          # Dépendances et scripts
```

## 🛠️ Technologies

- **Expo SDK 54** avec expo-dev-client
- **React Native 0.81.5**
- **Supabase** pour auth et backend
- **TypeScript**
- **AsyncStorage** pour persistance

## 📝 Commandes Utiles

```bash
npm start              # Metro bundler (auto-détecte le mode)
npm run start:tunnel   # Tunnel pour tester sur device distant
npm run web            # Lance sur navigateur web
npm run prebuild       # Génère les dossiers ios/android natifs
```

## ⚡ Workflow Recommandé

1. **Phase UI:** Utiliser Expo Go (`npm run start:go`)
2. **Phase Auth:** Builder et installer un dev build, puis `npm run start:dev`
3. **Testing:** Utiliser le dev build pour les tests complets

## 🐛 Troubleshooting

### OAuth ne fonctionne pas
- Vérifier que vous utilisez le **dev build**, pas Expo Go
- Vérifier les redirect URLs dans Supabase Dashboard
- Vérifier que le scheme `pop://` est bien configuré dans app.json

### Dev client non trouvé
- Builder un nouveau dev build avec `npm run build:android` ou `npm run build:ios`
- Installer le build sur votre appareil

### Metro bundler ne démarre pas
- Nettoyer le cache: `npx expo start -c`
