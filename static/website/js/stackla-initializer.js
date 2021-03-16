// ------------
// Utilize IntersectionObserver to delay loading Stackla widget(s) until desired point of scrolling:
//   A: Trigger element is in/near viewport
//   B: Stackla widget(s) in/near viewport (if no trigger element)
//
// Populate data-filter property on widgets based on desired logic.
//
// Authors:
// - Ben Richards: ben.richards@smiledirectclub.com
// - David Jahns: david.jahns@smiledirectclub.com
// ------------

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    observeAndInitializeStacklaWidgets();
    setStacklaDataFilters();
 };
};



////////////////////////////////////////////////////////
// IntersectionObserver function:
// Observes trigger element and stackla widgets, initializes based on config/settings declared.
////////////////////////////////////////////////////////
const observeAndInitializeStacklaWidgets = function () {
  const stacklaEmbedScriptId = "stackla-widget-js"; // this was pulled from the embed script provided by Stackla. Do not change unless they have changed this in their embed script. - See below function addStacklaEmbedScript()
  const mobileStacklaWidget = document.querySelector(".mobile-tablet-only .stackla-widget"); // mobile stackla widget for target element
  const desktopStacklaWidget = document.querySelector(".desktop-only .stackla-widget"); // desktop stackla widget for target element
  const triggerElement = document.querySelector(".Stackla_Load_Trigger"); // optional trigger element that is observed if present

  // only use IntersectionObserver if supported by Browser
  if ("IntersectionObserver" in window) {

    // Config for TRIGGER ELEMENT observer
    const stacklaTriggerElementObserverConfig = {
      root: null, // set to null so observer uses the viewport as the ancestor for the target
      rootMargin: '0px', // this offset will trigger the load "this many" pixels before it scrolls into view
      threshold: 0
    };

    // Config for MOBILE Stackla widget observer
    const mobileStacklaObserverConfig = {
      root: null, // set to null so observer uses the viewport as the ancestor for the target
      rootMargin: '1000px', // this offset will trigger the load "this many" pixels before it scrolls into view
      threshold: 0
    };

    // Config for DESKTOP Stackla widget observer
    const desktopStacklaObserverConfig = {
      root: null, // set to null so observer uses the viewport as the ancestor for the target
      rootMargin: '200px', // this offset will trigger the load "this many" pixels before it scrolls into view
      threshold: 0
    };

    // Shared callback function for all Stackla observers
    const stacklaObserverCallback = function(changes) {
      changes.forEach(function (change) {
        if (change.isIntersecting) {
          addStacklaEmbedScript(document, stacklaEmbedScriptId);
        }
      });
    };

    // Create the observers for Stackla widgets and load trigger
    const stacklaTriggerElementObserver = new IntersectionObserver(stacklaObserverCallback, stacklaTriggerElementObserverConfig);
    const mobileStacklaObserver = new IntersectionObserver(stacklaObserverCallback, mobileStacklaObserverConfig);
    const desktopStacklaObserver = new IntersectionObserver(stacklaObserverCallback, desktopStacklaObserverConfig);

    // use Observer on the trigger element if one is present
    if (triggerElement) {
      stacklaTriggerElementObserver.observe(triggerElement);
    }

    // Always observe widgets in case no load trigger element in DOM or in view when user loads page
    if (mobileStacklaWidget) {
      mobileStacklaObserver.observe(mobileStacklaWidget);
    }

    if (desktopStacklaWidget) {
      desktopStacklaObserver.observe(desktopStacklaWidget);
    }

  } else {
    // IntersectionObserver is not supported by the browser, load the script immediately
    // Bind main Stackla js to the head to load the widget/s
    addStacklaEmbedScript(document, stacklaEmbedScriptId);
  }
};
// end observeAndInitializeStacklaWidgets()



////////////////////////////////////////////////////////
// Set data-filter property for stackla widgets based on desired locale/page
////////////////////////////////////////////////////////
const setStacklaDataFilters = function () {

  // Helper fuction to check URL for a given string
  const urlContains = (stringToCheck) => window.location.href.indexOf(stringToCheck) > -1;

  // Page identifiers - based on URL
  const isImpressionKitCheckoutPage = urlContains("w=impr");
  const isScanCheckoutPage = urlContains("w=scekss");
  const isAlignerCheckoutPage = urlContains("checkout-aligner");

  // Locale identifiers - based on URL
  const isEN_IE = urlContains('en-ie'); // Ireland (English)
  const isEN_GB = urlContains('en-gb'); // UK (English)
  const isEN_NZ = urlContains('en-nz'); // New Zealand (English)
  const isEN_AU = urlContains('en-au'); // Australia (English)
  const isEN_HK = urlContains('en-hk'); // Hong Kong (English)
  const isEN_SG = urlContains('en-sg'); // Singapore (Enlgish)
  const isDE_DE = urlContains('de-de'); // Germany (German)
  const isDE_AT = urlContains('de-at'); // Austria (German)
  const isNL_NL = urlContains('nl-nl'); // Netherlands (Dutch)
  const isEN_NL = urlContains('en-nl'); // Netherlands (English)
  const isZH_HK = urlContains('zh-hk'); // Hong Kong (Chinese)
  const isES_ES = urlContains('es-es'); // Spain (Spanish)
  const isCA_ES = urlContains('ca-es'); // Spain (Catalán Spanish)
  const isEN_ES = urlContains('en-es'); // Spain (English)

  const stacklaWidgets = document.querySelectorAll('.stackla-widget');

  // Function to set data-filter attribute on all stackla widgets on the page
  const setFilterId = (filterID) => {
    stacklaWidgets.forEach(function(widget) {
      widget.setAttribute('data-filter', filterID);
    });
  }

  // Set filters based on locale and page
  /////////////////////////////////////////////
  // UK and Ireland
  if (isEN_IE || isEN_GB) {
    if (isScanCheckoutPage) {
      setFilterId('127019');
    }
    if(isImpressionKitCheckoutPage) {
      setFilterId('127020');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132076');
    }
  }

  // Australia and New Zealand
  else if (isEN_NZ || isEN_AU) {
    if (isScanCheckoutPage) {
      setFilterId('127157');
    }
    if(isImpressionKitCheckoutPage) {
      setFilterId('127156');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132078');
    }
  }

  // China and Singapore
  else if (isEN_HK || isEN_SG || isZH_HK) {
    if (isScanCheckoutPage) {
      setFilterId('129437');
    }
    if(isImpressionKitCheckoutPage) {
      setFilterId('131446');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132079');
    }
  }

  // Germany, Austria, Netherlands
  else if (isDE_DE || isDE_AT || isEN_NL || isNL_NL) {
    if (isScanCheckoutPage) {
      setFilterId('127153');
    }
    if(isImpressionKitCheckoutPage) {
      setFilterId('127152');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132077');
    }
  }

  // Spain (Spanish, Catalán, and English)
  else if (isES_ES || isCA_ES || isEN_ES) {
    if (isScanCheckoutPage) {
      setFilterId('132648');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132651');
    }
  }

  // Default settings for US / Canada - EN-US, ES-US, EN-CA, CA-FR
  else {
    if (isScanCheckoutPage) {
      setFilterId('121731');
    }
    if(isImpressionKitCheckoutPage) {
      setFilterId('121728');
    }
    if(isAlignerCheckoutPage) {
      setFilterId('132075');
    }
  }
};
// end setStacklaDataFilters()



////////////////////////////////////////////////////////
// Function provided by Stackla for embedding widgets. - Originally provided as a self-invoking function.
// Found at https://my.stackla.com/smiledirectclub/admin/widgets
// > click "edit" on a widget
//  > click "Embed Code"
////////////////////////////////////////////////////////
const addStacklaEmbedScript = function (d, id) {
  var t,
    el = d.scripts[d.scripts.length - 1].previousElementSibling;
  if (el)
    el.dataset.initTimestamp = new Date().getTime();
  if (d.getElementById(id))
    return;
  t = d.createElement("script");
  t.src = "//assetscdn.stackla.com/media/js/widget/fluid-embed.js";
  t.id = id;
  (d.getElementsByTagName("head")[0] || d.getElementsByTagName("body")[0]).appendChild(t);
};
