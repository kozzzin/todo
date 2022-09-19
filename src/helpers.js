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
        },

        todayDate(date) { 
            let today = new Date();
            today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            return today;
        },

        setAttributes(target, attributes) {
            Object.keys(attributes).forEach(key => {
                target.setAttribute(key,attributes[key]);
            })
        }
        
    }
})();


module.exports = { helpers };