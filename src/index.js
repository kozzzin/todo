console.log('huy na!');

const projects = {};




const tasksStorage = (function() {
    const tasksStorage = {};

    return {
        addToStorage(task) {
            tasksStorage[task.id] = task;
        },
    
        deleteFromStorageById(id) {
            if (id in tasksStorage) {
                delete tasksStorage[id];
            } else {
                console.log(`no such id: ${id}`);
            }
        },

        getTaskById(id) {

        },

        loadAllTasks() {
            for (let task of Object.keys(tasksStorage)) {
                console.log(task, tasksStorage[task]);
            }
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
        this.proj = this.constructor.addToProject(projects, proj, this.id);
        this.status = true;
        console.log(this);
    }

    static addID() {
        return this.idCounter++;
    }

    static addToProject(projects, project, id) {
        if (project) {
            if (!(project in projects)) {
                projects[project] = [];
            }
            projects[project].push(id);
            return project;
        }
        return null;
    }

    deleteTask() {

    }

}

function createTask() {
    
}

const task = new Task(
    'take money',
    '10/12/2009',
    'medium',
    'vaflia must be eaten',
    'website'
);

const task2 = new Task(
    'take money',
    '10/12/2009',
    'medium',
    'vaflia must be eaten',
    'website'
);

console.log(task);

tasksStorage.addToStorage(task);
tasksStorage.addToStorage(task2);

tasksStorage.deleteFromStorageById(0);
tasksStorage.deleteFromStorageById(1);

tasksStorage.loadAllTasks();


function createTask(name,due,priority,desc,proj) {

    todosArchive[task.id] = task;
}


    // Task.idCounter += 1;