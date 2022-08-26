const templates = (function() {

    function setAttributes(target, attributes) {
        Object.keys(attributes).forEach(key => {
            target.setAttribute(key,attributes[key]);
        })
    }

    function projectList(target, projects) {
        const ul = document.createElement('ul');
        ul.setAttribute('id','projects');
        projects.forEach(project => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = project.name;
            a.innerText = project.name.toUpperCase();
            const span = document.createElement('span');
            span.className = 'count';
            span.innerText = project.length;
            li.append(a,span);
            ul.appendChild(li);
        });

        const newButt = document.createElement('a');
        newButt.className = 'new-project';
        newButt.setAttribute('href','');
        const spanPlus = document.createElement('span');
        spanPlus.className = 'red-plus';
        spanPlus.innerText = '+';
        const spanText = document.createElement('span');
        spanText.innerText = 'New Project';
        newButt.append(spanPlus,spanText);

        const sidebar = document.querySelector('aside');
        target.append(ul,newButt);        
    }

    function tasksList(target, tasks) {
        const ul = document.createElement('ul');
        ul.className = 'todos';
        tasks.forEach((task) => {

            const li = document.createElement('li');
            li.setAttribute('data-id',task.id);
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
            taskPriority.innerText = task.priority;

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
            ul.appendChild(li);
            console.log(li);
        });

        target.querySelector('ul').remove();

        // form generator 

        const liForm = document.createElement('li');
        liForm.className = 'todo-form';

        const form = document.createElement('form');
        form.classList = 'todo-new-form';

        const taskCheck = document.createElement('span');
        taskCheck.classList = 'task-check';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        const nameInput = document.createElement('input');
        setAttributes(nameInput, {
            'type': 'text',
            'name': 'task-name',
            'placeholder': 'To do...',
        });
        taskName.required = true;

        taskName.appendChild(nameInput);

        const taskPriority = document.createElement('span');
        taskPriority.className = 'task-priority-edit';
        taskPriority.innerHTML = `
        <label>Priority:
            <select name="task-priority">
                <!-- <option value="" disabled selected>Select priority</option> -->
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
            </select>
        </label>`;

        const taskExtras = document.createElement('div');
        taskExtras.className = 'task-extras';
        taskExtras.innerHTML = `
        <span class="task-date">
            <label>Deadline: 
                <input type="date"  name="task-date">
            </label>
            </span>
        <span class="task-project">
            <label>Project: 
                <input type="text" list="project" class="project" placeholder="Add to Project"  name="task-project">
            </label>
            <datalist id="project">
                <option>Website</option>
                <option>Big App</option>
                <option>Database</option>
            </datalist>
        </span>`;

        const taskButtons = document.createElement('span');
        taskButtons.className = 'task-edit-buttons';
        taskButtons.innerHTML = `
        <button type="submit" class="save" onclick="window.formSubmit(event)">Save</button>
        <button class="cancel">Cancel</button>`;


        form.append(taskCheck,taskName,taskPriority,taskExtras,taskButtons);

        console.log(form);
        liForm.append(form);
        ul.append(liForm);

        target.append(ul);

    }

    return {
        renderProjects(target, projects) {
            if (projects == undefined) {
                projects = ['website','big app', 'database'];
            }
            projectList(target, projects);
        },   
        
        renderTasks(target,tasks) {
            // tasks = [{
            //     name: 'flame',
            //     id: 25,
            //     due: '12/02/2089',
            //     priority:'low',
            //     project:'website',
            //     status:false}];
            tasksList(target, tasks);
        }
    }

})();


module.exports = { templates }

