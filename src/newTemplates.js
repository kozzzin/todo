// !!! when click edit while another form is opened, another disapears
// date problem, it converts zero value to linux zero which iz 1970 year
// WANT TO HAVE NAMES OF PAGES IN ONE PLACE:

// take care of edit form when new add task form opens

const { helpers } = require('./helpers');
const { Projects, Tasks, Priorities, Sort } = require('./newTask');
const { formatDistance, format, parseISO } = require('date-fns');
const { tasksStorage } = require('./tasks');


class AppState {
    static _currentPage = {};
    static _currentFilter = '';

    static set currentPage(pageObj) {
        this._currentPage = pageObj;
        return this._currentPage;
    }

    static get currentPage() {
        return this._currentPage;
    }
}


class LocalStorage {
    static tasksStorage = 'tasksStorage';
    static projectsStorage = 'projectsStorage';

    static checkLocalStorage() {
        if (localStorage.length === 0) {
            this.createLocalStorage();
        }
    }

    static createLocalStorage() {
        localStorage[this.tasksStorage] = this.convertThisToJSON(new Object());
        localStorage[this.projectsStorage] = this.convertThisToJSON(new Object());
    }

    static convertThisToJSON(storage) {
        return JSON.stringify(storage);
    }

    static convertJSONToObject(key, storage = localStorage) {
        return JSON.parse(
            storage.getItem(key)
        );
    }

    static getAsDateSortedArray(storage = this.loadObjectFromStorage()) {
        return Sort.byDate(storage);
    }

    static saveToLocalStorage(key = this.tasksStorage,object = Tasks.getAll()) {
        this.checkLocalStorage();
        localStorage.setItem(key,this.convertThisToJSON(object));
    }

    static loadObjectFromStorage(key = this.tasksStorage) {
        this.checkLocalStorage();
        return this.convertJSONToObject(key)
    }

    static makeSavedStorageCurrent() {
        this.checkLocalStorage();
        Tasks.storage = {};
        
        const savedStorage = this.loadObjectFromStorage();
        Object.keys(savedStorage).forEach(key => {
            const project = savedStorage[key].project;
            if (project != undefined) {
                savedStorage[key].project = 
                this.loadObjectFromStorage(
                    this.projectsStorage
                        )[project].name;
            }
            savedStorage[key].due =
                savedStorage[key].due === undefined ?
                    undefined : new Date(Date.parse(savedStorage[key].due));
            Tasks.add(savedStorage[key]);
        });
        LocalStorage.saveToLocalStorage(
            this.projectsStorage,
            Projects.getAll()
        );
    }
}

class Page {
    static is(obj) {
        switch(obj.name) {
            case 'dateFilter': return FilterPage.create(obj.name,obj.type,obj.filter);
                break;
            case 'projectFilter':  return FilterPage.create(obj.name,obj.type,obj.id);
                break;
            default: return new this(obj.name,obj.type);
        }

    }

    constructor(name,type) {
        /// TEST
        Tasks.resetStorage();
        Tasks.resetIDsCounter();
        LocalStorage.makeSavedStorageCurrent();

        /// END TEST
        this.name = name;
        this.type = type;
        this.headerText = this.getHeader();
        this.tasks = this.getTasks(Tasks.getSortedByDueDate());
        // this.tasks = this.getTasks(LocalStorage.getAsDateSortedArray());
        this.dateFilters = this.getDateFilters();
        this.projectsList = this.getProjectsList();
    }

    getHeader() {
        return Header.for(this.name);
    }

    getDateFilters() {
        // hardcoded filters id bad idea
        return ['today','next week'];
    }

    getProjectsList() {
        return Projects.getProjectsSorted()
            .filter(el => {
                if (Tasks.filterByProject(el.id).length > 0) {
                    return true;
                }
                return false;
            });
    }

    getTasks(source) {
        return source;
    }

    render(template = PageTemplate) {
        new template(this).render();
    }
}

class FilterPage extends Page {
    constructor(name,type,filter) {
        super(name,type);
        this.filterType = filter;
    }

    static create(name,type,filter) {
        switch(type) {
            case 'dateFilter':
                return new dateFilterPage(name,type,filter);
                break;
            case 'projectFilter':
                return new projectFilterPage(name,type,filter);
                break;
        }
    }
}


class dateFilterPage extends FilterPage {
    constructor(name,type,filter) {
        super(name,type,filter);
        this.tasks = Tasks.filterByDate(filter);
        this.headerText = this.getHeader();
    }

    getHeader() {
        return Header.for(this.name, this.filterType);
    }
    
}

class projectFilterPage extends FilterPage {
    constructor(name,type,id) {
        super(name,type,id);
        this.tasks = Tasks.filterByProject(this.filterType);
        this.projectName = Projects.getByID(this.filterType).name;
        this.headerText = this.getHeader();
    }

    getHeader() {
        return Header.for(this.name, this.projectName);
    }
}  


class PageTemplate {
    constructor(pageObj) {
        this.name = pageObj.name,
        this.type = pageObj.type,
        this.tasks = pageObj.tasks,
        this.headerText = pageObj.headerText;
        this.dateFilters = pageObj.dateFilters;
        this.projectsList = pageObj.projectsList;
    }

    render() {
        this.renderHeader();
        this.renderTasks();
        this.renderSidebar();
        Interface.highlightLink();
    }

    renderSidebar(target = '.sidebar') {
        document.querySelector(target).innerHTML = Sidebar.get(this.dateFilters, this.projectsList);
    }

    renderHeader(target = '.main-content', element = 'h2') {
        this.headerText = helpers.capitalizer(this.headerText);
        let h2 = document.querySelector(element);
        if (h2) {
            h2.innerText = '';
        } else {
            h2 = document.createElement(element);
            document.querySelector(target).appendChild(h2);
        }
        
        h2.innerText = this.headerText;    
    }

    renderTasks(target = '.main-content') {
            const ul = document.createElement('ul');
            ul.className = 'todos';
            this.tasks.forEach((task) => {
                PageTemplate.renderTask(task,ul);
            });

            const addTask = document.createElement('li');
            addTask.className = 'add-task-li';
            addTask.setAttribute(
                'onclick',
                'eventAggregator.publish(\'addTask\')'
            );
            addTask.innerHTML = `
            <span class="add-task-plus"></span><span class="add-task-text">Add Task</span>`;

            ul.appendChild(addTask);
    
            try {
                document.querySelector(target).querySelector('ul').remove();
            } catch {
                
            }
    
            document.querySelector(target).append(ul);
    }

    static renderTask(task, target) {
        target.appendChild(this.addTask(task));
    }

    static renderTaskAfterEdit(task, target) {
        const parent = target.parentNode;
        task = PageTemplate.addTask(task);
        parent.parentNode.insertBefore(task,target.parentNode);
    }

    static addTask(task) {
        const li = document.createElement("li");
                li.setAttribute('data-id',task.id);
                li.innerHTML = `
                    ${Checkbox.get(task.name, task.id, task.notDone)}
                    <span class="task-name">${task.name}</span>
                    <span class="task-priority ${Priorities.getByID(task.priority).name}">${Priorities.getByID(task.priority).name}</span>
                    <div class="task-extras">
                        ${DuedateView.get(task.due)}
                        ${ProjectView.get(task.project)}
                    </div>
                    <div class="task-edit">
                        <a onclick="eventAggregator.publish(\'editTaskClick\',event)" class="link-task-edit"></a><a onclick="eventAggregator.publish(\'deleteTaskClick\',event)" class="link-task-delete"></a>
                    </div>
                </li>`;
        return li;
    }

    static renderForm(target = 'main ul', form = Form.create()) {
        if (target instanceof HTMLElement) {
            target.append(form);
        } else {
            document.querySelector(target).append(form);
        }
    }

    static renderTaskEdit(targetTask,form = Form.edit()) {
        const targetParent = targetTask.parentNode;
        targetParent.insertBefore(form, targetTask);
    }
}


class TaskView {

}


class TaskController {
    //mark completed 
    //show
    //edit
    //add
}



class Checkbox {
    static get(name, id, doneStatus) {
        return `
        <input type="checkbox" ${this.onChange()} name="${name}" data-id="${id}" ${this.getValue(doneStatus)}></input>`;
    }

    static getValue(notDone) {
        if (notDone == false) {
            return 'checked';
        }
        return '';
    }

    static onChange() {
        return `onchange="eventAggregator.publish('taskCheckedChange', event)"`;
    }
}

class DuedateView {               
    static get(date) {
                if (date) {
                    let dueDate = new Date(date);
                    dueDate.setHours(23,59);

                    const taskDate = 'Deadline: ' + formatDistance(
                        dueDate,
                        Date.now(),
                        {addSuffix:true}
                    );

                    return `<span class="task-date">${taskDate}</span>`
                }
                return '';
    }
}

class ProjectView {
    static get(projectID) {
        if (projectID != undefined) {
            const project = Projects.getByID(projectID);
            return `
            <span class="task-project">Project: <a href="#" onclick="eventAggregator.publish('projectFilterClick','${project.id}');">
                ${project.name}</a></span>`;
                // it could be beter: projectFilterClick, {passed arguments: project id or name}
        }
        return '';
    }
}

class Header {
    constructor(text) {
        this.text = text;
    }

    static for(page, filter) {
        switch(page) {
            // how to render names of dates and projects
            case 'projectFilter':
                return new this(`Project: ${filter}`).getText();
                break;
            case 'dateFilter':
                return new this(`Due date: ${filter}`).getText();
                break;
            default:
                return new this('So let\'s go').getText();
        }
    }

    getText() {
        return this.text;
    }
}


class Sidebar {
    static get(dateFilters,projectsList) {
        return `
            ${this.getBasicNav()}
            ${this.getDateFilters(dateFilters)}
            ${this.getProjectsList(projectsList)}
        `;
    }

    static getBasicNav() {
        return `
        <ul class="nav">
            <li class="all-li" data-link-id="index" onclick="eventAggregator.publish('indexClick')">
                <a class="all"  href="#">Everything</a>
                <span class="count">${Tasks.getAllAsArray().length}</span>
            </li>
        </ul>`
    }

    static getDateFilters(dateFilters) {
        dateFilters = dateFilters.map(filter => {

            return `
                <li class="today-li" data-link-id="dateFilter${filter}" onclick="eventAggregator.publish('dateFilterClick','${filter}');">
                    <a class="${filter}" href="#">${helpers.capitalizer(filter)}</a>
                    <span class="count">${Tasks.filterByDate(filter).length}</span>
                </li>`
        });

        return `
        <ul class="nav">
            <h4>Due date</h4>
            ${dateFilters.join('\n')}
        </ul>`
    }

    static getProjectsList(projectsList) {
        projectsList = projectsList.map(project => {
            return `
                <li data-name="" data-id="${project.id}" data-link-id="projectFilter${project.id}" onclick="eventAggregator.publish('projectFilterClick','${project.id}');">
                    <a class="${'project.name'}">${project.name.toUpperCase()}</a>
                    <span class="count">${project.countTasksInside()}</span>
                </li>`;
        })
        return `
            <h4>Projects</h4>
            <ul id="projects" class="nav projects-list">
                ${projectsList.join('\n')}
            </ul>
        `;
    }
}


class Form {
    constructor(taskObj) {
        if (taskObj !== undefined) {
            this.name = taskObj.name;
            this.project = taskObj.project;
            this.due = taskObj.due;
            this.id = taskObj.id;
            this.priority = taskObj.priority;
        }
    }

    static create(task) {
        return new Form(task).create();
    }

    static edit(task) {
        return new FormEdit(task).create();
    }

    static close() {
        const formIsHere = document.querySelector('.todo-form');
        if (formIsHere) {
            formIsHere.remove();
        }
    }

    static submit(e) {
            const formData = this.getFormData();
            this.saveNewTask(formData);
    }

    static saveNewTask(formData) {
        Tasks.add({
            name: formData.get('task-name'),
            due: formData.get('task-date'),
            priority: formData.get('task-priority'),
            description: '',
            project: formData.get('task-project')
        });
        LocalStorage.saveToLocalStorage();
        LocalStorage.saveToLocalStorage(
            LocalStorage.projectsStorage,
            Projects.getAll()
        );
    }

    static getFormData() {
        // form validator, no empty names
            //e.preventDefault();
        const form = document.querySelector('.todo-new-form');
        const formData = new FormData(document.querySelector('form'));
        const id = form.getAttribute('data-id');
        formData.id = id;
        return formData;
    }

    checkUndefined(value) {
        if (value === undefined) {
            return "";
        }
        return value;
    }

    getPredefinedValues() {
        if (this.id === undefined) {
            return {
                id: undefined,
                name: undefined,
                priority: undefined,
                project: this.getPredefinedProject(),
                due: undefined
            }
        } else {
            return {
                id: this.id,
                name: this.name,
                priority: this.priority,
                project: this.getPredefinedProject(),
                due: this.due
            }
        }
    }

    addEditClass() {
        return '';
    }

    create() {
        Form.close();

        const predefined = this.getPredefinedValues();


        const liForm = document.createElement('li');
        liForm.className = 'todo-form';
        liForm.innerHTML = `
                <form class="todo-new-form ${this.addEditClass()}" method="post" data-id="${predefined.id}">
                    <span class="task-check"></span>
                        ${this.getNameInput(predefined.name)}
                    <span class="task-priority-edit">
                        ${this.getPrioritySelector(predefined.priority)}
                    </span>
                    <div class="task-extras">
                        ${this.getDateInput(predefined.due)}
                        ${this.getProjectsSelector(predefined.project)}
                    </div>
                    ${this.getButtons()}
                </form>
        `;
        return liForm;
    }


    getPredefinedProject() {
        const project = Projects.getByID(AppState._currentFilter);
        if (project) {
            return project.id;
        }
        return this.project;
    }

    getPrioritySelector(priorityID) {
        let prioritiesList = Priorities.getAllAsArray();
        prioritiesList = 
            prioritiesList.map(priority => {
                return `
                <option ${priorityID == priority.id ? "selected=\"true\"" : ""} value="${priority.id}">${priority.name}</option>`;
            })
            .join('\n');
        return `
            <label>Priority<select name="task-priority">
                ${prioritiesList}
            </select></label>`;
    }

    getProjectsSelector(projectID) {
        const currentProj = projectID === undefined ? undefined : Projects.getByID(projectID).name;
        const projectsOptions = Projects.getProjectsSorted()
            .map(project => {
                return `<option value="${project.name}"></option>`
            }).join('\n');
        return `
            <span class="task-project">
                <label>Project: <input type="text" list="project" class="project" name="task-project" value="${this.checkUndefined(currentProj)}" placeholder="Add to Project"></label>
                <datalist id="project">
                    ${projectsOptions}
                </datalist>
            </span>`
    }

    getDateInput(date) {
        const dateSelected = date === undefined ? '' : format(date,'yyyy-MM-dd');
        return `
            <span class="task-date">
                <label>Deadline: <input type="date" name="task-date" value="${dateSelected}" min="${format(new Date(),'yyyy-MM-dd')}">
                </label>
            </span>`;
    }

    getNameInput(name) {
        return `
            <span class="task-name">
                <input type="text" name="task-name" value="${this.checkUndefined(name)}" placeholder="To do..." required>
            </span>
        `;
    }

    getButtons() {
        const submitClick = `eventAggregator.publish('formSubmit',event)`;
        const resetClick = `eventAggregator.publish('closeForm')`;
        return `
            <span class="task-edit-buttons">
                <button onclick="${submitClick}" type="submit" class="save" ">Save</button>
                <button onClick="${resetClick}" type="reset" class="cancel">Cancel</button>
            </span>`;
    }

}

class FormEdit extends Form {
    static submit(e) {
        const formData = this.getFormData();
        this.saveEditedTask(formData);
    }

    static saveEditedTask(formData) {
        Tasks.updateByID(formData.id,
            {
                name: formData.get('task-name'),
                due: formData.get('task-date'),
                priority: formData.get('task-priority'),
                description: '',
                project: formData.get('task-project')
            }
        );
        // LOCALSTORAGE TEST
        LocalStorage.saveToLocalStorage();
        LocalStorage.saveToLocalStorage(
            LocalStorage.projectsStorage,
            Projects.getAll()
        );

        
    }

    static close(e) {
        let target = e.target;
        while(target.getAttribute('data-id') == null) {
            target = target.parentNode;
        }

        const id = target.getAttribute('data-id');

        PageTemplate.renderTaskAfterEdit(
            Tasks.getByID(id),
            target
        );

        Form.close();
    }

    addEditClass() {
        return 'todo-edit-form';
    }

    getButtons() {
        const submitClick = `eventAggregator.publish('formEditSubmit',[event])`;
        const resetClick = `eventAggregator.publish('reloadPage',event)`;
        return `
            <span class="task-edit-buttons">
                <button onclick="${submitClick}" type="submit" class="save" ">Save</button>
                <button onClick="${resetClick}" type="reset" class="cancel">Cancel</button>
            </span>`;
    }


}

class Interface {
    static highlightLink() {
        const currentFilter =
            AppState._currentFilter === undefined ?
                '' : AppState._currentFilter;
        const link = document.querySelector(`[data-link-id="${AppState._currentPage}${currentFilter}"]`);

        if (link) {
            link.setAttribute('data-link-active','true');
        }

    }
}


class PageController {
    static useDateFilter(date) {
        Router.for('dateFilter',date);
    }

    static useProjectFilter(id) {
        Router.for('projectFilter',id);
    }

    static kindlyCloseCurrentForm() {
        let existingForm = document.querySelector('.todo-edit-form');

        if (existingForm) {
            FormEdit.close({target:existingForm});
        }
    }

    static renderForm() {
        PageController.kindlyCloseCurrentForm();
        PageTemplate.renderForm();
    }

    static closeForm() {
        Form.close();
    }

    static formSubmit(e) {
        Form.submit(e);
        Router.for(AppState._currentPage,AppState._currentFilter);
    }

    static formEditSubmit(e) {
        FormEdit.submit(e);
        Router.for(AppState._currentPage,AppState._currentFilter);
    }

    static formEditClose(e) {
        Form.close(e);
    }

    static deleteTask(e) {
        let target = e.target;
        while(target.getAttribute('data-id') == null) {
            target = target.parentNode;
        }

        const id = target.getAttribute('data-id');

        Tasks.deleteByID(id);
        LocalStorage.saveToLocalStorage();
        LocalStorage.saveToLocalStorage(
            LocalStorage.projectsStorage,
            Projects.getAll()
        );
        Router.for(AppState._currentPage,AppState._currentFilter);
    }

    static dateCLick(event, action,argument) {

    }

    static editTask(e) {
        let target = e.target;
        while(target.getAttribute('data-id') == null) {
            target = target.parentNode;
        }

        const id = target.getAttribute('data-id');

        PageController.kindlyCloseCurrentForm();
        
        PageTemplate.renderTaskEdit(target,Form.edit(Tasks.getByID(id)));

        try {
            target.remove();
        } catch {

        }
    }

    static checkTask(event) {
        const id = event.target.getAttribute('data-id');
        const checked = !event.target.checked;
        Tasks.updateByID(id,{
            notDone: checked
        });
        
        LocalStorage.saveToLocalStorage();
    }
}


class Router {
    static for(page,filter) {
        switch(page) {
            case 'dateFilter':
                AppState.currentPage = 'dateFilter';
                AppState._currentFilter = filter;
                return Page.is({
                    name:'dateFilter',
                    type:'dateFilter',
                    filter:filter
                }).render();
                break;    
            case 'projectFilter':
                AppState.currentPage = 'projectFilter';
                AppState._currentFilter = filter;
                return Page.is({
                    name:'projectFilter',
                    type:'projectFilter',
                    id:filter
                }).render();
                break;
            default:
                AppState.currentPage = 'index';
                AppState._currentFilter = undefined;
                return Page.is({
                    name: 'index',
                    type: 'index'
                }).render();
        }
    }
}

module.exports = { Router, PageController, AppState };