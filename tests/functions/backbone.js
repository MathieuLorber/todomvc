var getStorageSize = function(storageName) {
    var todoList = window.localStorage.getItem(storageName);
    // TODO null ?
    if (!todoList) {
        return 0;
    }
    return todoList.split(",").length;
}; 