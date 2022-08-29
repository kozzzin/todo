const { createTask, tasksStorage, projects } = require('./tasks');
const { templates } = require('./templates');
const { eventAggregator } = require('./events');
import { formatDistance, subDays } from 'date-fns'

const testDAte = formatDistance(subDays(new Date(), -3), new Date(), { addSuffix: true });





const dateNow = Date.now();
// dateNow.setTime(0);

// console.log(dateNow.getHours());

// const dateParse = Date.parse('2022-05-11');
// console.log(dateParse)
// console.log(new Date(dateParse).getMonth()+1);

// console.log(testDAte)
//=> "3 days ago"


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

createTask(
    'today is task',
    '2022-08-29',
    '1',
    'vaflia must be eaten',
    'todays'
);

createTask(
    'today is task 2',
    '2022-08-29',
    '1',
    'vaflia must be eaten',
    'todays'
);



createTask(
    '6 sept',
    '2022-09-06',
    '1',
    'vaflia must be eaten',
    'weeks'
);


createTask(
    '5 sept',
    '2022-09-05',
    '1',
    'vaflia must be eaten',
    'weeks'
);

createTask(
    '4 sept',
    '2022-09-04',
    '1',
    'vaflia must be eaten',
    'weeks'
);






projects.addProject('biba');
projects.addProject('zalupka');


console.log(Object.keys(projects.getAllProjects()));


templates.renderBasicHeader();

// render projects list
templates.renderProjects(
    document.querySelector('.sidebar'),
    Object.values(projects.getAllProjectsSorted())
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
        Object.values(projects.getAllProjectsSorted())
    );
    
    
    templates.renderTasks();
};


templates.templatesController();

// module.exports =  { formSubmit }


    // have a trouble when click two times on add form, 

// window.formSubmit = formSubmit;
// window.renderForm = templates.renderForm;
// window.renderTasks = templates.renderTasks;
// window.editTask = templates.editTask;
// window.deleteTask = templates.deleteTask;
// window.eventController = eventController;


window.projects = projects;


function showTodayTasks() {
    const today = Date.now();
    const anotherDay = new Date(2022,7,29)
    console.log(today == anotherDay);    
}

showTodayTasks();



eventAggregator.subscribe('formSubmit',formSubmit);
eventAggregator.subscribe('showAllTasks',templates.renderTasks);
eventAggregator.subscribe('showAllTasks',templates.renderBasicHeader);
eventAggregator.subscribe('addTask',templates.renderForm);
eventAggregator.subscribe('projectClick', templates.renderTasks);
eventAggregator.subscribe('projectClick', templates.renderProjectHeader);
eventAggregator.subscribe('editTaskClick', templates.editTask);
eventAggregator.subscribe('deleteTaskClick', templates.deleteTask);
eventAggregator.subscribe('showTodayTasks', templates.renderTodayTasks);
eventAggregator.subscribe('showWeekTasks', templates.renderWeekTasks);

function eventsController(event,eventArgs) {
    // ...eventArgs
    eventAggregator.publish(event,eventArgs);
}


window.eventsController = eventsController;