const { helpers } = require('./helpers');

class Event {
    constructor(name) {
        this.name = name;
        this.handlers = [];
    }

    addHandlers(handlers) {
        if (Array.isArray(handlers)) {
            handlers.forEach((h) => {
                this.handlers.push(h);
            });
        } else {
            this.handlers.push(handlers);
        }
    }

    removeHandler(handler) {
        const index = this.handlers.findIndex(h => h == handler);
        if (index != -1) {
            this.handlers.splice(index,1);
        }
    }

    fire(args) {
        this.handlers.forEach((handler) => {
            handler(args);
        });
    }
}

const eventAggregator = (function() {
    const events = {};

    return {
        publish(eventName,eventArgs) {
            if (!helpers.keyInObj(eventName,events)) {
                events[eventName] = new Event(eventName);
            }
            events[eventName].fire(eventArgs);
        },

        subscribe(eventName,handler) {
            if (!helpers.keyInObj(eventName,events)) {
                events[eventName] = new Event();
            }

            events[eventName].addHandlers(handler);
        },

        showEvents() {
            return events;
        }
    }
})();



eventAggregator.publish('click','fuck');

eventAggregator.subscribe('click',function(arg) {
    console.log(arg);
});

eventAggregator.publish('click','sucker');


console.log(eventAggregator.showEvents()['click']);
