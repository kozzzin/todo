// const { createTask, tasksStorage, projects } = require('./tasks');
const { templates } = require('./templates');
const { eventAggregator } = require('./events');
const { Router, PageController } = require('./newTemplates');
const { Projects, Tasks, Priorities } = require('./newTask');


Tasks.add(
    {
        name: 'test name',
        due: '2022-09-17', 
        priority: 1,
        description: 'couple words about',
        project: 'one'
    }
);
Tasks.add(
    {
        name: 'test name', 
        priority: 0,
        description: 'couple words about',
        project: 'three'
    }
);
Tasks.add(
    {
        name: 'Best Mem',
        due: '2022-09-12', 
        priority: 1,
        description: 'couple words about',
        project: 'two'
    }
);
Tasks.add(
    {
        name: 'test name',
        due: '2022-09-29', 
        priority: 2,
        description: 'couple words about',
    }
);

Router.for();


// events
eventAggregator.subscribe('addTask',PageController.renderForm);
eventAggregator.subscribe('closeForm',PageController.closeForm);
eventAggregator.subscribe('formSubmit',PageController.formSubmit);
eventAggregator.subscribe('deleteTaskClick',PageController.deleteTask);
eventAggregator.subscribe('editTaskClick',PageController.editTask);
eventAggregator.subscribe('formEditSubmit',PageController.formEditSubmit);
eventAggregator.subscribe('reloadPage',Router.for);


// where to store global state of page, now page is type... name... so use it for new forms

window.eventAggregator = eventAggregator;
