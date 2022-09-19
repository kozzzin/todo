// const { createTask, tasksStorage, projects } = require('./tasks');
const { templates } = require('./templates');
const { eventAggregator } = require('./events');
const { Router, PageController, AppState } = require('./newTemplates');
const { Projects, Tasks, Priorities } = require('./newTask');


// open index page
Router.for();


// events

// new task form controls
eventAggregator.subscribe('addTask',PageController.renderForm);
eventAggregator.subscribe('formSubmit',PageController.formSubmit);
eventAggregator.subscribe('closeForm',PageController.closeForm);

// task controls
eventAggregator.subscribe('deleteTaskClick',PageController.deleteTask);
eventAggregator.subscribe('editTaskClick',PageController.editTask);
eventAggregator.subscribe('taskCheckedChange',PageController.checkTask);

// edit form controls
eventAggregator.subscribe('formEditSubmit',PageController.formEditSubmit);
eventAggregator.subscribe('formEditClose',PageController.formEditClose);

// navigation controls
eventAggregator.subscribe('indexClick',Router.for);
eventAggregator.subscribe('dateFilterClick',PageController.useDateFilter)
eventAggregator.subscribe('projectFilterClick',PageController.useProjectFilter)

// reload page
eventAggregator.subscribe('reloadPage',Router.for);


// making some variables global
window.eventAggregator = eventAggregator;
window.currentPage = function() {
    return [AppState.currentPage, AppState._currentFilter];
}


function makeTestStorage() {
    const newObjects = [
        {
            name: 'test name',
            due: '2022-09-17', 
            priority: 1,
            description: 'couple words about',
            project: 'one'
        },
        {
            name: 'test name', 
            priority: 0,
            description: 'couple words about',
            project: 'three'
        },
        {
            name: 'Best Mem',
            due: new Date(), 
            priority: 1,
            description: 'couple words about',
            project: 'two'
        },
        {
            name: 'test name',
            due: '2022-09-29', 
            priority: 2,
            description: 'couple words about',
        }
    ]

    newObjects.forEach(obj => Tasks.add(obj))
}

