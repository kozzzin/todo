const { createTask, tasksStorage, projects } = require('./tasks');
const { templates } = require('./templates')
const { eventAggregator } = require('./events');


console.log('huy na!');


const task = createTask(
    'take money',
    '2009-05-12',
    '0',
    'vaflia must be eaten',
    'website'
);

createTask(
    'take money',
    '2022-05-11',
    '2',
    'vaflia must be eaten',
    'website'
);

createTask(
    'take money',
    '2005-03-17',
    '1',
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




function formSubmit(e,edit=false) {

    // form validator, no empty names

    console.log('edit ', edit);
    if (edit) {
        console.log('edit!!!');
    }
    console.log(e);
    const form = document.querySelector('.todo-new-form');
    // form.preventDefault();
    // form.preventDefault()
    console.log(e.target);
    const formData = new FormData(document.querySelector('form'));

    if (edit) {
        const id = form.getAttribute('data-id');
        const task = tasksStorage.getTaskById(id);
        task.update(
            {
                name: formData.get('task-name'),
                due: formData.get('task-date'),
                priority: formData.get('task-priority'),
                proj: formData.get('task-project')
            }
        );
    } else {
        createTask(
            formData.get('task-name'),
            formData.get('task-date'),
            formData.get('task-priority'),
            '',
            formData.get('task-project')
        );
    }
    



    console.log(tasksStorage.loadAllTasks());

    templates.renderProjects(
        document.querySelector('.sidebar'),
        Object.values(projects.getAllProjects())
    );
    
    
    templates.renderTasks();
};



templates.templatesController();

// module.exports =  { formSubmit }


    // have a trouble when click two times on add form, 

// window.formSubmit = formSubmit;
// window.renderForm = templates.renderForm;
window.renderTasks = templates.renderTasks;
window.editTask = templates.editTask;
window.deleteTask = templates.deleteTask;
// window.eventController = eventController;
window.projects = projects;



eventAggregator.subscribe('formSubmit',formSubmit);
eventAggregator.subscribe('showAllTasks',templates.renderTasks);
eventAggregator.subscribe('addTask',templates.renderForm);
eventAggregator.subscribe('projectClick', templates.renderTasks);

function eventsController(event,eventArgs) {
    // ...eventArgs
    eventAggregator.publish(event,eventArgs);
}


window.eventsController = eventsController;