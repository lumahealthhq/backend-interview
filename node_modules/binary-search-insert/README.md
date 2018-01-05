binary-search-insert
====================
[![Build Status](https://travis-ci.org/cflynn07/binary-search-insert.svg)](https://travis-ci.org/cflynn07/binary-search-insert)
[![Code Climate](https://codeclimate.com/github/cflynn07/binary-search-insert/badges/gpa.svg)](https://codeclimate.com/github/cflynn07/binary-search-insert)
[![Test Coverage](https://codeclimate.com/github/cflynn07/binary-search-insert/badges/coverage.svg)](https://codeclimate.com/github/cflynn07/binary-search-insert)
[![Dependency Status](https://david-dm.org/cflynn07/binary-search-insert.svg)](https://david-dm.org/cflynn07/binary-search-insert)
[![devDependency Status](https://david-dm.org/cflynn07/binary-search-insert/dev-status.svg)](https://david-dm.org/cflynn07/binary-search-insert#info=devDependencies)

[![NPM](https://nodei.co/npm/binary-search-insert.png?compact=true)](https://nodei.co/npm/binary-search-insert/)

A library for performing a binary search and insert into a sorted array.  
Binary search has an average time complexity of O(log(n)) which is substantially faster than a linear search
with an average time complexity of O(n).

Installing
----------
```
$ npm install binary-search-insert
```

Usage
-----
```js
var binarySearchInsert = require('binary-search-insert');
var sortedArray = [1, 3, 5, 7, 9, 11];
var comparator = function (a, b) { return a - b; }

/**
 * Mutates sortedArray and returns index of inserted value
 * @param {Array} A sorted array
 * @param {*} An item to insert in the sorted array
 * @param {Function} A comparator function that takes two arguments and returns a number. The first
 *   argument will be a member of sortedArray, the second argument will be item.
 *   If item < member, return value < 0
 *   If item > member, return value > 0
 * @returns {Number} index of array where item is inserted
 */
var indexInsertedAt = binarySearchInsert(sortedArray, comparator, 6);
// indexInsertedAt: 3
// sortedArray: [1, 3, 5, 6, 7, 9, 11]
```

Benchmarks
----------
http://jsperf.com/cflynn07-binary-search-insert-vs-linear-search-insert  
![Performance](https://cloud.githubusercontent.com/assets/467885/12046878/7c2d98ca-ae76-11e5-8eee-34bb01c2e09b.png)

Testing
-------
```
// Tests + coverage reports are run using Lab
$ npm test
// Test coverage reports
$ npm run test-cov # will auto-open Google Chrome with html coverage report
```

License
-------
[MIT](https://raw.githubusercontent.com/cflynn07/binary-search-insert/master/LICENSE)
