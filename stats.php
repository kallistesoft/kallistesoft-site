<?php
// Returns the event logs written by hit.php, for tools/stats.mjs.
// GET stats.php?s=quiz&from=2026-11-19&to=2026-11-30 with the header
// X-Stats-Key: <key>. The key lives only on the owner's Mac
// (~/.config/kallistesoft/stats.key); this file holds its SHA-256.
require __DIR__ . '/stats-lib.php';

const KEY_SHA256 = '081c1bbe79f33e1fdb16dc1660393d842d396c691e23dbfe4bebd4d06c7c87d9';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$key = $_SERVER['HTTP_X_STATS_KEY'] ?? '';
if (!is_string($key) || !hash_equals(KEY_SHA256, hash('sha256', $key))) {
  http_response_code(403);
  exit;
}

$site = $_GET['s'] ?? '';
$re = '/^\d{4}-\d{2}-\d{2}$/';
$from = $_GET['from'] ?? '';
$to = $_GET['to'] ?? gmdate('Y-m-d');
if (!in_array($site, STATS_SITES, true) || !preg_match($re, $from) || !preg_match($re, $to)) {
  http_response_code(400);
  exit;
}

header('Content-Type: application/x-ndjson; charset=utf-8');
foreach (glob(stats_dir() . "/$site/*.jsonl") ?: [] as $file) {
  $day = basename($file, '.jsonl');
  if ($day >= $from && $day <= $to) readfile($file);
}
