const { helpers } = require('helpers');
const { Projects, Tasks, Priorities } = require('newTask');

class Page {
    constructor(name,type) {
        this.name = name,
        this.type = type
    }

    getHeader() {
        return helpers.capitalize(this.type) + helpers.capitalize(this.name);
    }

    getSidebar(sidebar) {

    }
}



class Interface {
    giveProjectsCount() {
        // have an object, which has name and count
        // filer empty projects!!!
    }

    giveDateFilterOptions() {
        // show all options for search by date
    }
}


class Render {
    static it() {

    }
}