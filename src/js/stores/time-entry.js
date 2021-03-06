/*global require, module*/
var InvalidArgumentError = require("../error/invalid-argument-error"),
    easyGid = require("easy-guid"),
    validator = require('validator'),
    _ = require("lodash"),
    settings = require("./settings-manager");

var TimeEntry = function (issueId, issueName, projectName, taskUrl) {
    "use strict";
    if (!validator.isInt(issueId)) {
        throw new InvalidArgumentError("Parameter issueId must be an integer.");
    }

    if (typeof issueName !== "string") {
        throw new InvalidArgumentError("Parameter issueName must be a string.");
    }

    if (typeof projectName !== "string") {
        throw new InvalidArgumentError("Parameter projectName must be a string.");
    }

    if (!validator.isURL(taskUrl)) {
        throw new InvalidArgumentError("Parameter taskUrl must be a URL.");
    }

    this.id = easyGid.new();
    this.issueId = issueId;
    this.issueName = issueName;
    this.projectName = projectName;
    this.taskUrl = taskUrl;
    this.spentOn = null;
    this.hours = null;
    this.activityId = null;
    this.comments = null;
    this.updated = false;
    this.customFields = _.cloneDeep(settings.timeEntryCustomFieldData);
};

TimeEntry.prototype = (function () {
    "use strict";
    var dateFormat = "YYYY-MM-DD",
        setCustomField = function (id, value) {
            var field = _.find(this.customFields, { 'id': id });
            if (field) {
                field.value = value;
            }

            this.updated = isUpdated.call(this);
            return this;
        },
        setSpentOn = function (spentOn) {
            if (!spentOn || !spentOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter spentOn must be a moment object.");
            }

            this.spentOn = spentOn;
            return this;
        },
        isUpdated  = function () {
            var index = 0,
                length = this.customFields.length,
                field;

            for (index; length > index; index++) {
                field = this.customFields[index];
                if (field.required && (field.value === "" || field.value === null || typeof field.value === "undefined")) {
                    return false;
                }
            }

            return this.activityId !== null && this.hours !== null;
        },
        setHours = function (hours) {
            if (!(validator.isInt(hours) || validator.isFloat(hours))) {
                this.updated = false;
                this.hours = null;
                return this;
            }

            this.hours = parseFloat(hours);
            if (this.hours <= 0) {
                this.hours = null;
                this.updated = false;
                return this;
            }

            this.updated = isUpdated.call(this);
            return this;
        },
        setActivityId = function (activityId) {
            if (!validator.isInt(activityId)) {
                this.updated = false;
                this.activityId = null;
                return this;
            }

            this.activityId = parseInt(activityId, 10);
            this.updated = isUpdated.call(this);
            return this;
        },
        setComments = function (comments) {
            this.comments = comments;
            return this;
        },
        clearTimeEntry = function () {
            this.spentOn = null;
            this.hours = null;
            this.activityId = null;
            this.comments = null;
            this.updated = false;
            this.customFields.map(function (field) {
                field.value = null;
            });
        },
        buildPostEntry = function () {
            var entry = {
                issue_id: this.issueId,
                spent_on: this.spentOn.format(dateFormat),
                hours: this.hours,
                activity_id: this.activityId,
                comments: this.comments
            };

            if (this.customFields.length) {
                entry.custom_fields = this.customFields;
            }

            return {
                time_entry: entry
            };
        };
    return {
        setCustomField: setCustomField,
        setHours: setHours,
        setActivityId: setActivityId,
        setComments: setComments,
        buildPostEntry: buildPostEntry,
        setSpentOn: setSpentOn,
        clearTimeEntry: clearTimeEntry
    };
}());

TimeEntry.createInstance = function (issueId, issueName, projectName, taskUrl) {
    "use strict";
    return new TimeEntry(issueId, issueName, projectName, taskUrl);
};

module.exports = TimeEntry;