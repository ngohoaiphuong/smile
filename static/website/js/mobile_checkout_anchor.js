function mobileCheckoutAnchor() {
    const impressionKitCheckoutDiv = document.getElementById("mobile-checkout-anchor");
    const displayIsMobileWidth = window.matchMedia("(max-width: 768px)").matches;
    const urlParams = new URLSearchParams(window.location.search);
    const skipDetailsFlag = urlParams.has('skpdtls');

    if (displayIsMobileWidth && impressionKitCheckoutDiv && skipDetailsFlag) {
        impressionKitCheckoutDiv.scrollIntoView();
    }
}

mobileCheckoutAnchor();
