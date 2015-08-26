/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /** 
         * Test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('each feed has an URL and it is not empty', function() {
            allFeeds.forEach(function(item) {
                expect(item.url).toBeDefined();
                expect(item.url).not.toBe('');
            });
        });


        /**
         * Test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('each feed has an name and it is not empty', function() {
            allFeeds.forEach(function(item) {
                expect(item.name).toBeDefined();
                expect(item.name).not.toBe('');
            });
        });
    });


    /* Test suite named "The menu" */
    describe('The menu', function() {
        /**
         * Test that ensures the menu element is
         * hidden by default.
         */
        it('is hidden by default', function() {
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

        /**
         * Test that ensures the menu changes
         * visibility when the menu icon is clicked.
         */
        it('changes visibility when the menu icon is clicked', function() {
            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBe(false);
            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    /* Test suite named "Initial Entries" */
    describe('Initial Entries', function() {

        /**
         * As loadFeed is async, we load a feed before tests are executed.
         */
        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });

        /**
         * Test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         */
        it('loadFeed function is called and completes its work and there is at least a single .entry element within the .feed container', function(done) {
            expect($('.feed > .entry-link').length > 0).toBe(true);
            done();
        });
    });

    /* Test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        var firstFeed, secondFeed;

        /**
         * Every must remain unaltered after test execution.
         */
        afterAll(function() {
            loadFeed(0);
        });

        /**
         * As loadFeed is async, we load two random feeds before tests are executed.
         */
        beforeEach(function(done) {
            // We select a random feed and the next feed. If it is the last, we get the first one.
            var feedToLoad = Math.floor(Math.random() * allFeeds.length),
                nextFeedToLoad = (feedToLoad + 1) % allFeeds.length;

            loadFeed(feedToLoad, function() {
                firstFeed = $('.feed').html();
                loadFeed(nextFeedToLoad, function() {
                    secondFeed = $('.feed').html();
                    done();
                });
            });
        });

        /**
         * Test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         */
        it('content changes when new feed is loaded', function(done) {
            expect(firstFeed).not.toBe(secondFeed);
            done();
        });
    });

    /* Test suite named "Feeds entries" */
    describe('Feed entries', function() {

        /**
         * Every must remain unaltered after test execution.
         */
        afterAll(function() {
            loadFeed(0);
        });

        /**
         * As loadFeed is async, we a feed before tests are executed.
         */
        beforeEach(function(done) {
            // We select a random feed.
            var feedToLoad = Math.floor(Math.random() * allFeeds.length);

            loadFeed(feedToLoad, function() {
                done();
            });
        });

        /**
         * Test that ensures when all feed entries has a valid URL.
         */
        it('has a valid URL', function(done) {
            // RegExp retrieved from: http://www.notasdelprogramador.com/2014/09/26/validar-url-con-javascript/
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            $('.feed > .entry-link').each(function() {
                expect($(this).attr('href')).toBeDefined();
                expect($(this).attr('href')).toMatch(regexp);
            });
            done();
        });

        /**
         * Test that ensures when all feed entries has a heading and it is not empty.
         */
        it('has a heading and it is not empty', function(done) {
            $('.feed .entry').each(function() {
                expect($('h2', $(this)).length).toBe(1);
                expect($('h2', $(this)).text()).not.toBe('');
            });
            done();
        });

        /**
         * Test that ensures when all feed entries has a content and it is not empty.
         */
        it('has a content and it is not empty', function(done) {
            $('.feed .entry').each(function() {
                expect($('p', $(this)).length).toBe(1);
                expect($('p', $(this)).text()).not.toBe('');
            });
            done();
        });

        /**
         * Test that ensures when all feed entries has an image.
         */
        it('has an image', function(done) {
            $('.feed .entry').each(function() {
                expect($('img', $(this)).length > 0).toBe(true);
            });
            done();
        });

        /**
         * Test that ensures when all read entries has a css class called "read".
         */
        it('already read has a red class', function(done) {
            $('.feed .entry-link').first().click();
            expect($('.feed .entry-link').first().hasClass('read')).toBe(true);
            done();
        });        
    });
}());
