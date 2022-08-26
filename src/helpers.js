const helpers = (function() {
    return {
        keyInObj(key,obj) {
            if (key in obj) {
                return true;
            } else {
                console.log(`no such key: ${key}`);
                return false;
            }
        },

        capitalizer(str) {
            return str[0].toUpperCase() + str.slice(1);
        }
        
    }
})();


module.exports = { helpers };