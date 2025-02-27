//QR Generator
function genQRCodes() {
    csvResult.forEach(function (patient, index) {
        if (pocSystem == "outcomes4health") {
            if (!patient[keys['dob']]) {
                return; //exit loop if no DOB
            }
            //Generate double QR style
            $('#ptid-qr-' + index).qrcode({
                text: formatDate(patient[keys['dob']]) + String.fromCharCode(09) + patient[keys['nhsno']] + String.fromCharCode(09) + String.fromCharCode(32)
            });

            if (type == "incBookingNumber") {
                $('#booking-qr-' + index).qrcode({
                    text: patient.bookingNumber
                });
            }
        } else {
            //NHS number only
            $('#ptid-qr-' + index).qrcode({
                text: patient[keys['nhsno']]
            });
        }


    });
}

function generateAgeAlertsHTML(patient) {
    age = getAge(patient[keys['dob']]);
    patientAlertHTML = "";
    if (age < 16) {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 16</p>'
    } else if (age < 18 && vaccineType != "Pfizer-BioNTech") {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 18</p>'
    } else if (age < 40 && vaccineType == "AstraZeneca" && getDose(csvVaccineDose) == "First") {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 40</p>'
    }
    return patientAlertHTML;
}

//Format date into the pinnacle format
function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

function formatDate(dateString) {
    if (dateString.includes('-')) {
        var splitDate = dateString.split('-');
    } else if (dateString.includes('.')) {
        var splitDate = dateString.split('.');
    } else if (dateString.includes('/')) {
        var splitDate = dateString.split('/');
    }
    //Seperate out month and year
    var month = splitDate[1];

    var year = splitDate[2];
    if (year.length == 2) {
        // NOTE(Isaac): this is a bit of a messy situation. QFlow exports DOBs
        // with two-digit years, and so we need to pick a suitable threshold to
        // decide which century is more likely to be correct. This seems to work
        // pretty well on what we've seen so far.
        if ((new Date().getFullYear().toString().substr(-2) - year) >= 0) {
            year = '20' + year;
        } else {
            year = '19' + year;
        }
    }
    //Convert text month to int
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(month)) {
        month = getMonthFromString(month)
    }
    month = month - 1 //Javascript months are 0-11


    var fomattedDate = new Date()
    //Default to leap year and first of month
    fomattedDate.setFullYear(2020)
    fomattedDate.setDate(1)

    fomattedDate.setMonth(month)
    fomattedDate.setDate(splitDate[0])
    fomattedDate.setFullYear(year)

    var out = fomattedDate.toLocaleDateString(
        'en-gb', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    ).replace(/ /g, '-').replace("Sept", "Sep")
    return out;
}

//Get age from formatDate
// RH -  Note this only work in chromium browsers.  Firefox will give the result in days not years!
function getAge(dateString) {
    var dateString = formatDate(dateString);
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//Sort list of patients alphabetically
function sortAlphabetical(objArray) {
    function compare(a, b) {
        // TODO(Isaac): this doesn't handle NSB's format with split name fields
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
            return -1;
        }
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    objArray.sort(compare);
    return objArray;
}

//Identify the column names
function identifyCSVKeys(CSVArray) {
    var keys = Object.keys(CSVArray[0]);
    var nhsno_key, dob_key, name_key, address_key, firstdose_type, firstdose_batch, firstdose_date;
    var first_name_key, last_name_key, appointment_start_key;
    keys.forEach(function (key) {
        lkey = key.toLowerCase();
        if (lkey.includes('nhs')) {
            nhsno_key = key;
        }
        if (lkey.includes('address')) {
            if (lkey.includes('organisation')) {} else
            if (lkey.includes('organization')) {} else
            if (lkey.includes('practice')) {} else
            if (lkey.includes('pcn')) {} else {
                address_key = key;
            }
        }
        if (lkey.includes('dob')) {
            dob_key = key;
        } else if (lkey.includes('birth')) {
            dob_key = key;
        }
        if (lkey.includes('name')) {
            //do not include if the column name has a "name" that is referencing something other than patient
            if (lkey.includes('organisation')) {} else
            if (lkey.includes('organization')) {} else
            if (lkey.includes('practice')) {} else
            if (lkey.includes('first')) {} else
            if (lkey.includes('last')) {} else
            if (lkey.includes('sur')) {} else
            // NOTE(Isaac): National Booking Service uses a key of AppointmentTypeName for vaccine dose. Ignore that.
            if (lkey.includes('type')) {} else
            if (lkey.includes('pcn')) {} else {
                name_key = key;
            }
        }
        if (lkey.includes('firstname')) {
            first_name_key = key;
        }
        if (lkey.includes('lastname')) {
            last_name_key = key;
        }
        if (lkey.includes('appointment start')) {
            appointment_start_key = key;
        }
        if (lkey.includes('first')) {
            if (lkey.includes('date')) {
                firstdose_date = key;
            }
            if (lkey.includes('type')) {
                firstdose_type = key;
            }
            if (lkey.includes('batch')) {
                firstdose_batch = key;
            }
        }
    });


    return {
        dob: dob_key,
        name: name_key,
        nhsno: nhsno_key,
        address: address_key,
        first_name: first_name_key,
        last_name: last_name_key,
        appointment_start: appointment_start_key,
        firstdose_batch: firstdose_batch,
        firstdose_date: firstdose_date,
        firstdose_type: firstdose_type
    };
}


function capitaliseName(str) {
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
}

/// Parses a variety of dose information exported by various booking systems and returns either "First",
/// "Second", "Booster", or "Unknown"
// TODO(Isaac): could we extend this to handle Third Primary doses? The booking systems don't seem to handle them gracefully tho
function getDose(csvDose) {
    // TODO(Isaac): what does the National Booking Service give us for a Moderna or AZ dose?
    if (csvVaccineDose == "First" || csvVaccineDose == "Pfizer-BioNTech General Dose 1") {
        return "First";
    } else if (csvVaccineDose == "Second" || csvVaccineDose == "Pfizer-BioNTech General Dose 2") {
        return "Second";
    } else if (csvVaccineDose == "Booster" || csvVaccineDose == "Pfizer-BioNTech Booster") {
        return "Booster";
    } else {
        return "Unknown";
    }
}

function generateAlert(text, elementToAppendTo, type = 'danger') {
    var alertHTML = `<div class="alert alert-` + type + `" role="alert">
        ` + text + `
        </div>`;
    console.log(alertHTML);
    $(elementToAppendTo).prepend(alertHTML);
}

//Error logging
window.onerror = function (error) {
    $("#patient-list").append(`<div class="alert alert-warning" role="alert">
        <strong>Error:</strong> ` + error + `
        <p>Please try the following:</p>
        <ul>
            
            <li>Try the dummy patient csv file in the package. If that works, the problem is in your CSV file</li>
                <li>Try and reformat your CSV file so it matches the dummy file</li>
                    <li>Check there are no blank lines in the CSV file</li>
            </ul>
        If this fails, contact mike@mikedavidsmith.com if you keep getting this error for support.
      </div>`);
};
