var methods = {};

var methods = {
    timestamp: function () {
        console.log('Current Time in Unix Timestamp: ' + Math.floor(Date.now() / 1000));
    },
    currentDate: function () {
        //console.log('Current Date is: ' + new Date().toISOString().slice(0, 10));
        var currentDate = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14);
        return currentDate;        
    }
};

module.exports = methods;