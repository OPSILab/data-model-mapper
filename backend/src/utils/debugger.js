const readline = require('readline-sync');
const config = require('../../config')
module.exports = {
    log(obj){//, info, breakpoint) {
        console.log("<" + Object.keys(obj)[0] + ">\n", Object.values(obj)[0])
        if (config.debugger)
            readline.question("<" + Object.keys(obj)[0] + ">\n")
        else console.log("<" + Object.keys(obj)[0] + ">\n")
        return true
    }
}