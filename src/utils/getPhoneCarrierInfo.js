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
        color: "#00FF00",
        enum_value: 3
    },
];

const phoneCarriers = [
    // MTN Nigeria
    { prefix: "803", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "703", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "903", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "806", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "706", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "813", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "810", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "814", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "816", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "906", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "913", carrier: "MTN Nigeria", id: "mtn" },
    { prefix: "916", carrier: "MTN Nigeria", id: "mtn" },

    // Glo (Globacom)
    { prefix: "805", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "807", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "705", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "811", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "815", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "905", carrier: "Glo Nigeria", id: "glo" },
    { prefix: "915", carrier: "Glo Nigeria", id: "glo" },

    // Airtel Nigeria
    { prefix: "802", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "808", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "708", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "701", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "812", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "901", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "902", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "904", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "907", carrier: "Airtel Nigeria", id: "airtel" },
    { prefix: "912", carrier: "Airtel Nigeria", id: "airtel" },

    // 9mobile (formerly Etisalat)
    { prefix: "809", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "817", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "818", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "908", carrier: "9mobile Nigeria", id: "9mobile" },
    { prefix: "909", carrier: "9mobile Nigeria", id: "9mobile" },

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
    
    // Remove country code and leading zeros if present
    if (normalizedNumber.startsWith('+234')) {
        normalizedNumber = normalizedNumber.slice(4); // Remove +234
    } else if (normalizedNumber.startsWith('234')) {
        normalizedNumber = normalizedNumber.slice(3); // Remove 234
    }
    
    // Remove leading zero if present
    if (normalizedNumber.startsWith('0')) {
        normalizedNumber = normalizedNumber.slice(1);
    }
    
    // Validate number format (should be 10 digits)
    if (!normalizedNumber.match(/^\d{10}$/)) {
        return { carrier: "Invalid Format", id: null, iconUrl: null, enum_value: null };
    }

    // Get the first 3 digits for prefix matching
    const prefix = normalizedNumber.slice(0, 3);

    // Find the carrier based on the prefix
    for (let { prefix: carrierPrefix, carrier, id } of phoneCarriers) {
        if (prefix === carrierPrefix) {
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