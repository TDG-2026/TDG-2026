
$root = Get-Location
$report = Join-Path $root "PROJECT_REPORT.txt"

"PROJECT AUDIT REPORT" | Set-Content $report
"Root: $root" | Add-Content $report

"`n===== FOLDER TREE =====" | Add-Content $report
tree $root /F /A | Add-Content $report

"`n===== FILE INVENTORY =====" | Add-Content $report

$files = Get-ChildItem $root -Recurse -File -Force `
    -ErrorAction SilentlyContinue |
    Where-Object {
        $_.FullName -ne $report -and
        $_.FullName -notmatch '\\(node_modules|\.git|vendor|dist|build|\.next)\\'
    }

foreach ($file in $files) {
    "`nFILE: $($file.FullName)" | Add-Content $report
    "SIZE: $($file.Length) bytes" | Add-Content $report
    "MODIFIED: $($file.LastWriteTime)" | Add-Content $report

    if ($file.Extension -in @(
        '.js','.jsx','.ts','.tsx','.html','.css','.php',
        '.py','.json','.md','.txt','.xml','.yml','.yaml',
        '.sql','.sh','.ps1','.bat','.toml','.ini'
    ) -and $file.Length -le 200KB) {

        if ($file.Name -match '(^\.env|secret|credential|password|token|private.key)') {
            "[CONTENT SKIPPED: POSSIBLE SECRET]" |
                Add-Content $report
        }
        else {
            "----- CONTENT START -----" | Add-Content $report
            Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue |
                Add-Content $report
            "----- CONTENT END -----" | Add-Content $report
        }
    }
}

"`n===== AUDIT COMPLETE =====" | Add-Content $report
Write-Host "Report created: $report"
