# Error handling without try/catch and error transforming

Inspired by golang error system and C return values.

[![Build Status](https://travis-ci.org/Yakika/func.svg?branch=master)](https://travis-ci.org/Yakika/func)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a49e80543465b0a5b79/maintainability)](https://codeclimate.com/github/Yakika/func/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/Yakika/func/badge.svg?branch=master)](https://coveralls.io/github/Yakika/func?branch=master)

## Func Usage

Import or Require

```javascript
import { func, trErr } from '@yakika/func'
// OR
const { func, trErr } = require('@yakika/func')
```

Func without transform

```javascript
function myFunction() {
  const [res, err] = await func(someAsyncTask())
  if(err) { return handleError() }
  return res
}
```

Func with transform

```javascript
function myFunction() {
  const [res, err] = await func(
    someAsyncTask(), `couldn't do it`
  )
  // err.message will be of format
  // `error: ${msg}\n- original error: ${originalErr}`
  if(err) { return handleError(err) }
  return res
}
```

Transform can be used out of func context

```javascript
function myFunction() {
  try{
    // Some code here that might throw an Error
  }catch(e=>{
    handleError(trErr('some code threw an error'))
  })
}
```

Transform ca be used with a promise error immediatly

```javascript
async function myFunction() {
  const prom = new Promise((s,r)=>{r()})
  prom().catch(trErr('That promised failed :('))
}
```
