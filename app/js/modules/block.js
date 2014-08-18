(function() {

    function extendTemplate($templateCache, $compile, $http, $q, $log) {

        function warnMissingBlock(name, src) {
            $log.warn('Failed to find data-block=' + name + ' in ' + src);
        }

        return {
            compile: function(tElement, tAttrs) {
                var src = tAttrs.extendTemplate;
                if (!src) {
                    throw 'Template not specified in extend-template directive';
                }
                // Clone and then clear the template element to prevent expressions from being evaluated
                var $clone = angular.element(tElement.clone());
                tElement.html('');

                var loadTemplate = $http.get(src, {
                    cache: $templateCache
                })
                    .then(function(response) {
                    var $template = angular.element(document.createElement('div')).html(response.data);

                    function override(method, block, attr) {
                        var name = block[0].getAttribute(attr),
                            classes = angular.element($template[0].querySelectorAll('[data-block="' + name + '"]')).attr('class');

                        if (angular.element($template[0].querySelectorAll('[data-block="' + name + '"]'))[method](block).length === 0 && angular.element($template[0].querySelectorAll('[data-extend-template]')).append(block).length === 0) {
                            warnMissingBlock(name, src);
                        }

                        block.attr('class', classes);
                    }

                    angular.forEach($clone.children(), function(el) {
                        var $el = angular.element(el);

                        // Replace overridden blocks
                        if (el.hasAttribute('data-block')) {
                            override('replaceWith', $el, 'data-block');
                        }

                        // Insert prepend blocks
                        if (el.hasAttribute('data-block-prepend')) {
                            override('prepend', $el, 'data-block-prepend');
                        }

                        // Insert append blocks
                        if (el.hasAttribute('data-block-append')) {
                            override('append', $el, 'data-block-append');
                        }

                        // Insert after blocks
                        if (el.hasAttribute('data-block-after')) {
                            override('after', $el, 'data-block-after');
                        }
                        //console.log(el);
                    });

                    return $template;
                }, function() {
                    var msg = 'Failed to load template: ' + src;
                    $log.error(msg);
                    return $q.reject(msg);
                });


                return function($scope, $element) {
                    loadTemplate.then(function($template) {
                        $element.html($template.html());
                        $compile($element.contents())($scope);
                    });
                };
            }
        };
    }

    angular.module('angular-blocks', [])
        .directive('extendTemplate', ['$templateCache', '$compile', '$http', '$q', '$log', extendTemplate]);
}());