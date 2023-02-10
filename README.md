# Cattle Log | FarmService


### Environment Variables

`SECRET_KEY` = secret

`PORT` = 4001

`NODE_ENV` = [devlopment, production]

`DATABASE_URL` = postgresql://postgres:root@localhost:5432/CattleDB?schema=Farm

----------
### Run Database Migrations

```bash
$ npx prisma migrate deploy
```

### Install Dependencies

```cmd
npm install
```

### Make Build

```cmd
npm run build
```

### Start Server

```cmd
npm run start
```



#### Note - Do not use **tsc** to compile typescript, Custom transformers will throw error, [ttypescript](https://www.npmjs.com/package/ttypescript) dependency needed, ttsc can compile typescript
