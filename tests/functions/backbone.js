var getStorageSize = function(storageName) {
    var todoList = window.localStorage.getItem(storageName);
    if (!todoList) {
        return 0;
    }
    return todoList.split(",").length;
}; 