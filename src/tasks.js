const { helpers } = require('./helpers');

// WE HAVE TO INJECT STORAGES TO Task, Project and other classes. At first they have to now, what is storage and it hasn\t to depend on certain name of storage,
// maybe it usefull to create one storage class and then implement 2 variations for tasks and projects

// tasks
// -- storage
// -- add task
// -- get task
// -- delete task
// -- get all tasks

// FILTERS (for tasks)
// -- get elements by due date parameter 

class Task {
    static ID = 0;

    constructor(taskProperties) {
        this.name = taskProperties.name;
        this.due = taskProperties.due;
        this.priority = taskProperties.priority;
        this.description = taskProperties.description;
        this.project = this.addToProject(taskProperties.project);
        this.id = this.getID();
        this.notDone = true;

        this.registerInStorage();
    }

    getID() {
        return this.ID++;
    }

    registerInStorage() {

    }

    addToProject(project) {
        project = project.toLowerCase();
    }

    updateTask() {

    }
}

// task
// -- constructor
// -- -- id
// -- -- name
// -- -- description
// -- -- due date
// -- -- priority
// -- -- project
// -- -- status
// -- register in projects
// -- register in storage ? how to implement it
// -- update task
// -- delete task ? how and from where

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

class LocalStorage {
    constructor() {
    }

    addKey() {
    }

    updateKey() {

    }

    eraseKey() {

    }

    eraseAll() {

    }
}

const tasksStorage = (function() {
    let tasksStorage = {};
    // if (localStorage.getItem('savedTasks')) {
    //     tasksStorage = JSONlocalStorage.getItem('savedTasks')
    // } else {
    //     const jsonObject = JSON.stringify(tasksStorage.loadAllTasks());
    //     localStorage.setItem('tasks',jsonObject);
    // }

    return {

        addToStorage(task) {
            tasksStorage[task.id] = task;
        },
    
        deleteFromStorageById(id) {
            if (tasksStorage.hasOwnProperty(id)) {
                delete tasksStorage[id];
            }

        },

        updateTaskById(id, updObj) {
            if (tasksStorage.hasOwnProperty(id)) {
                tasksStorage[id].update(updObj)
            }
        },

        getTaskById(id) {
            if (tasksStorage.hasOwnProperty(id)) {
                return tasksStorage[id];
            }
        },

        getTasksByDate(date) {
            const tasksArray = Array.from(Object.values(tasksStorage));
            if (date == 'today') {
                date = helpers.todayDate();
                return tasksArray.filter(task => task.due == date);

            } else if (date == 'week') {
                const minDate = new Date(helpers.todayDate());
                minDate.setHours(0,0,0,0);
                const maxDate = new Date(Date.parse(minDate) + (1000 * 60 * 60 * 24 * 7));

                return tasksArray.filter(task => {
                    const taskDue = new Date(task.due);
                    taskDue.setHours(0,0,0,0);
                    return minDate <= taskDue && taskDue < maxDate;
                });
            }
        },

        loadAllTasks() {
            return tasksStorage;
            // ret
        },


    }
})();

const priorities = (function() {
    const priorities = {
        0: 'low',
        1: 'medium',
        2: 'high'
    }
    return {
        getPriority(id) {
            return priorities[id];
        },

        getAllPriorities() {
            return priorities;
        }
    }
})();

const projects = (function() {

    class Project {
        constructor(name) {
            this.name = name;
            this.tasks = [];
        }

        addTask(id) {
            this.tasks.push(id);
        }

        deleteTask(id) {
            const index = this.tasks.findIndex((el) => el == id);
            this.tasks.splice(index,1);
        }

        getTasks() {
            return this.tasks;
        }

        get length() {
            return this.tasks.length;
        }
    }

    const projectsStorage = new Object();

    return {
        addProject(name) {
            name = name.toLowerCase();
            // check if name has been taken, not delete the old one
            projectsStorage[name] = new Project(name);
        },

        deleteProject(name) {
            if (projectsStorage[name]) {
                delete projectsStorage[name];
            }
        },

        getAllProjectsSorted() {
            // alphabetically sorted and not empty projects
            const keysArr = Object.keys(projectsStorage).sort();
            const result = keysArr.reduce((acc,key) => {
                if (projectsStorage[key].length > 0) {
                    acc.push(projectsStorage[key]);
                }
                return acc;
            },[]);
            return result;
        },

        getAllProjects() {
            return projectsStorage;
        },

        getProject(name) {
            if (projectsStorage[name]) {
                return projectsStorage[name];
            }
        },

        getTasksOfProject(name) {
            const project = this.getProject(name);
            const tasksIds = project.getTasks();
            const tasks = tasksStorage.loadAllTasks();
            const result = [];
            tasksIds.forEach((id) => {
               result.push(tasks[id]);
            });
            console.log(result);
            return result;
        }
    }
})();

class Task {
    static idCounter = 0

    constructor(name,due,priority,desc,proj) {
        this.name = name;
        this.due = due;
        this.priority = priority;
        this.desc = desc;
        this.id = this.constructor.addID();  
        this.proj = this.constructor.addToProject(proj, this.id);
        this.status = true;
    }

    static addID() {
        return this.idCounter++;
    }

    static addToProject(project, id) {
        if (project) {
            if (!(project in projects.getAllProjects())) {
               projects.addProject(project);

            }
            projects.getProject(project).addTask(id);
            return project;
        }
        return undefined;
    }

    deleteTask() {

    }

    update(updateObj) {
        Object.assign(this,updateObj)
    }

}

function createTask(name,due,priority,desc,project) {
    const task = new Task(
        name,
        due,
        priority,
        desc,
        project.toLowerCase()
    ); 
    tasksStorage.addToStorage(task);
    return task;
}


// make controller for main parts
// -- createTask
// -- addTaskTo Projects

module.exports = { createTask, tasksStorage, projects, priorities }