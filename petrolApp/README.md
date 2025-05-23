npx expo start --clear

npm install -g eas-cli

eas build -p android

eas build -p android --profile production
eas build -p android --profile development
eas build -p android --profile preview
eas update --channel preview --platform android --message "adjust registration logic"

steps to install nativewind
npx expo install nativewind tailwindcss@^3.4.17 react-native-reanimated@3.16.2 react-native-safe-area-context
npx tailwindcss init
npx pod-install

eas init
eas build:configure
eas update:configure  
npx expo prebuild

git commit -a -m "latest update"
https://github.com/petapp4all/petapp
git push adeyemi main

rm -rf petrolApp/.git

git remote -v

git rm --cached petrolApp
rm -rf .git/modules/petrolApp

git add petrolApp
git commit -a -m "edit registration logic"
git push origin main
git push petapp main
