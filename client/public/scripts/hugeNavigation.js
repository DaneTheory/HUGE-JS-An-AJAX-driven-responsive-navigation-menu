/*=====================================
            UTILITY HELPERS
            1.) xhrResponseCheck
======================================*/
// Prints node info to console including if type is
// an Array or Object (if Object is null, prints null).
// Also, console logs original argument refference made.
const xhrResponseCheck = (function(){
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }
  };

  function init(node){
    if(node === null){
      console.log('XHR Response Returned As: NULL');
    } else if(Array.isArray(node)){
        console.log('XHR Response Returned As: ARRAY');
    } else if(Object.prototype.toString.call(node) && !(node === null)){
        console.log('XHR Response Returned As: OBJECT');
    }
  console.log(node);
  };

  return init

})();


/*================================================

        HUGE NAVIGATION MODULE

            HugeNav
            ======================
              Private:
              --------
                *) _buildNav(data)
                *) _getRemoteApi(url)
                *) _uiDefaultNavBehavior(uiEl)
                *) _navActions(e)
                *) _subNavActions(e)
                *) _desktopNavSettings
                *) _mobileNavSettings
                *) _mobileNavResets()

              Public:
              -------
                *) navSettings()
                *) navDeviceTypeConfigs
                *) noneYaBusiness()
                *) init()

              Module Extensions:
              ------------------
               *) HugeNavApiConfigs

=========================================================*/
const HugeNav = (function (window, document, undefined) {


    ///////////////////////////////////
    // GET DATA FROM REMOTE API
    ///////////////////////////////////
    function _getRemoteApi(url){
      let xhr = new XMLHttpRequest(); // Create new XMLHttpRequest Object

        xhr.open('GET', url + '?' + new Date().getTime(), true); // Define GET HTTP Method and remote url with
                                                                 // an appended cache busting query.

        xhr.responseType = 'json'; // Rather than parse the response during load,
                                   // here we define the response type before hand.

          xhr.onload = function(){
            if (xhr.status >= 200 && xhr.status < 400) {  // Check to ensure response can be recieved.
              let data = xhr.response;                    // Response as variable 'data'.
                 xhrResponseCheck(data);                  // NOTE: This is a Utility Helper for dev. It can be
                                                          // disabled without any side effects.
                _buildNav.call(this, data)                // Private function call to begin working with response.
            } else {
              console.log('AJAX error' + '\n' +           // Error checking in case response returns as 404.
                          'ERROR TYPE: ' + xhr.status);   // Provides console output to help debug.
            }
          }

          xhr.onerror = function() {                            // Error checking in case onload fails entirely
            console.log('Remote Communication Failed.' + '\n' + // and returns with a 500 server error.
            'Verify URI/Paths/Port Defined.' + '\n' +           // Further Error info provided to assist with
            'ATTEMPTED URI: ' + '\n' +                          // debugging.
            _remoteApiUri)
          }

      xhr.send(null);  // Finally, XHR object is sent. Null is provided since we are only retrieving data via GET,
                       // versuses sending data back to server like we would in a POST.
    };


    ///////////////////////////////////
    // CREATE NAV DOM ELEMENTS
    ///////////////////////////////////
    function _buildNav(data){
      const uiNavContainer = document.querySelector('#nav__menu'), // uiNavContainer: DOM element container for generated nav.
            uiNavDocFrag = document.createDocumentFragment(),      // uiNavDocFrag: Appending dynamically created elems to a
                                                                   //               Document Fragment first, rather than the
                                                                   //               DOM directly, boosts performance.
          uiNavMainUl = document.createElement('UL');              // uiNavMainUl: Creates Primary nav UL.

      uiNavMainUl.className = 'nav__main--ul'; // Sets class for primary nav UL.

      // ** If we used the for loop to build our nav, we'd end up having to write a couple
      //    nested loops with unscoped indice variables left floating about.
      //    Using .map() offers a few advantages that make it a more suitable alternative.
      //    It's visually simpler to read, returns a new array that doesn't
      //    mutate our original data, and can invoke callbacks on each indice in parallel
      //    which gives us chaining super powers. Running a .forEach() within a .map()
      //    won't break our loop.
      //    It's not necessary to build the navigation UI, but I'll demonstrate below.
      //---------------------------------------------------------------------------------------//
      data.map(function(data,index,arr) {
        let uiMainNavLi = document.createElement('LI'), // uiMainNavLi: Creates primary nav LI.
              uiMainNavA = document.createElement('A');   // uiMainNavLi: Creates primary nav A tags.
        let uiMainNav = arr[index],                       // uiMainNav: Builds primary nav items from array returned via remote API.
            uiSubNav = uiMainNav.items;                   // uiSubNav: Builds sub nav items from primary nav using dot notation.

        uiMainNavLi.className = 'nav__main--li';   // Sets class for primary nav LI.
        uiMainNavA.textContent = uiMainNav.label;  // Sets visable link name via textContent rather than
                                                   // the more expensive alternative, innerHTML for
                                                   // performance boost.
        uiMainNavA.href = uiMainNav.url;           // Sets url for primary nav link.
        uiMainNavA.className = 'nav__primaryLink'; // Sets class for primary nav A tags.

          uiMainNavLi.appendChild(uiMainNavA); // Appends primary nav A tags as children to primary nav LI

            // ** Condition that checks for any sub
            //    nav items and builds them if they exist.
            //-----------------------------------------------//
            if(uiSubNav.length !== 0){
              let uiSubNavUl = document.createElement('UL'); // uiSubNavUl: Creates sub nav UL.

              uiSubNavUl.className = 'nav__sub--ul'; // Sets class for sub nav UL.

                // ** We could use .map() entirely, but for demonstrating
                //    versatility we'll use a forEach() loop to build the
                //    sub navigation. Like .map(), .forEach() is visually
                //    cleaner to read and has the advantage of providing
                //    its own scope which makes using it in tandem with
                //    .map() much less prone to dumb bug issues.
                //------------------------------------------------------------//
                uiSubNav.forEach(function(uiSubNav){
                  let uiSubNavLi = document.createElement('LI'),   // uiSubNavLi: Creates sub nav LI.
                        uiSubNavA = document.createElement('A');   // uiSubNavA: Creates sub nav A tags.

                  uiSubNavLi.className = 'nav__sub--li';      // Sets class for sub nav LI.
                  uiSubNavA.textContent = uiSubNav.label;     // Sets visable link name via textContent rather than
                                                              // the more expensive alternative, innerHTML for
                                                              // performance boost.
                  uiSubNavA.href = uiSubNav.url;              // Sets url for sub nav links.
                  uiSubNavA.className = 'nav__secondaryLink'; // Sets class for sub nav A tags.

                    uiSubNavLi.appendChild(uiSubNavA);  // Appends sub nav A tags as children to sub nav LI

                    uiSubNavUl.appendChild(uiSubNavLi); // Appends sub nav LI tags as children to sub nav UL
                })

              uiMainNavLi.className += ' nav--hasChildren'; // Adds additional class to primary nav LI's that have sub nav items.

                uiMainNavLi.appendChild(uiSubNavUl); // Appends sub nav UL's as children to primary nav LI's.
            }

        uiNavMainUl.appendChild(uiMainNavLi); // Appends primary nav LI as child to primary nav UL.
      })

      uiNavDocFrag.appendChild(uiNavMainUl);  // Appends current dynamically generated element tree to Document Fragment.
      _uiDefaultNavBehavior(uiNavMainUl) // Private function that adds conditionally based behavior to application.
      uiNavContainer.insertBefore(uiNavDocFrag, uiNavContainer.firstChild); // Renders the Document Fragment of nav items to
                                                                            // the DOM at the navigation container via insertBefore
                                                                            // method for performance boost.
    };


    ////////////////////////////////////////////////////////////
    // PUBLIC HANDLER FOR PRIVATE API CALL VIA MODULE EXTENSION
    ////////////////////////////////////////////////////////////
    function noneYaBusiness(){                                      // Production quality function naming.
      _getRemoteApi(HugeNav.apiServer());                           // Invokes our remote Api function using
    }                                                               // a Module extension to provide the needed
                                                                    // url parameter. It's overkill, but I shows
                                                                    // how flexible the Revealing Module Pattern can be.


    //////////////////////////////////////
    // DEFINE DEFAULT NAVIGATION BEHAVIOR
    ///////////////////////////////////////
    function _uiDefaultNavBehavior(uiEl) {
      let navDropDownItems = uiEl.querySelectorAll('a:not(:only-child)');  // We could query all of our sub nav
                                                                           // items using the class names we defined
                                                                           // while building out our User Interface,
                                                                           // however, this is a neat little trick
                                                                           // in finding items without any children
                                                                           // because it's native to the browser,
                                                                           // there's no need to worry about any
                                                                           // weird mutations that could happen
                                                                           // to our data somewhere along the way.

      uiEl.addEventListener('click', _navActions, false);  // Create event listener object for subNav.

      Array.prototype.forEach.call(navDropDownItems, function(el){  // Normally it's not the best idea to build an
        el.addEventListener('click', _subNavActions, false);        // event object within a loop, but here we are
      })                                                            // also converting our previously defined NodeList
                                                                    // into an Array via the actual Array prototype.

      function _navActions(e){
        let currActive = document.querySelectorAll('.isActive');     // Defining our live DOM nodes with the class
        if(currActive){                                              // of 'isActive'.
          [].forEach.call(currActive, function(el) {                 // Then we conditionally check it and run a short
            el.classList.remove('isActive');                         // hand version of our Array .forEach call we made
          })                                                         // earlier. If any element has the 'isActive' class
        }                                                            // this will remove it. We follow up right away with
        e.target.parentNode.classList.add('isActive');               // setting the event target with the isActive class.
      }                                                              // This little snippet resolves menu items that are
                                                                     // active after a click and dont return to their original
                                                                     // state after another element is clicked.
      function _subNavActions(e){
        let currNode = this.parentNode;                               // This function does something similiar as the previous one,
        let subNav = this.parentNode.querySelector('UL');             // but instead of taking advantage of JavaScripts async nature,
        subNav.classList.add('ui--showComponent');                    // we are checking the DOM value between clicked subNav nodes.
        document.addEventListener('click', function(e){               // Then we handle visual updates to the UI by toggling CSS
          if(e.target.parentNode !== currNode){                       // classes. Though not true all of the time, more often than not
            subNav.classList.remove('ui--showComponent');             // using CSS to manage visuals is always a great idea to help
          }                                                           // increase application performance.
        }, false)
      }
    }


    ////////////////////////////////////////////////////////
    // DEVICE SPECIFFIC NAV CONFIGS FOR DESKTOP AND MOBILE
    ////////////////////////////////////////////////////////
    const navDeviceTypeConfigs = function() {
        const navUi = document.querySelector('#header__nav--wrapper'),  // Here we are finishing up the final touches
              appMask = document.querySelector('#page--mask');          // of our module. A few of the navigation
                                                                        // functionality requirements are better declared
        const _desktopNavSettings = function(e) {                       // directly for their speciffic ue case. This piece
          let mainNav = navUi.querySelector('.nav__main--ul'),          // of the module handles the minor subtleties between
            activeSubNav = mainNav.getElementsByClassName('isActive'),  // mobile and desktop devices. Namely, how the
            currNode = e.target.parentNode;                             // translucent mask behaves. The configs within
                                                                        // these two functions handle desktop functionality.
          [].forEach.call(activeSubNav, function(navItem) {
            if(currNode.classList.contains('nav--hasChildren')) {
              appMask.classList.add('ui--showComponent')
            } else if(!currNode.classList.contains('nav--hasChildren') &&
                      !(navUi.classList.contains('activate--mobile'))){
                          appMask.classList.remove('ui--showComponent')
                      }
          })
      }

      const _mobileNavSettings = function() {
        document.getElementById('btn__menu').addEventListener('click', function() {               // This eye sore of a function
          document.getElementById('header__nav--wrapper').classList.toggle('activate--mobile');   // handles the mobile speciffic
          document.getElementById('btn__menu').classList.toggle('ui--closeComponent');            // requirements.
          document.querySelector('body').classList.toggle('scrollLock');
          document.querySelector('#btn__menu').classList.toggle('close');
          document.querySelector('#page--mask').classList.toggle('ui--showComponent')
          document.querySelector('#page--mask').addEventListener('click', _mobileNavResets, false);
        })
      }

      function _mobileNavResets(){
        document.getElementById('header__nav--wrapper').classList.toggle('activate--mobile');      // And has a reset button to help
        document.querySelector('#btn__menu').classList.toggle('close');                            // create a more fluid User Experience.
        document.querySelector('#page--mask').classList.toggle('ui--showComponent');               // TODO: Add logic for listening to
      }                                                                                            // window resize event to better maintain
                                                                                                   // state between mobile and desktop.
                                                                                                   // It's always the little details that
                                                                                                   // get you.
      function navSettings() {  // Public function for invoking our
        _desktopNavSettings     // private device speciffic functions.
        _mobileNavSettings()
      }

      navUi.addEventListener('click', _desktopNavSettings, false)      // Event Listeners defined
      appMask.addEventListener('click', _desktopNavSettings, false)    // for desktop.

      return navSettings()
    }


    ///////////////////////////////////
    // MODULE INITIALIZATION SETUP
    ///////////////////////////////////
    function init(){                       // Almost done. Not we
      noneYaBusiness()                     // invoke our public functions
      navDeviceTypeConfigs()               // within a single initialization script
    };                                     // so we can finally.....


    ///////////////////////////////////
    // RUN MODULE
    ///////////////////////////////////
    return {
      init                                  // Invoke our navigation module in such a way that
    }                                       // many public functions could create our build.
                                            // Returns an object.

})(window, document);


const HugeNavApiConfigs = (function (HugeNav) {       // This is the example module
  let _remoteApiURL = "http://localhost:3001/items";  // described earlier. It's currently
  HugeNav.apiServer = function () {                   // providing the app with the remote
    return _remoteApiURL                              // Api url necessary to build out the
  };                                                  // navigation.

  return HugeNav;

})(HugeNav || {});


HugeNav.init();  // Initilize our Menu Module! 
