# Google Sheets API Integration

This guide shows how to integrate Google Sheets API directly with AfterApply.

## Setup Instructions

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API

### 2. Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Give it a name (e.g., "afterapply-api")
4. Click "Create and Continue"
5. Skip granting roles (optional)
6. Click "Done"

### 3. Generate Credentials
1. Find your service account and click on it
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the JSON file
6. Rename it to `credentials.json` and place in project root

### 4. Share Your Google Sheet
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from JSON file)
4. Give it "Viewer" or "Editor" permissions

### 5. Configure Environment
1. Copy `.env.example` to `.env`
2. Set your spreadsheet ID:
   ```
   GOOGLE_SPREADSHEET_ID=your_sheet_id_here
   GOOGLE_CREDENTIALS_PATH=./credentials.json
   ```

### 6. Get Spreadsheet ID
From your Google Sheet URL:
`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

The `SPREADSHEET_ID` is the long string between `/d/` and `/edit`.

## Usage

```javascript
import { useGoogleSheets } from './hooks/useGoogleSheets';

function MyComponent() {
  const { data, loading, error } = useGoogleSheets('your_spreadsheet_id');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data.map(app => (
        <div key={app.id}>{app.company} - {app.role}</div>
      ))}
    </div>
  );
}
```

## Expected Sheet Structure

Your Google Sheet should have these columns (case-insensitive):
- Company
- Role
- Status
- Date Applied
- Last Updated
- Job Link
- Case Code
- Next Follow Up Date

## Security Notes

- Never commit `credentials.json` to version control
- Keep your spreadsheet private and only share with the service account
- Consider using environment variables for production deployment
