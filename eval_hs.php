<html>
<head><title>ZZT High Scores</title></head>
<body>
<pre>

<?php

// The following settings configure the high scores processing script.

// High scores subfolder storage location
$hsSubFolder = "hiscores/";

// High scores file extension
$hsFileExtension = "_hi.txt";

// Maximum number of lines storable per file
$hsMaxLinesPerFile = 500;

// List of filenames to allow in storage
// If the list is not empty, ONLY these filenames can generate high scores
// If the list is empty, any filename can generate high scores (permissive mode)
// Ex:  $hsIncludeList = array("TOWN", "CAVES", "DUNGEONS", "CITY");
$hsIncludeList = array();

// List of filenames to exclude from storage
// If $hsIncludeList is empty (permissive mode), the exclusion will prevent
// specific files from being stored
// Ex:  $hsExcludeList = array("FOREST", "TREES", "ROCKS");
$hsExcludeList = array();

// Predefined sort key if unspecified; defaults to primary key (index 0)
// Basic high score lists normally contain at least a score (index 2) and
// a name (index 3); the sort key is usually manually specified as 2
$hsDefaultSortKey = 0;

// Predefined sort order if unspecified; 1=ascending, -1=descending, 0=unsorted
// Common list format places highest scores at top, so -1 is normally picked
$hsDefaultSortOrder = 0;

// Maximum allowed length of line for posted entries
$hsMaxLineLen = 256;

// Maximum allowed timestamp difference between posted entries (seconds)
$hsMaxTimeStampDiff = 120;

// Word filtering list file (comma-delimited words to star-out when posted)
$hsWordFilterList = "hiscores/blockedwords.txt";

// UID used for next post
$highestUID = 1;

// Main list sorting function
function listSorter($lines, $sortKey, $sortOrder)
{
    global $highestUID;

    // Get sort keys for existing list
    $keys = array();
    $sType = SORT_NUMERIC;

    foreach ($lines as $l) {
        $fields = explode(",", $l);

        if ($sortKey < count($fields))
        {
            if ($highestUID <= (int)$fields[0])
                $highestUID = (int)$fields[0] + 1;

            $val = $fields[$sortKey];
            if (intval($val) == 0 && $val != "0")
                $sType = SORT_STRING;
        }
        else
            $val = 0;

        $keys[] = $val;
    }

    // Sort keys
    if ($sortOrder > 0)
        asort($keys, $sType);
    else
        arsort($keys, $sType);

    $keys = array_keys($keys);

    // Rearrange lines in proper sort order
    $sLines = array();
    foreach ($keys as $k) {
        if (strlen($lines[$k]) > 3)
            $sLines[] = $lines[$k];
    }

    return $sLines;
}


// Main script processing
$specStr = $_GET["spec"];
$specFields = explode(",", $specStr);

if (strlen(specStr) > $hsMaxLineLen)
    exit("Bad input");

if (count($specFields) <= 6)
    exit("Bad input");

// Get request fundamentals
$actionCode = (int)($specFields[0]);
$timeStamp = (int)($specFields[1]);
$filename = ($specFields[2]);
$sortKey = (int)($specFields[3]);
$sortOrder = (int)($specFields[4]);
if ($sortKey == 0)
    $sortKey = $hsDefaultSortKey;
if ($sortOrder == 0)
    $sortOrder = $hsDefaultSortOrder;

// Timestamp must fall within valid range
$thisTime = time();
if ($thisTime - $timeStamp >= $hsMaxTimeStampDiff)
    exit("Connection timeout");

// Find converted name (no extension and case-insensitive)
$convertedName = strtoupper($filename);
$periodPos = strpos($filename, ".");
if ($periodPos !== FALSE)
    $convertedName = substr($convertedName, 0, $periodPos);

// Filter filename
$inclusive = FALSE;
foreach ($hsIncludeList as $l) {
    if ($l == $convertedName)
        $inclusive = TRUE;
}

if (count($hsIncludeList) == 0)
    $inclusive = TRUE;

foreach ($hsExcludeList as $l) {
    if ($l == $convertedName)
        $inclusive = FALSE;
}

if (!$inclusive)
    exit("Bad filename");

// Establish actual storage location; fetch file
$actualFile = $hsSubFolder . $convertedName . $hsFileExtension;

$allLines = file_get_contents($actualFile);
if ($allLines === FALSE)
    $allLines = "";

$lines = explode("\n", $allLines);

// Sort the list
if (count($lines) > 0 && $sortOrder != 0 && $sortKey >= 0)
    $lines = listSorter($lines, $sortKey, $sortOrder);

// Establish action-specific information
if ($actionCode == 1)
{
    // Post-to-scores action

    // Synth posted line.  This excludes the action code, filename,
    // sort key, sort order, and checksum, but includes a primary key,
    // the timestamp, and all other fields.
    $postedLine = "$highestUID," . $timeStamp;
    for ($i = 5; $i < count($specFields) - 1; $i += 1) {
        $postedLine = $postedLine . "," . $specFields[$i];
    }

    // Calculate checksum
    $checkSum = (int)$specFields[count($specFields) - 1] ^ 0x5555;

    $calcCheckSum = 0;
    $checkLine = substr($specStr, 0, strrpos($specStr, ","));
    for ($i = 0; $i < strlen($checkLine); $i += 1)
        $calcCheckSum += ord(substr($checkLine, $i, 1)) & 255;

    //echo "$checkSum , $calcCheckSum";
    if ($checkSum != $calcCheckSum)
        exit("Bad post data");

    // Filter objectionable words
    $wordsFiltered = file_get_contents($hsWordFilterList);
    $wfList = explode(",", $wordsFiltered);

    foreach ($wfList as $w) {
        $postedLine = preg_replace("/$w/i", "****", $postedLine);
    }

    // Add posted line

    // If maximum number of lines exceeded, remove the last sorted line
    if (count($lines) > $hsMaxLinesPerFile - 1)
    {
        // We remove the last line because we assume anything
        // at the tail of the sort order is least significant.
        $lines[count($lines) - 1] = $postedLine;
    }
    else
    {
        // Just add the line to the end.
        $lines[] = $postedLine;
    }

    // Re-sort the list if needed
    if ($sortOrder != 0)
        $lines = listSorter($lines, $sortKey, $sortOrder);

    // Write list back to file
    $fp = fopen($actualFile, "wb");
    if ($fp)
    {
        foreach ($lines as $l) {
            fwrite($fp, $l . "\n");
        }

        fclose($fp);
    }
}
elseif ($actionCode == 2)
{
    // Fetch-score action
}
else
{
    exit("Bad input code");
}

// Echo response as sorted lines
foreach ($lines as $l) {
    echo $l . "\n";
}

?>

</pre>
</body>
</html>
