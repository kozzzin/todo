const { helpers } = require('./helpers');

const tasksStorage = (function() {
    const tasksStorage = {};

    return {
        addToStorage(task) {
            tasksStorage[task.id] = task;
        },
    
        deleteFromStorageById(id) {
            if (helpers.keyInObj(id,tasksStorage)) {
                delete tasksStorage[id];
            }

        },

        updateTaskById(id, updObj) {
            if (helpers.keyInObj(id,tasksStorage)) {
                tasksStorage[id].update(updObj)
            }
        },

        getTaskById(id) {
            if (helpers.keyInObj(id,tasksStorage)) {
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