//
// Example Data Model for application header
// 
define(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojtoolbar', 'ojs/ojnavigationlist', 'ojs/ojoffcanvas', 'hammerjs'], 
       function(oj, ko)  {

           // 
           // Define a computed observable for the ID.
           // Read returns a unique id, write returns a "matching" id.
           // This is used to implement synchronized select between the
           // horizontal and vertical nav lists.
           // 
           function _createCompositeObservable(prefix, suffixObservable) {
               return ko.pureComputed(
                   {
                       read: function () 
                       {
                           var sel = suffixObservable();
                           return (sel != null ? prefix+sel: null);
                       },
                       write: function (value) 
                       {
                           suffixObservable(value == null ? null : value.substr(prefix.length));
                       }
                   });
           }

           var ViewModel = function() {

               var self = this;

               // 
               // Button used for toggling off screen data.
               // 
               var offScreenDataButton = {
                   "label": "navigation list",
                   "iconClass": "oj-fwk-icon oj-fwk-icon-hamburger",
                   "url": "#"
               };

               // 
               // Dropdown menu states
               // 
               this.selectedMenuItem = ko.observable("(None selected yet)");

               this.menuItemSelect = function( event, ui ) {
                   switch (ui.item.attr("id") ) {
                   case "open":
                       this.selectedMenuItem(ui.item.children("a").text());
                       break;
                   default:
                       this.selectedMenuItem(ui.item.children("a").text());
                   }
               };

               // Data for application name
               var appName = {
                   "id": "em",
                   "name": "Enterprise Manager",
               };

               // 
               // Toolbar buttons
               // 
               var toolbarData = {
                   // user name in toolbar
                   "userName": "john.hancock@oracle.com",
                   "toolbar_buttons" : [
                       {   
                           "label": "search",
                           "iconClass": "oj-fwk-icon-magnifier oj-fwk-icon",
                           "url": "#"
                       }
                   ],
                   // Data for global nav dropdown menu embedded in toolbar.
                   "global_nav_dropdown_items" : [
                       {   "label": "preferences",
                           "url": "#"
                       },
                       {   "label": "help",
                           "url": "#"
                       },
                       {   "label": "about",
                           "url": "#"
                       },
                       {   "label": "sign out",
                           "url": "#"
                       },
                   ]
               }

               this.offScreenButtonIconClass = offScreenDataButton.iconClass;
               this.offScreenButtonLabel = offScreenDataButton.label;

               this.appId = appName.id;
               this.appName = appName.name;

               this.userName = ko.observable(toolbarData.userName);
               this.toolbarButtons = toolbarData.toolbar_buttons;
               this.globalNavItems = toolbarData.global_nav_dropdown_items;

               // Drawer for toggling off-canvas content.
               this.appDrawer = {
                   "edge": "start",
                   "displayMode": "push",
                   "selector": "#demoAppDrawer",
                   "selection": "selectedItem",
               };

               // 
               // Data for application navigation
               // 
               var appNavData = {
                   "app_buttons" : [
                       {
                           name: 'ORAC (12.1.0.1.0 RAC)',
                           id: 'ORAC',
                           iconClass: 'demo-home-icon-24'
                       },
                       {   
                           name: 'Configuration',
                           id: 'configuration',
                           iconClass: 'demo-education-icon-24'
                       },
                       {
                           name: 'Services',
                           id: 'services',
                           iconClass: 'demo-library-icon-24'
                       },
                       {
                           name: 'Security',
                           id: 'security',
                           iconClass: 'demo-palette-icon-24 '
                       },
                       {   
                           name: 'Performance',
                           id:  'performance',
                           iconClass: 'demo-grid-icon-16'
                       }]
               };

               this.selectedItem = ko.observable("services");

               this.appButtons = appNavData.app_buttons;

               // construct a unique id for the vertical nav list
               this.vertSelect = _createCompositeObservable("vert::", this.selectedItem);
               // construct a unique id for the horizontal nav list
               this.horzSelect = _createCompositeObservable("horz::", this.selectedItem);

               this.toggleAppDrawer = function()
               {
                   return oj.OffcanvasUtils.toggle(this.appDrawer);
               }

               //
               // Close off-screen content once window becomes larger.
               //
               query = window.matchMedia("(min-width: 1023px)");
               var mqListener = function(event) 
               {
                   oj.OffcanvasUtils.close(self.appDrawer);
               }
               query.addListener(mqListener);

           };

           return new ViewModel();
       }
      );

