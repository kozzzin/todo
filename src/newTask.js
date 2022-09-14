const { helpers } = require('./helpers');
const { addDays } = require('date-fns');
class Database {
    static storage = {};
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

    // techincal method using fot simpler testing
    static resetIDsCounter() {
        this.fieldFactory.ID = 0;
    }

    // techincal method using fot simpler testing
    static resetStorage() {
        this.fieldFactory.storage = {};
    }
}

class Task {
    static ID = 0

    static create(taskProperties) {
        return new this(taskProperties);
    }

    constructor(taskProperties) {
        this.name = taskProperties.name;
        this.due = DueDate.create(taskProperties.due);
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
        if (projectName === undefined) {
            return undefined;
        }
        const project =  projectsStorage.add(projectName);
        return project.id;
    }

    update(updateObj) {
        // it's important to send project id for update
        // where handle logic of id assigment ???
        Array.from(Object.keys(updateObj)).forEach(key => {
            let value = updateObj[key];
            switch (key) {
                case 'due': value = DueDate.create(value);
                    break;
                case 'project': value = this.constructor.addToProject(value);
                    break;
            }
            this[key] = value;
        });
    }
}


class Tasks extends Database {
    static storage = {};
    static fieldFactory = Task;

    static filterByDate(date) {
        return Filter.byDate(this.storage,date);
    } 

    static filterByProject(projectID) {
        return Filter.byProject(this.storage,projectID);
    }
    
    static getSortedByDueDate() {
        // index page has tasks sorted by due date
        return Array.from(
            Object.values(this.storage))
                .sort((a,b) => a.due-b.due);
    }


}


// class Sort {
//     static byABC() {

//     }

//     static byDate(content) {

//     }
// }


class Filter {
    static byDate(contentObj, date) {
        return DateFilter.for(contentObj,date);
    }

    static byProject(contentObj,projectID) {
        const values = Object.values(contentObj);
        return values.filter(val => val.project === projectID);
    }
}


class DateFilter {
    constructor(data) {
        this.data = data;
    }

    static for(data,date) {
        switch (date) {
            case 'today': return DateFilterToday.filter(data);
            break;
            case 'week': return DateFilterWeek.filter(data);
            break;
            default: return DateFilter.filter(data);
        }
    }

    static filter(data) {
        return new this(data).filtered();
    }

    filtered() {
        // maybe make tasks sorted by time
        return Array.from(Object.values(this.data));
    }
}

class DateFilterToday extends DateFilter {
    constructor(data) {
        super(data);
    }

    filtered() {
        const today = new Date();
        today.setHours(0,0,0,0);
        return Array.from(
            Object.values(this.data))
                .filter(el => {
                    return el.due.toString() == today.toString();
                }
        );
    }
}

class DateFilterWeek extends DateFilter {
    constructor(data) {
        super(data);
    }

    filtered() {
        const today = new Date();
        today.setHours(0,0,0,0);
        const weekEnd = addDays(today,6);
        return Array.from(
            Object.values(this.data))
                .filter(el => {
                    if (el.due >= today && el.due <= weekEnd) {
                        return true;
                    }
                }
        );
    }
}


class DueDate {
    static create(date) {
        if (date instanceof Date) {
            return date;
        }
        const dateArr = date
            .split('-')
            .map(el => Number(el));
        return new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
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

    static getIDsSortedABC() {
        return Object.keys(this.storage).sort(
            (a,b) => {
                return this.storage[a].name.localeCompare(this.storage[b].name);
            }
        )
    }

    static getProjectsSorted() {
        return Array.from(this.getIDsSortedABC()).reduce((arr,id) => {
            arr.push(this.getAll()[id]);
            return arr;
        }, []);
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



module.exports = { Projects, Tasks, Priorities }