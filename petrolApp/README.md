npx expo start --clear

eas build -p android --profile production
eas build -p android --profile development
eas build -p android --profile preview
eas update --channel preview --platform android --message "adjust image upload"

git add petrolApp
git commit -a -m "edit registration logic"
git push origin main
git push petapp main

npx prisma db push
