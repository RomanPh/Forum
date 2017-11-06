app.filter('lastPost', function () {
    return function (items) {
         if (!items.length) return;
        let outputTopic = [];
        let lastTopic = items[0];
        let nowTime = Date.now();
        let minIntervalTime = (nowTime - Date.parse(lastTopic.created_at));
        angular.forEach(items, function (item) {
            /* console.log('item topic ' + item.name);
             console.log('item topic in compare ' + item.name);
             console.log('nowTime in compare ' + nowTime);
             console.log('minTIme in compare ' + minIntervalTime);
             console.log('nowTime - item in compare ' + (nowTime - Date.parse(item.created_at)));
             console.log(' compare ' + ((nowTime - new Date(item.created_at)) < minIntervalTime));*/
            if ((nowTime - new Date(item.created_at)) < minIntervalTime) {
                lastTopic = item;
                /* console.log('item topic in compare ' + item.name);
                 console.log('nowTime in compare ' + nowTime);
                 console.log('nowTime - item in compare ' + (nowTime - new Date(item.created_at)));
                 console.log(' compare ' + ((nowTime - new Date(item.created_at)) < minIntervalTime));*/
            }
        });
        let date = new Date(lastTopic.created_At);
        outputTopic.push(lastTopic);
        return outputTopic;
    }
});

app.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});