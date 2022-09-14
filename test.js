const { Projects, Tasks, Priorities } = require('./src/newTask');
const { addDays } = require('date-fns');



describe('Tasks', () => {

    const expected1 = {
        name: 'test name',
        due: new Date(2022,8,13), 
        priority: 1,
        description: 'couple words about',
        project: 0,
        id: 0,
        notDone: true
    };

    test('add field', () => {    
        expect(Tasks.add(
            {
                name: 'test name',
                due: '2022-09-13', 
                priority: 1,
                description: 'couple words about',
                project: 'one'
            }
        )).toEqual(expected1);
    });

    test('get by id', () => {
        expect(Tasks.getByID(0)).toEqual(expected1);
    });

    const expected2 = {
        name: 'new test name',
        due: new Date(2022,8,14), 
        priority: 2,
        description: 'new couple words about',
        project: 1,
        id: 0,
        notDone: false
    };

    test('update by id', () => {

        expect(Tasks.updateByID(0,
            {
                name: 'new test name',
                due: '2022-09-14',
                priority: 2,
                description: 'new couple words about',
                project: 'two',
                id: 0,
                notDone: false
            })).toEqual(expected2);
    });

    const expected3 = {
        name: 'test name 2',
        due: new Date(2022,8,13), 
        priority: 1,
        description: 'couple words about',
        project: 0,
        id: 1,
        notDone: true
    }

    test('get all tasks', () => {
        Tasks.add(
            {
                name: 'test name 2',
                due: '2022-09-13', //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 'one'
            }
        )

        const expected = {
            0: expected2,
            1: expected3
        }
        expect(Tasks.getAll()).toEqual(expected);
    });

    test('sorted by date', () => {
        const expected = [
            expected3,
            expected2
        ]
        expect(Tasks.getSortedByDueDate()).toEqual(expected);
    });

    test('delete by ID --> return test', () => {
        expect(Tasks.deleteByID(1)).toBe(true);
    });

    test('delete by ID --> return test // no such id', () => {
        const spy = jest.spyOn(console, 'log');
        expect(Tasks.deleteByID(1)).toBe(false);
        expect(spy).toHaveBeenCalledWith('no field with such ID');
    });

    test('delete by ID --> state of storage after it', () => {
        const expected= {
            0: expected2
        }
        expect(Tasks.storage).toEqual(expected);
    });


 
});

describe('Filters', () => {
    test('filter by Project', () => {
        Tasks.resetIDsCounter();
        Tasks.resetStorage();
        Projects.resetIDsCounter();

        Tasks.add(
            {
                name: 'test name 2',
                due: '2022-09-13', //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 'one'
            }
        );
        const expected= [{
                name: 'test name 2',
                due: new Date(2022,8,13), //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 0,
                id: 0,
                notDone: true
            }];
        expect(Tasks.filterByProject(0)).toEqual(expected);
    });


    test('filter by date: today', () => {

        function todayDate() { 
            let today = new Date();
            today = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            return today;
        }

        Tasks.resetIDsCounter();
        Tasks.resetStorage();
        Projects.resetIDsCounter();
        Tasks.add(
            {
                name: 'test name 2',
                due: todayDate(), //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 'one'
            }
        );
        Tasks.add(
            {
                name: 'test name 2',
                due: '2022-09-13', //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 'two'
            }
        );
        Tasks.add(
            {
                name: 'test name 2',
                due: '2022-09-12', //now question is in format
                priority: 1,
                description: 'couple words about',
                project: 'three'
            }
        );
        const todayCheckDate = new Date();
        todayCheckDate.setHours(0,0,0,0);
        const expected= [{
            name: 'test name 2',
            due: todayCheckDate, //now question is in format
            priority: 1,
            description: 'couple words about',
            project: 0,
            id: 0,
            notDone: true
        }];
        expect(Tasks.filterByDate('today')).toEqual(expected);
    });

    test('filter by date: this week', () => {
        // add one day before week, one day after, 2-3 inside this range
        Tasks.resetIDsCounter();
        Tasks.resetStorage();
        Projects.resetIDsCounter();
        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);
        // yesterday id:0 
        Tasks.add({
            due: addDays(todayDate,-1)
        });
        // +1 day expired id: 1
        Tasks.add({
            due: addDays(todayDate,8)
        });
        // today id: 2
        Tasks.add({
            due: todayDate
        });
        // in the middle of week id: 3
        Tasks.add({
            due: addDays(todayDate,3)
        });
        // last day of week id: 4
        Tasks.add({
            due: addDays(todayDate,6)
        })
        expected = [
            {
                "description": undefined,
                "due": todayDate,
                "id": 2,
                "name": undefined,
                "notDone": true,
                "priority": undefined,
                "project": undefined,
            },
            {
                "description": undefined,
                "due": addDays(todayDate,3),
                "id": 3,
                "name": undefined,
                "notDone": true,
                "priority": undefined,
                "project": undefined,
            },
            {
                "description": undefined,
                "due": addDays(todayDate,6),
                "id": 4,
                "name": undefined,
                "notDone": true,
                "priority": undefined,
                "project": undefined,
            }
        ];
        expect(Tasks.filterByDate('week')).toEqual(expected);
    });
});

describe('Projects',() => {
    

    test('add', () => {
        Tasks.resetIDsCounter();
        Tasks.resetStorage();
        Projects.resetIDsCounter();
        Projects.resetStorage();
        const expected = {
            name: 'test name',
            id: 0
        }
        expect(Projects.add('test name')).toEqual(expected);
    });

    test('get by name', () => {
        const expected= {
            name: 'test name',
            id: 0
        }
        expect(Projects.getByName('test name')).toEqual(expected); 
    });

    test('rename', () => {
        const expected= {
            name: 'new name',
            id: 0
        }
        expect(Projects.rename('test name','new name')).toEqual(expected); 
    });


    test('get project names list sorted alphabetically', () => {
        Projects.storage = {};
        Projects.resetIDsCounter();
        Projects.add('C');
        Projects.add('a');
        Projects.add('Z');
        Projects.add('b');
        const expected = [
            {
                name: 'a',
                id: 1                
            },
            {
                name: 'b',
                id: 3                
            },
            {
                name: 'c',
                id: 0                
            },
            {
                name: 'z',
                id: 2                
            },
        ]
        console.log(Projects.storage);
        expect(Projects.getProjectsSorted()).toEqual(expected);
    });


    
});




// INTERFACE: count tasks in project