const carrierIconMap = {
    mtn: "/network-icons/mtn.jpg",
    airtel: "/network-icons/airtel.jpg",
    glo: "/network-icons/glo.png",
    "9mobile": "/network-icons/9mobile.png",
};

const phoneCarriers = [
    { prefix: "+234903", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234803", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234806", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234810", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234813", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234814", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234816", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234703", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234706", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234802", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+234808", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+234812", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+234701", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+234902", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+234808", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+234807", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+234815", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+234905", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+234909", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+234818", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+234817", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+234909", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+234908", carrier: "9mobile Nigeria", id: "9mobile" },
];

export function detectCarrier(phoneNumber) {
    // Normalize the phone number
    if (phoneNumber.startsWith("0")) {
        phoneNumber = "+234" + phoneNumber.slice(1); // Convert local format to international
    } else if (phoneNumber.startsWith("234")) {
        phoneNumber = "+" + phoneNumber; // Convert to international format with +
    } else if (!phoneNumber.startsWith("+234")) {
        // If it doesn't start with +234, prepend it
        phoneNumber = "+234" + phoneNumber;
    }

    for (let { prefix, carrier, id }
        of phoneCarriers) {
        if (phoneNumber.startsWith(prefix)) {
            return { carrier, id, iconUrl: carrierIconMap[id] }; // Return carrier info including id and iconUrl
        }
    }
    return { carrier: "Unknown Carrier", id: null, iconUrl: null }; // Return unknown carrier info
}

// // Example Usage:
// const number = "+2348031234567";
// const carrierInfo = detectCarrier(number);
// console.log(`Carrier: ${carrierInfo.carrier}, ID: ${carrierInfo.id}, Icon URL: ${carrierInfo.iconUrl}`);