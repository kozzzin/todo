const { createTask, tasksStorage, projects } = require('./tasks');
const { templates } = require('./templates')


console.log('huy na!');


const task = createTask(
    'take money',
    '10/12/2009',
    'medium',
    'vaflia must be eaten',
    'website'
);

createTask(
    'take money',
    '10/12/2009',
    'medium',
    'vaflia must be eaten',
    'website'
);

createTask(
    'take money',
    '10/12/2009',
    'medium',
    'vaflia must be eaten',
    'website'
);


console.log(task);


tasksStorage.loadAllTasks();

tasksStorage.deleteFromStorageById(0);

console.log(tasksStorage.getTaskById(0));


const updater = tasksStorage.getTaskById(0);


tasksStorage.updateTaskById(0,updater);

tasksStorage.loadAllTasks();



console.log(projects.getTasksOfProject('website'));

projects.addProject('biba');
projects.addProject('laba');
projects.addProject('zalupka');


console.log(Object.keys(projects.getAllProjects()));



// render projects list
templates.renderProjects(
    document.querySelector('.sidebar'),
    Object.values(projects.getAllProjects())
);


templates.renderTasks();
