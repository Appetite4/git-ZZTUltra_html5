<html>
<head><title>Dir Evaluation</title></head>
<body>
<pre>

<?php

function getAllFilesAtPath($dirpath)
{
    // Search directory stub; get results
    //$allfiles = scandir($dirpath);
    $allfiles = array();
    $handle = opendir($dirpath);
    while (($filename = readdir($handle)) !== false) {
        $allfiles[] = $filename;
    }

    closedir($handle);

    sort($allfiles);
    return $allfiles;
}

function getRecursiveFilesAtPath($dirpath, $ext, $level)
{
    // Search directory stub; get results
    $allfiles = getAllFilesAtPath($dirpath);

    if (substr($dirpath, strlen($dirpath) - 1) != "/")
        $dirpath = $dirpath . "/";

    // Establish only those paths we want
    $mydirs = array();
    $myfiles = array();
    foreach ($allfiles as $f) {
        $fullpath = $dirpath . $f;
        if ($f == "." || $f == "..")
            continue;
        elseif (is_dir($fullpath))
            $mydirs[] = $fullpath;
        elseif (substr($f, strlen($f) - strlen($ext)) == $ext)
            $myfiles[] = $fullpath;
    }

    // If recursive level allows, evaluate subdirectories.
    if ($level > 0) {
        foreach ($mydirs as $d) {
            $newfiles = getRecursiveFilesAtPath($d, $ext, $level - 1);
            foreach ($newfiles as $f) {
                $myfiles[] = $f;
            }
        }
    }

    return $myfiles;
}

$searchpath = $_GET["path"];
$level = $_GET["level"];
if (!$level)
    $level = 0;
else
    $level = (int)$level;

// Backward nav not allowed anywhere in path; force relative from base
if (strpos($searchpath, "..") !== FALSE)
    $searchpath = ".";

// Cannot reference root; force relative from base
if (substr($searchpath, 0, 1) == "/")
    $searchpath = ".";

// Cannot reference HTTP path; force relative from base
if (substr($searchpath, 0, 7) == "http://")
    $searchpath = ".";

// Establish directory to search and wildcard location
$dirpath = $searchpath;
$wildcardpos = strpos($searchpath, "*");
$ext = "";

if ($wildcardpos !== FALSE) {
    // Wildcard found.  Create directory stub and extension
    $ext = substr($searchpath, $wildcardpos + 1);
    $lastdirpos = strrpos($searchpath, "/");
    if ($lastdirpos !== FALSE) {
        // Break off stub
        if ($lastdirpos > 0)
            $dirpath = substr($searchpath, 0, $lastdirpos);
        elseif ($lastdirpos == 0)
            $dirpath = ".";
    }
    else
        $dirpath = ".";
}

// Recursively search for files; return all matching files
$myfiles = getRecursiveFilesAtPath($dirpath, $ext, $level);

// Write back all full paths
foreach ($myfiles as $f) {
    echo $f . "\n";
}

?>

</pre>
</body>
</html>
