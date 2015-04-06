import 'package:di/di.dart';
import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';

import 'todo.dart';
import 'directives.dart';

class TodoModule extends Module {
  TodoModule() {
    bind(TodoController);
    bind(StorageService);
    bind(TodoDOMEventDirective);
  }
}

main() {
	applicationFactory().addModule(new TodoModule()).run();
}
