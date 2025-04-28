function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Precinct Chair Application')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processForm(formData) {
  try {
    // Get or create the spreadsheet
    const folder = getOrCreateFolder('Data');
    const spreadsheet = getOrCreateSpreadsheet(folder, 'ApplicantData');
    const sheet = spreadsheet.getSheetByName('Applications') || 
                 spreadsheet.insertSheet('Applications');
    
    // Set headers if this is a new sheet
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'First Name',
        'Last Name',
        'Phone',
        'Email',
        'Mailing Address',
        'City',
        'Zip Code',
        'County',
        'Voter Registration Number',
        'Birth Date',
        'Precinct Number',
        'Current Precinct Chair',
        'Current Precinct Number',
        'Occupation',
        'Employer',
        'Felony Conviction',
        'Felony Explanation',
        'Agreed to Commitment',
        'Signature',
        'Signature Date'
      ];
      sheet.appendRow(headers);
    }
    
    // Prepare data row
    const timestamp = new Date();
    const rowData = [
      timestamp,
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.email,
      formData.address,
      formData.city,
      formData.zip,
      formData.county,
      formData.voterId,
      formData.birthDate,
      formData.precinctNumber,
      formData.currentChair,
      formData.currentChair === 'Yes' ? formData.currentPrecinct : '',
      formData.occupation,
      formData.employer,
      formData.felony,
      formData.felony === 'Yes' ? formData.felonyExplanation : '',
      formData.agreeCommitment ? 'Yes' : 'No',
      formData.signature,
      formData.signatureDate
    ];
    
    // Append data
    sheet.appendRow(rowData);
    
    return { success: true };
  } catch (error) {
    console.error('Error processing form:', error);
    throw error;
  }
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function getOrCreateSpreadsheet(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  } else {
    const spreadsheet = SpreadsheetApp.create(fileName);
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    return spreadsheet;
  }
}

