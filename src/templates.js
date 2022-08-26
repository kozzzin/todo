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


        console.log('DOCUMENT','document');

        console.log(ul);

        const sidebar = document.querySelector('aside');
        target.append(ul,newButt);        
    }

    function tasksList(target, tasks) {
        const ul = document.createElement('ul');
        ul.className = 'todos';
        tasks.forEach((task) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            setAttributes(checkbox, {
                'type': 'checkbox',
                'name': task.name,
                'data-id': task.id
            });
            li.appendChild(checkbox);
            console.log(li);
        });
        

    }

    return {
        renderProjects(target, projects) {
            if (projects == undefined) {
                projects = ['website','big app', 'database'];
            }
            projectList(target, projects);
        },   
        
        renderTasks(target,tasks) {
            tasks = [{name: 'flame',id: 25}];
            tasksList(target, tasks);
        }
    }

})();


module.exports = { templates }