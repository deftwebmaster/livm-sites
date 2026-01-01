/**
 * Quiet Career Strategy
 * Minimal JS - permalink copy functionality
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const permalinks = document.querySelectorAll('.permalink');

        permalinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const url = window.location.origin + window.location.pathname + link.getAttribute('href');
                
                navigator.clipboard.writeText(url).then(function() {
                    link.classList.add('copied');
                    
                    // Update URL without scrolling
                    history.pushState(null, '', link.getAttribute('href'));
                    
                    setTimeout(function() {
                        link.classList.remove('copied');
                    }, 1500);
                }).catch(function() {
                    // Fallback: just navigate to the anchor
                    window.location.hash = link.getAttribute('href');
                });
            });
        });
    });
})();
