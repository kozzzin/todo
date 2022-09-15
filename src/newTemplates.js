// HOW DO WE KNOW, where are we
// WHICH PAGE IS OPENED NOW

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
                    <input type="checkbox" name="${task.name}" data-id="${task.id}" ${Checkbox.getValue(task.notDone)}>
                    <span class="task-name">${task.name}</span>
                    <span class="task-priority ${Priorities.getByID(task.priority).name}">${Priorities.getByID(task.priority).name}</span>
                    <div class="task-extras">
                        ${DuedateView.get(task.due)}
                        ${ProjectView.get(task.project)}
                    </div>
                    <div class="task-edit">
                        <a onclick="eventsController(\'editTaskClick\',event)" class="link-task-edit"></a><a onclick="eventsController(\'deleteTaskClick\',event)" class="link-task-delete"></a>
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

    static renderForm(target = 'main ul') {
        const form = Form.create();
        document.querySelector(target).append(form);
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
}

class Checkbox {
    static getValue(notDone) {
        if (notDone === false) {
            return 'checked';
        }
        return '';
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

    static create(blah) {
        return new Form(blah).create(blah);
    }

    static edit(blah) {
        return new FormEdit(blah).edit(blah);
    }

    static close() {
        const formIsHere = document.querySelector('.todo-form');
        if (formIsHere) {
            formIsHere.remove();
        }
    }

    create() {
        Form.close();
        const liForm = document.createElement('li');
        liForm.className = 'todo-form';
        liForm.innerHTML = `
                <form class="todo-new-form" method="post">
                    <span class="task-check"></span>
                        ${this.getNameInput()}
                    <span class="task-priority-edit">
                        ${this.getPrioritySelector()}
                    </span>
                    <div class="task-extras">
                        ${this.getDateInput()}
                        ${this.getProjectsSelector()}
                    </div>
                    ${this.getButtons()}
                </form>
        `;
        return liForm;
    }

    getPrioritySelector() {
        const prioritiesList = Priorities.ge;
        return `
            <label>Priority<select name="task-priority">
                <option value="0">low</option>
                <option value="1">medium</option>
                <option value="2">high</option>
            </select></label>`;
    }

    getProjectsSelector() {
        const projectsOptions = Projects.getProjectsSorted()
            .map(project => {
                return `<option>${project.name}</option>`
            }).join('\n');
        return `
            <span class="task-project">
                <label>Project: <input type="text" list="project" class="project" name="task-project" placeholder="Add to Project"></label>
                <datalist id="project">
                    ${projectsOptions}
                </datalist>
            </span>`
    }

    getDateInput(date) {
        date = date === undefined ? new Date() : date;
        // IT'S Question, whether it is good or bad idea to select due date as today
        return `
            <span class="task-date">
                <label>Deadline: <input type="date" name="task-date" value="${format(date,'yyyy-MM-dd')}" min="${format(date,'yyyy-MM-dd')}">
                </label>
            </span>`;
    }

    getNameInput() {
        return `
            <span class="task-name">
                <input type="text" name="task-name" placeholder="To do..." required>
            </span>
        `;
    }

    getButtons() {
        const submitClick = `eventsController('formSubmit',event)`;
        const resetClick = `eventAggregator.publish('closeForm')`;
        return `
            <span class="task-edit-buttons">
                <button onclick="${submitClick} type="submit" class="save" ">Save</button>
                <button onClick="${resetClick}" type="reset" class="cancel">Cancel</button>
            </span>`;
        //onclick="eventsController('showAllTasks')"
    }
    //     const form = document.createElement('form');
    //     form.classList = 'todo-new-form';
    //     form.setAttribute('data-id',id);
    //     form.setAttribute('method','post');

    //     const taskCheck = document.createElement('span');
    //     taskCheck.classList = 'task-check';

    //     const taskName = document.createElement('span');
    //     taskName.className = 'task-name';
    //     const nameInput = document.createElement('input');
    //     setAttributes(nameInput, {
    //         'type': 'text',
    //         'name': 'task-name',
    //         'placeholder': placeholder,
    //         'value': name
    //         // 'required': true
    //     });
    //     nameInput.required = true;

    //     taskName.appendChild(nameInput);

    //     const taskPriority = document.createElement('span');
    //     taskPriority.className = 'task-priority-edit';
    //     const priorLabel = document.createElement('label');
    //     priorLabel.innerText = 'Priority';
    //     const priorSelect = document.createElement('select');
    //     priorSelect.setAttribute('name','task-priority');
    //     const prioritiesList = priorities.getAllPriorities();
    //     for (let priorKey of Object.keys(prioritiesList)) {
    //         const priorOption = document.createElement('option');
    //         if (priorKey == priority) {
    //             priorOption.setAttribute('selected','true');
    //         }
    //         priorOption.setAttribute('value',priorKey);
    //         priorOption.innerText = prioritiesList[priorKey];
    //         priorSelect.appendChild(priorOption);
    //     }
        
    //     priorLabel.appendChild(priorSelect);
    //     taskPriority.appendChild(priorLabel);

    //     const taskExtras = document.createElement('div');
    //     taskExtras.className = 'task-extras';

    //     const taskDate = document.createElement('span');
    //     taskDate.className = 'task-date';
    //     const dateLabel = document.createElement('label');
    //     dateLabel.innerText = 'Deadline: ';
    //     const taskDateInput = document.createElement('input');
    //     setAttributes(taskDateInput,{
    //         type: 'date',
    //         name: 'task-date',
    //         value: date,
    //         min: today
    //     })

    //     dateLabel.appendChild(taskDateInput);
    //     taskDate.appendChild(dateLabel);
        

    //     const taskProjectAdd = document.createElement('span');
    //     taskProjectAdd.className = 'task-project';
    //     const taskProjectAddLabel = document.createElement('label');
    //     taskProjectAddLabel.innerText = 'Project: ';
    //     const taskProjectAddInput = document.createElement('input');
    //     setAttributes(taskProjectAddInput, {
    //        type: 'text',
    //        list: 'project',
    //        class: 'project',
    //        name: 'task-project' 
    //     });



    // function createForm(target,id,edit=false) {   
    //     let name,date,priority,project,placeholder;
    //     const today = helpers.todayDate();

    //     if (id !== undefined) {
    //         const task = tasksStorage.getTaskById(id);
    //         name = task.name;
    //         date = task.due;
    //         project = task.proj;
    //         priority = task.priority;
    //     } else {
    //         placeholder = 'To do...';
    //         name='';
    //         date = undefined;
    //         project = 'Add to Project';
        
    //     }

    //     // form generator 
    //     const liForm = document.createElement('li');
    //     liForm.className = 'todo-form';



    //     if (edit) {
    //         taskProjectAddInput.setAttribute('value',project);
    //     } else {
    //         const activeProject = document.querySelectorAll('#projects li');
    //         let projValue;
    //         activeProject.forEach(pro => {
    //             if (pro.classList.contains('active')) {
    //                 projValue = pro.getAttribute('data-name');
    //                 return;
    //             }
    //         });
    //         if (projValue) {
    //             taskProjectAddInput.setAttribute('value',projValue);
    //         } else {
    //             taskProjectAddInput.setAttribute('placeholder',project);  
    //         }
            
    //     }

    //     taskProjectAddLabel.appendChild(taskProjectAddInput);

    //     const projectDatalist = document.createElement('datalist');
    //     projectDatalist.setAttribute('id','project');

    //     const projectsList = projects.getAllProjects();
    //     for (let projKey of Object.keys(projectsList)) {
    //         const projOption = document.createElement('option');
    //         projOption.setAttribute('value',projKey);
    //         // projOption.innerText = prioritiesList[projKey];
    //         projectDatalist.appendChild(projOption);
    //     }

    //     taskProjectAdd.append(taskProjectAddLabel,projectDatalist);

    //     taskExtras.append(taskDate,taskProjectAdd);

    //     const taskButtons = document.createElement('span');
    //     taskButtons.className = 'task-edit-buttons';
    //     if (!edit) {
    //         taskButtons.innerHTML = `
    //         <button type="submit" class="save" onclick="eventsController('formSubmit',event)">Save</button>`;
    //         // depends on page, better show this li back than rerender all
    //     } else {
    //         taskButtons.innerHTML = `
    //         <button type="submit" class="save" onclick="eventsController('formSubmit',[event,true])">Save</button> `;
    //     }

    //     taskButtons.innerHTML += '<button onclick="eventsController(\'showAllTasks\')" type="reset" class="cancel">Cancel</button>';
        

    //     // IF ON PROJECT PAGE, THAN ADD BY DEFAULT
    //     // IF MAIN HAS PROJECT-ID, THAN USE BY DEFAULT

    //     form.append(taskCheck,taskName,taskPriority,taskExtras,taskButtons);

    //     liForm.append(form);
        
    //     return liForm;
    // }


    // renderForm(target,id,edit=false) {
    //     const form = createForm(target,id,edit);
    //     if (edit) {
    //         const targetParent = target.parentNode;
    //         targetParent.insertBefore(form, target);
    //     } else {
    //         target.append(form);
    //     }
        
    //     hideAddTaskLink();
    // },
}

class FormEdit extends Form {
    create() {
        const liForm = document.createElement('li');
        liForm.className = 'todo-form';
        liForm.innerHTML = `
                <form class="todo-new-form" data-id="undefined" method="post">
                    <span class="task-check"></span>
                    <span class="task-name">
                        <input type="text" name="task-name" placeholder="To do..." value="" required="">
                    </span>
                    <span class="task-priority-edit">
                        <label>Priority<select name="task-priority">
                            <option value="0">low</option>
                            <option value="1">medium</option>
                            <option value="2">high</option>
                        </select></label>
                    </span>
                    <div class="task-extras">
                        <span class="task-date">
                            <label>Deadline: <input type="date" name="task-date" value="undefined" min="2022-09-15">
                            </label>
                        </span>
                        <span class="task-project">
                            <label>Project: <input type="text" list="project" class="project" name="task-project" placeholder="Add to Project"></label>
                            <datalist id="project">
                                <option value="website"></option>
                                <option value="laba"></option>
                                <option value="todays"></option>
                                <option value="weeks"></option>
                            </datalist>
                        </span>
                    </div>
                    <span class="task-edit-buttons">
                        <button type="submit" class="save" onclick="eventsController('formSubmit',event)">Save</button>
                        <button onclick="eventsController('showAllTasks')" type="reset" class="cancel">Cancel</button>
                    </span>
                </form>
        `;
        return liForm;
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