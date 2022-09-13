const { helpers } = require('./helpers');
class Database {
    static storage = {}
    static fieldFactory;

    static add(fieldProperties,fieldFactory = this.fieldFactory) {
        const newField = fieldFactory.create(fieldProperties);
        this.registerInStorage(newField);
        return newField;
    }

    static registerInStorage(field) {
        this.storage[field.id] = field;
    }

    static getByID(id) {
        if (this.storage.hasOwnProperty(id)) {
            return this.storage[id];
        } else {
            this.noIdError();
        }
    }

    static updateByID(id, fieldProperties) {
        this.getByID(id).update(fieldProperties);
        return this.getByID(id);
    }

    static deleteByID(id) {
        if (this.storage.hasOwnProperty(id)) {
            delete this.storage[id];
            return true;
        } else {
            this.noIdError();
            return false;
        }
    }

    static noIdError() {
        console.log('no field with such ID');
    }

    static getAll() {
        return this.storage;
    }
}

class Task {
    static ID = 0

    static create(taskProperties) {
        return new this(taskProperties);
    }

    constructor(taskProperties) {
        this.name = taskProperties.name;
        this.due = taskProperties.due;
        this.priority = taskProperties.priority;
        this.description = taskProperties.description;
        this.project = this.constructor.addToProject(taskProperties.project);
        this.id = this.constructor.assignID();
        this.notDone = true;
    }

    static assignID() {
        return this.ID++;
    }

    static addToProject(projectName,projectsStorage = Projects) {
        const project =  projectsStorage.add(projectName);
        return project.id;
    }

    update(updateObj) {
        // it's important to send project id for update
        // where handle logic of id assigment ???
        Object.assign(this,updateObj);
    }
}



class Tasks extends Database {
    static storage = {};
    static fieldFactory = Task;

    static filterByDate(date) {
        return Filters.byDate(this.storage,date);
    } 

    static filterByProject(projectID) {
        return Filters.byProject(this.storage,projectID);
    } 
}

class Filters {
    static byDate(contentObj, date) {
        // FILTER BY DATE
        // MAYBE USE ANOTHER OBJECT FOR DATE while CREATED, FILTERED AND RENDERED!
    }

    static byProject(contentObj,projectID) {
        const values = Object.values(contentObj);
        return values.filter(val => val.project === projectID);
    }
}

class Project {
    static ID = 0

    static create(name) {
        return new this(name);
    }

    constructor(name) {
        this.name = name;
        this.id = this.constructor.assignID();
    }

    static assignID() {
        return this.ID++;
    }

    rename(newName) {
        try {
            this.name = newName;
        } catch(e) {
            console.log('it\'s flaw')
        }

    }

    countTasksInside() {
        const count = Tasks.filterByProject(this.id).length;
        return count;
    }
}

class Projects extends Database {
    static storage = {};
    static fieldFactory = Project;

    static getByName(name) {
        name = name.toLowerCase();
        const values = Object.values(this.storage);
        const result = values.find(val => val.name === name);
        if (result === undefined) {
            return false;
        }
        return result;
    }

    static add(name) {
        name = name.toLowerCase();
        let project = Projects.getByName(name);
        if (!project) {
            project = Project.create(name);
            this.storage[project.id] = project;
        }
        return project;
    }

    static rename(name, newName) {
        name = name.toLowerCase();
        newName = newName.toLowerCase();
        const project = this.getByName(name);
        try {
            project.rename(newName);
        } catch(e) {
            console.log('error', e);
        }
        return project;
    }

    static getIDsSortedAlpha() {
        return Object.keys(this.storage).sort(
            (a,b) => {
                return this.storage[a].name.localeCompare(this.storage[b].name);
            }
        )
    }

    static getProjectsSorted() {
        return Array.from(this.getIDsSortedAlpha()).reduce((arr,id) => {
            arr.push(this.getAll()[id]);
            return arr;
        }, []);
    }

    // techincal method using fot sippler testing
    static resetIDCounter() {
        this.fieldFactory.ID = 0;
    }


}

class Priorities {
    static mapping = {
        0: 'low',
        1: 'medium',
        2: 'high'
    }

    add(id,name) {
        mapping[id] = name;
    }

    getName(id) {
        return mapping[id];
    }

    getAll() {
        return mapping;
    }
}

//maybe create priority class / entity with id and name


class Interface {
    giveProjectsCount() {
        // have an object, which has name and count
        // filer empty projects!!!
    }

    giveDateFilterOptions() {
        // show all options for search by date
    }
}


module.exports = { Projects, Tasks, Priorities }