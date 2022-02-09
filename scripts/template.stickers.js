function genPatientStickersHTML() {
    var i = 0;
    var fullhtml = '';

    csvResult.forEach(function (patient, index) {
        if (i == 0) {
            start = `<div class="row stickers">`;
        } else {
            start = '';
        }
        if (i == 17) {
            end = `</div><div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
            i = 0;
        } else {
            end = '';
            i++;
        }

        var patientName;
        if (patient[keys['name']]) {
            patientName = capitaliseName(patient[keys['name']]);
        } else {
            if (!patient[keys['first_name']] || !patient[keys['last_name']]) {
                throw new Error('CSV file does not contain patient names, either as single or split fields!');
            }
            patientName = capitaliseName(patient[keys['last_name']] + ', ' + patient[keys['first_name']]);
        }

        // NOTE(Isaac): this parses the appointment date and time from some of a number of fields, depending on the booking system:
        //     - On the National Booking Service, we split the single `Appointment Start` field by whitespace
        //     - On AccuBook, we get separate `SessionDate` and `SessionTime` fields
        var date = '', time = '';
        if (patient.SessionDate !== undefined) {
            date = patient.SessionDate;
        }
        if (patient.StartTime !== undefined) {
            time = patient.StartTime;
        }
        if (patient[keys['appointment_start']] && (date === '' && time === '')) {
            var appointment_start = patient[keys['appointment_start']].split(' ');
            date = appointment_start[0];
            time = appointment_start[1];
        }

        // NOTE(Isaac): we grab the expected vaccine from either the `VaccineDose` or `AppointmentTypeName` fields, depending on booking system
        csvVaccineDose = false;
        if (patient.VaccineDose !== undefined) {
            csvVaccineDose = patient.VaccineDose;
        } else if (patient.AppointmentTypeName !== undefined) {
            csvVaccineDose = patient.AppointmentTypeName;
        }

        var dose = getDose(csvVaccineDose);
        if (dose == "First") {
            doseHTML = generateFirstDoseHTML(date, time, batchNumber);
        } else if (dose == "Second") {
            doseHTML = generateSecondDoseHTML(date, time, batchNumber);
        } else if (dose == "Booster") {
            doseHTML = generateBoosterDoseHTML(date, time, batchNumber);
        } else {
            doseHTML = generateUnspecifiedDoseHTML(date, time, batchNumber);
        }

        html = start + `<div class="col-sm-4">
            <p class="patientName">` + patientName + `</p>
            <table>
                <tr>
                    <td>
                        DOB: <strong>` + formatDate(patient[keys['dob']]) + `</strong><br>
                        NHS: <strong>` + patient[keys['nhsno']] + `</strong><br>
                    </td>
                    <td class="text-center">
                        <div class="qr-code" id="ptid-qr-` + index + `"></div>
                    <td>
                </tr>
            </table>
            Vaccine Type: <strong>` + vaccineType + `</strong>
            ` +
            doseHTML + generateAgeAlertsHTML(patient) +
            `
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

function generateFirstDoseHTML(sessiondate, sessiontime, batchNumber) {
    tableheadHTML = `<table class="dose-details">
    <tr><td colspan="2"><i>Dose Details</i></td></tr> `;
    tablefootHTML = `</table>`;

    if (batchNumber) {
        batchHTML = `<td>Batch: ` + batchNumber + `</td>`;
        batchOnRecordHTML = '';
    } else {
        batchOnRecordHTML = `<small class="batchOnRecord text-center">The batch details are stored in your medical record.</small>`;
        batchHTML = '';
    }
    firstDoseHTML = `<tr><td><strong>First</strong>:` + sessiondate + ` ` + sessiontime + `</td>` +
        batchHTML + '</tr>';

    return tableheadHTML + firstDoseHTML + tablefootHTML + batchOnRecordHTML;
}

function generateSecondDoseHTML(sessiondate, sessiontime, batchNumber) {
    tableheadHTML = `<table class="dose-details">
    <tr><td colspan="2"><i>Dose Details</i></td></tr> `;
    tablefootHTML = `</table>`;

    if (batchNumber) {
        batchHTML = `<td>Batch: ` + batchNumber + `</td>`;
        batchOnRecordHTML = '';
    } else {
        batchOnRecordHTML = `<small class="batchOnRecord text-center">The batch details are stored in your medical record.</small>`;
        batchHTML = '';
    }

    secondDoseHTML = `<tr><td><strong>Second</strong>:` + sessiondate + ` ` + sessiontime + `</td>` +
        batchHTML + '</tr>';

    return tableheadHTML + secondDoseHTML + tablefootHTML + batchOnRecordHTML;
}

function generateBoosterDoseHTML(sessiondate, sessiontime, batchNumber) {
    tableheadHTML = `<table class="dose-details">
    <tr><td colspan="2"><i>Dose Details</i></td></tr> `;
    tablefootHTML = `</table>`;

    if (batchNumber) {
        batchHTML = `<td>Batch: ` + batchNumber + `</td>`;
        batchOnRecordHTML = '';
    } else {
        batchOnRecordHTML = `<small class="batchOnRecord text-center">The batch details are stored in your medical record.</small>`;
        batchHTML = '';
    }

    boosterDoseHTML = `<tr><td><strong>Booster</strong>:` + sessiondate + ` ` + sessiontime + `</td>` +
        batchHTML + '</tr>';

    return tableheadHTML + boosterDoseHTML + tablefootHTML + batchOnRecordHTML;
}

function generateUnspecifiedDoseHTML(sessiondate, sessiontime, batchNumber) {
    return `
            <tr>
                <td>Date: ` + sessiondate + ` ` + sessiontime + `</td>
                <td>Batch: ` + batchNumber + `</td>
            </tr>
            <tr class="text-center">
                <td colspan="2">First Dose | Second Dose | Booster<br>
                <small>Circle as applicable</small></td>
            </tr>`;
}
