const { priorities, projects, tasksStorage  } = require('./tasks') ;

const templates = (function() {

    function setAttributes(target, attributes) {
        Object.keys(attributes).forEach(key => {
            target.setAttribute(key,attributes[key]);
        })
    }

    function projectList(target, projects) {
        const ul = document.createElement('ul');
        ul.setAttribute('id','projects');
        ul.className = 'projects-list';
        projects.forEach(project => {
            const li = document.createElement('li');
            setAttributes(li, {
                'data-name': project.name,
                'onclick': `eventsController('projectClick',
                [
                    renderTasks(document.querySelector('.main-content')),
                    projects.getTasksOfProject('${project.name}')
                ])`
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
            taskPriority.className = 'task-priority';
            taskPriority.innerText = priorities.getPriority(task.priority);

            const taskExtras = document.createElement('div');
            taskExtras.className = 'task-extras';

            const taskDate = document.createElement('span');
            taskDate.className = 'task-date';
            taskDate.innerText = task.due;
            taskExtras.appendChild(taskDate);

            if (task.proj != undefined) {
                const taskProject = document.createElement('span');
                taskProject.className = 'task-project';
                const taskProjectLink = document.createElement('a');
                taskProjectLink.setAttribute('href','');
                taskProjectLink.innerText = task.proj;
                taskProject.appendChild(taskProjectLink);
                taskExtras.appendChild(taskProject);
            } 



            li.append(checkbox, taskName, taskPriority, taskExtras);

            const imgsDiv = document.createElement('div');
            imgsDiv.className = 'task-edit'
            const imgs = '<a onclick="editTask(event)" class="link-task-edit"></a><a onclick="deleteTask(event)" class="link-task-delete"></a>';

            // 'data-id': task.id,
            // 'onclick': 'editTask(event)'

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
        let today = new Date();
        today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

        if (id !== undefined) {
            const task = tasksStorage.getTaskById(id);
            name = task.name;
            date = task.due;
            project = task.proj;
            priority = task.priority;
        } else {
            placeholder = 'To do...';
            name='';
            date = today;
            project = 'Add to Project';
        
        }

        console.log(date);
        console.log(today);

        // form generator 

        const liForm = document.createElement('li');
        liForm.className = 'todo-form';

        const form = document.createElement('form');
        form.classList = 'todo-new-form';
        form.setAttribute('data-id',id);

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
            taskProjectAddInput.setAttribute('placeholder',project);
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
            <button type="submit" class="save" onclick="eventsController('formSubmit',event)">Save</button> 
            <button  onclick="eventsController('showAllTasks')" type="reset" class="cancel">Cancel</button>`;
            // depends on page, better show this li back than rerender all
        } else {
            console.log(edit);
            taskButtons.innerHTML = `
            <button type="submit" class="save" onclick="eventsController('formSubmit',[event,true])">Save</button> 
            <button onclick="eventsController('showAllTasks')" type="reset" class="cancel">Cancel</button>`;
        }
        

        // IF ON PROJECT PAGE, THAN ADD BY DEFAULT
        // IF MAIN HAS PROJECT-ID, THAN USE BY DEFAULT

        form.append(taskCheck,taskName,taskPriority,taskExtras,taskButtons);

        console.log(form);
        liForm.append(form);
        
        return liForm;
    }


    function hideAddTaskLink() {
        try {
            document.querySelector('.add-task-li').remove();
        } catch {
            
        }
        
    }

    

   

    return {
        renderProjects(target, projects) {
            if (projects == undefined) {
                projects = ['website','big app', 'database'];
            }
            projectList(target, projects);
        },   
        
        renderTasks(target,tasks) {
            if (tasks === undefined) {
                tasks = Object.values(tasksStorage.loadAllTasks());
            }
            if (target === undefined) {
                target = document.querySelector('.main-content');
            }
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
                Object.values(projects.getAllProjects())
            );
        },


    }

})();



// change header when render project page
// use project name by default in form to add new tassk
// imporove reset button logic:
// depends on page, better show this li back than rerender all



module.exports = { templates }

