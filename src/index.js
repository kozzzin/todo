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
    'laba'
);


// console.log(task);


// tasksStorage.loadAllTasks();

// tasksStorage.deleteFromStorageById(0);

// console.log(tasksStorage.getTaskById(0));


// const updater = tasksStorage.getTaskById(0);


// tasksStorage.updateTaskById(0,updater);

// tasksStorage.loadAllTasks();



// console.log(projects.getTasksOfProject('website'));

projects.addProject('biba');
projects.addProject('zalupka');


console.log(Object.keys(projects.getAllProjects()));



// render projects list
templates.renderProjects(
    document.querySelector('.sidebar'),
    Object.values(projects.getAllProjects())
);


templates.renderTasks(
    document.querySelector('.main-content'),
    Object.values(tasksStorage.loadAllTasks())
    );




function formSubmit(e) {
    console.log(e);
    const form = document.querySelector('.todo-new-form');
    // form.preventDefault();
    e.preventDefault()
    console.log(e.target);
    const formData = new FormData(document.querySelector('form'));

    createTask(
        formData.get('task-name'),
        formData.get('task-date'),
        formData.get('task-priority'),
        '',
        formData.get('task-project')
    );

    console.log(tasksStorage.loadAllTasks());

    templates.renderProjects(
        document.querySelector('.sidebar'),
        Object.values(projects.getAllProjects())
    );
    
    
    templates.renderTasks(
        document.querySelector('.main-content'),
        Object.values(tasksStorage.loadAllTasks())
        );
};


// module.exports =  { formSubmit }


    // have a trouble when click two times on add form, 

window.formSubmit = formSubmit;