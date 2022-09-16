// HOW DO WE KNOW, where are we
// WHICH PAGE IS OPENED NOW

// NEXT
// SAVE TASK CHECKMARK, WHEN WE MARK TASK AS COMPLETED
// SIDEBAR
// ANOTHER PAGES

// AFTER ALL: logic for current page: what to refresh after add and edit
//, predefined values and so on

// localSTORAGE

const { helpers } = require('./helpers');
const { Projects, Tasks, Priorities } = require('./newTask');
const { formatDistance, format } = require('date-fns');

class Page {
    constructor(name,type) {
        this.name = name;
        this.type = type;
        this.headerText = this.getHeader();
        this.tasks = this.getTasks(Tasks.getSortedByDueDate());
        this.sidebar;
        console.log(this.tasks)
    }

    getHeader() {
        return Header.for(this.name);
    }

    getSidebar(sidebar) {
        // use namees for static objects
        // use filters
    }

    getTasks(source) {
        return source;
    }

    render(template = PageTemplate) {
        new template(this).render();
    }
}


//maybe register elements on pagetemplate or page entity,
// it would be easer to do: remove this.form
class PageTemplate {
    constructor(pageObj) {
        this.name = pageObj.name,
        this.type = pageObj.type,
        this.tasks = pageObj.tasks,
        this.headerText = pageObj.headerText;
    }

    render() {
        console.log(this.headerText);
        this.renderHeader();
        this.renderTasks();
        // render sidebar
        // render tasks
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
            // dont like links with arguments mess !!!!! register event on each click, to only send one word, but not the poem
            const ul = document.createElement('ul');
            ul.className = 'todos';
            this.tasks.forEach((task) => {
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
                ul.appendChild(li);
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

//maybe make whole main block with header and tasks


class PageController {
    // i need to know current page id !
    static renderForm() {
        PageTemplate.renderForm();
    }

    static closeForm() {
        Form.close();
    }

    static formSubmit(e) {
        Form.submit(e);
        Router.for();
    }

    static formEditSubmit(e) {
        FormEdit.submit(e);
        Router.for();
    }

    static deleteTask(e) {
        let target = e.target;
        while(target.getAttribute('data-id') == null) {
            target = target.parentNode;
        }

        const id = target.getAttribute('data-id');

        Tasks.deleteByID(id);
        Router.for();
    }

    static editTask(e) {
        let target = e.target;
        while(target.getAttribute('data-id') == null) {
            target = target.parentNode;
        }

        const id = target.getAttribute('data-id');

        PageTemplate.renderTaskEdit(target,Form.edit(Tasks.getByID(id)));

        try {
            target.remove();
        } catch {

        }

        // BIG TROUBLE: AFTER CANCELATION, WE HAVE TO GET OUR TASK BACK
        // MAKE PAGE REFRESH
        // NEXT QUESTION IS, WHICH PAGE WE HAVE TO RELOAD!
    }

    static checkTask(event) {
        const id = event.target.getAttribute('data-id');
        const checked = !event.target.checked;
        Tasks.updateByID(id,{
            notDone: checked
        });
    }
}

class Checkbox {

    static get(name, id, doneStatus) {
        return `
        <input type="checkbox" ${this.onChange()} name="${name}" data-id="${id}" ${this.getValue(doneStatus)}></input>`;
    }

    static getValue(notDone) {
        if (notDone === false) {
            return 'checked';
        }
        return '';
    }

    static onChange() {
        return `onchange="eventAggregator.publish('taskCheckedChange', event)"`;
    }


}

// make class views, and use common method get, if empty then ...
class DuedateView {               
    static get(date) {
                if (date) {
                    const dueDate = new Date(date);
                    dueDate.setHours(23,59);
        
                    const taskDate = 'Deadline: ' + formatDistance(
                        new Date(dueDate),
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
            return `
            <span class="task-project">Project: <a href="#" onclick="eventsController('projectClick',
                [
                    document.querySelector('.main-content'),
                    projects.getTasksOfProject('${Projects.getByID(projectID).name}'),
                    '${Projects.getByID(projectID).name}',
                    event
                ]);
                eventsController('linkClick',{event:event,target:document.querySelector('.${Projects.getByID(projectID).name}')})">
                ${Projects.getByID(projectID).name}</a></span>`;
                // it could be beter: projectFilterClick, {passed arguments: project id or name}
        }
        return '';
    }
}


// get page with data // controller
class Router {
    static for(page) {
        switch(page) {
            case 'datefilter': 1;
                break;    
            case 'projectfilter': 1;
                break;
            default: return new Page({
                name: 'index',
                type: 'index'
            }).render();
        }
    }
}

// QUESTION ABOUT FORM, we have to create special version of form for each page,
// if we have this pagem then we use next form for it with/
// some elements already predefined



// use this object to render details on page


// INTERFACE // CONTROLLER

class Sidebar {

}

class Header {
    constructor(text) {
        this.text = text;
    }

    static for(page) {
        switch(page) {
            // how to render names of dates and projects
            case 'projectfilter': 1;
                break;
            case 'datefilter': 2;
                break;
            default: return new this('So let\'s go').getText();
        }
    }

    getText() {
        return this.text;
    }
}

class TaskController {
    //mark completed 
    //show
    //edit
    //add
}

// WHere should be a form render
// Whete it has to be controlled

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

    static create(blah) {
        return new Form(blah).create();
    }

    static edit(blah) {
        return new FormEdit(blah).create();
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
                project: undefined,
                due: undefined
            }
        } else {
            return {
                id: this.id,
                name: this.name,
                priority: this.priority,
                project: this.project,
                due: this.due
            }
        }
    }

    create() {
        Form.close();

        const predefined = this.getPredefinedValues();

        const liForm = document.createElement('li');
        liForm.className = 'todo-form';
        liForm.innerHTML = `
                <form class="todo-new-form" method="post" data-id="${predefined.id}">
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
                <label>Project: <input type="text" list="project" class="project" name="task-project" value="${currentProj}" placeholder="Add to Project"></label>
                <datalist id="project">
                    ${projectsOptions}
                </datalist>
            </span>`
    }

    getDateInput(date) {
        const dateSelected = date === undefined ? '' : format(date,'yyyy-MM-dd');
        // IT'S Question, whether it is good or bad idea to select due date as today
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

    //     // IF ON PROJECT PAGE, THAN ADD BY DEFAULT
    //     // IF MAIN HAS PROJECT-ID, THAN USE BY DEFAULT

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
    }

    getButtons() {
        const submitClick = `eventAggregator.publish('formEditSubmit',[event])`;
        const resetClick = `eventAggregator.publish('reloadPage')`;
        return `
            <span class="task-edit-buttons">
                <button onclick="${submitClick}" type="submit" class="save" ">Save</button>
                <button onClick="${resetClick}" type="reset" class="cancel">Cancel</button>
            </span>`;
    }


}

// using templates to render

// using interface methods to highlight links and so on


class Interface {
    giveProjectsCount() {
        // have an object, which has name and count
        // filer empty projects!!!
    }

    giveDateFilterOptions() {
        // show all options for search by date
    }
}

class Render {
    static it() {

    }
}


// PAGES
// -- index
// -- filtered
// ---- Date Filter
// ------ today
// ------ week
// ---- Projects' pages (created dynamically)

module.exports = { Router, PageController };