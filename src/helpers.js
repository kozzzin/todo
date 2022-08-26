const helpers = (function() {
    return {
        keyInObj(key,obj) {
            if (key in obj) {
                return true;
            } else {
                console.log(`no such key: ${key}`);
                return false;
            }
        }
    }
})();

module.exports = { helpers };