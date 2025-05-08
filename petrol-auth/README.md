This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

npm install @prisma/client
npm install prisma --save-dev

npx prisma init
npx prisma generate

git commit -a -m "add adCount"
git remote add adeyemi https://github.com/adeyemithecoder/petapp.git
git push adeyemi main
git push --set-upstream origin main

npx prisma migrate dev --name init
npx prisma generate
npx prisma db push

npx prisma studio

npx prisma migrate reset

after adding new field or new model;
npx prisma migrate dev --name name your_migration_name
npx prisma migrate dev --name dev
