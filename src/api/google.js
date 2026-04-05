export async function getGoogleSheetData() {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error('Missing VITE_GOOGLE_SCRIPT_URL');
  }

  const response = await fetch(scriptUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.status}`);
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || 'Apps Script returned an error');
  }

  return data;
}

export async function getApplicationsFromSheet() {
  const data = await getGoogleSheetData();
  return data.applications || [];
}

export async function getActivityFromSheet() {
  const data = await getGoogleSheetData();
  return data.activityLog || [];
}
