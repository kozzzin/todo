const { priorities, projects, tasksStorage  } = require('./tasks') ;
const { Projects, Tasks, Priorities } = require('./newTask');
const { helpers } = require('./helpers');
const { formatDistance } = require('date-fns');

const templates = (function() {

    function setAttributes(target, attributes) {
        Object.keys(attributes).forEach(key => {
            target.setAttribute(key,attributes[key]);
        })
    }

    function chooseActiveLink(event,target) {
        if (target == undefined) {
            target = event.target;

            console.log(target);
    
            while (target.nodeName.toLowerCase() != 'li') {
                target = target.parentNode;
            }
        }


        const li = document.querySelectorAll('.nav li');
        li.forEach(li => {
            if (li.classList.contains('active')) {
                li.classList.remove('active');
            }
        });

        target.classList.add('active');

    }

    function updateTimeFilterCounters() {
        const allCount = document.querySelector('.all-li .count');
        allCount.innerHTML = Array.from(Object.keys(tasksStorage.loadAllTasks())).length;
        const todayCount = document.querySelector('.today-li .count');
        todayCount.innerHTML = tasksStorage.getTasksByDate('today').length;
        const weekCount = document.querySelector('.week-li .count');
        weekCount.innerHTML = tasksStorage.getTasksByDate('week').length;
    }

    function projectList(target, projects) {
        const ul = document.createElement('ul');
        ul.setAttribute('id','projects');
        ul.classList.add('nav', 'projects-list');
        projects.forEach(project => {
            const li = document.createElement('li');
            setAttributes(li, {
                'data-name': project.name,
                'onclick': `eventsController('projectClick',
                [
                    document.querySelector('.main-content'),
                    projects.getTasksOfProject('${project.name}'),
                    '${project.name}',
                    event
                ]);
                eventsController('linkClick',event)
                `
            });
            const a = document.createElement('a');
            a.className = project.name;
            a.innerText = project.name.toUpperCase();
            const span = document.createElement('span');
            span.className = 'count';
            span.innerText = project.length;
            li.append(a,span);
            ul.appendChild(li);
        });

        // ADD NEW PROJECT BUTTON
        // NOW YOU CAN ADD NEW PROJECT WHEN EDIT OR ADD NEW TASK
        // const newButt = document.createElement('a');
        // newButt.className = 'new-project';
        // newButt.setAttribute('href','');
        // const spanPlus = document.createElement('span');
        // spanPlus.className = 'red-plus';
        // spanPlus.innerText = '+';
        // const spanText = document.createElement('span');
        // spanText.innerText = 'New Project';
        // newButt.append(spanPlus,spanText);
        // target.append(ul,newButt);    

        // const sidebar = document.querySelector('aside');
        //
        try {
            target.querySelector('.projects-list').remove();
            target.querySelector('.new-project').remove();
        } catch {

        }
        target.append(ul);        
    }

    function tasksList(target, tasks) {
        const ul = document.createElement('ul');
        ul.className = 'todos';
        tasks.forEach((task) => {

            const li = document.createElement('li');
            setAttributes(li,
                {
                    'data-id': task.id,
                    // 'onclick': 'editTask(event)'
                }       
            );
            const checkbox = document.createElement('input');
            setAttributes(checkbox, {
                'type': 'checkbox',
                'name': task.name,
                'data-id': task.id,
            });
            checkbox.checked = !task.status;

            const taskName = document.createElement('span');
            taskName.className = 'task-name';
            taskName.innerText = task.name;


            const taskPriority = document.createElement('span');
            taskPriority.classList.add(
                'task-priority',
                priorities.getPriority(task.priority)
            );
            taskPriority.innerText = priorities.getPriority(task.priority);

            const taskExtras = document.createElement('div');
            taskExtras.className = 'task-extras';

            const taskDate = document.createElement('span');
            taskDate.className = 'task-date';

            if (task.due) {
                const dueDate = new Date(task.due);
                dueDate.setHours(23,59);
    
                taskDate.innerText = 'Deadline: ' + formatDistance(
                    new Date(dueDate),
                    Date.now(),
                    {addSuffix:true}
                );
            } else {
                taskDate.innerText = '';
            }


            taskExtras.appendChild(taskDate);

            if (task.proj != undefined) {
                const taskProject = document.createElement('span');
                taskProject.className = 'task-project';
                const taskProjectLink = document.createElement('a');
                setAttributes(taskProjectLink,
                    {
                        'href':'#',
                        'onclick': `eventsController('projectClick',
                        [
                            document.querySelector('.main-content'),
                            projects.getTasksOfProject('${task.proj}'),
                            '${task.proj}',
                            event
                        ]);
                        eventsController('linkClick',{event:event,target:document.querySelector('.${task.proj}')})`
                    });
                taskProjectLink.innerText = task.proj;
                taskProject.appendChild(taskProjectLink);
                taskExtras.appendChild(taskProject);
            } 



            li.append(checkbox, taskName, taskPriority, taskExtras);

            const imgsDiv = document.createElement('div');
            imgsDiv.className = 'task-edit'
            const imgs = '<a onclick="eventsController(\'editTaskClick\',event)" class="link-task-edit"></a><a onclick="eventsController(\'deleteTaskClick\',event)" class="link-task-delete"></a>';


            imgsDiv.innerHTML = imgs;

            li.appendChild(imgsDiv);
            ul.appendChild(li);

        });

        const addTask = document.createElement('li');
        addTask.className = 'add-task-li';
        addTask.setAttribute(
            'onclick',
            'eventsController(\'addTask\',document.querySelector(\'main ul\'))'
        );
        const spanPlus = document.createElement('span');
        spanPlus.className = 'add-task-plus';
        const spanAddTask = document.createElement('span');
        spanAddTask.className = 'add-task-text';
        spanAddTask.innerText = 'Add Task';
        addTask.append(spanPlus,spanAddTask);

        ul.appendChild(addTask);

        try {
            target.querySelector('ul').remove();
        } catch {
            
        }

        target.append(ul);

    }

    function createForm(target,id,edit=false) {   
        let name,date,priority,project,placeholder;
        const today = helpers.todayDate();

        if (id !== undefined) {
            const task = tasksStorage.getTaskById(id);
            name = task.name;
            date = task.due;
            project = task.proj;
            priority = task.priority;
        } else {
            placeholder = 'To do...';
            name='';
            date = undefined;
            project = 'Add to Project';
        
        }

        // form generator 
        const liForm = document.createElement('li');
        liForm.className = 'todo-form';

        const form = document.createElement('form');
        form.classList = 'todo-new-form';
        form.setAttribute('data-id',id);
        form.setAttribute('method','post');

        const taskCheck = document.createElement('span');
        taskCheck.classList = 'task-check';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        const nameInput = document.createElement('input');
        setAttributes(nameInput, {
            'type': 'text',
            'name': 'task-name',
            'placeholder': placeholder,
            'value': name
            // 'required': true
        });
        nameInput.required = true;

        taskName.appendChild(nameInput);

        const taskPriority = document.createElement('span');
        taskPriority.className = 'task-priority-edit';
        const priorLabel = document.createElement('label');
        priorLabel.innerText = 'Priority';
        const priorSelect = document.createElement('select');
        priorSelect.setAttribute('name','task-priority');
        const prioritiesList = priorities.getAllPriorities();
        for (let priorKey of Object.keys(prioritiesList)) {
            const priorOption = document.createElement('option');
            if (priorKey == priority) {
                priorOption.setAttribute('selected','true');
            }
            priorOption.setAttribute('value',priorKey);
            priorOption.innerText = prioritiesList[priorKey];
            priorSelect.appendChild(priorOption);
        }
        
        priorLabel.appendChild(priorSelect);
        taskPriority.appendChild(priorLabel);

        const taskExtras = document.createElement('div');
        taskExtras.className = 'task-extras';

        const taskDate = document.createElement('span');
        taskDate.className = 'task-date';
        const dateLabel = document.createElement('label');
        dateLabel.innerText = 'Deadline: ';
        const taskDateInput = document.createElement('input');
        setAttributes(taskDateInput,{
            type: 'date',
            name: 'task-date',
            value: date,
            min: today
        })

        dateLabel.appendChild(taskDateInput);
        taskDate.appendChild(dateLabel);
        

        const taskProjectAdd = document.createElement('span');
        taskProjectAdd.className = 'task-project';
        const taskProjectAddLabel = document.createElement('label');
        taskProjectAddLabel.innerText = 'Project: ';
        const taskProjectAddInput = document.createElement('input');
        setAttributes(taskProjectAddInput, {
           type: 'text',
           list: 'project',
           class: 'project',
           name: 'task-project' 
        });

        if (edit) {
            taskProjectAddInput.setAttribute('value',project);
        } else {
            const activeProject = document.querySelectorAll('#projects li');
            let projValue;
            activeProject.forEach(pro => {
                if (pro.classList.contains('active')) {
                    projValue = pro.getAttribute('data-name');
                    return;
                }
            });
            if (projValue) {
                taskProjectAddInput.setAttribute('value',projValue);
            } else {
                taskProjectAddInput.setAttribute('placeholder',project);  
            }
            
        }

        taskProjectAddLabel.appendChild(taskProjectAddInput);

        const projectDatalist = document.createElement('datalist');
        projectDatalist.setAttribute('id','project');

        const projectsList = projects.getAllProjects();
        for (let projKey of Object.keys(projectsList)) {
            const projOption = document.createElement('option');
            projOption.setAttribute('value',projKey);
            // projOption.innerText = prioritiesList[projKey];
            projectDatalist.appendChild(projOption);
        }

        taskProjectAdd.append(taskProjectAddLabel,projectDatalist);

        taskExtras.append(taskDate,taskProjectAdd);

        const taskButtons = document.createElement('span');
        taskButtons.className = 'task-edit-buttons';
        if (!edit) {
            taskButtons.innerHTML = `
            <button type="submit" class="save" onclick="eventsController('formSubmit',event)">Save</button>`;
            // depends on page, better show this li back than rerender all
        } else {
            taskButtons.innerHTML = `
            <button type="submit" class="save" onclick="eventsController('formSubmit',[event,true])">Save</button> `;
        }

        taskButtons.innerHTML += '<button onclick="eventsController(\'showAllTasks\')" type="reset" class="cancel">Cancel</button>';
        

        // IF ON PROJECT PAGE, THAN ADD BY DEFAULT
        // IF MAIN HAS PROJECT-ID, THAN USE BY DEFAULT

        form.append(taskCheck,taskName,taskPriority,taskExtras,taskButtons);

        liForm.append(form);
        
        return liForm;
    }


    function hideAddTaskLink() {
        try {
            document.querySelector('.add-task-li').remove();
        } catch {
            
        }   
    }

    function addTasksHeader(placeholder, header) {
        // if header in projects, render project
        // else if header in time brackets, render
        // else render tasks
        header = helpers.capitalizer(header);
        let h2 = document.querySelector('h2');
        if (h2) {
            h2.innerText = '';
        } else {
            h2 = document.createElement('h2');
            document.querySelector('.main-content').appendChild(h2);
        }
        
        if (placeholder != undefined) {
            h2.innerText = placeholder;
        }
        h2.innerText += ' ' + header;
    }



   

    return {
        renderProjects(target, projects) {
            // projects = Object.keys(projects);
            // // projects.sort((a,b) => a - b);
            projectList(target, projects);
            updateTimeFilterCounters();
        },

        renderSidebar(target,projects) {

        },
        
        renderTasks(target,tasks) {

            console.log(target,tasks);

            if (tasks === undefined) {
                tasks = Object.values(tasksStorage.loadAllTasks());
            }
            if (target === undefined) {
                target = document.querySelector('.main-content');
            }
            tasksList(target, tasks);
            
        },

        renderTodayTasks(target,tasks) {
            // if (tasks === undefined) {
            //     tasks = Object.values(tasksStorage.loadAllTasks());
            // }
            if (target === undefined) {
                target = document.querySelector('.main-content');
            }

            tasks = tasksStorage.getTasksByDate('today');

            addTasksHeader('Due date: ', 'today');

            tasksList(target, tasks);
            
        },

        renderWeekTasks(target,tasks) {
            // if (tasks === undefined) {
            //     tasks = Object.values(tasksStorage.loadAllTasks());
            // }
            if (target === undefined) {
                target = document.querySelector('.main-content');
            }

            tasks = tasksStorage.getTasksByDate('week');

            addTasksHeader('Due date: ', 'next week');

            tasksList(target, tasks);
            
        },

        renderForm(target,id,edit=false) {
            const form = createForm(target,id,edit);
            if (edit) {
                const targetParent = target.parentNode;
                targetParent.insertBefore(form, target);
            } else {
                target.append(form);
            }
            
            hideAddTaskLink();
        },

        hideForm() {

        },

        renderActivelink(event) {
            chooseActiveLink(event);
        },

        updateCounter() {
            updateTimeFilterCounters();
        },

        renderProjectHeader() {
            addTasksHeader('Project:', arguments[2]);
        },

        renderBasicHeader() {
            const header = "So let's go";
            addTasksHeader(undefined,header);
        },

        templatesController() {
            const that = this;
            // document.querySelector('.add-task-li')
            //     .addEventListener('click',function(e) {
            //         that.renderForm(document.querySelector('main ul'));
            //     });
        },

        editTask(e) {
            let target = e.target;
            while(target.getAttribute('data-id') == null) {
                target = target.parentNode;
            }

            const id = target.getAttribute('data-id');



            templates.renderForm(target,id,true);

            try {
                target.remove();
            } catch {

            }
        },

        deleteTask(e) {
            let target = e.target;
            while(target.getAttribute('data-id') == null) {
                target = target.parentNode;
            }

            const id = target.getAttribute('data-id');

            const projName = tasksStorage.getTaskById(id).proj;

            if (!!projName) {
                projects.getProject(projName).deleteTask(id);
            }

            tasksStorage.deleteFromStorageById(id);
            // delete from project

            templates.renderTasks();
            templates.renderProjects(
                document.querySelector('.sidebar'),
                Object.values(projects.getAllProjectsSorted())
            );
        },


    }

})();



// make current variable, to track where are you
// have trouble: when edit in everywhere, switch to project, but want yo render back current pagw
// problem with rendering in project after saving

// imporove reset button logic:
// depends on page, better show this li back than rerender all



// storage // implement storage
// refactoring

// form validation, empty name input is prohibited

// implement dates library ?? what else? do we need comparison functionss


// complete task logic
// what would be with completed tasks? make them grey, and then user have to delete completed, but we leave completed striked


module.exports = { templates }

