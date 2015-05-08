var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    StoreHelper = require('./StoreHelper'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    storeHelper = new StoreHelper(),
    settings = require('./Settings');

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
        var State = {
            fetchInProgress : false, // denotes weather issues are being fetched.
            filteredResult : [], // filtered search results.
            activeItems : null, // active tasks selected by the user.
            activities : [], // activities available to enter time against. Fetched from server.
            isLoading : true
        },
        getState = function () {
            return State;
        },
        getSettings = function(){
            return settings;
        },
        onSearchBoxChange = function (payload) {
            State.filteredResult = payload.data; // set the newly filtered data.
            EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
        },
        onTaskListChange = function (payload) {
            State.activeItems = payload.data; // set the new set of active items.
            EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
        },
        addChangeListener = function (callback) {
            EventEmitter.prototype.on(AppEvent.Change, callback);
        },
        removeChangeListeners = function (callback) {
            EventEmitter.prototype.removeListener(AppEvent.Change, callback);
        },
        dispatcherIndex = AppDispatcher.register(function (payload) {
            var action = payload.action;
            switch (action.actionType) {
                case AppConstants.FetchIssues:
                    storeHelper.fetchItems(function (callback) {
                        State.isLoading = false; 
                        EventEmitter.prototype.emit(AppEvent.Change);
                    });
                    storeHelper.fetchTimeEntryActivities(function (callback) {
                        var activities = storeHelper.getTimeEntryActivities().data.time_entry_activities;

                        activities.map(function(item, i) {
                            State.activities.push({
                                id: item.id,
                                text: item.name
                            });
                        });
                    });
                    break;
                case AppConstants.Search:
                    onSearchBoxChange.call(this, storeHelper.filter(action.query));
                    break;
                case AppConstants.AddIssue:
                    onTaskListChange.call(this, storeHelper.addIssue(action.issueId));
                    break;
                case AppConstants.UpdateTime:
                    var result = storeHelper.updateTimeEntry(action.timeEntry);
                    EventEmitter.prototype.emit(AppEvent.Change);
                    break;
                case AppConstants.CreateTimeEntries:
                    storeHelper.createTimeEntries(function (result){
                        EventEmitter.prototype.emit(AppEvent.Change);
                    });
                    break;
                case AppConstants.SaveSettings:
                    try {
                        $.when(settings.setSettings(action.settings.url, action.settings.apiKey)).done(function () {
                            debugger;
                        }).fail(function (error) {
                            debugger;
                        });
                    } catch (error) {
                        console.log(error)
                    }
                    break;
                }
        });

    return {
        getState: getState,
        getSettings: getSettings,
        addChangeListener: addChangeListener,
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
