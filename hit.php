<?php
// Anonymous event counter for the free web tools (cnp., quiz.).
// Their js/track.js sends navigator.sendBeacon(here, '{"s":"quiz","e":"step_view","p":{"step":3}}').
// One JSON line per event in <home>/kallistesoft-stats/<site>/<date>.jsonl:
// time to the minute, event, params. No IP, no cookie, no identifier.
require __DIR__ . '/stats-lib.php';

http_response_code(204);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') exit;

$body = file_get_contents('php://input', false, null, 0, 2048);
$in = json_decode($body ?: '', true);
if (!is_array($in)) exit;

$site = $in['s'] ?? '';
$event = $in['e'] ?? '';
if (!in_array($site, STATS_SITES, true) || !is_string($event) || !preg_match('/^[a-z_]{1,32}$/', $event)) exit;

// Only the site's own pages count (browsers always send Origin with a beacon).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== "https://$site.kallistesoft.ca") exit;

// Flat params only: short keys, numbers or short strings. Anything else is dropped.
$params = [];
foreach ((is_array($in['p'] ?? null) ? $in['p'] : []) as $k => $v) {
  if (count($params) >= 8) break;
  if (!is_string($k) || !preg_match('/^[a-z_]{1,20}$/', $k)) continue;
  if (is_int($v) || is_float($v)) $params[$k] = $v;
  elseif (is_string($v) && strlen($v) <= 40) $params[$k] = $v;
}

$dir = stats_dir() . '/' . $site;
if (!is_dir($dir)) @mkdir($dir, 0700, true);
$file = $dir . '/' . gmdate('Y-m-d') . '.jsonl';
if (@filesize($file) > 20 * 1024 * 1024) exit; // a day's file stops at 20 MB (flood guard)

$line = json_encode(['t' => gmdate('Y-m-d\TH:i\Z'), 'e' => $event, 'p' => (object) $params], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
@file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX);
