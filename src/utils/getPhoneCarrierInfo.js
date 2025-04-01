export const networks = [
    {
        id: "mtn",
        iconUrl: "/network-icons/mtn-new-logo.svg",
        name: "MTN Nigeria",
        color: "#FCE29A",
        enum_value: 0
    },
    {
        id: "airtel",
        iconUrl: "/network-icons/airtel.png",
        name: "Airtel Nigeria",
        color: "#FF0000",
        enum_value: 1
    },
    {
        id: "glo",
        iconUrl: "/network-icons/glo.png",
        name: "Glo Nigeria",
        color: "#228B22",
        enum_value: 2
    },
    {
        id: "9mobile",
        iconUrl: "/network-icons/9mobile.png",
        name: "9mobile Nigeria",
        color: "#00FF00", // Light Green
        enum_value: 3
    },
];

const phoneCarriers = [
    // MTN Nigeria
    { prefix: "+234803", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+234703", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340903", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340806", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340706", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340813", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340810", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340814", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340816", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340906", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340913", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "+2340916", carrier: "MTN Nigeria", id: "mtn" },

    // Glo (Globacom)
    { prefix: "+2340805", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340807", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340705", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340811", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340815", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340905", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "+2340915", carrier: "Glo Nigeria", id: "glo" },

    // Airtel Nigeria
    { prefix: "+2340802", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340808", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340708", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340701", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340812", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340901", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340902", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340904", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340907", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "+2340912", carrier: "Airtel Nigeria", id: "airtel" },

    // 9mobile (formerly Etisalat)
    { prefix: "+2340809", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+2340817", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+2340818", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+2340908", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "+2340909", carrier: "9mobile Nigeria", id: "9mobile" },

    // Ntel
    // { prefix: "+2340804", carrier: "Ntel", id: "ntel" },

    // Starcomms
    // { prefix: "+2340819", carrier: "Starcomms", id: "starcomms" },
    // { prefix: "+23407028", carrier: "Starcomms", id: "starcomms" },
    // { prefix: "+23407029", carrier: "Starcomms", id: "starcomms" },
];

export function detectCarrier(phoneNumber) {
    // Handle invalid input
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return { carrier: "Invalid Number", id: null, iconUrl: null, enum_value: null };
    }

    // Normalize the phone number
    let normalizedNumber = phoneNumber.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, and parentheses
    
    // Truncate the number to the correct length based on format
    if (normalizedNumber.startsWith('+234')) {
        normalizedNumber = normalizedNumber.slice(0, 14); // +234 + 10 digits
    } else if (normalizedNumber.startsWith('234')) {
        normalizedNumber = normalizedNumber.slice(0, 13); // 234 + 10 digits
    } else if (normalizedNumber.startsWith('0')) {
        normalizedNumber = normalizedNumber.slice(0, 11); // 0 + 10 digits
    } else {
        normalizedNumber = normalizedNumber.slice(0, 10); // Just 10 digits
    }
    
    // Validate number format
    const isValidFormat = 
        normalizedNumber.match(/^\+234\d{10}$/) || // +2348031234567
        normalizedNumber.match(/^0\d{10}$/) ||     // 08031234567
        normalizedNumber.match(/^234\d{10}$/);     // 2348031234567

    if (!isValidFormat) {
        return { carrier: "Invalid Format", id: null, iconUrl: null, enum_value: null };
    }

    // Convert to international format for comparison
    let comparisonNumber = normalizedNumber;
    if (normalizedNumber.startsWith("0")) {
        comparisonNumber = "+2340" + normalizedNumber.slice(1); // Keep the 0 after 234
    } else if (normalizedNumber.startsWith("234")) {
        comparisonNumber = "+" + normalizedNumber;
    }

    // Find the carrier based on the prefix
    for (let { prefix, carrier, id } of phoneCarriers) {
        if (comparisonNumber.startsWith(prefix)) {
            const network = networks.find((network) => network.id === id);
            return {
                carrier,
                id,
                iconUrl: network ? network.iconUrl : null,
                enum_value: network ? network.enum_value : null
            };
        }
    }

    // Return unknown carrier info if no match is found
    return { carrier: "Unknown Carrier", id: null, iconUrl: null, enum_value: null };
}

// // Example Usage:
// const number = "+2348031234567";
// const carrierInfo = detectCarrier(number);
// console.log(`Carrier: ${carrierInfo.carrier}, ID: ${carrierInfo.id}, Icon URL: ${carrierInfo.iconUrl}, Enum Value: ${carrierInfo.enum_value}`);

// 