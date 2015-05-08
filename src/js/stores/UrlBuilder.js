var Validator = require("validator"),
    InvalidArgumentError = require("../error/InvalidArgumentError"),
    ItemStatus = require("../constants/item-status");

var UrlBase = {
    Issues : "/issues.json",
    TimeEntries: "/time_entries.json",
    TimeEntryActivities: "/enumerations/time_entry_activities.json",
    CurrentUser: "/users/current.json"
};

var UrlBuilder = function (serviceBaseUrl) {
    "use strict";
    if(!Validator.isURL(serviceBaseUrl)){
        throw new InvalidArgumentError("Parameter url must be a URL.");
    }

    this.serviceBaseUrl = serviceBaseUrl;
    this.statusId = ItemStatus.New,
    this.currentPageSize = 100,
    this.itemOffset = 0;
};

UrlBuilder.prototype = (function () {
    "use strict";
    var withPageSize = function (pageSize) {
            if(typeof pageSize !== "number"){
                throw new InvalidArgumentError("Parameter pageSize must be a number.");
            }

            if(pageSize < 1 || pageSize > 100){
                throw new InvalidArgumentError("Parameter pageSize must be between 1 and 100.");
            }
            this.currentPageSize = pageSize;
            return this;
        },
        getPageSize = function(){
            return this.currentPageSize;
        },
        withOffset = function (offset) {
            if(typeof offset !== "number"){
                throw new InvalidArgumentError("Parameter offset must be a number.");
            }

            if(offset < 0){
                throw new InvalidArgumentError("Parameter offset must be greater than 0.");
            }

            this.itemOffset = offset;
            return this;
        },
        getOffset = function () {
            return this.itemOffset;
        },
        withNextOffset = function () {
            this.itemOffset = this.itemOffset + this.currentPageSize;
            return this;
        },
        resetDefault = function () {
            this.itemOffset = 0;
            this.currentPageSize = 100;
            this.statusId = ItemStatus.New;
            return this;
        },
        hasPropertyValue = function (status) {
            for(var prop in ItemStatus) {
                if(ItemStatus.hasOwnProperty(prop)) {
                    if(ItemStatus[prop] === status) {
                        return true;
                    }
                }
            }

            return false;
        },
        withItemStatus = function (status) {
            if(!hasPropertyValue.call(this, status)){
                throw new InvalidArgumentError("Parameter statusId must be a property of ItemStatus.");
            }

            this.statusId = status;
            return this;
        },
        getItemStatus = function () {
            return this.statusId;
        },
        buildIssuesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.Issues, "?status_id=", this.statusId, "&offset=", this.itemOffset, "&limit=", this.currentPageSize);
        },
        buildTimeEntryUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntries);
        },
        buildTimeEntryActivitiesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntryActivities);
        },
        buildCurrentUserUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.CurrentUser);
        };
    return {
        withPageSize: withPageSize,
        getPageSize: getPageSize,
        withOffset: withOffset,
        getOffset: getOffset,
        withNextOffset: withNextOffset,
        resetDefault: resetDefault,
        withItemStatus: withItemStatus,
        getItemStatus : getItemStatus,
        buildIssuesUrl : buildIssuesUrl,
        buildTimeEntryUrl: buildTimeEntryUrl,
        buildTimeEntryActivitiesUrl: buildTimeEntryActivitiesUrl,
        buildCurrentUserUrl: buildCurrentUserUrl
    };
}());

UrlBuilder.createInstance = function (serviceBaseUrl) {
    return new UrlBuilder(serviceBaseUrl);
};

module.exports = UrlBuilder;
