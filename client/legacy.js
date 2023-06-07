
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

// Некоторые браузеры частично реализуют свойство mediaDevices, поэтому
//мы не можем присвоить ссылку на объект свойству getUserMedia, поскольку
//это переопределит существующие свойства. Здесь, просто добавим свойство
//getUserMedia , если оно отсутствует.

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // Сначала, если доступно, получим устаревшее getUserMedia

        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        //Некоторые браузеры не реализуют его, тогда вернём отменённый промис
        // с ошибкой для поддержания последовательности интерфейса

        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Иначе, обернём промисом устаревший navigator.getUserMedia

        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}