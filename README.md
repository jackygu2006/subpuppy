# SubPuppy 
### An awesome tool for fetching chain data from substrate-based blockchain to Mysql database, and serve an API service for remote loading.

## 1. Install
Run `npm i` or `yarn` command

## 2. Database configuration

Copy `ormconfig.json.sample` to `ormconfig.json`, configue mysql database.

## 3. Run
Run `yarn start` command to get help as floowing:
```
Usage:  subpuppy fetch [options] or subpuppy api [options]

Options:
  -V, --version              output the version number
  -h, --help                 display help for command

Commands:
  fetch [options] [options]  Fetch substrate-based blockchain data
  api [options] [options]    Run API service
  help [command]             display help for command
```
Run `yarn start help fetch` to get help for fetch:
```
Usage: index fetch [options] [options]

Fetch substrate-based blockchain data

Options:
  -f --from <blockHeight>  from block height
  -t --to <blockHeight>    to block height
  -u --update              update existed block data allowed (default: false)
  -l --latest              Fetch data until latest block
  -h, --help               display help for command
```

## 4. Examples:

### Fetch from block number 10000-20000
```
yarn start fetch -f 10000 -t 20000
```

### Fetch from block number 10000-20000, if the data already existed, update the current data. 
```
yarn start fetch -f 10000 -t 20000 -u
```
Default is passing without updating.

### Fetch the lastest block data.
```
yarn start fetch -l
```

### Start API service, set port 3000
```
yarn start api -p 3000
```
Default port is `3000`

### Fetch and save validators' point data
```
yarn start points -i 1800
```
Save point data every 1800 seconds.


## 5. Use pm2
### Fetch to the latest block
```
pm2 start run.sh -n subpuppy_auto // same as: yarn start fetch -l
```

### Fetch range from ... to ...
```
pm2 start run_fetch.sh -n fetch10000~12000 -- 10000 11000 // same as yarn start fetch -f 10000 -t 11000, name it fetch10000~12000
```

### Run api
```
pm2 start run_api.sh // same as: yarn start api -p 3030
```

### Log File
located in `./info.log`

