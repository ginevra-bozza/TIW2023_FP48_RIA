{
    /**
     * Add an event listener that start the event tree whe the homePage is loaded
     */
    (function () {
        window.addEventListener('load', (e) => {
            // initialize event listeners
            initializeHome();
            // display home page
        });
    })();
}