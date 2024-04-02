import TOKEN from './config.json' with {type: "json"}
import main from './main.mjs'
import fetch from 'node-fetch'
const response = await fetch("https://jsonplaceholder.typicode.com/posts")
const jsonResponse = await response.json();

main(jsonResponse);
// just to wait debug
setTimeout(() => {
    console.log('done')
}, 300000);