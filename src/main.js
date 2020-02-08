const R = require('ramda');
const fs = require('fs');

const readFileSync = path => fs.readFileSync(path, { encoding: 'utf-8' });

const readData = R.pipe(
    R.converge(R.concat, [
        R.pipe(
            R.replace(/.*\//, ''),
            R.replace(/\..*/, ''),
            R.concat('date\t'),
            R.concat(R.__, '\n')
        ),
        readFileSync
    ])
);

R.pipe(
    R.map(R.pipe(
        readData,
        R.split('\n'),
        R.dropLast(1),
        R.map(R.pipe(
            R.split('\t'),
            R.view(R.lensIndex(1))
        )),
        R.converge(R.map, [
            R.pipe(R.head, R.objOf),
            R.tail
        ])
    )),
    R.transpose,
    R.map(R.mergeAll),
    console.log
)(['./input/btc.csv', "./input/eth.csv"])
