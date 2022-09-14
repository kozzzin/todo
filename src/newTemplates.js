// HOW DO WE KNOW, where are we
// WHICH PAGE IS OPENED NOW

const { helpers } = require('./helpers');
const { Projects, Tasks, Priorities } = require('./newTask');
const { formatDistance } = require('date-fns');

class Page {
    constructor(name,type) {
        this.name = name;
        this.type = type;
        this.header = this.getHeader();
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

class PageTemplate {
    constructor(pageObj) {
        this.name = pageObj.name,
        this.type = pageObj.type,
        this.tasks = pageObj.tasks,
        this.header = pageObj.header;
    }

    render() {
        console.log(this.header);
        this.renderHeader();
        this.renderTasks();
        // render header
        // render sidebar
        // render tasks
    }

    renderHeader(target = '.main-content', element = 'h2') {
        this.header = helpers.capitalizer(this.header);
        let h2 = document.querySelector(element);
        if (h2) {
            h2.innerText = '';
        } else {
            h2 = document.createElement(element);
            document.querySelector(target).appendChild(h2);
        }
        
        h2.innerText = this.header;    
    }

    renderTasks(target = '.main-content') {
            // dont like links with arguments mess !!!!! register event on each click, to only send one word, but not the poem
            const ul = document.createElement('ul');
            ul.className = 'todos';
            this.tasks.forEach((task) => {
                const li = document.createElement("li");
                li.setAttribute('data-id',task.id);
                li.innerHTML = 
                `<input type="checkbox" name="${task.name}" data-id="${task.id}" ${Checkbox.getValue(task.notDone)}>
                    <span class="task-name">${task.name}</span>
                    <span class="task-priority ${Priorities.getName(task.priority)}">${Priorities.getName(task.priority)}</span>
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
                'eventsController(\'addTask\',document.querySelector(\'main ul\'))'
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
}


class Checkbox {
    static getValue(notDone) {
        if (notDone === false) {
            return 'checked';
        }
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
            <span class="task-project"><a href="#" onclick="eventsController('projectClick',
                [
                    document.querySelector('.main-content'),
                    projects.getTasksOfProject('laba'),
                    'laba',
                    event
                ]);
                eventsController('linkClick',{event:event,target:document.querySelector('.laba')})">
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

class Form {

}

class EditForm extends Form {

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

module.exports = { Router };