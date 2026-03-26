param(
    [string]$Owner = "Selina2025-alt",
    [string]$Repo = "Agent-Content-Factory",
    [string]$Branch = "main",
    [string]$CommitMessage = "",
    [string]$Token = $env:GITHUB_TOKEN
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
    throw "Set GITHUB_TOKEN or pass -Token before running this script."
}

if (-not $CommitMessage) {
    $CommitMessage = "Sync snapshot $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

$headers = @{
    Authorization = "Bearer $Token"
    "User-Agent"  = "Codex"
    Accept        = "application/vnd.github+json"
}

function Invoke-GitHubApi {
    param(
        [string]$Method,
        [string]$Uri,
        $Body = $null,
        [switch]$AllowNotFound
    )

    try {
        if ($null -eq $Body) {
            return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers
        }

        return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -Body ($Body | ConvertTo-Json -Depth 100)
    } catch {
        $statusCode = $null
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }

        if ($AllowNotFound -and ($statusCode -eq 404 -or $statusCode -eq 409)) {
            return $null
        }

        throw
    }
}

function Get-RelativePath {
    param(
        [string]$Root,
        [string]$Path
    )

    $rootWithSlash = $Root
    if (-not $rootWithSlash.EndsWith([System.IO.Path]::DirectorySeparatorChar) -and -not $rootWithSlash.EndsWith([System.IO.Path]::AltDirectorySeparatorChar)) {
        $rootWithSlash += [System.IO.Path]::DirectorySeparatorChar
    }

    $rootUri = New-Object System.Uri($rootWithSlash)
    $pathUri = New-Object System.Uri($Path)
    return $rootUri.MakeRelativeUri($pathUri).ToString()
}

$repoRoot = (Resolve-Path ".").Path
$repoApi = "https://api.github.com/repos/$Owner/$Repo"

$items = Get-ChildItem -Path $repoRoot -Recurse -File -Force | Where-Object {
    $_.FullName -notmatch '[\\/]\.git([\\/]|$)'
}

$ref = Invoke-GitHubApi -Method GET -Uri "$repoApi/git/ref/heads/$Branch" -AllowNotFound

if (-not $ref) {
    if ($items.Count -eq 0) {
        throw "Cannot initialize an empty remote repository from an empty working tree."
    }

    $bootstrapItem = $items | Select-Object -First 1
    $bootstrapPath = (Get-RelativePath -Root $repoRoot -Path $bootstrapItem.FullName).Replace('\', '/')
    $bootstrapBytes = [System.IO.File]::ReadAllBytes($bootstrapItem.FullName)

    Invoke-GitHubApi -Method PUT -Uri "$repoApi/contents/$bootstrapPath" -Body @{
        message = "Bootstrap repository"
        content = [System.Convert]::ToBase64String($bootstrapBytes)
        branch  = $Branch
    } | Out-Null

    $ref = Invoke-GitHubApi -Method GET -Uri "$repoApi/git/ref/heads/$Branch"
}

$tree = @()

foreach ($item in $items) {
    $relativePath = (Get-RelativePath -Root $repoRoot -Path $item.FullName).Replace('\', '/')
    $bytes = [System.IO.File]::ReadAllBytes($item.FullName)
    $blob = Invoke-GitHubApi -Method POST -Uri "$repoApi/git/blobs" -Body @{
        content  = [System.Convert]::ToBase64String($bytes)
        encoding = "base64"
    }

    $tree += @{
        path = $relativePath
        mode = "100644"
        type = "blob"
        sha  = $blob.sha
    }
}

$parentSha = $null
$baseTreeSha = $null

if ($ref) {
    $parentSha = $ref.object.sha
    $parentCommit = Invoke-GitHubApi -Method GET -Uri "$repoApi/git/commits/$parentSha"
    $baseTreeSha = $parentCommit.tree.sha
}

$treeRequest = @{}
if ($baseTreeSha) {
    $treeRequest.base_tree = $baseTreeSha
}
$treeRequest.tree = $tree

$newTree = Invoke-GitHubApi -Method POST -Uri "$repoApi/git/trees" -Body $treeRequest

$commitBody = @{
    message = $CommitMessage
    tree    = $newTree.sha
}
if ($parentSha) {
    $commitBody.parents = @($parentSha)
}

$newCommit = Invoke-GitHubApi -Method POST -Uri "$repoApi/git/commits" -Body $commitBody

if ($ref) {
    Invoke-GitHubApi -Method PATCH -Uri "$repoApi/git/refs/heads/$Branch" -Body @{
        sha   = $newCommit.sha
        force = $false
    } | Out-Null
} else {
    Invoke-GitHubApi -Method POST -Uri "$repoApi/git/refs" -Body @{
        ref = "refs/heads/$Branch"
        sha = $newCommit.sha
    } | Out-Null
}

[pscustomobject]@{
    Repo       = "$Owner/$Repo"
    Branch     = $Branch
    FilesSynced = $tree.Count
    CommitSha  = $newCommit.sha
    Message    = $CommitMessage
}
