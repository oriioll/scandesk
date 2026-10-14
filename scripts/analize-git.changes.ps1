# Vuelca los cambios del working tree (staged + unstaged + untracked)
# en un formato compacto para pegarlo y generar commits.
# Uso: .\scripts\analize-git.changes.ps1 [-Out salida.txt] [-Max 80]
param(
    [string]$Out = "git-changes.txt",
    [int]$Max = 120
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$skip = '(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|composer\.lock)$'

git rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "No es un repo git"; exit 1 }

# Las rutas de `git status` son relativas a la raíz del repo
Set-Location (git rev-parse --show-toplevel)

$outName = Split-Path $Out -Leaf
$status = @(git -c core.quotepath=false status --porcelain -uall |
    Where-Object { $_ -notmatch [regex]::Escape($outName) })
$sb = [System.Collections.Generic.List[string]]::new()

$sb.Add("# Branch: $(git branch --show-current)")
$sb.Add("")
$sb.Add("## Files")
$status | ForEach-Object { $sb.Add($_) }
$sb.Add("")
$sb.Add("## Details")

foreach ($line in $status) {
    $code   = $line.Substring(0, 2)
    $path   = $line.Substring(3)
    $target = ($path -split ' -> ')[-1].Trim('"')   # en renames, usa la ruta nueva

    $sb.Add("")
    $sb.Add("==================================================")
    $sb.Add("FILE: $path   [status: $code]")

    if ($target -match $skip) { $sb.Add("(lockfile, content omitted)"); continue }

    if ($code -eq "??") {
        if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
            $sb.Add("NEW (not a file, omitted)"); continue
        }
        $full  = (Resolve-Path -LiteralPath $target).Path
        $bytes = [System.IO.File]::ReadAllBytes($full)
        if ($bytes.Length -eq 0) { $sb.Add("NEW EMPTY FILE (0 bytes)"); continue }
        if (($bytes | Select-Object -First 8000) -contains 0) {
            $sb.Add("NEW BINARY ($($bytes.Length) bytes, omitted)"); continue
        }
        $content = @(Get-Content -LiteralPath $full)
        $sb.Add("NEW FILE, $($content.Count) lines:")
        $content | Select-Object -First $Max | ForEach-Object { $sb.Add($_) }
        if ($content.Count -gt $Max) { $sb.Add("... (truncated)") }
        continue
    }

    if ($code -match 'D') { $sb.Add("DELETED"); continue }

    $stat = git diff HEAD --numstat -- $target
    if ($stat) { $p = ($stat | Select-Object -First 1) -split "`t"; $sb.Add("stats: +$($p[0]) -$($p[1])") }

    $diff = @(git diff HEAD -U1 --no-color -- $target |
        Where-Object { $_ -notmatch '^(diff --git|index |--- |\+\+\+ )' })
    if ($diff.Count -eq 0) { $sb.Add("(no diff against HEAD)"); continue }
    $diff | Select-Object -First $Max | ForEach-Object { $sb.Add($_) }
    if ($diff.Count -gt $Max) { $sb.Add("... (truncated, $($diff.Count) diff lines total)") }
}

$sb | Set-Content -Path $Out -Encoding UTF8
$sb -join "`n" | Set-Clipboard
Write-Host "Generado: $Out ($($sb.Count) líneas) y copiado al portapapeles"