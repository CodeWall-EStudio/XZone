angular.module('ts.directives.ngEnter', [])
    .directive('ngEnter', function(){
        function link(scope, element, attrs){
            element.on('keydown', function(event){
                if(event.keyCode == 13){
                    var callback = attrs['ngEnter'];
                    if(callback){
                        _.bind(function(){
                            eval('this.' + callback);
                        }, scope)();
                    }
                }
            });
        }
        return {link:link};
    });