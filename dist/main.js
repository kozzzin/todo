/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { helpers } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n\nclass Event {\n    constructor(name) {\n        this.name = name;\n        this.handlers = [];\n    }\n\n    addHandlers(handlers) {\n        if (Array.isArray(handlers)) {\n            handlers.forEach((h) => {\n                this.handlers.push(h);\n            });\n        } else {\n            this.handlers.push(handlers);\n        }\n    }\n\n    removeHandler(handler) {\n        const index = this.handlers.findIndex(h => h == handler);\n        if (index != -1) {\n            this.handlers.splice(index,1);\n        }\n    }\n\n    fire(args) {\n        this.handlers.forEach((handler) => {\n            if (Array.isArray(args)) {\n                handler(...args);\n            } else {\n                handler(args);\n            }\n            \n        });\n    }\n}\n\nconst eventAggregator = (function() {\n    const events = {};\n\n    return {\n        publish(eventName,eventArgs) {\n            if (!helpers.keyInObj(eventName,events)) {\n                events[eventName] = new Event(eventName);\n            }\n            events[eventName].fire(eventArgs);\n        },\n\n        subscribe(eventName,handler) {\n            if (!helpers.keyInObj(eventName,events)) {\n                events[eventName] = new Event();\n            }\n\n            events[eventName].addHandlers(handler);\n        },\n\n        showEvents() {\n            return events;\n        }\n    }\n})();\n\n\n\n// function for right extraction order from a task object!\n// maybe return as object\n\nfunction eventController(event,eventArgs) {\n    eventAggregator.publish(event,eventArgs);\n\n   if (event === 'resetButtonClicked') {\n       console.log(event);\n   }\n\n}\n\nmodule.exports = { eventAggregator, eventController }\n\n//# sourceURL=webpack://todo/./src/events.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((module) => {

eval("const helpers = (function() {\n    return {\n        keyInObj(key,obj) {\n            if (key in obj) {\n                return true;\n            } else {\n                console.log(`no such key: ${key}`);\n                return false;\n            }\n        },\n\n        capitalizer(str) {\n            return str[0].toUpperCase() + str.slice(1);\n        }\n        \n    }\n})();\n\n\nmodule.exports = { helpers };\n\n//# sourceURL=webpack://todo/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { createTask, tasksStorage, projects } = __webpack_require__(/*! ./tasks */ \"./src/tasks.js\");\nconst { templates } = __webpack_require__(/*! ./templates */ \"./src/templates.js\")\nconst { eventAggregator } = __webpack_require__(/*! ./events */ \"./src/events.js\");\n\n\nconsole.log('huy na!');\n\n\nconst task = createTask(\n    'take money',\n    '2009-05-12',\n    '0',\n    'vaflia must be eaten',\n    'website'\n);\n\ncreateTask(\n    'take money',\n    '2022-05-11',\n    '2',\n    'vaflia must be eaten',\n    'website'\n);\n\ncreateTask(\n    'take money',\n    '2005-03-17',\n    '1',\n    'vaflia must be eaten',\n    'laba'\n);\n\n\n// console.log(task);\n\n\n// tasksStorage.loadAllTasks();\n\n// tasksStorage.deleteFromStorageById(0);\n\n// console.log(tasksStorage.getTaskById(0));\n\n\n// const updater = tasksStorage.getTaskById(0);\n\n\n// tasksStorage.updateTaskById(0,updater);\n\n// tasksStorage.loadAllTasks();\n\n\n\n// console.log(projects.getTasksOfProject('website'));\n\nprojects.addProject('biba');\nprojects.addProject('zalupka');\n\n\nconsole.log(Object.keys(projects.getAllProjects()));\n\n\n\n// render projects list\ntemplates.renderProjects(\n    document.querySelector('.sidebar'),\n    Object.values(projects.getAllProjects())\n);\n\n\ntemplates.renderTasks(\n    document.querySelector('.main-content'),\n    Object.values(tasksStorage.loadAllTasks())\n    );\n\n\n\n\nfunction formSubmit(e,edit=false) {\n\n    // form validator, no empty names\n\n    console.log('edit ', edit);\n    if (edit) {\n        console.log('edit!!!');\n    }\n    console.log(e);\n    const form = document.querySelector('.todo-new-form');\n    // form.preventDefault();\n    // form.preventDefault()\n    console.log(e.target);\n    const formData = new FormData(document.querySelector('form'));\n\n    if (edit) {\n        const id = form.getAttribute('data-id');\n        const task = tasksStorage.getTaskById(id);\n        task.update(\n            {\n                name: formData.get('task-name'),\n                due: formData.get('task-date'),\n                priority: formData.get('task-priority'),\n                proj: formData.get('task-project')\n            }\n        );\n    } else {\n        createTask(\n            formData.get('task-name'),\n            formData.get('task-date'),\n            formData.get('task-priority'),\n            '',\n            formData.get('task-project')\n        );\n    }\n    \n\n\n\n    console.log(tasksStorage.loadAllTasks());\n\n    templates.renderProjects(\n        document.querySelector('.sidebar'),\n        Object.values(projects.getAllProjects())\n    );\n    \n    \n    templates.renderTasks();\n};\n\n\n\ntemplates.templatesController();\n\n// module.exports =  { formSubmit }\n\n\n    // have a trouble when click two times on add form, \n\n// window.formSubmit = formSubmit;\n// window.renderForm = templates.renderForm;\nwindow.renderTasks = templates.renderTasks;\nwindow.editTask = templates.editTask;\nwindow.deleteTask = templates.deleteTask;\n// window.eventController = eventController;\nwindow.projects = projects;\n\n\n\neventAggregator.subscribe('formSubmit',formSubmit);\neventAggregator.subscribe('showAllTasks',templates.renderTasks);\neventAggregator.subscribe('addTask',templates.renderForm);\neventAggregator.subscribe('projectClick', templates.renderTasks);\n\nfunction eventsController(event,eventArgs) {\n    // ...eventArgs\n    eventAggregator.publish(event,eventArgs);\n}\n\n\nwindow.eventsController = eventsController;\n\n//# sourceURL=webpack://todo/./src/index.js?");

/***/ }),

/***/ "./src/tasks.js":
/*!**********************!*\
  !*** ./src/tasks.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { helpers } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n\nconst tasksStorage = (function() {\n    const tasksStorage = {};\n\n    return {\n        addToStorage(task) {\n            tasksStorage[task.id] = task;\n        },\n    \n        deleteFromStorageById(id) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                delete tasksStorage[id];\n            }\n\n        },\n\n        updateTaskById(id, updObj) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                tasksStorage[id].update(updObj)\n            }\n        },\n\n        getTaskById(id) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                return tasksStorage[id];\n            }\n        },\n\n        loadAllTasks() {\n            return tasksStorage;\n            // ret\n        }\n    }\n})();\n\nconst priorities = (function() {\n    const priorities = {\n        0: 'low',\n        1: 'medium',\n        2: 'high'\n    }\n    return {\n        getPriority(id) {\n            return priorities[id];\n        },\n\n        getAllPriorities() {\n            return priorities;\n        }\n    }\n})();\n\nconst projects = (function() {\n\n    class Project {\n        constructor(name) {\n            this.name = name;\n            this.tasks = [];\n        }\n\n        addTask(id) {\n            this.tasks.push(id);\n        }\n\n        deleteTask(id) {\n            const index = this.tasks.findIndex((el) => el == id);\n            this.tasks.splice(index,1);\n        }\n\n        getTasks() {\n            return this.tasks;\n        }\n\n        get length() {\n            return this.tasks.length;\n        }\n    }\n\n    const projectsStorage = new Object();\n\n    return {\n        addProject(name) {\n            name = name.toLowerCase();\n            // check if name has been taken, not delete the old one\n            projectsStorage[name] = new Project(name);\n        },\n\n        deleteProject(name) {\n            if (projectsStorage[name]) {\n                delete projectsStorage[name];\n            }\n        },\n\n        getAllProjects() {\n            return projectsStorage;\n        },\n\n        getProject(name) {\n            if (projectsStorage[name]) {\n                return projectsStorage[name];\n            }\n        },\n\n        getTasksOfProject(name) {\n            const project = this.getProject(name);\n            const tasksIds = project.getTasks();\n            const tasks = tasksStorage.loadAllTasks();\n            const result = [];\n            tasksIds.forEach((id) => {\n               result.push(tasks[id]);\n            });\n            console.log(result);\n            return result;\n        }\n    }\n})();\n\nclass Task {\n    static idCounter = 0\n\n    constructor(name,due,priority,desc,proj) {\n        this.name = name;\n        this.due = due;\n        this.priority = priority;\n        this.desc = desc;\n        this.id = this.constructor.addID();  \n        this.proj = this.constructor.addToProject(proj, this.id);\n        this.status = true;\n    }\n\n    static addID() {\n        return this.idCounter++;\n    }\n\n    static addToProject(project, id) {\n        if (project) {\n            if (!(project in projects.getAllProjects())) {\n               projects.addProject(project);\n\n            }\n            projects.getProject(project).addTask(id);\n            return project;\n        }\n        return undefined;\n    }\n\n    deleteTask() {\n\n    }\n\n    update(updateObj) {\n        Object.assign(this,updateObj)\n    }\n\n}\n\nfunction createTask(name,due,priority,desc,project) {\n    const task = new Task(\n        name,\n        due,\n        priority,\n        desc,\n        project.toLowerCase()\n    ); \n    tasksStorage.addToStorage(task);\n    return task;\n}\n\n\n// make controller for main parts\n// -- createTask\n// -- addTaskTo Projects\n\nmodule.exports = { createTask, tasksStorage, projects, priorities }\n\n//# sourceURL=webpack://todo/./src/tasks.js?");

/***/ }),

/***/ "./src/templates.js":
/*!**************************!*\
  !*** ./src/templates.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { priorities, projects, tasksStorage  } = __webpack_require__(/*! ./tasks */ \"./src/tasks.js\") ;\n\nconst templates = (function() {\n\n    function setAttributes(target, attributes) {\n        Object.keys(attributes).forEach(key => {\n            target.setAttribute(key,attributes[key]);\n        })\n    }\n\n    function projectList(target, projects) {\n        const ul = document.createElement('ul');\n        ul.setAttribute('id','projects');\n        ul.className = 'projects-list';\n        projects.forEach(project => {\n            const li = document.createElement('li');\n            setAttributes(li, {\n                'data-name': project.name,\n                'onclick': `eventsController('projectClick',\n                [\n                    renderTasks(document.querySelector('.main-content')),\n                    projects.getTasksOfProject('${project.name}')\n                ])`\n            });\n            const a = document.createElement('a');\n            a.className = project.name;\n            a.innerText = project.name.toUpperCase();\n            const span = document.createElement('span');\n            span.className = 'count';\n            span.innerText = project.length;\n            li.append(a,span);\n            ul.appendChild(li);\n        });\n\n        // ADD NEW PROJECT BUTTON\n        // NOW YOU CAN ADD NEW PROJECT WHEN EDIT OR ADD NEW TASK\n        // const newButt = document.createElement('a');\n        // newButt.className = 'new-project';\n        // newButt.setAttribute('href','');\n        // const spanPlus = document.createElement('span');\n        // spanPlus.className = 'red-plus';\n        // spanPlus.innerText = '+';\n        // const spanText = document.createElement('span');\n        // spanText.innerText = 'New Project';\n        // newButt.append(spanPlus,spanText);\n        // target.append(ul,newButt);    \n\n        // const sidebar = document.querySelector('aside');\n        //\n        try {\n            target.querySelector('.projects-list').remove();\n            target.querySelector('.new-project').remove();\n        } catch {\n\n        }\n        target.append(ul);        \n    }\n\n    function tasksList(target, tasks) {\n        const ul = document.createElement('ul');\n        ul.className = 'todos';\n        tasks.forEach((task) => {\n\n            const li = document.createElement('li');\n            setAttributes(li,\n                {\n                    'data-id': task.id,\n                    // 'onclick': 'editTask(event)'\n                }       \n            );\n            const checkbox = document.createElement('input');\n            setAttributes(checkbox, {\n                'type': 'checkbox',\n                'name': task.name,\n                'data-id': task.id,\n            });\n            checkbox.checked = !task.status;\n\n            const taskName = document.createElement('span');\n            taskName.className = 'task-name';\n            taskName.innerText = task.name;\n\n\n            const taskPriority = document.createElement('span');\n            taskPriority.className = 'task-priority';\n            taskPriority.innerText = priorities.getPriority(task.priority);\n\n            const taskExtras = document.createElement('div');\n            taskExtras.className = 'task-extras';\n\n            const taskDate = document.createElement('span');\n            taskDate.className = 'task-date';\n            taskDate.innerText = task.due;\n            taskExtras.appendChild(taskDate);\n\n            if (task.proj != undefined) {\n                const taskProject = document.createElement('span');\n                taskProject.className = 'task-project';\n                const taskProjectLink = document.createElement('a');\n                taskProjectLink.setAttribute('href','');\n                taskProjectLink.innerText = task.proj;\n                taskProject.appendChild(taskProjectLink);\n                taskExtras.appendChild(taskProject);\n            } \n\n\n\n            li.append(checkbox, taskName, taskPriority, taskExtras);\n\n            const imgsDiv = document.createElement('div');\n            imgsDiv.className = 'task-edit'\n            const imgs = '<a onclick=\"editTask(event)\" class=\"link-task-edit\"></a><a onclick=\"deleteTask(event)\" class=\"link-task-delete\"></a>';\n\n            // 'data-id': task.id,\n            // 'onclick': 'editTask(event)'\n\n            imgsDiv.innerHTML = imgs;\n\n            li.appendChild(imgsDiv);\n\n            ul.appendChild(li);\n\n        });\n\n        const addTask = document.createElement('li');\n        addTask.className = 'add-task-li';\n        addTask.setAttribute(\n            'onclick',\n            'eventsController(\\'addTask\\',document.querySelector(\\'main ul\\'))'\n        );\n        const spanPlus = document.createElement('span');\n        spanPlus.className = 'add-task-plus';\n        const spanAddTask = document.createElement('span');\n        spanAddTask.className = 'add-task-text';\n        spanAddTask.innerText = 'Add Task';\n        addTask.append(spanPlus,spanAddTask);\n\n        ul.appendChild(addTask);\n\n        try {\n            target.querySelector('ul').remove();\n        } catch {\n            \n        }\n\n        target.append(ul);\n\n    }\n\n    function createForm(target,id,edit=false) {   \n        let name,date,priority,project,placeholder;\n        let today = new Date();\n        today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');\n\n        if (id !== undefined) {\n            const task = tasksStorage.getTaskById(id);\n            name = task.name;\n            date = task.due;\n            project = task.proj;\n            priority = task.priority;\n        } else {\n            placeholder = 'To do...';\n            name='';\n            date = today;\n            project = 'Add to Project';\n        \n        }\n\n        console.log(date);\n        console.log(today);\n\n        // form generator \n\n        const liForm = document.createElement('li');\n        liForm.className = 'todo-form';\n\n        const form = document.createElement('form');\n        form.classList = 'todo-new-form';\n        form.setAttribute('data-id',id);\n\n        const taskCheck = document.createElement('span');\n        taskCheck.classList = 'task-check';\n\n        const taskName = document.createElement('span');\n        taskName.className = 'task-name';\n        const nameInput = document.createElement('input');\n        setAttributes(nameInput, {\n            'type': 'text',\n            'name': 'task-name',\n            'placeholder': placeholder,\n            'value': name\n            // 'required': true\n        });\n        nameInput.required = true;\n\n        taskName.appendChild(nameInput);\n\n        const taskPriority = document.createElement('span');\n        taskPriority.className = 'task-priority-edit';\n        const priorLabel = document.createElement('label');\n        priorLabel.innerText = 'Priority';\n        const priorSelect = document.createElement('select');\n        priorSelect.setAttribute('name','task-priority');\n        const prioritiesList = priorities.getAllPriorities();\n        for (let priorKey of Object.keys(prioritiesList)) {\n            const priorOption = document.createElement('option');\n            if (priorKey == priority) {\n                priorOption.setAttribute('selected','true');\n            }\n            priorOption.setAttribute('value',priorKey);\n            priorOption.innerText = prioritiesList[priorKey];\n            priorSelect.appendChild(priorOption);\n        }\n        \n        priorLabel.appendChild(priorSelect);\n        taskPriority.appendChild(priorLabel);\n\n        const taskExtras = document.createElement('div');\n        taskExtras.className = 'task-extras';\n\n        const taskDate = document.createElement('span');\n        taskDate.className = 'task-date';\n        const dateLabel = document.createElement('label');\n        dateLabel.innerText = 'Deadline: ';\n        const taskDateInput = document.createElement('input');\n        setAttributes(taskDateInput,{\n            type: 'date',\n            name: 'task-date',\n            value: date,\n            min: today\n        })\n\n        dateLabel.appendChild(taskDateInput);\n        taskDate.appendChild(dateLabel);\n        \n\n        const taskProjectAdd = document.createElement('span');\n        taskProjectAdd.className = 'task-project';\n        const taskProjectAddLabel = document.createElement('label');\n        taskProjectAddLabel.innerText = 'Project: ';\n        const taskProjectAddInput = document.createElement('input');\n        setAttributes(taskProjectAddInput, {\n           type: 'text',\n           list: 'project',\n           class: 'project',\n           name: 'task-project' \n        });\n\n        if (edit) {\n            taskProjectAddInput.setAttribute('value',project);\n        } else {\n            taskProjectAddInput.setAttribute('placeholder',project);\n        }\n\n        taskProjectAddLabel.appendChild(taskProjectAddInput);\n\n        const projectDatalist = document.createElement('datalist');\n        projectDatalist.setAttribute('id','project');\n\n        const projectsList = projects.getAllProjects();\n        for (let projKey of Object.keys(projectsList)) {\n            const projOption = document.createElement('option');\n            projOption.setAttribute('value',projKey);\n            // projOption.innerText = prioritiesList[projKey];\n            projectDatalist.appendChild(projOption);\n        }\n\n        taskProjectAdd.append(taskProjectAddLabel,projectDatalist);\n\n        taskExtras.append(taskDate,taskProjectAdd);\n\n        const taskButtons = document.createElement('span');\n        taskButtons.className = 'task-edit-buttons';\n        if (!edit) {\n            taskButtons.innerHTML = `\n            <button type=\"submit\" class=\"save\" onclick=\"eventsController('formSubmit',event)\">Save</button> \n            <button  onclick=\"eventsController('showAllTasks')\" type=\"reset\" class=\"cancel\">Cancel</button>`;\n            // depends on page, better show this li back than rerender all\n        } else {\n            console.log(edit);\n            taskButtons.innerHTML = `\n            <button type=\"submit\" class=\"save\" onclick=\"eventsController('formSubmit',[event,true])\">Save</button> \n            <button onclick=\"eventsController('showAllTasks')\" type=\"reset\" class=\"cancel\">Cancel</button>`;\n        }\n        \n\n        // IF ON PROJECT PAGE, THAN ADD BY DEFAULT\n        // IF MAIN HAS PROJECT-ID, THAN USE BY DEFAULT\n\n        form.append(taskCheck,taskName,taskPriority,taskExtras,taskButtons);\n\n        console.log(form);\n        liForm.append(form);\n        \n        return liForm;\n    }\n\n\n    function hideAddTaskLink() {\n        try {\n            document.querySelector('.add-task-li').remove();\n        } catch {\n            \n        }\n        \n    }\n\n    \n\n   \n\n    return {\n        renderProjects(target, projects) {\n            if (projects == undefined) {\n                projects = ['website','big app', 'database'];\n            }\n            projectList(target, projects);\n        },   \n        \n        renderTasks(target,tasks) {\n            if (tasks === undefined) {\n                tasks = Object.values(tasksStorage.loadAllTasks());\n            }\n            if (target === undefined) {\n                target = document.querySelector('.main-content');\n            }\n            tasksList(target, tasks);\n            \n        },\n\n        renderForm(target,id,edit=false) {\n            const form = createForm(target,id,edit);\n            if (edit) {\n                const targetParent = target.parentNode;\n                targetParent.insertBefore(form, target);\n            } else {\n                target.append(form);\n            }\n            \n            hideAddTaskLink();\n        },\n\n        hideForm() {\n\n        },\n\n        templatesController() {\n            const that = this;\n            // document.querySelector('.add-task-li')\n            //     .addEventListener('click',function(e) {\n            //         that.renderForm(document.querySelector('main ul'));\n            //     });\n        },\n\n        editTask(e) {\n            let target = e.target;\n            while(target.getAttribute('data-id') == null) {\n                target = target.parentNode;\n            }\n\n            const id = target.getAttribute('data-id');\n\n\n\n            templates.renderForm(target,id,true);\n\n            try {\n                target.remove();\n            } catch {\n\n            }\n        },\n\n        deleteTask(e) {\n            let target = e.target;\n            while(target.getAttribute('data-id') == null) {\n                target = target.parentNode;\n            }\n\n            const id = target.getAttribute('data-id');\n\n            const projName = tasksStorage.getTaskById(id).proj;\n\n            if (!!projName) {\n                projects.getProject(projName).deleteTask(id);\n            }\n\n            tasksStorage.deleteFromStorageById(id);\n            // delete from project\n\n            templates.renderTasks();\n            templates.renderProjects(\n                document.querySelector('.sidebar'),\n                Object.values(projects.getAllProjects())\n            );\n        },\n\n\n    }\n\n})();\n\n\n\n// change header when render project page\n// use project name by default in form to add new tassk\n// imporove reset button logic:\n// depends on page, better show this li back than rerender all\n\n\n\nmodule.exports = { templates }\n\n\n\n//# sourceURL=webpack://todo/./src/templates.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;