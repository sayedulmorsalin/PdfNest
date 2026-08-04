$ErrorActionPreference = 'Stop'
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  $word.AutomationSecurity = 3
  $path = 'C:\Users\HP\Downloads\1 Introduction to Data Warehouse (1).pdf'
  Write-Host "Opening $path..."
  $doc = $word.Documents.Open($path, $false, $true, $false)
  Write-Host "OPEN SUCCESS!"
  $doc.Close([ref]0)
  $word.Quit()
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
  if ($word) { $word.Quit() }
}
