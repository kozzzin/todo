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

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((module) => {

eval("const helpers = (function() {\n    return {\n        keyInObj(key,obj) {\n            if (key in obj) {\n                return true;\n            } else {\n                console.log(`no such key: ${key}`);\n                return false;\n            }\n        }\n    }\n})();\n\nmodule.exports = { helpers };\n\n//# sourceURL=webpack://todo/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { createTask, tasksStorage, projects } = __webpack_require__(/*! ./tasks */ \"./src/tasks.js\");\nconst { templates } = __webpack_require__(/*! ./templates */ \"./src/templates.js\")\n\n\nconsole.log('huy na!');\n\n\nconst task = createTask(\n    'take money',\n    '10/12/2009',\n    'medium',\n    'vaflia must be eaten',\n    'website'\n);\n\ncreateTask(\n    'take money',\n    '10/12/2009',\n    'medium',\n    'vaflia must be eaten',\n    'website'\n);\n\ncreateTask(\n    'take money',\n    '10/12/2009',\n    'medium',\n    'vaflia must be eaten',\n    'website'\n);\n\n\nconsole.log(task);\n\n\ntasksStorage.loadAllTasks();\n\ntasksStorage.deleteFromStorageById(0);\n\nconsole.log(tasksStorage.getTaskById(0));\n\n\nconst updater = tasksStorage.getTaskById(0);\n\n\ntasksStorage.updateTaskById(0,updater);\n\ntasksStorage.loadAllTasks();\n\n\n\nconsole.log(projects.getTasksOfProject('website'));\n\nprojects.addProject('biba');\nprojects.addProject('laba');\nprojects.addProject('zalupka');\n\n\nconsole.log(Object.keys(projects.getAllProjects()));\n\n\n\n// render projects list\ntemplates.renderProjects(\n    document.querySelector('.sidebar'),\n    Object.values(projects.getAllProjects())\n);\n\n\ntemplates.renderTasks();\n\n\n//# sourceURL=webpack://todo/./src/index.js?");

/***/ }),

/***/ "./src/tasks.js":
/*!**********************!*\
  !*** ./src/tasks.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { helpers } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n\nconst tasksStorage = (function() {\n    const tasksStorage = {};\n\n    return {\n        addToStorage(task) {\n            tasksStorage[task.id] = task;\n        },\n    \n        deleteFromStorageById(id) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                delete tasksStorage[id];\n            }\n\n        },\n\n        updateTaskById(id, updObj) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                tasksStorage[id].update(updObj)\n            }\n        },\n\n        getTaskById(id) {\n            if (helpers.keyInObj(id,tasksStorage)) {\n                return tasksStorage[id];\n            }\n        },\n\n        loadAllTasks() {\n            return tasksStorage;\n            // ret\n        }\n    }\n})();\n\nconst projects = (function() {\n\n    class Project {\n        constructor(name) {\n            this.name = name;\n            this.tasks = [];\n        }\n\n        addTask(id) {\n            this.tasks.push(id);\n        }\n\n        deleteTask(id) {\n            const index = tasks.findIndex(id);\n            this.tasks.splice(index,1);\n        }\n\n        getTasks() {\n            return this.tasks;\n        }\n\n        get length() {\n            return this.tasks.length;\n        }\n    }\n\n    const projectsStorage = new Object();\n\n    return {\n        addProject(name) {\n            projectsStorage[name] = new Project(name);\n        },\n\n        deleteProject(name) {\n            if (projectsStorage[name]) {\n                delete projectsStorage[name];\n            }\n        },\n\n        getAllProjects() {\n            return projectsStorage;\n        },\n\n        getProject(name) {\n            if (projectsStorage[name]) {\n                return projectsStorage[name];\n            }\n        },\n\n        getTasksOfProject(name) {\n            const project = this.getProject(name);\n            const tasksIds = project.getTasks();\n            const tasks = tasksStorage.loadAllTasks();\n            tasksIds.forEach((id) => {\n                console.log(tasks[id]);\n            });\n        }\n    }\n})();\n\nclass Task {\n    static idCounter = 0\n\n    constructor(name,due,priority,desc,proj) {\n        this.name = name;\n        this.due = due;\n        this.priority = priority;\n        this.desc = desc;\n        this.id = this.constructor.addID();  \n        this.proj = this.constructor.addToProject(proj, this.id);\n        this.status = true;\n    }\n\n    static addID() {\n        return this.idCounter++;\n    }\n\n    static addToProject(project, id) {\n        if (project) {\n            if (!(project in projects.getAllProjects())) {\n               projects.addProject(project);\n\n            }\n            projects.getProject(project).addTask(id);\n            return project;\n        }\n        return null;\n    }\n\n    deleteTask() {\n\n    }\n\n    update(updateObj) {\n        Object.assign(this,updateObj)\n    }\n\n}\n\nfunction createTask(name,due,priority,desc,project) {\n    const task = new Task(\n        name,\n        due,\n        priority,\n        desc,\n        project\n    ); \n    tasksStorage.addToStorage(task);\n    return task;\n}\n\n\n// make controller for main parts\n// -- createTask\n// -- addTaskTo Projects\n\nmodule.exports = { createTask, tasksStorage, projects }\n\n//# sourceURL=webpack://todo/./src/tasks.js?");

/***/ }),

/***/ "./src/templates.js":
/*!**************************!*\
  !*** ./src/templates.js ***!
  \**************************/
/***/ ((module) => {

eval("const templates = (function() {\n\n    function setAttributes(target, attributes) {\n        Object.keys(attributes).forEach(key => {\n            target.setAttribute(key,attributes[key]);\n        })\n    }\n\n    function projectList(target, projects) {\n        const ul = document.createElement('ul');\n        ul.setAttribute('id','projects');\n        projects.forEach(project => {\n            const li = document.createElement('li');\n            const a = document.createElement('a');\n            a.className = project.name;\n            a.innerText = project.name.toUpperCase();\n            const span = document.createElement('span');\n            span.className = 'count';\n            span.innerText = project.length;\n            li.append(a,span);\n            ul.appendChild(li);\n        });\n\n        const newButt = document.createElement('a');\n        newButt.className = 'new-project';\n        newButt.setAttribute('href','');\n        const spanPlus = document.createElement('span');\n        spanPlus.className = 'red-plus';\n        spanPlus.innerText = '+';\n        const spanText = document.createElement('span');\n        spanText.innerText = 'New Project';\n        newButt.append(spanPlus,spanText);\n\n\n        console.log('DOCUMENT','document');\n\n        console.log(ul);\n\n        const sidebar = document.querySelector('aside');\n        target.append(ul,newButt);        \n    }\n\n    function tasksList(target, tasks) {\n        const ul = document.createElement('ul');\n        ul.className = 'todos';\n        tasks.forEach((task) => {\n            const li = document.createElement('li');\n            const checkbox = document.createElement('input');\n            setAttributes(checkbox, {\n                'type': 'checkbox',\n                'name': task.name,\n                'data-id': task.id\n            });\n            li.appendChild(checkbox);\n            console.log(li);\n        });\n        \n\n    }\n\n    return {\n        renderProjects(target, projects) {\n            if (projects == undefined) {\n                projects = ['website','big app', 'database'];\n            }\n            projectList(target, projects);\n        },   \n        \n        renderTasks(target,tasks) {\n            tasks = [{name: 'flame',id: 25}];\n            tasksList(target, tasks);\n        }\n    }\n\n})();\n\n\nmodule.exports = { templates }\n\n//# sourceURL=webpack://todo/./src/templates.js?");

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