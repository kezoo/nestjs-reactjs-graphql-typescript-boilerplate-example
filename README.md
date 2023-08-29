# nestjs-reactjs-graphql-typescript-boilerplate-example

## Prerequisite
Node.js >= 14.0 on your machine.

## Install Packages
```
cd nest-graphql-ts && yarn
cd react-graphql-ts && yarn
```

## Start Server
Make sure your terminal is in the respective directory.

For front-end
```
yarn start
```
For Nest
```
yarn start:dev
```

## How to configure database
Check out [this file](https://github.com/kezoo/nestjs-reactjs-graphql-typescript-boilerplate-example/blob/71ae27d646dd240c4b6de1d16313042a067ec2a7/nest-graphql-ts/config/default.yml#L6-L11), there is a 'db' section, configure database there.

On the frontend side, you might need to change the server address to yours, take a look at [this file](https://github.com/kezoo/nestjs-reactjs-graphql-typescript-boilerplate-example/blob/aee31332f474e71170c37400282d362e97c8ec72/react-graphql-ts/src/config/api.config.ts#L16), I think it's crystal clear where you can make the change.

## Pager module
There is an independent [Pager module](https://github.com/kezoo/nestjs-reactjs-graphql-typescript-boilerplate-example/tree/main/nest-graphql-ts/src/modules/_common/pagination) inside the nest project, which supports both offset pagination and cursor pagination.

At the moment there are only a few articles on the internet talking about how to make cursor-based pagination work with nest.js suite, but they all seem to have some bugs or incompletions for me, especially when you are trying to do a query in need of sorting and order, So I decided to write my own pagination under the hood of Nest, now here it is, this might be the only working cursor & offset pagination that supports sorting and order and Nest. 

Another thing is that I can't get TypeORM work with some complex query conditions, I mean like there are many where clauses and orWhere clauses at the same time, I tried a lot, but the final output is just not right, so I replaced it with Knex.

I may try to make this module into a new package sometime later this year, so it can be more convenient to other people for integrating purpose or something.
