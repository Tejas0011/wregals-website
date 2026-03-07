$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx" | Where-Object { $_.Name -ne "IIcon.tsx" }
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    $hasIIcon = $c -match "<IIcon "
    $hasImport = $c -match "import.*IIcon"
    if ($hasIIcon -and -not $hasImport) {
        Write-Host "Needs import: $($f.Name)"
        # Add import after first import line
        $c = $c -replace "(import .+?['\"]\r?\n)", "`$1import IIcon from '../components/IIcon';`n"
        Set-Content $f.FullName $c -NoNewline
        Write-Host "  -> fixed"
    }
}
Write-Host "Done."
