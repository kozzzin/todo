const { helpers } = require('./helpers');

// WE HAVE TO INJECT STORAGES TO Task, Project and other classes. At first they have to now, what is storage and it hasn\t to depend on certain name of storage,
// maybe it usefull to create one storage class and then implement 2 variations for tasks and projects

class Database {
    static storage = {}

    static add(fieldProperties,fieldFactory) {
        const newField = fieldFactory.create(fieldProperties);
        this.registerInStorage(newField);
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

    static deleteByID(id) {
        if (this.storage.hasOwnProperty(id)) {
            delete this.storage[id];
        } else {
            this.noIdError();
        }
    }

    static noIdError() {
        console.log('no field with such ID');
    }

    // static getByDate(date) {

    // }

    static getAll() {
        return this.storage;
    }
}



class Tasks extends Database {
    static storage = {}

    static add(fieldProperties,fieldFactory = Task) {
        const newField = fieldFactory.create(fieldProperties);
        this.registerInStorage(newField);
    }

    static getByDate(date) {

    } 
}

class Projects extends Database {
    static storage = {}

    static add(fieldProperties,fieldFactory = Task) {
        const newField = fieldFactory.create(fieldProperties);
        this.registerInStorage(newField);
    }

    static getByDate(date) {

    } 
}



// FILTERS (for tasks)
// -- get elements by due date parameter 

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
        this.id = this.constructor.getID();
        this.notDone = true;
    }

    static getID() {
        return this.ID++;
    }

    static addToProject(project) {
        project = project.toLowerCase();
    }

    update(updateObj) {
        Object.assign(this,updateObj);
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



Tasks.add(
    {
        name: 'Something1',
        due: '21/06/2027',
        priority: 0,
        description: 'It\'s a project',
        project: 'GigaMan'
    }
);

Tasks.add(
    {
        name: 'Something2',
        due: '22/06/2027',
        priority: 1,
        description: 'It\'s a project',
        project: 'GigaMan'
    }
);


console.log('get by ID', Tasks.getByID(1));
console.log(Tasks.getAll());


console.log(Database.storage)
console.log(Tasks.storage)

// projects
// -- storage
// -- add to storage
// -- get project
// -- get all projects somehow sorted
// -- delete project
// -- update project

// project
// -- constructor
// -- -- tasks of project
// -- add task
// -- delete task
// -- get all tasks

// priorities
// -- constructor
// -- -- map of priority names
// -- get priority by id
// -- get all priorities with names and IDs

// localStorage
// -- localStorage constructor
// -- add / update localstorage key and value
// -- erase localStorage
// ??? how we know about keys
// where we check whether it's empty or not
// what data we use if it's empty
// how do we know that saved data is adequate for user                                          



// class Tasks {
//     static storage = {}

//     static add(taskProperties,taskFactory = Task) {
//         const newTask = taskFactory.create(taskProperties);
//         this.registerInStorage(newTask);
//         // return this.getByID(newTask.id); i'm not sure that i need somehing to be returned
//     }

//     static registerInStorage(task) {
//         this.storage[task.id] = task;
//     }

//     static getByID(id) {
//         if (this.storage.hasOwnProperty(id)) {
//             return this.storage[id];
//         } else {
//             console.log('no task with such ID');
//         }
//     }

//     static deleteByID(id) {
//         if (this.storage.hasOwnProperty(id)) {
//             delete this.storage[id];
//         } else {
//             console.log('no task with such ID');
//         }
//     }

//     static getByDate(date) {

//     }

//     static getAll() {
//         return this.storage;
//     }
// }