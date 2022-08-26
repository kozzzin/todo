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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("console.log('huy na!');\n\nconst projects = {};\n\n\n\n\nconst tasksStorage = (function() {\n    const tasksStorage = {};\n\n    return {\n        addToStorage(task) {\n            tasksStorage[task.id] = task;\n        },\n    \n        deleteFromStorageById(id) {\n            if (id in tasksStorage) {\n                delete tasksStorage[id];\n            } else {\n                console.log(`no such id: ${id}`);\n            }\n        },\n\n        getTaskById(id) {\n\n        },\n\n        loadAllTasks() {\n            for (let task of Object.keys(tasksStorage)) {\n                console.log(task, tasksStorage[task]);\n            }\n        }\n    }\n})();\n\nclass Task {\n    static idCounter = 0\n\n    constructor(name,due,priority,desc,proj) {\n        this.name = name;\n        this.due = due;\n        this.priority = priority;\n        this.desc = desc;\n        this.id = this.constructor.addID();  \n        this.proj = this.constructor.addToProject(projects, proj, this.id);\n        this.status = true;\n        console.log(this);\n    }\n\n    static addID() {\n        return this.idCounter++;\n    }\n\n    static addToProject(projects, project, id) {\n        if (project) {\n            if (!(project in projects)) {\n                projects[project] = [];\n            }\n            projects[project].push(id);\n            return project;\n        }\n        return null;\n    }\n\n    deleteTask() {\n\n    }\n\n}\n\nfunction createTask() {\n    \n}\n\nconst task = new Task(\n    'take money',\n    '10/12/2009',\n    'medium',\n    'vaflia must be eaten',\n    'website'\n);\n\nconst task2 = new Task(\n    'take money',\n    '10/12/2009',\n    'medium',\n    'vaflia must be eaten',\n    'website'\n);\n\nconsole.log(task);\n\ntasksStorage.addToStorage(task);\ntasksStorage.addToStorage(task2);\n\ntasksStorage.deleteFromStorageById(0);\ntasksStorage.deleteFromStorageById(1);\n\ntasksStorage.loadAllTasks();\n\n\nfunction createTask(name,due,priority,desc,proj) {\n\n    todosArchive[task.id] = task;\n}\n\n\n    // Task.idCounter += 1;\n\n//# sourceURL=webpack://todo/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;