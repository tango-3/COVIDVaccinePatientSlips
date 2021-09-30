//Form
function genFormHTML() {
    var fullhtml = '';
    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }
        html = genFullPageHTML(patient, index);
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

//FullPage
function genFullPageHTML(patient, index) {
    var address = '';
    if (patient[keys['address']] !== undefined) {
        address = patient[keys['address']];
    }
    var sessiondate = '';
    if (patient.SessionDate !== undefined) {
        sessiondate = patient.SessionDate;
    }
    var sessiontime = '';
    if (patient.StartTime !== undefined) {
        sessiontime = patient.StartTime;
    }
    var RegisteredPracticeName = '';
    if (patient.RegisteredPracticeName !== undefined) {
        RegisteredPracticeName = patient.RegisteredPracticeName;
    }
    age = getAge(patient[keys['dob']]);
    ageHTML = ""
    if (age < 18) {
        ageHTML = ' (Under 18)'
    }
    firstdoseHTML = ``;
    doseHTML = ` First    |    Second    |     Booster`;



    return `<div class="vaccine-form"><h1>Vaccine Record Form</h1>
<table class="table table-bordered">
    <tr>
        <td>Name</td>
        <td>` + patient[keys['name']] + `</td>
        <td rowspan=3 colspan=2 class="text-center">
            <div class="qr-code" id="ptid-qr-` + index + `"></div>
        </td> 
        
    </tr>
    <tr>
        
        <td>DOB</td>
        <td>` + formatDate(patient[keys['dob']]) + ageHTML + `</td>
        
    </tr>
    <tr>
    <td>NHS No.</td>
    <td>` + patient[keys['nhsno']] + `</td>
    </tr>
    <tr>
    <td>Address</td>
    <td>` + address + `</td>
        <td>GP Practice</td>
        <td>` + RegisteredPracticeName + `</td>
    </tr>
</table>

<table class="table table-bordered">
    <tr>
        <th>Demographics</th>
    </tr>
    <tr>
        <td>Ethnicity:</td>
    </tr>
    <tr>
    <td>Is the patient a carer, social worker, healthcare worker or do they live in a residential or care home?</td>
    </tr>
</table>

<table class="table table-bordered">
    <tr>
        <th>Screening Questions - Updated: 30 September 2021 - Please check this reflects current questions</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
    <tr>
        <td>1. Has the individual experienced major venous and/or arterial thrombosis occurring with thrombocytopenia following vaccination with any COVID-19 vaccine?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>2. Has the individual had any vaccination in the last 7 days?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>3. Is the individual currently unwell with fever?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>4. Has the individual ever had any serious allergic reaction to any ingredients of the Covid-19 vaccines, drug or other vaccine?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>5. Has the individual ever had an unexplained anaphylaxis reaction?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>6. Does the individual have a history of heparin-induced thrombocytopenia and thrombosis (HITT or HIT type 2)?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
    <td>7. Does the individual have a history of capillary leak syndrome?</td>
    <td></td>
    <td></td>
</tr>
<td>8. Has the individual indicated they are, or could be pregnant?</td>
    <td></td>
    <td></td>
</tr>
<td>9. Has the individual informed you they are currently or have been in a trial of a potential coronavirus vaccine?</td>
    <td></td>
    <td></td>
</tr>
<td>10. Is the individual taking anticoagulant medication, or do they have a bleeding disorder?</td>
    <td></td>
    <td></td>
</tr>
<td>11. Does the individual currently have any symptoms of Covid-19 infection?</td>
    <td></td>
    <td></td>
</tr>
    </table>
    <div class="page-break-clear"></div><div class="page-break">&nbsp;</div>
<table class="table table-bordered">
    <tr>
        <td>Screening Questions Completed by:</td>
        <td>Vaccinator (who is registered HCP) | Other HCP (please add name, signature and date below)</td>
        </tr>
    <tr>
        <td colspan="2"><p></p></td>
    </tr>
    <tr>
        <td>Protocol under which the vaccination is given:</td>
        <td>National | PSD | PGD</td>
    </tr>
</table>
    <table class="table table-bordered">
        <tr>
            <th colspan="2">Consent</th>
        </tr>
        <tr>
            <td>Consent given?</td>
            <td>Yes | No</td>
        </tr>
        <tr>
            <td>Consent Provided By:</td>
            <td>Patient | LPA for Health | Court Appointed Deputy | Clinician Best Interests Decision (MCA)</td>
        </tr>
        <tr>
            <td>Notes</td>
            <td></td>
        </tr>
    </table>


    <table class="table table-bordered">
        <tr>
            <th colspan="4">Vaccination Details</th>
        </tr>
        <tr>
        <td colspan="2">Dose Round</td>
        <td colspan="2">` + doseHTML + `</td>
        </tr>
        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td>` + sessiontime + `</td>
            <td>Date of Vaccination</td>
            <td>` + sessiondate + `</td>
        </tr>
        <tr>
            <td colspan="2">Vaccine Brand and Batch Number</td>
            <td colspan="2">` + vaccineType + ` ` + batchNumber + firstdoseHTML + `</td>
        </tr>
        <tr>
            <td colspan="2">Administration Site</td>
            <td colspan="2">               Left    |    Right   |      Deltoid   |      Thigh</td>
        </tr>
        <tr>
            <td colspan="2">Any Adverse Effects (blank for none) or other comments</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccinator Name</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccine not given (reason)
            </td>
            <td colspan="2">Unwell | Contraindicated | Did not consent</td>
        </tr>
    </table>
    </div>
    <div class="page-break-clear"></div><div class="page-break">&nbsp;</div>
    `;
}